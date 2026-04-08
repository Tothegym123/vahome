import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface LeadPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  source: string
  source_detail?: string
  listing_id?: string
  lead_type?: string
}

function parseName(full?: string) {
  const s = (full || '').trim()
  if (!s) return { first: 'Unknown', last: '' }
  const parts = s.split(/\s+/)
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function sendEmail(subject: string, body: string) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL || 'tom@vahomes.com'
  const from = process.env.RESEND_FROM || 'VaHome Leads <onboarding@resend.dev>'
  if (!key) { console.log('[leads] Resend not configured'); return }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text: body }),
    })
    if (!r.ok) console.error('[leads] Resend', r.status, await r.text())
  } catch (e) { console.error('[leads] Resend exception', e) }
}

async function sendSms(body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM
  const to = process.env.TWILIO_TO || '+17577777577'
  if (!sid || !token || !from) { console.log('[leads] Twilio not configured'); return }
  try {
    const url = 'https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json'
    const auth = Buffer.from(sid + ':' + token).toString('base64')
    const form = new URLSearchParams({ From: from, To: to, Body: body })
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    if (!r.ok) console.error('[leads] Twilio', r.status, await r.text())
  } catch (e) { console.error('[leads] Twilio exception', e) }
}

export async function POST(req: NextRequest) {
  let payload: LeadPayload
  try { payload = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  if (!payload.source) return NextResponse.json({ error: 'Missing source' }, { status: 400 })
  if (!payload.email && !payload.phone) return NextResponse.json({ error: 'Email or phone required' }, { status: 400 })

  const isWaitlist = payload.source === 'waitlist_agent' || payload.source === 'waitlist_lender'
  const { first, last } = parseName(payload.name)

  let supabase
  try { supabase = sb() } catch (e: any) {
    console.error('[leads] supabase init failed', e)
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  let contactId: string | null = null
  if (!isWaitlist) {
    // Dedup check
    if (payload.email) {
      const { data } = await supabase.from('contacts').select('id').eq('email', payload.email).limit(1).maybeSingle()
      if (data) contactId = data.id
    }
    if (!contactId && payload.phone) {
      const { data } = await supabase.from('contacts').select('id').eq('phone', payload.phone).limit(1).maybeSingle()
      if (data) contactId = data.id
    }

    if (!contactId) {
      const { data: ins, error: insErr } = await supabase.from('contacts').insert({
        first_name: first,
        last_name: last || null,
        email: payload.email || null,
        phone: payload.phone || null,
        source: payload.source,
        source_detail: payload.source_detail || null,
        pipeline_stage: 'New Leads',
        lead_types: payload.lead_type ? [payload.lead_type] : [],
        last_touch: new Date().toISOString(),
      }).select('id').single()
      if (insErr) {
        console.error('[leads] contact insert failed', insErr)
        return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
      }
      contactId = ins.id
    } else {
      await supabase.from('contacts').update({ last_touch: new Date().toISOString() }).eq('id', contactId)
    }

    await supabase.from('activities').insert({
      contact_id: contactId,
      activity_type: 'note',
      title: 'New ' + payload.source + ' submission',
      description: payload.message || null,
      metadata: {
        source: payload.source,
        source_detail: payload.source_detail || null,
        listing_id: payload.listing_id || null,
      },
    })
  }

  const label = payload.name || payload.email || payload.phone || 'Unknown'
  const lines = [
    'New VaHome lead (' + payload.source + ')',
    'Name: ' + (payload.name || '-'),
    'Email: ' + (payload.email || '-'),
    'Phone: ' + (payload.phone || '-'),
  ]
  if (payload.listing_id) lines.push('Listing: ' + payload.listing_id)
  if (payload.message) lines.push('\nMessage:\n' + payload.message)
  lines.push('\nView: https://vahometest2.com/admin/leads')
  const text = lines.join('\n')

  await Promise.all([
    sendEmail('New VaHome Lead: ' + label, text),
    sendSms('VaHome lead: ' + label + ' (' + payload.source + ') ' + (payload.phone || payload.email || '')),
  ])

  return NextResponse.json({ ok: true, contact_id: contactId })
}
