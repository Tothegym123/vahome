// Try multiple DMQL queries against REIN to find the right field names.
// Also dumps every searchable field name so we can pick the right ones for
// timestamp / status / MLS number.

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

async function dumpAllFields(metaUrl) {
  const params = new URLSearchParams({ Type: 'METADATA-TABLE', ID: 'Property:Listing', Format: 'STANDARD-XML' });
  const resp = await digestFetch(`${metaUrl}?${params.toString()}`);
  const xml = await resp.text();
  const fields = [...xml.matchAll(/<Field>([\s\S]*?)<\/Field>/g)];
  const all = fields.map(m => {
    const sn = m[1].match(/<SystemName>([^<]+)<\/SystemName>/)?.[1] || '';
    const stn = m[1].match(/<StandardName>([^<]*)<\/StandardName>/)?.[1] || '';
    const dt = m[1].match(/<DataType>([^<]+)<\/DataType>/)?.[1] || '';
    const sr = m[1].match(/<Searchable>([^<]+)<\/Searchable>/)?.[1] || '';
    return { sn, stn, dt, sr };
  });
  console.log(`=== ALL ${all.length} fields in Property:Listing (searchable=1 only) ===`);
  const searchable = all.filter(f => f.sr === '1');
  searchable.forEach(f => console.log(`  ${f.sn}  (Std=${f.stn}, Type=${f.dt})`));
  console.log('');

  // Highlight likely candidates
  console.log('--- Likely TIMESTAMP fields ---');
  searchable.filter(f => /modif|timestamp|update|matrix/i.test(f.sn)).forEach(f => console.log(`  ${f.sn}  (Type=${f.dt})`));
  console.log('--- Likely STATUS fields ---');
  searchable.filter(f => /status|state/i.test(f.sn)).forEach(f => console.log(`  ${f.sn}  (Type=${f.dt})`));
  console.log('--- Likely KEY/MLS-NUMBER fields ---');
  searchable.filter(f => /^mls|listing|key|number/i.test(f.sn)).forEach(f => console.log(`  ${f.sn}  (Type=${f.dt})`));
  console.log('');
  return all;
}

async function trySearch(searchUrl, query, label) {
  const params = new URLSearchParams({
    SearchType: 'Property',
    Class: 'Listing',
    Query: query,
    QueryType: 'DMQL2',
    Format: 'COMPACT-DECODED',
    Limit: '5',
    Offset: '1',
    StandardNames: '0',
    Count: '1',
  });
  const resp = await digestFetch(`${searchUrl}?${params.toString()}`);
  const xml = await resp.text();
  const replyCode = xml.match(/ReplyCode="(\d+)"/)?.[1];
  const replyText = xml.match(/ReplyText="([^"]+)"/)?.[1];
  const count = xml.match(/<COUNT[^>]*>(\d+)/)?.[1] || xml.match(/<COUNT[^>]*Records="(\d+)"/)?.[1];
  const dataMatches = [...xml.matchAll(/<DATA>([\s\S]*?)<\/DATA>/g)];
  console.log(`[${label}]`);
  console.log(`  Query: ${query}`);
  console.log(`  ReplyCode=${replyCode}  ReplyText="${replyText}"  Count=${count || '?'}  Rows=${dataMatches.length}`);
  if (dataMatches.length > 0) {
    // Show columns + first row preview
    const colMatch = xml.match(/<COLUMNS>\s*([\s\S]*?)\s*<\/COLUMNS>/);
    if (colMatch) {
      const cols = colMatch[1].split('\t').filter(Boolean);
      console.log(`  Columns (${cols.length}): ${cols.slice(0, 12).join(', ')}${cols.length > 12 ? '...' : ''}`);
    }
  } else if (replyCode && replyCode !== '0') {
    // Show raw response head for debugging
    console.log(`  --- raw response head ---\n  ${xml.substring(0, 400).replace(/\n/g, '\n  ')}`);
  }
  console.log('');
}

async function main() {
  const s = await getRetsSession();
  const searchUrl = s.capabilityUrls.search;
  const metaUrl = s.capabilityUrls.getmetadata;
  console.log('Search URL:', searchUrl);
  console.log('GetMetadata URL:', metaUrl);
  console.log('');

  // Dump every field first
  await dumpAllFields(metaUrl);

  // Try a series of probe queries
  await trySearch(searchUrl, '(BedsTotal=1+)', 'BedsTotal>=1 (broadest possible)');
  await trySearch(searchUrl, '(CurrentPrice=1+)', 'CurrentPrice>=1');
  await trySearch(searchUrl, '(City=*)', 'City=anything');
  await trySearch(searchUrl, '(MatrixModifiedDT=2020-01-01T00:00:00+)', 'MatrixModifiedDT>=2020');
  await trySearch(searchUrl, '(ModificationTimestamp=2020-01-01T00:00:00+)', 'ModificationTimestamp>=2020 (current default)');
  await trySearch(searchUrl, '(Status=Active)', 'Status=Active');
  await trySearch(searchUrl, '(MlsStatus=Active)', 'MlsStatus=Active');
  await trySearch(searchUrl, '(StandardStatus=Active)', 'StandardStatus=Active');
}

main().catch(e => {
  console.error('PROBE FAILED:', e.message);
  console.error(e.stack);
  process.exit(1);
});
