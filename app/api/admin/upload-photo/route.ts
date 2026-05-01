// Photo upload proxy. Droplet POSTs photo bytes here; this route uploads
// to Vercel Blob using the auto-injected BLOB_READ_WRITE_TOKEN env var
// which only exists at runtime inside Vercel.
//
// Auth: shared secret in x-admin-password header, matched against
// ADMIN_PASSWORD env var.
//
// Body: { path: string, contentType: string, base64: string }
// Response: { url: string } on success
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD not set on server' },
      { status: 500 }
    );
  }
  const provided = req.headers.get('x-admin-password');
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { path?: string; contentType?: string; base64?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const { path, contentType, base64 } = body;
  if (!path || !base64) {
    return NextResponse.json(
      { error: 'missing path or base64 in body' },
      { status: 400 }
    );
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return NextResponse.json({ error: 'invalid base64' }, { status: 400 });
  }

  if (buffer.length === 0) {
    return NextResponse.json({ error: 'empty buffer' }, { status: 400 });
  }
  if (buffer.length > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'buffer too large (>10MB)' }, { status: 413 });
  }

  try {
    const result = await put(path, buffer, {
      contentType: contentType || 'image/webp',
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 31536000,
    });
    return NextResponse.json({ url: result.url, pathname: result.pathname });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'blob upload failed', detail: err?.message || String(err) },
      { status: 502 }
    );
  }
}
