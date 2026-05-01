// app/api/tour-request/route.ts
// =============================================================================
// Server-side tour request submission.
//
// Why this exists:
//   The tour modal previously posted directly to Supabase via the anon
//   client. That path silently fails because anon REST INSERT is no longer
//   permitted on these tables. This route uses the service role and writes
//   to both contact_requests (lead record) and search_activity (event log).
//
// Validation:
//   - Either email OR phone required (we need a way to follow up).
//   - Message capped at 4000 chars (DB CHECK enforces this too).
//   - All string fields trimmed and length-capped before insert.
//
// Privacy:
//   - PII (name/email/phone) is NEVER logged to console. Only error codes
//     and types are logged.
//   - search_activity.metadata still carries PII because the legacy admin
//     view depends on it for anonymous tour-request leads. CRM Phase 1
//     will move this to a structured inquiries table without PII bleed.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface TourRequestPayload {
  name?: string
  email?: string
  phone?: string
  date?: string         // human-readable, e.g. "Mon May 5"
  time?: string         // e.g. "11:00 AM"
  tour_type?: 'in-person' | 'video' | string
  mls_number?: string
  listing_address?: string
  listing_city?: string
  listing_state?: string
  listing_zip?: string
  listing_price?: number
}

function clean(s: any, max = 500): string | null {
  if (typeof s !== 'string') return null
  const t = s.trim()
  if (!t) return null
  return t.length > max ? t.slice(0, max) : t
}

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

export async function POST(req: NextRequest) {
  let body: TourRequestPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name = clean(body.name, 200)
  const email = clean(body.email, 254)
  const phone = clean(body.phone, 30)
  const date = clean(body.date, 64)
  const time = clean(body.time, 32)
  const tour_type = clean(body.tour_type, 16)
  const mls_number = clean(body.mls_number, 32)
  const listing_address = clean(body.listing_address, 200)
  const listing_city = clean(body.listing_city, 80)
  const listing_state = clean(body.listing_state, 8)
  const listing_zip = clean(body.listing_zip, 16)
  const listing_price = typeof body.listing_price === 'number' ? body.listing_price : null

  // Validation: must have at least one contact channel
  if (!email && !phone) {
    return NextResponse.json({ ok: false, error: 'contact_required' }, { status: 400 })
  }

  // Build the human-readable message that lands in contact_requests.message
  const dateTime = [date, time].filter(Boolean).join(' at ')
  const tourTypeText = tour_type ? `(${tour_type})` : ''
  const listingText = [listing_address, listing_city].filter(Boolean).join(', ')
  const messageParts = [
    'Tour request:',
    dateTime || 'no time selected',
    tourTypeText,
    listingText ? `for ${listingText}` : '',
  ].filter(Boolean)
  const message = messageParts.join(' ').slice(0, 4000)

  let supabase
  try {
    supabase = sb()
  } catch {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 })
  }

  // Insert into contact_requests (the lead record)
  const { data: insertData, error: insertErr } = await supabase
    .from('contact_requests')
    .insert({
      name,
      email,
      phone,
      message,
      type: 'Buying',
      source: 'tour_modal',
      submitted_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertErr) {
    // Never log PII. Only the error code/type.
    console.error('[tour-request] contact_requests insert failed', {
      code: insertErr.code,
      hint: insertErr.hint,
    })
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 })
  }

  const contactRequestId = insertData?.id

  // Also write a tour_request event to search_activity for the admin timeline.
  // PII stays in metadata (legacy admin reads it); CRM Phase 1 will replace
  // this with a structured inquiries+events split.
  const { error: activityErr } = await supabase.from('search_activity').insert({
    action_type: 'tour_request',
    mls_number: mls_number,
    metadata: {
      contact_request_id: contactRequestId,
      name,
      email,
      phone,
      date,
      time,
      tour_type,
      listing_address: listing_address && [listing_address, listing_city, listing_state, listing_zip]
        .filter(Boolean).join(', '),
      listing_price,
    },
  })

  if (activityErr) {
    // Non-fatal — the lead record above already landed. Log code only.
    console.error('[tour-request] search_activity insert failed (non-fatal)', {
      code: activityErr.code,
    })
  }

  return NextResponse.json({ ok: true, id: contactRequestId })
}
