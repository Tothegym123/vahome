// app/api/admin/reviews/route.ts
// =============================================================================
// Admin: list reviews by status (pending/approved/rejected/spam).
// Cookie-gated: requires admin_ok cookie set by /api/admin-auth.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get('admin_ok')?.value === '1';
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get('status') || 'pending';
  const allowed = ['pending', 'approved', 'rejected', 'spam', 'all'];
  if (!allowed.includes(status)) {
    return NextResponse.json({ ok: false, error: 'invalid_status' }, { status: 400 });
  }
  const supabase = sb();
  let q = supabase
    .from('neighborhood_reviews')
    .select('id, neighborhood_slug, rating, title, pros, cons, years_lived, reviewer_name, reviewer_email, status, created_at, ip_address')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) {
    console.error('[admin/reviews] list error', error);
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, reviews: data || [] });
}
