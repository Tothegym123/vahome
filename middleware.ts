import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// IP allowlist — only these IPs can view the site.
// To re-open the site to the public, delete this file and redeploy.
const ALLOWED_IPS = ['47.133.138.47'];

export function middleware(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for') ?? '';
  const ip = (req.ip || xff.split(',')[0] || '').trim();

  if (ALLOWED_IPS.includes(ip)) {
    return NextResponse.next();
  }

  return new NextResponse(
    '<!doctype html><html><head><title>Unavailable</title><meta name="robots" content="noindex"></head><body style="font-family:system-ui;padding:3rem;text-align:center;color:#444"><h1>Site temporarily unavailable</h1><p>This site is currently in private testing.</p></body></html>',
    { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
