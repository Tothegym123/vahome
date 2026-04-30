// Unified photo fetcher — dispatches to RESO or RETS, returns buffers
import sharp from 'sharp';
import { fetchPhotosReso } from './auth-reso.js';
import { fetchPhotosRets } from './auth-rets.js';
import { logger } from './logger.js';

const MAX_PHOTOS = parseInt(process.env.MAX_PHOTOS_PER_LISTING || '50', 10);

export async function fetchAndProcessPhotos(mlsId) {
  const authType = (process.env.REIN_AUTH_TYPE || 'reso').toLowerCase();
  let metas;

  if (authType === 'reso') {
    // RESO returns metadata with URLs — fetch each URL
    const list = await fetchPhotosReso(mlsId);
    metas = list.slice(0, MAX_PHOTOS);
    const results = [];
    for (const m of metas) {
      try {
        if (!m.url) continue;
        const r = await fetch(m.url);
        if (!r.ok) {
          logger.warn({ mlsId, mediaKey: m.mediaKey, status: r.status }, 'photo download failed');
          continue;
        }
        const buf = Buffer.from(await r.arrayBuffer());
        const optimized = await optimizePhoto(buf);
        results.push({ mediaKey: m.mediaKey, contentType: 'image/webp', buffer: optimized, order: m.order });
      } catch (err) {
        logger.warn({ mlsId, mediaKey: m.mediaKey, err: err.message }, 'photo processing failed');
      }
    }
    return results;
  } else if (authType === 'rets') {
    // RETS returns binary parts directly
    const parts = await fetchPhotosRets(mlsId);
    const trimmed = parts.slice(0, MAX_PHOTOS);
    const results = [];
    for (const p of trimmed) {
      try {
        const optimized = await optimizePhoto(p.buffer);
        results.push({ mediaKey: p.mediaKey, contentType: 'image/webp', buffer: optimized, order: p.order });
      } catch (err) {
        logger.warn({ mlsId, mediaKey: p.mediaKey, err: err.message }, 'photo optimization failed');
      }
    }
    return results;
  } else {
    throw new Error(`Unknown REIN_AUTH_TYPE: ${authType}`);
  }
}

async function optimizePhoto(buffer) {
  // Resize to max 1920px wide, convert to WebP at quality 82
  return sharp(buffer)
    .rotate() // honor EXIF orientation then strip
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}
