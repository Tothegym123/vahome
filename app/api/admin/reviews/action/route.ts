// app/api/admin/reviews/action/route.ts
// =============================================================================
// Admin: approve or reject a review.
//
// Two access modes:
//   1. Cookie-gated POST { id, action } — for the in-app /admin/reviews page.
//   2. HMAC-signed GET ?id=&action=&sig= — for the one-click links in the
//      moderation email. Signature uses ADMIN_PASSWORD as the HMAC secret so
//      only emails Tom received can act, and the URL stays useful even when
//      he's logged out.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

function isAdminCookie(req: NextRequest): boolean {
  return req.cookies.get('admin_ok')?.value === '1';
}

function verifySignature(reviewId: string, action: string, sig: string): boolean {
  const secret = process.env.ADMIN_PASSWORD || '';
  if (!secret || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${reviewId}:${action}`).digest('hex');
  // Timing-safe compare
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

async function applyAction(id: string, action: 'approve' | 'reject') {
  const supabase = sb();
  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  const { data, error } = await supabase
    .from('neighborhood_reviews')
    .update({
      status: newStatus,
      approved_at: action === 'approve' ? new Date().toISOString() : null,
      approved_by: 'tom@vahomes.com',
    })
    .eq('id', id)
    .select('id, status, neighborhood_slug')
    .single();
  if (error) return { ok: false, error: 'db_error' as const };
  return { ok: true, review: data };
}

// One-click email link
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const id = url.searchParams.get('id') || '';
  const action = url.searchParams.get('action') || '';
  const sig = url.searchParams.get('sig') || '';

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  }
  if (!verifySignature(id, action, sig)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 403 });
  }

  const result = await applyAction(id, action as 'approve' | 'reject');
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  // Friendly HTML response so Tom isn't staring at a JSON blob
  const status = result.review!.status;
  const slug = result.review!.neighborhood_slug;
  const html = `<!doctype html><meta charset="utf-8"><title>Review ${status}</title>
    <style>body{font-family:-apple-system,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;color:#1a5276;text-align:center}
    .ok{font-size:3rem;color:#34c759;margin-bottom:8px}.btn{display:inline-block;margin-top:18px;padding:12px 22px;background:#1a5276;color:#fff;text-decoration:none;border-radius:8px;font-weight:600}</style>
    <div class="ok">${action === 'approve' ? '✅' : '❌'}</div>
    <h1>Review ${status}</h1>
    <p>The review has been marked <strong>${status}</strong>.</p>
    <a class="btn" href="/admin/reviews/">Back to moderation queue</a>
    <p style="margin-top:32px"><a href="/neighborhoods/${slug}/" style="color:#5d6d7e">View /neighborhoods/${slug}/</a></p>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// Admin UI POST
export async function POST(req: NextRequest) {
  if (!isAdminCookie(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  let body: { id?: string; action?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const id = (body.id || '').toString();
  const action = (body.action || '').toString();
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  }
  const result = await applyAction(id, action as 'approve' | 'reject');
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, review: result.review });
}
