// app/api/map-listings/route.ts
// =============================================================================
// Map listings endpoint — backed by live Supabase REIN data.
//
// Hampton Roads bbox query, status-filtered to buyer-relevant statuses, 500 cap.
// Field shape EXACTLY matches the prior mock-data response so MapClient
// does not need any change.
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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Listing statuses we surface on the map. Sold/Withdrawn/Expired are excluded
// because they are not actionable for a buyer browsing the map.
const VISIBLE_STATUSES = ['Active', 'Pending', 'Contingent']

function generateSlug(address: string, city: string, state: string, zip: string): string {
  return [address, city, state, zip]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
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
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
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

    // hard cap at 500 to protect the response size + map render
    const limit = Math.min(parseInt(sp.get('limit') || '500', 10) || 500, 500)
    const type = (sp.get('type') || '').trim()
    const min_price = sp.get('min_price') ? parseInt(sp.get('min_price')!, 10) : null
    const max_price = sp.get('max_price') ? parseInt(sp.get('max_price')!, 10) : null
    const beds = sp.get('beds') ? parseInt(sp.get('beds')!, 10) : null

    const supabase = sb()

    let q = supabase
      .from('listings')
      .select('id, address, city, state, zip, price, beds, baths, sqft, lat, lng, status, property_type', {
        count: 'exact',
      })
      .in('status', VISIBLE_STATUSES)
      .eq('excluded', false)
      .is('removed_at', null)
      .gte('lat', sw_lat).lte('lat', ne_lat)
      .gte('lng', sw_lng).lte('lng', ne_lng)
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .order('price', { ascending: false })  // larger numbers first; matches typical "headline price" UX
      .limit(limit)

    if (min_price !== null) q = q.gte('price', min_price)
    if (max_price !== null) q = q.lte('price', max_price)
    if (beds !== null) q = q.gte('beds', beds)
    if (type) q = q.ilike('property_type', type)

    const { data, count, error } = await q

    if (error) {
      console.error('[map-listings] supabase error', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings', listings: [], total: 0 },
        { status: 500 },
      )
    }

    const rows = data ?? []

    const listings = rows.map((r: any) => ({
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
      lat: r.lat,
      lng: r.lng,
      slug: generateSlug(r.address, r.city, r.state, r.zip),
    }))

    const res = NextResponse.json({
      listings,
      total: count ?? listings.length,
    })

    // Edge cache: 60s fresh, 5m stale-while-revalidate. The map fires this on
    // every pan/zoom; cache absorbs the burst without hammering Supabase.
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res
  } catch (e) {
    console.error('[map-listings] exception', e)
    return NextResponse.json(
      { error: 'Failed to fetch listings', listings: [], total: 0 },
      { status: 500 },
    )
  }
}
