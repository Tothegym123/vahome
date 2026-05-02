// app/api/map-listings/route.ts
// =============================================================================
// Map listings endpoint — backed by live Supabase REIN data.
//
// Hampton Roads bbox query, status-filtered to buyer-relevant statuses, 500 cap.
// Field shape EXACTLY matches the prior mock-data response so MapClient
// does not need any change.
//
// Filter parsing/application is delegated to app/lib/listing-filters.ts so the
// /listings page and the /map endpoint stay in lockstep on the URL contract.
//
// Performance:
//   - Uses partial index `listings_status_idx` (status, where excluded=false
//     and removed_at is null) for status filtering.
//   - Uses composite `listings_geo_idx` (lat, lng) for bounding-box.
//   - Uses `listings_price_idx` for price filters.
//   - Selects only the columns the map needs (no description, no rooms, no
//     photos array, no agent fields) to keep payload small.
//   - 60-second edge cache via Cache-Control to absorb pan/zoom storms.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  parseFiltersFromSearchParams,
  applyFiltersToSupabaseQuery,
} from '../../lib/listing-filters'
import { canonicalListingSlug } from '../../lib/listing-slug'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function generateSlug(address: string, city: string, _state?: string, _zip?: string): string {
  return canonicalListingSlug({ address, city })
}

function formatPriceShort(price: number): string {
  if (price >= 1000000) return '$' + (price / 1000000).toFixed(1) + 'M'
  if (price >= 1000) return '$' + Math.round(price / 1000) + 'K'
  return '$' + price
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Bypass Next.js fetch cache — listings change frequently via REIN sync,
    // and stale results are worse than a tiny latency hit.
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input as any, { ...(init || {}), cache: 'no-store' }),
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams

    // bbox — defaults are intentionally permissive so a missing param doesn't
    // accidentally narrow the results to nothing
    const sw_lat = parseFloat(sp.get('sw_lat') || '-90')
    const sw_lng = parseFloat(sp.get('sw_lng') || '-180')
    const ne_lat = parseFloat(sp.get('ne_lat') || '90')
    const ne_lng = parseFloat(sp.get('ne_lng') || '180')

    // Cap at 5000 — generous enough to feed every listing in the visible
    // viewport to the client-side MarkerClusterer (Hampton Roads has ~7K
    // active+contingent total). The clusterer collapses dense areas into
    // counted blue circles, so the visible-object count on the map stays
    // small regardless of how many we return.
    const limit = Math.min(parseInt(sp.get('limit') || '5000', 10) || 5000, 5000)

    // Build a plain object of search params for the shared filter parser.
    const spObj: Record<string, string> = {}
    sp.forEach((v: string, k: string) => { spObj[k] = v })
    const filters = parseFiltersFromSearchParams(spObj)

    const supabase = sb()

    let q = supabase
      .from('listings')
      .select(
        'id, address, city, state, zip, price, beds, baths, sqft, lat, lng, status, property_type, photos, raw',
        { count: 'exact' },
      )
      .gte('lat', sw_lat).lte('lat', ne_lat)
      .gte('lng', sw_lng).lte('lng', ne_lng)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .order('price', { ascending: false })  // larger numbers first; matches typical "headline price" UX
      .limit(limit)

    // Shared filter application — status, price, beds, baths, type, sqft,
    // year_built, dom_max, q (text search), city. Note this also injects the
    // status/excluded/removed_at clauses that used to live inline.
    q = applyFiltersToSupabaseQuery(q, filters)

    const { data, count, error } = await q

    if (error) {
      console.error('[map-listings] supabase error', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings', listings: [], total: 0 },
        { status: 500 },
      )
    }

    const rows = data ?? []

    const listings = rows.map((r: any) => {
      // REIN's contingency model: ContingencyExists is the canonical boolean
      // ('Contingent' or 'Non Contingent'); Contingencies is the text list of
      // active contingencies (e.g. 'Home/EIFS Insp. Con.,POA/Condo'). About
      // 19% of Active listings carry a contingency — we surface that on the
      // map pill via a yellow color override regardless of headline status.
      const contingencyExists = r.raw?.ContingencyExists ?? null
      const contingenciesText = r.raw?.Contingencies ?? ''
      const contingent =
        contingencyExists === 'Contingent' ||
        (typeof contingenciesText === 'string' && contingenciesText.trim().length > 0)
      return {
        id: r.id,
        address: r.address,
        city: r.city,
        state: r.state,
        zip: r.zip,
        price: r.price,
        priceFormatted: formatPriceShort(r.price),
        beds: r.beds ?? 0,
        baths: r.baths != null ? Number(r.baths) : 0,
        sqft: r.sqft ?? 0,
        propertyType: r.property_type ?? '',
        status: r.status,
        contingent,
        lat: r.lat,
        lng: r.lng,
        slug: generateSlug(r.address, r.city, r.state, r.zip),
        photo: Array.isArray(r.photos) && r.photos.length > 0 ? r.photos[0] : '',
      }
    })

    const res = NextResponse.json({
      listings,
      total: count ?? listings.length,
    })

    // Edge cache: 60s fresh, 5m stale-while-revalidate. The map fires this on
    // every pan/zoom; cache absorbs the burst without hammering Supabase.
    // Cache disabled while listings table is being seeded with real REIN data.
    // Re-enable as 'public, s-maxage=60, stale-while-revalidate=300' once feed is reliably flowing.
    res.