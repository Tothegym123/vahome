// app/api/mortgage-track/route.ts
// Lightweight non-PII tracking endpoint.
// Records soft signals (e.g., "user expanded the listing calculator")
// into mortgage_interactions so we can detect "warm" users.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    await supabase.from('mortgage_interactions').insert({
      session_id: req.headers.get('x-session-id') || null,
      event_type: String(body.eventType || 'unknown').slice(0, 80),
      props: body.props || {},
      page_url: body.attribution?.pageUrl || null,
      referrer: body.attribution?.referrer || null,
      utm_source: body.attribution?.utmSource || null,
      utm_medium: body.attribution?.utmMedium || null,
      utm_campaign: body.attribution?.utmCampaign || null,
    })
  } catch {
    // best-effort; never block UX
  }
  return NextResponse.json({ ok: true })
}
