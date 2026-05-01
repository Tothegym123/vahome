// One-shot probe: discover REIN's actual Resource / Class / queryable-field names.
// Run with: node probe-metadata.js
//
// REIN doesn't use the generic "Property/Listing" pair that the default sync
// config assumes. This script logs into RETS, then hits GetMetadata for:
//   - METADATA-SYSTEM (server-wide system info)
//   - METADATA-RESOURCE (list of all resources)
//   - METADATA-CLASS (list of classes per resource)
//   - METADATA-TABLE (queryable fields for the residential class)
// Output reveals the exact ResourceID + ClassName + key field names to put
// in .env and to use in the DMQL query.

import 'dotenv/config';
import crypto from 'node:crypto';
import { getRetsSession } from './lib/auth-rets.js';

function md5(s) { return crypto.createHash('md5').update(s).digest('hex'); }

async function digestFetch(url, opts = {}) {
  const username = process.env.REIN_USERNAME;
  const password = process.env.REIN_PASSWORD;
  const userAgent = process.env.REIN_USER_AGENT || 'VaHomeSync/1.0';
  const retsVersion = process.env.REIN_RETS_VERSION || 'RETS/1.7.2';

  const baseHeaders = {
    'User-Agent': userAgent,
    'RETS-Version': retsVersion,
    'Accept': '*/*',
    ...(opts.headers || {}),
  };

  let resp = await fetch(url, { ...opts, headers: baseHeaders });
  if (resp.status === 401) {
    const wwwAuth = resp.headers.get('www-authenticate') || '';
    if (/^Digest/i.test(wwwAuth)) {
      const params = {};
      wwwAuth.replace(/Digest\s+/i, '').split(',').forEach(p => {
        const [k, ...rest] = p.trim().split('=');
        params[k] = rest.join('=').replace(/^"|"$/g, '');
      });
      const ha1 = md5(`${username}:${params.realm}:${password}`);
      const u = new URL(url);
      const ha2 = md5(`${opts.method || 'GET'}:${u.pathname}${u.search}`);
      const cnonce = crypto.randomBytes(8).toString('hex');
      const nc = '00000001';
      const response = md5(`${ha1}:${params.nonce}:${nc}:${cnonce}:${params.qop || 'auth'}:${ha2}`);
      const auth = `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", uri="${u.pathname}${u.search}", qop=${params.qop || 'auth'}, nc=${nc}, cnonce="${cnonce}", response="${response}", algorithm=${params.algorithm || 'MD5'}${params.opaque ? `, opaque="${params.opaque}"` : ''}`;
      resp = await fetch(url, { ...opts, headers: { ...baseHeaders, Authorization: auth } });
    } else {
      const basic = Buffer.from(`${username}:${password}`).toString('base64');
      resp = await fetch(url, { ...opts, headers: { ...baseHeaders, Authorization: `Basic ${basic}` } });
    }
  }
  return resp;
}

async function getMeta(metaUrl, type, id) {
  const params = new URLSearchParams({ Type: type, ID: id, Format: 'STANDARD-XML' });
  const resp = await digestFetch(`${metaUrl}?${params.toString()}`);
  if (!resp.ok) {
    console.log(`! ${type} ${id} -> HTTP ${resp.status}`);
    return null;
  }
  return resp.text();
}

async function main() {
  const s = await getRetsSession();
  const metaUrl = s.capabilityUrls.getmetadata || s.capabilityUrls.GetMetadata;
  if (!metaUrl) throw new Error('GetMetadata capability not found');
  console.log('GetMetadata URL:', metaUrl);
  console.log('');

  // === 1. List all resources ===
  console.log('=== METADATA-RESOURCE (all resources) ===');
  const resourcesXml = await getMeta(metaUrl, 'METADATA-RESOURCE', '0');
  if (resourcesXml) {
    // STANDARD-XML uses <Resource>...<ResourceID>...</ResourceID>...
    const resourceIds = [...resourcesXml.matchAll(/<ResourceID>([^<]+)<\/ResourceID>/g)].map(m => m[1]);
    const standardNames = [...resourcesXml.matchAll(/<StandardName>([^<]*)<\/StandardName>/g)].map(m => m[1]);
    const visibleNames = [...resourcesXml.matchAll(/<VisibleName>([^<]*)<\/VisibleName>/g)].map(m => m[1]);
    resourceIds.forEach((id, i) => {
      console.log(`  ResourceID="${id}"  Standard="${standardNames[i] || ''}"  Visible="${visibleNames[i] || ''}"`);
    });
    console.log('');

    // === 2. For each resource, list classes ===
    for (const rid of resourceIds) {
      console.log(`=== METADATA-CLASS for resource "${rid}" ===`);
      const classXml = await getMeta(metaUrl, 'METADATA-CLASS', rid);
      if (classXml) {
        const classNames = [...classXml.matchAll(/<ClassName>([^<]+)<\/ClassName>/g)].map(m => m[1]);
        const classDescs = [...classXml.matchAll(/<VisibleName>([^<]*)<\/VisibleName>/g)].map(m => m[1]);
        const standardNames = [...classXml.matchAll(/<StandardName>([^<]*)<\/StandardName>/g)].map(m => m[1]);
        classNames.forEach((cn, i) => {
          console.log(`  ClassName="${cn}"  Standard="${standardNames[i] || ''}"  Visible="${classDescs[i] || ''}"`);
        });
      }
      console.log('');
    }

    // === 3. Show queryable fields for likely "residential" class ===
    // Try common residential class names + the first class of each resource
    const probableResources = resourceIds.filter(r => /property|listing/i.test(r));
    for (const rid of probableResources) {
      const classXml = await getMeta(metaUrl, 'METADATA-CLASS', rid);
      if (!classXml) continue;
      const firstClass = classXml.match(/<ClassName>([^<]+)<\/ClassName>/);
      if (!firstClass) continue;
      const classId = `${rid}:${firstClass[1]}`;
      console.log(`=== METADATA-TABLE searchable fields for "${classId}" ===`);
      const tableXml = await getMeta(metaUrl, 'METADATA-TABLE', classId);
      if (tableXml) {
        // Print only fields where Searchable=1
        const fields = [...tableXml.matchAll(/<Field>([\s\S]*?)<\/Field>/g)];
        const searchable = fields
          .map(m => m[1])
          .filter(f => /<Searchable>1<\/Searchable>/.test(f))
          .map(f => {
            const sn = f.match(/<SystemName>([^<]+)<\/SystemName>/)?.[1] || '';
            const stn = f.match(/<StandardName>([^<]*)<\/StandardName>/)?.[1] || '';
            const dt = f.match(/<DataType>([^<]+)<\/DataType>/)?.[1] || '';
            return `${sn}  (Standard=${stn}, Type=${dt})`;
          });
        console.log(`  ${searchable.length} searchable fields:`);
        searchable.slice(0, 80).forEach(f => console.log(`    ${f}`));
        if (searchable.length > 80) console.log(`    ... (${searchable.length - 80} more)`);
      }
      console.log('');
    }
  }
}

main().catch(e => {
  console.error('PROBE FAILED:', e.message);
  console.error(e.stack);
  process.exit(1);
});
