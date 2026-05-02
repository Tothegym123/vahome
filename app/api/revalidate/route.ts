// app/api/revalidate/route.ts
// =============================================================================
// On-demand revalidation endpoint.
//
// Called by the REIN sync host (DigitalOcean droplet) after a successful
// listings upsert batch. Triggers Next.js to drop its cached HTML for the
// affected paths so the next visitor sees fresh data without waiting for
// the 600-second ISR timer.
//
// Auth: requires the `x-revalidate-secret` header to match the
// `REVALIDATE_SECRET` env var. The secret is shared between the Vercel
// project and the DigitalOcean sync .env. Constant-time compare prevents
// timing attacks.
//
// Request:
//   POST /api/revalidate
//   x-revalidate-secret: <secret>
//   Content-Type: application/json
//   {
//     "paths": [
//       "/listings/1166/3340-country-cir-chesapeake/",
//       "/listings/chesapeake/",
//       "/neighborhoods/great-neck/"
//     ]
//   }
//
// Response (200):
//   {
//     "success": true,
//     "revalidated": ["/listings/1166/3340-country-cir-chesapeake/", ...],
//     "skipped":     ["/dashboard/etc"],     // paths rejected by allowlist
//     "errors":      [{ path, error }],      // paths that threw
//     "count":       N,
//     "timestamp":   "2026-05-02T18:23:11.123Z"
//   }
//
// 401: invalid or missing secret
// 400: invalid JSON / paths missing / paths not an array / empty array
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cap how many paths we'll revalidate in a single call. Prevents a runaway
// sync from accidentally invalidating thousands of pages at once.
const MAX_PATHS_PER_CALL = 500;

// Allowlist of path prefixes the sync is permitted to revalidate. Anything
// outside this list (e.g. /api/, /admin/, /dashboard/) is silently skipped.
const ALLOWED_PREFIXES = [
  '/',                    // homepage
  '/listings/',           // listing detail + city + filter pages
  '/neighborhoods/',
  '/va/',                 // /va/{city}/ military pages
  '/locations/',
];

function isPathAllowed(p: string): boolean {
  if (typeof p !== 'string') return false;
  if (!p.startsWith('/')) return false;
  // Block obvious abuse paths
  if (p.includes('..') || p.includes('//')) return false;
  if (p.length > 300) return false;
  // Block API/admin/dashboard/auth surfaces
  if (
    p.startsWith('/api/') ||
    p.startsWith('/admin/') ||
    p.startsWith('/admin') ||
    p.startsWith('/dashboard/') ||
    p.startsWith('/dashboard') ||
    p.startsWith('/_next/') ||
    p.startsWith('/auth/')
  ) {
    return false;
  }
  return ALLOWED_PREFIXES.some((pre) => p === pre || p.startsWith(pre));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET || '';
  const provided = req.headers.get('x-revalidate-secret') || '';

  if (!expected) {
    console.error('[revalidate] REVALIDATE_SECRET not configured');
    return NextResponse.json(
      { success: false, error: 'server_misconfigured' },
      { status: 500 }
    );
  }

  if (!provided || !timingSafeEqual(expected, provided)) {
    return NextResponse.json(
      { success: false, error: 'unauthorized' },
      { status: 401 }
    );
  }

  let body: { paths?: unknown };
  try {
    body = (await req.json()) as { paths?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_json' },
      { status: 400 }
    );
  }

  const paths = body.paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json(
      { success: false, error: 'paths_required' },
      { status: 400 }
    );
  }

  // Dedupe + cap.
  const unique = Array.from(new Set(paths.map((p) => String(p))));
  const capped = unique.slice(0, MAX_PATHS_PER_CALL);

  const revalidated: string[] = [];
  const skipped: string[] = [];
  const errors: Array<{ path: string; error: string }> = [];

  for (const p of capped) {
    if (!isPathAllowed(p)) {
      skipped.push(p);
      continue;
    }
    try {
      revalidatePath(p);
      revalidated.push(p);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'unknown_error';
      // Don't leak internal stack traces; log full server-side, return summary.
      console.error('[revalidate] path failed', p, e);
      errors.push({ path: p, error: msg.slice(0, 200) });
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    revalidated,
    skipped,
    errors,
    count: revalidated.length,
    timestamp: new Date().toISOString(),
  });
}

// Reject everything that isn't POST so port-scanners/curl-tinkering don't get
// a friendly 405 response leaking metadata.
export async function GET() {
  return NextResponse.json({ success: false, error: 'method_not_allowed' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ success: false, error: 'method_not_allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ success: false, error: 'method_not_allowed' }, { status: 405 });
}
