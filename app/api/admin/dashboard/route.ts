// app/api/admin/dashboard/route.ts
// =============================================================================
// Server-side admin data endpoint.
//
// Auth:
//   Requires the `admin_ok=1` cookie set by /api/admin-auth.
//   That cookie is httpOnly + Secure + SameSite=Strict, so it cannot be read
//   by JS or sent on cross-site requests.
//
// Trust model:
//   The browser proves admin status by knowing the password (set via
//   /api/admin-auth, which uses constant-time compare against ADMIN_PASSWORD).
//   On success that handler issues the cookie. From then on, this route just
//   confirms the cookie is present and == '1'.
//
// Data:
//   Reads profiles, search_activity, saved_listings, waitlist using the
//   Supabase service role key (server-only env var). Bypasses RLS so it
//   works after we lock down the leaky anon-read policies.
//
// Cache:
//   Forced fresh — admin must always see current data. Bypasses both
//   the Vercel edge cache and Next.js fetch cache.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Bypass Next.js fetch cache — admin must always see fresh data.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input as any, { ...(init || {}), cache: 'no-store' }),
    },
  })
}

export async function GET(req: NextRequest) {
  // Auth gate — require admin_ok cookie set by /api/admin-auth
  const adminCookie = req.cookies.get('admin_ok')?.value
  if (adminCookie !== '1') return unauthorized()

  try {
    const supabase = sb()

    // Run all reads in parallel for speed.
    const [profilesRes, activityRes, savedListingsRes, waitlistRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, role, updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(1000),
      supabase
        .from('search_activity')
        .select('id, user_id, action_type, mls_number, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(1000),
      supabase
        .from('saved_listings')
        .select('id, user_id, mls_number, created_at')
        .limit(2000),
      supabase
        .from('waitlist')
        .select('id, name, email, phone, source, created_at, metadata')
        .order('created_at', { ascending: false })
        .limit(500),
    ])

    if (profilesRes.error || activityRes.error || savedListingsRes.error || waitlistRes.error) {
      console.error('[admin/dashboard] supabase error', {
        profiles: profilesRes.error?.message,
        activity: activityRes.error?.message,
        saved: savedListingsRes.error?.message,
        waitlist: waitlistRes.error?.message,
      })
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const res = NextResponse.json({
      profiles: profilesRes.data ?? [],
      activity: activityRes.data ?? [],
      saved_listings: savedListingsRes.data ?? [],
      waitlist: waitlistRes.data ?? [],
    })
    res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate')
    return res
  } catch (e: any) {
    console.error('[admin/dashboard] exception', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
