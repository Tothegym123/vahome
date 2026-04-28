// app/api/mortgage-lead/route.ts
// Receives a LeadPayload from the client, fans it out to:
//   1. Supabase mortgage_leads insert (system of record)
//   2. GoHighLevel webhook (CRM workflow trigger) — if env GHL_WEBHOOK_URL is set
//   3. Email notification to Tom — if env NOTIFY_EMAIL is set
//
// All three are best-effort; Supabase insert is the only "must succeed".

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { LeadPayload } from '@/app/lib/mortgage/types'

export const runtime = 'nodejs'   // service-role key requires Node runtime

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export async function POST(req: NextRequest) {
  let payload: LeadPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Required fields
  if (!payload?.form?.name || !payload?.form?.email) {
    return NextResponse.json({ error: 'name and email required' }, { status: 400 })
  }

  // ---- 1. Insert into Supabase ----
  const supabase = adminClient()
  const row = {
    event_type: payload.eventType,
    name: payload.form.name.slice(0, 200),
    email: payload.form.email.slice(0, 200).toLowerCase(),
    phone: payload.form.phone?.slice(0, 30) || null,
    buying_timeline: payload.form.buyingTimeline || null,
    military_status: payload.form.militaryStatus || null,
    desired_city: payload.form.desiredCity || null,
    notes: payload.form.notes?.slice(0, 2000) || null,
    loan_type: payload.calculation.loanType,
    purchase_price: payload.calculation.purchasePrice,
    monthly_payment: payload.calculation.monthlyPayment,
    loan_amount: payload.calculation.loanAmount,
    down_payment: payload.calculation.downPayment,
    interest_rate: payload.calculation.interestRate,
    loan_term: payload.calculation.loanTerm,
    bah_monthly: payload.calculation.bahMonthly || null,
    bah_status: payload.calculation.bahCoverage?.status || null,
    bah_delta: payload.calculation.bahCoverage?.delta || null,
    listing_mls_id: payload.listing?.mlsId || null,
    listing_address: payload.listing?.address || null,
    listing_city: payload.listing?.city || null,
    listing_state: payload.listing?.state || null,
    listing_zip: payload.listing?.zip || null,
    listing_price: payload.listing?.price || null,
    listing_url: payload.listing?.url || null,
    page_url: payload.attribution.pageUrl,
    referrer: payload.attribution.referrer,
    utm_source: payload.attribution.utmSource || null,
    utm_medium: payload.attribution.utmMedium || null,
    utm_campaign: payload.attribution.utmCampaign || null,
    utm_term: payload.attribution.utmTerm || null,
    utm_content: payload.attribution.utmContent || null,
  }

  const { data, error } = await supabase.from('mortgage_leads').insert(row).select('id').single()
  if (error) {
    console.error('mortgage_leads insert failed', error)
    return NextResponse.json({ error: 'database insert failed' }, { status: 500 })
  }

  const leadId = data.id

  // ---- 2. Fan out to GoHighLevel (best-effort) ----
  const ghlUrl = process.env.GHL_WEBHOOK_URL
  if (ghlUrl) {
    fireGhlWebhook(ghlUrl, payload, leadId).catch((e) =>
      console.error('GHL webhook failed (non-fatal):', e),
    )
  }

  // ---- 3. Email notification (best-effort) ----
  const notifyEmail = process.env.NOTIFY_EMAIL
  if (notifyEmail) {
    fireEmailNotification(notifyEmail, payload, leadId).catch((e) =>
      console.error('Email notification failed (non-fatal):', e),
    )
  }

  return NextResponse.json({ ok: true, id: leadId })
}

// -----------------------------------------------------------------------------
// GoHighLevel webhook fan-out
// Maps our LeadPayload to GHL's expected shape for an inbound webhook.
// -----------------------------------------------------------------------------

async function fireGhlWebhook(url: string, payload: LeadPayload, leadId: string) {
  const ghlBody = {
    // Standard GHL contact fields
    firstName: payload.form.name.split(' ')[0] || payload.form.name,
    lastName: payload.form.name.split(' ').slice(1).join(' ') || '',
    email: payload.form.email,
    phone: payload.form.phone || '',
    source: 'VaHome Mortgage Calculator',
    tags: [
      'vahome-mortgage-calculator',
      `event:${payload.eventType}`,
      `loan:${payload.calculation.loanType}`,
      payload.form.militaryStatus !== 'civilian' ? 'military' : 'civilian',
      payload.form.buyingTimeline ? `timeline:${payload.form.buyingTimeline}` : '',
    ].filter(Boolean),
    // Custom fields — names must match what's set up in GHL sub-account
    customField: {
      vahome_lead_id: leadId,
      event_type: payload.eventType,
      loan_type: payload.calculation.loanType,
      purchase_price: payload.calculation.purchasePrice,
      monthly_payment: payload.calculation.monthlyPayment,
      down_payment: payload.calculation.downPayment,
      interest_rate: payload.calculation.interestRate,
      loan_term: payload.calculation.loanTerm,
      bah_monthly: payload.calculation.bahMonthly || '',
      bah_status: payload.calculation.bahCoverage?.status || '',
      buying_timeline: payload.form.buyingTimeline,
      desired_city: payload.form.desiredCity || '',
      listing_mls_id: payload.listing?.mlsId || '',
      listing_address: payload.listing?.address || '',
      listing_price: payload.listing?.price || '',
      listing_url: payload.listing?.url || '',
      utm_source: payload.attribution.utmSource || '',
      utm_campaign: payload.attribution.utmCampaign || '',
      page_url: payload.attribution.pageUrl,
      referrer: payload.attribution.referrer,
      notes: payload.form.notes || '',
    },
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ghlBody),
    // Don't hold up the user response
    signal: AbortSignal.timeout(8000),
  })
}

// -----------------------------------------------------------------------------
// Email notification fan-out
// Uses Resend if RESEND_API_KEY is set, falls back to a simple log.
// -----------------------------------------------------------------------------

async function fireEmailNotification(to: string, payload: LeadPayload, leadId: string) {
  const resendKey = process.env.RESEND_API_KEY
  const subject = `New ${payload.eventType.replace(/_/g, ' ')} — ${payload.form.name}`

  const body = `
New mortgage lead

Lead ID: ${leadId}
Event: ${payload.eventType}
Captured: ${payload.capturedAt}

CONTACT
  Name: ${payload.form.name}
  Email: ${payload.form.email}
  Phone: ${payload.form.phone || '(none)'}
  Buying timeline: ${payload.form.buyingTimeline || '(unknown)'}
  Military status: ${payload.form.militaryStatus}
  Desired city: ${payload.form.desiredCity || '(unspecified)'}
  Notes: ${payload.form.notes || '(none)'}

CALCULATION
  Loan type: ${payload.calculation.loanType}
  Purchase price: $${payload.calculation.purchasePrice.toLocaleString()}
  Down payment: $${payload.calculation.downPayment.toLocaleString()}
  Loan amount: $${payload.calculation.loanAmount.toLocaleString()}
  Rate: ${payload.calculation.interestRate}%
  Term: ${payload.calculation.loanTerm} years
  Monthly payment: $${payload.calculation.monthlyPayment.toLocaleString()}
${payload.calculation.bahMonthly ? `  BAH: $${payload.calculation.bahMonthly}/mo (${payload.calculation.bahCoverage?.status})` : ''}

${payload.listing ? `LISTING
  ${payload.listing.address}, ${payload.listing.city}, ${payload.listing.state} ${payload.listing.zip}
  MLS: ${payload.listing.mlsId}
  Price: $${payload.listing.price.toLocaleString()}
  URL: ${payload.listing.url}
` : ''}
ATTRIBUTION
  Page: ${payload.attribution.pageUrl}
  Referrer: ${payload.attribution.referrer}
  UTM source: ${payload.attribution.utmSource || '(none)'}
  UTM campaign: ${payload.attribution.utmCampaign || '(none)'}
`.trim()

  if (!resendKey) {
    console.log('Mortgage lead notification (no RESEND_API_KEY set):\n', body)
    return
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'VaHome Leads <leads@vahome.com>',
      to: [to],
      reply_to: payload.form.email,
      subject,
      text: body,
    }),
    signal: AbortSignal.timeout(8000),
  })
}
