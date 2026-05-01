// Upload optimized photos to Supabase Storage (vahome-photos bucket).
//
// Migrated from Vercel Blob → Supabase Storage on 2026-05-01.
// Why: eliminates the need for BLOB_READ_WRITE_TOKEN and the passkey-gated
// dashboard. Same SUPABASE_SERVICE_ROLE_KEY already used for upserts.
//
// Module name kept as upload-blob.js so callers don't have to change
// (sync.js imports `uploadPhoto` from here).
//
// Public URL pattern: https://<project>.supabase.co/storage/v1/object/public/vahome-photos/<path>
// 1-year cache headers (URLs are immutable; new MediaKey from REIN = new URL).

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.js';

const BUCKET = 'vahome-photos';

let _client = null;
function client() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export async function uploadPhoto(mlsNumber, mediaKey, buffer, contentType) {
  const ext = (contentType?.split('/')[1] || 'webp').toLowerCase();
  // Path is immutable: when REIN replaces a photo it gets a new MediaKey,
  // which produces a new URL — no cache invalidation needed downstream.
  const safeKey = String(mediaKey).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `listings/${mlsNumber}/${safeKey}.${ext}`;

  const supabase = client();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: contentType || 'image/webp',
      upsert: true,                  // idempotent: same path = overwrite (effectively no-op for same content)
      cacheControl: '31536000',      // 1 year — paths are immutable
    });

  if (error) {
    // Supabase storage occasionally returns a "Duplicate" error if upsert isn't honored.
    // Fall back to constructing the public URL directly (object exists either way).
    if (error.message?.toLowerCase().includes('duplicate') || error.statusCode === '409') {
      logger.debug({ mlsNumber, mediaKey, path }, 'photo already exists, returning public URL');
    } else {
      logger.warn({ mlsNumber, mediaKey, err: error.message, code: error.statusCode }, 'storage upload failed');
      throw new Error(`storage upload failed: ${error.message}`);
    }
  }

  // Construct the public URL (works whether upload succeeded or duplicate)
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}
