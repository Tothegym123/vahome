# VaHome REIN MLS Sync

Scheduled poller that pulls listings + photos from REIN's MLS feed,
optimizes photos to WebP, uploads to Vercel Blob, and upserts into
Supabase. Runs every 30 minutes via cron on a DigitalOcean droplet.

## Architecture

```
REIN MLS (RETS or RESO Web API)
        │
        ▼
[ DigitalOcean droplet 138.197.73.206 ]
   sync.js (cron */30)
   ├── auth (RESO OAuth2 OR RETS Digest)
   ├── fetchAllListings()  ← incremental from cursor
   ├── transform.js        ← REIN field → schema column
   ├── fetchAndProcessPhotos() → sharp → WebP @ 1920px / Q82
   ├── uploadPhoto() → Vercel Blob (vahome-photos)
   └── upsertListings()    ← Supabase listings + listing_history + open_houses
```

## Files

| File | Purpose |
|---|---|
| `sync.js` | Main entry — orchestrates auth → fetch → transform → upload → upsert |
| `setup.sh` | One-time droplet bootstrap (Node 20, npm install, .env, log file) |
| `package.json` | Node deps: @supabase/supabase-js, @vercel/blob, dotenv, pino, sharp |
| `.env.example` | All env vars documented; copy to `.env` and fill |
| `.gitignore` | Excludes `.env`, `node_modules/`, `*.log` |
| `lib/logger.js` | Structured pino logger |
| `lib/auth-reso.js` | RESO Web API OAuth2 + paged OData fetch |
| `lib/auth-rets.js` | Legacy RETS XML Digest auth + capability discovery |
| `lib/fetch-listings.js` | Unified paged listings fetcher (RESO or RETS) |
| `lib/fetch-photos.js` | Photo fetch + sharp WebP optimization |
| `lib/upload-blob.js` | Vercel Blob upload (immutable URLs by mediaKey) |
| `lib/transform.js` | REIN field → Supabase schema; permissive name fallbacks |
| `lib/upsert-supabase.js` | Upsert listings + history events + open_houses |

## One-time setup on the droplet

```bash
ssh root@138.197.73.206
curl -sSL https://raw.githubusercontent.com/Tothegym123/vahome/main/sync/setup.sh | bash
```

Or, manually after a `git clone`:

```bash
cd /root/vahome/sync
bash setup.sh
```

Then edit `/root/vahome/sync/.env`:

- `REIN_AUTH_TYPE` — `reso` or `rets` (whichever REIN provides)
- For RESO: `REIN_TOKEN_URL`, `REIN_CLIENT_ID`, `REIN_CLIENT_SECRET`, `REIN_BASE_URL`
- For RETS: `REIN_LOGIN_URL`, `REIN_USERNAME`, `REIN_PASSWORD`
- `BLOB_READ_WRITE_TOKEN` — from Vercel dashboard → vahome-photos store → `.env.local` tab
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project → Settings → API

## Running

```bash
# Smoke test — auth only, no data fetch
node sync.js --test-auth

# First full pull (1–6 hours depending on photo volume)
SYNC_FULL=true node sync.js

# Incremental (default after first full run)
node sync.js
```

## Cron install

After verifying `.env` and a successful smoke test:

```bash
(crontab -l 2>/dev/null; echo '*/30 * * * * cd /root/vahome/sync && /usr/bin/node sync.js >> /var/log/vahome-sync.log 2>&1') | crontab -
```

Verify: `crontab -l`

Tail the log: `tail -f /var/log/vahome-sync.log`

## How incremental sync works

1. On startup, queries Supabase `ingestion_runs` for the most recent `status='completed'` row.
2. Reads its `started_at` timestamp, subtracts `INCREMENTAL_OVERLAP_MINUTES` (default 5),
   uses that as the `ModificationTimestamp gt …` filter.
3. Fetches only records modified since.
4. Inserts a new `ingestion_runs` row at start (`status='running'`) and updates it
   at end with counts + status.

If the previous run failed, the cursor stays at the last *successful* run's timestamp,
so missed records are caught on the next attempt.

## Compliance

Per Exhibit A IDX:
- `RES + MFR + COM + LAF + RNT` resources synced
- `Active + 120 days Pending/Expired/Withdrawn + 1 year Sold`
- `WebExclude=Y` filtered at ingest (set `excluded=true`, `listings_public_read` RLS hides)
- Sold/Expired/Withdrawn stored but **not publicly displayed** (RLS enforces)
- Longitude stored but never displayed (frontend responsibility)
- Photo cap 50 per listing (configurable via `MAX_PHOTOS_PER_LISTING`)

## Photo URLs

Path convention: `listings/{mls_number}/{mediaKey}.webp`

URLs are immutable — when REIN replaces a photo it gets a new MediaKey, which produces
a new URL. The `cacheControlMaxAge` is 1 year. No cache invalidation needed.

## Troubleshooting

**Auth fails:** Verify `REIN_AUTH_TYPE` matches what REIN ships. Try `--test-auth`.
For RETS, check that `REIN_LOGIN_URL` returns a `<RETS-RESPONSE>` block.

**Photos missing:** Check `MAX_PHOTOS_PER_LISTING` cap, and verify `BLOB_READ_WRITE_TOKEN`
is set. The pipeline degrades gracefully — listing data ingests even if photos fail.

**Field name mismatches:** `lib/transform.js` uses permissive fallbacks but if REIN's data
dictionary uses non-standard names, edit that file. Common pattern: `pick(rec, 'A', 'B', 'C')`
returns the first non-empty value.

**Sync hangs on first run:** The first full pull can take 1–6 hours depending on photo
volume. Watch the log: `tail -f /var/log/vahome-sync.log`. If genuinely stuck, kill it
and run again — incremental will resume.

**RLS hides everything from frontend:** `listings_public_read` policy requires
`excluded=false AND removed_at IS NULL AND status IN ('Active', 'Pending')`. To show
Sold listings, ALTER POLICY to add `'Sold'` to the IN list — no re-import needed.

## After first successful sync

Swap the frontend's `app/lib/listings.ts` to read from Supabase. The drop-in replacement
is at `rein-ingestion/04_lib_listings_supabase.ts` in this repo. Function signatures
match — no caller changes needed.
