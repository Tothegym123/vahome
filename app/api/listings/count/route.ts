// app/api/listings/count/route.ts
// =============================================================================
// Live-count endpoint for the FilterSheet bottom CTA. Takes the same
// query-string filters as /listings and returns { count: N } using a
// head-only Supabase query for efficiency (head: true, count: 'exact').
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  parseFiltersFromSearchParams,
  applyFiltersToSupabaseQuery,
} from '../../../lib/listing-filters'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input as any, { ...(init || {}), cache: 'no-store' }),
    },
  })
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const sp: Record<string, string> = {}
    url.searchParams.forEach((v, k) => { sp[k] = v })
    const filters = parseFiltersFromSearchParams(sp)

    const supabase = sb()
    let q = supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .gt('price', 0)

    q = applyFiltersToSupabaseQuery(q, filters)

    const { count, error } = await q
    if (error) {
      console.error('[/api/listings/count] supabase error', error)
      return NextResponse.json({ count: 0, error: error.message }, { status: 500 })
    }
    return NextResponse.json(
      { count: count ?? 0 },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err: any) {
    console.error('[/api/listings/count] err', err)
    return NextResponse.json({ count: 0, error: err?.message || 'unknown' }, { status: 500 })
  }
}
