// app/lib/mortgage/leadCapture.ts
// Lead-capture client: posts to /api/mortgage-lead, which fans out to:
//   1. Supabase mortgage_leads table (system of record)
//   2. GoHighLevel webhook (CRM workflow trigger)
//   3. Email notification to Tom (immediate alert)
//
// Designed so future CRM swaps only require changing the API route, not this file.

import type { LeadPayload, LeadEventType, LeadFormData, ListingContext, CalculationResult } from './types'

/** Read UTM and referrer from window. Safe to call client-side only. */
function readAttribution() {
  if (typeof window === 'undefined') {
    return { pageUrl: '', referrer: '' }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    pageUrl: window.location.href,
    referrer: document.referrer || '',
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  }
}

/** Build a complete lead payload from form data + calculation + optional listing. */
export function buildLeadPayload(args: {
  eventType: LeadEventType
  form: LeadFormData
  result: CalculationResult
  listing?: ListingContext
}): LeadPayload {
  const { eventType, form, result, listing } = args
  return {
    eventType,
    capturedAt: new Date().toISOString(),
    form,
    calculation: {
      loanType: result.inputs.loanType,
      purchasePrice: result.inputs.purchasePrice,
      monthlyPayment: Math.round(result.payment.totalMonthly),
      loanAmount: Math.round(result.loanAmount),
      downPayment: result.inputs.downPayment,
      interestRate: result.inputs.interestRate,
      loanTerm: result.inputs.loanTerm,
      bahMonthly: result.inputs.bahMonthly,
      bahCoverage: result.bahCoverage,
    },
    listing,
    attribution: readAttribution(),
  }
}

/** Submit a lead. Returns { ok, id } on success, or { ok: false, error }. */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('/api/mortgage-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, error: text || `HTTP ${res.status}` }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: true, id: data.id }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error' }
  }
}

/** Fire-and-forget tracking event for soft signals (no PII). Used to flag "user
 * viewed 2+ listing calculators" without prompting them yet. */
export async function trackInteraction(eventType: string, props: Record<string, any> = {}) {
  if (typeof window === 'undefined') return
  try {
    await fetch('/api/mortgage-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        props,
        capturedAt: new Date().toISOString(),
        attribution: readAttribution(),
      }),
      keepalive: true,
    })
  } catch {
    // tracking is best-effort; never block UX
  }
}
