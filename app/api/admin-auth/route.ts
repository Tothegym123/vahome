// File: app/api/admin-auth/route.ts
// Server-side admin password check. The actual password lives in the ADMIN_PASSWORD Vercel env var.

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const submitted = (body.password ?? '').toString();
  const expected = process.env.ADMIN_PASSWORD ?? '';

  if (!expected) {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 });
  }

  if (submitted.length !== expected.length) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= submitted.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // path: '/' so the cookie is also sent to /api/admin/* routes (e.g. /api/admin/dashboard).
  // Cookie is still httpOnly + secure + sameSite=strict, so it cannot be read by JS
  // or sent on cross-site requests. Path widening does not weaken any of those protections.
  res.cookies.set('admin_ok', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 4,
  });
  return res;
}
