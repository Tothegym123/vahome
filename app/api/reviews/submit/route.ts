// app/api/reviews/submit/route.ts
// =============================================================================
// Submit a neighborhood review. Anonymous submission with Turnstile + rate limit.
//
// Flow:
//   1. Parse + validate input
//   2. Verify Cloudflare Turnstile token server-side
//   3. Rate-limit by IP and by email (max 3 per 24h)
//   4. Insert as 'pending' (RLS allows because we use SUPABASE_SERVICE_ROLE_KEY)
//   5. Email tom@vahomes.com with one-click approve/reject deep-links
//
// Env required:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   TURNSTILE_SECRET_KEY        (set up by Tom at cloudflare.com)
//   RESEND_API_KEY              (already configured for /api/leads)
//   ADMIN_PASSWORD              (used to sign the one-click links — same env var the rest of admin uses)
//   NEXT_PUBLIC_BASE_URL        (e.g. https://vahome.com — used to build approve/reject links in emails)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ReviewPayload {
  neighborhood_slug?: string;
  rating?: number | string;
  title?: string;
  pros?: string;
  cons?: string;
  years_lived?: number | string;
  reviewer_name?: string;
  reviewer_email?: string;
  turnstile_token?: string;
}

const MAX_REVIEWS_PER_IP_PER_24H = 3;
const MAX_REVIEWS_PER_EMAIL_PER_24H = 3;

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing');
  return createClient(url, key, { auth: { persistSession: false } });
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  const first = xff.split(',')[0]?.trim();
  if (first) return first;
  return req.headers.get('x-real-ip') || '0.0.0.0';
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Soft-fail in development if not configured. In prod, missing secret = reject.
    if (process.env.NODE_ENV === 'production') return false;
    console.warn('[reviews] TURNSTILE_SECRET_KEY not set — accepting in non-prod');
    return true;
  }
  try {
    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (ip) body.set('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await r.json()) as { success: boolean };
    return !!data.success;
  } catch (e) {
    console.error('[reviews] turnstile verify failed', e);
    return false;
  }
}

function signActionToken(reviewId: string, action: 'approve' | 'reject'): string {
  const secret = process.env.ADMIN_PASSWORD || '';
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(`${reviewId}:${action}`).digest('hex');
}

async function sendModerationEmail(review: {
  id: string;
  neighborhood_slug: string;
  rating: number;
  title: string | null;
  pros: string | null;
  cons: string | null;
  years_lived: number | null;
  reviewer_name: string;
  reviewer_email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[reviews] Resend not configured, skipping moderation email');
    return;
  }
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://vahome.com').replace(/\/$/, '');
  const approveSig = signActionToken(review.id, 'approve');
  const rejectSig = signActionToken(review.id, 'reject');
  const approveUrl = `${baseUrl}/api/admin/reviews/action?id=${review.id}&action=approve&sig=${approveSig}`;
  const rejectUrl = `${baseUrl}/api/admin/reviews/action?id=${review.id}&action=reject&sig=${rejectSig}`;

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a5276;">
      <h2 style="margin:0 0 16px;color:#1a5276">New Neighborhood Review — Pending Moderation</h2>
      <p style="color:#5d6d7e;margin:0 0 20px">Submitted just now to <strong>/neighborhoods/${review.neighborhood_slug}/</strong></p>
      <div style="background:#fafcfe;border:1px solid #e2eaf2;border-radius:10px;padding:20px;margin:0 0 24px">
        <p style="margin:0 0 6px"><strong>Rating:</strong> <span style="color:#e67e22;font-size:1.15rem">${stars}</span> (${review.rating}/5)</p>
        <p style="margin:0 0 6px"><strong>Reviewer:</strong> ${review.reviewer_name} &lt;${review.reviewer_email}&gt;</p>
        ${review.years_lived != null ? `<p style="margin:0 0 6px"><strong>Years lived:</strong> ${review.years_lived}</p>` : ''}
        ${review.title ? `<p style="margin:12px 0 6px"><strong>Title:</strong> ${review.title}</p>` : ''}
        ${review.pros ? `<p style="margin:12px 0 6px"><strong>Pros:</strong><br>${review.pros.replace(/\n/g, '<br>')}</p>` : ''}
        ${review.cons ? `<p style="margin:12px 0 6px"><strong>Cons:</strong><br>${review.cons.replace(/\n/g, '<br>')}</p>` : ''}
      </div>
      <div style="display:flex;gap:12px">
        <a href="${approveUrl}" style="display:inline-block;padding:12px 24px;background:#34c759;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Approve</a>
        <a href="${rejectUrl}" style="display:inline-block;padding:12px 24px;background:#ff3b30;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Reject</a>
      </div>
      <p style="color:#5d6d7e;font-size:0.85rem;margin:24px 0 0">Or moderate from the dashboard: <a href="${baseUrl}/admin/reviews/" style="color:#e67e22">${baseUrl}/admin/reviews/</a></p>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'VaHome Reviews <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL || 'tom@vahomes.com',
        subject: `New review (${review.rating}/5) for /neighborhoods/${review.neighborhood_slug}/`,
        html,
      }),
    });
    if (!r.ok) console.error('[reviews] Resend error', r.status, await r.text());
  } catch (e) {
    console.error('[reviews] email send failed', e);
  }
}

export async function POST(req: NextRequest) {
  let payload: ReviewPayload = {};
  try {
    payload = (await req.json()) as ReviewPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  // Validate
  const slug = (payload.neighborhood_slug || '').toString().trim().toLowerCase();
  const ratingNum = Number(payload.rating);
  const yearsNum = payload.years_lived !== undefined && payload.years_lived !== '' ? Number(payload.years_lived) : null;
  const name = (payload.reviewer_name || '').toString().trim();
  const email = (payload.reviewer_email || '').toString().trim().toLowerCase();
  const title = (payload.title || '').toString().trim().slice(0, 200) || null;
  const pros = (payload.pros || '').toString().trim().slice(0, 2000) || null;
  const cons = (payload.cons || '').toString().trim().slice(0, 2000) || null;
  const turnstileToken = (payload.turnstile_token || '').toString();

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, error: 'invalid_slug' }, { status: 400 });
  }
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ ok: false, error: 'invalid_rating' }, { status: 400 });
  }
  if (yearsNum !== null && (!Number.isFinite(yearsNum) || yearsNum < 0 || yearsNum > 100)) {
    return NextResponse.json({ ok: false, error: 'invalid_years_lived' }, { status: 400 });
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!pros && !cons && !title) {
    return NextResponse.json({ ok: false, error: 'review_empty' }, { status: 400 });
  }
  if (!turnstileToken) {
    return NextResponse.json({ ok: false, error: 'captcha_required' }, { status: 400 });
  }

  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent') || '';

  // Captcha verify
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ ok: false, error: 'captcha_failed' }, { status: 400 });
  }

  let supabase;
  try {
    supabase = sb();
  } catch (e) {
    console.error('[reviews] supabase init failed', e);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }

  // Rate limit by IP and by email — count rows in last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: ipCount } = await supabase
    .from('neighborhood_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', since);
  if ((ipCount ?? 0) >= MAX_REVIEWS_PER_IP_PER_24H) {
    return NextResponse.json({ ok: false, error: 'rate_limit_ip' }, { status: 429 });
  }
  const { count: emailCount } = await supabase
    .from('neighborhood_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('reviewer_email', email)
    .gte('created_at', since);
  if ((emailCount ?? 0) >= MAX_REVIEWS_PER_EMAIL_PER_24H) {
    return NextResponse.json({ ok: false, error: 'rate_limit_email' }, { status: 429 });
  }

  const { data: inserted, error: insErr } = await supabase
    .from('neighborhood_reviews')
    .insert({
      neighborhood_slug: slug,
      rating: ratingNum,
      title,
      pros,
      cons,
      years_lived: yearsNum,
      reviewer_name: name,
      reviewer_email: email,
      ip_address: ip,
      user_agent: userAgent.slice(0, 500),
      status: 'pending',
    })
    .select('id, neighborhood_slug, rating, title, pros, cons, years_lived, reviewer_name, reviewer_email')
    .single();

  if (insErr || !inserted) {
    console.error('[reviews] insert failed', insErr);
    return NextResponse.json({ ok: false, error: 'insert_failed' }, { status: 500 });
  }

  // Fire-and-forget moderation email
  sendModerationEmail(inserted).catch((e) => console.error('[reviews] email error', e));

  return NextResponse.json({ ok: true, id: inserted.id });
}
