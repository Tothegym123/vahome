// app/components/mortgage/LeadCaptureForm.tsx
'use client'

import { useState } from 'react'
import type {
  LeadEventType,
  LeadFormData,
  CalculationResult,
  ListingContext,
  MilitaryStatus,
} from '@/app/lib/mortgage/types'
import { buildLeadPayload, submitLead } from '@/app/lib/mortgage/leadCapture'
import { fmtUsd } from '@/app/lib/mortgage/calculations'

export interface LeadCaptureFormProps {
  open: boolean
  onClose: () => void
  /** Title shown at top of modal  -  varies by trigger. */
  title: string
  /** Sub-headline  -  context for why we're asking. */
  subtitle?: string
  /** Primary CTA label on submit button. */
  submitLabel: string
  /** Lead event the form will fire when submitted. */
  eventType: LeadEventType
  result: CalculationResult
  listing?: ListingContext
  /** Pre-fill military status if known from outer state. */
  defaultMilitaryStatus?: MilitaryStatus
  /** Called after successful submit. */
  onSuccess?: (leadId: string) => void
}

const TIMELINES: { value: LeadFormData['buyingTimeline']; label: string }[] = [
  { value: '0-3-months',  label: 'Within 3 months' },
  { value: '3-6-months',  label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: '12-plus-months', label: 'Over a year' },
  { value: 'just-looking', label: 'Just looking' },
]

const MILITARY_OPTIONS: { value: MilitaryStatus; label: string }[] = [
  { value: 'civilian', label: 'Civilian' },
  { value: 'active-duty', label: 'Active duty' },
  { value: 'veteran', label: 'Veteran' },
  { value: 'spouse', label: 'Military spouse' },
  { value: 'reservist', label: 'Reservist / National Guard' },
]

export default function LeadCaptureForm({
  open,
  onClose,
  title,
  subtitle,
  submitLabel,
  eventType,
  result,
  listing,
  defaultMilitaryStatus = 'civilian',
  onSuccess,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    buyingTimeline: '3-6-months',
    militaryStatus: defaultMilitaryStatus,
    desiredCity: listing?.city || '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (!open) return null

  const update = <K extends keyof LeadFormData>(key: K, val: LeadFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.')
      return
    }
    setSubmitting(true)
    const payload = buildLeadPayload({ eventType, form, result, listing })
    const res = await submitLead(payload)
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error || 'Could not submit. Please try again.')
      return
    }
    setDone(true)
    onSuccess?.(res.id || '')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 id="lead-form-title" className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1"
          >
            ✕
          </button>
        </div>

        {/* Snapshot of the calc */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-600">Your estimated payment</span>
          <span className="font-bold text-gray-900">
            {fmtUsd(result.payment.totalMonthly)}<span className="text-gray-500 font-normal">/mo</span>
          </span>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="text-3xl mb-3">✓</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">You're all set</h4>
            <p className="text-sm text-gray-600 mb-6">
              We'll send your detailed estimate to <strong>{form.email}</strong> shortly. A VaHome agent will reach out within one business day.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Name" required>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Phone (optional)">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={inputClass}
                placeholder="(757) 555-0000"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Buying timeline">
                <select
                  value={form.buyingTimeline}
                  onChange={(e) => update('buyingTimeline', e.target.value as any)}
                  className={inputClass}
                >
                  {TIMELINES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={form.militaryStatus}
                  onChange={(e) => update('militaryStatus', e.target.value as MilitaryStatus)}
                  className={inputClass}
                >
                  {MILITARY_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Desired city / area (optional)">
              <input
                type="text"
                value={form.desiredCity || ''}
                onChange={(e) => update('desiredCity', e.target.value)}
                className={inputClass}
                placeholder="Virginia Beach, Norfolk, Chesapeake..."
              />
            </Field>
            <Field label="Notes (optional)">
              <textarea
                value={form.notes || ''}
                onChange={(e) => update('notes', e.target.value)}
                className={inputClass + ' min-h-[68px]'}
                rows={3}
                placeholder="Anything we should know  -  must-haves, school district, schools, deployment timing..."
              />
            </Field>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
              >
                {submitting ? 'Sending...' : submitLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
              By submitting you agree to be contacted by a VaHome agent. We do not sell your information. Estimates are not loan offers; speak with a licensed lender for an official Loan Estimate.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
