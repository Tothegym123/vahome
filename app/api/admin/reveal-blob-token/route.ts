// TEMPORARY admin-gated endpoint to reveal BLOB_READ_WRITE_TOKEN.
// DELETE THIS FILE after the token has been retrieved and added to the droplet.
//
// Usage:
//   curl -H "x-admin-password: <ADMIN_PASSWORD>" https://vahome.com/api/admin/reveal-blob-token
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not set on server' }, { status: 500 });
  }
  const provided = req.headers.get('x-admin-password');
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN || '';
  if (!token) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set' }, { status: 500 });
  }
  return NextResponse.json({
    BLOB_READ_WRITE_TOKEN: token,
    note: 'DELETE this endpoint after retrieving the token. File: app/api/admin/reveal-blob-token/route.ts',
  });
}
