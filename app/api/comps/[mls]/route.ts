// app/api/comps/[mls]/route.ts
// =============================================================================
// V2 Phase B — Comparable listings endpoint.
//
// Returns up to 6 active + 6 recently sold listings near the target MLS,
// ordered by a composite similarity score. The Postgres function get_comps
// (see migration v2_phase_b_get_comps_function) does the heavy lifting; this
// route runs both modes in parallel, retries with a relaxed envelope when the
// strict envelope returns < 3 hits, and serves from a 1h edge cache.
//
// The cache key is just the MLS number — the REIN sync already pings
// /api/revalidate when a listing changes, and we extend that hook to bust
// the comp cache via tag `comps:<mls>` (Phase B Step 2 follow-up).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { canonicalListingSlug } from '../../../lib/listing-slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RawComp {
  id: number;
  mls_number: string;
  address: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  lat: number | null;
  lng: number | null;
  photos: string[] | null;
  close_date: string | null;
  close_price: number | null;
  comp_score: number;
}

export interface Comp {
  id: number;
  mls_number: string;
  address: string;
  street: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  lat: number | null;
  lng: number | null;
  photo: string | null;       // First photo (or null)
  href: string;               // /listings/<id>/<slug>/
  close_date?: string;        // Sold tab only
  sold_price?: number;        // Sold tab only
}

interface CompsResponse {
  active: Comp[];
  sold: Comp[];
  fallback: { active: boolean; sold: boolean };
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input as any, { ...(init || {}), cache: 'no-store' }),
    },
  });
}

function streetOnly(address: string): string {
  return (address || '').split(',')[0].trim();
}

function shape(raw: RawComp, mode: 'active' | 'sold'): Comp {
  const slug = canonicalListingSlug({ address: raw.address, city: raw.city });
  const out: Comp = {
    id: raw.id,
    mls_number: raw.mls_number,
    address: raw.address,
    street: streetOnly(raw.address),
    city: raw.city,
    price: Number(raw.price),
    beds: raw.beds,
    baths: Number(raw.baths),
    sqft: Number(raw.sqft),
    status: raw.status,
    lat: raw.lat,
    lng: raw.lng,
    photo: Array.isArray(raw.photos) && raw.photos.length > 0 ? raw.photos[0] : null,
    href: `/listings/${raw.id}/${slug}/`,
  };
  if (mode === 'sold') {
    if (raw.close_date) out.close_date = raw.close_date;
    if (raw.close_price != null) out.sold_price = Number(raw.close_price);
  }
  return out;
}

async function fetchMode(
  client: ReturnType<typeof sb>,
  mls: string,
  mode: 'active' | 'sold',
): Promise<{ comps: Comp[]; fallback: boolean }> {
  // Strict envelope first
  const { data: strictRows, error: strictErr } = await client.rpc('get_comps', {
    mls_input: mls,
    mode,
    result_limit: 6,
    similarity_relax: false,
  });
  if (strictErr) throw strictErr;
  const strict = (strictRows as RawComp[] | null) ?? [];
  if (strict.length >= 3) {
    return { comps: strict.map((r) => shape(r, mode)), fallback: false };
  }
  // Relaxed envelope as fallback
  const { data: relaxedRows, error: relaxedErr } = await client.rpc('get_comps', {
    mls_input: mls,
    mode,
    result_limit: 6,
    similarity_relax: true,
  });
  if (relaxedErr) throw relaxedErr;
  const relaxed = (relaxedRows as RawComp[] | null) ?? [];
  return {
    comps: relaxed.map((r) => shape(r, mode)),
    fallback: relaxed.length > strict.length,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { mls: string } },
) {
  const mls = params.mls?.trim();
  if (!mls) {
    return NextResponse.json({ error: 'MLS number required' }, { status: 400 });
  }

  try {
    const client = sb();
    const [active, sold] = await Promise.all([
      fetchMode(client, mls, 'active'),
      fetchMode(client, mls, 'sold'),
    ]);

    const body: CompsResponse = {
      active: active.comps,
      sold: sold.comps,
      fallback: { active: active.fallback, sold: sold.fallback },
    };

    return NextResponse.json(body, {
      headers: {
        // 1h edge cache, allow stale-while-revalidate up to 1 day
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[api/comps] error', err);
    return NextResponse.json(
      { error: 'Failed to fetch comps', detail: (err as Error).message },
      { status: 500 },
    );
  }
}
