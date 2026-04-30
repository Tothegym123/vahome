// Upload optimized photos to Vercel Blob (vahome-photos store)
import { put } from '@vercel/blob';
import { logger } from './logger.js';

const blobToken = () => process.env.BLOB_READ_WRITE_TOKEN;

export async function uploadPhoto(mlsNumber, mediaKey, buffer, contentType) {
  const token = blobToken();
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN not set');

  const ext = contentType.split('/')[1] || 'webp';
  // Path is immutable: when REIN replaces a photo it gets a new MediaKey,
  // which produces a new URL — no cache invalidation needed.
  const safeKey = String(mediaKey).replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `listings/${mlsNumber}/${safeKey}.${ext}`;

  try {
    const result = await put(path, buffer, {
      access: 'public',
      token,
      contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000, // 1 year — URLs are immutable
    });
    return result.url;
  } catch (err) {
    // If the blob already exists, return its URL (idempotent uploads)
    if (err.message?.includes('already exists')) {
      // Vercel Blob exposes a deterministic URL pattern; recompute
      const storeUrl = process.env.BLOB_STORE_URL || '';
      if (storeUrl) return `${storeUrl}/${path}`;
    }
    logger.warn({ mlsNumber, mediaKey, err: err.message }, 'blob upload failed');
    throw err;
  }
}
