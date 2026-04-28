// app/components/mortgage/MortgageCalculator.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import LoanTypeSelector from '@/app/components/mortgage/LoanTypeSelector'
import PaymentBreakdown from '@/app/components/mortgage/PaymentBreakdown'
import LeadCaptureForm from '@/app/components/mortgage/LeadCaptureForm'
import { calculate, fmtUsd } from '@/app/lib/mortgage/calculations'
import {
  getDefaultRate,
  getEstimatedTaxRate,
  DEFAULT_INSURANCE_RATE_PCT,
  MIN_DOWN_PAYMENT_PCT,
} from '@/app/lib/mortgage/loanAssumptions'
import { trackInteraction } from '@/app/lib/mortgage/leadCapture'
import type {
  CalculatorInputs,
  LoanType,
  LoanTerm,
  CreditScoreBand,
  MilitaryStatus,
  ListingContext,
  LeadEventType,
} from '@/app/lib/mortgage/types'

export interface MortgageCalculatorProps {
  /** Optional listing context  -  when present, prefills price/tax/HOA. */
  listing?: ListingContext
  /** When true, lead form opens with VA mode highlighted. */
  defaultMilitary?: boolean
  /** Default city slug used to estimate property tax (e.g., "norfolk"). */
  defaultCitySlug?: string
  /** Compact UI for listing pages */
  compact?: boolean
}

export default function MortgageCalculator({
  listing,
  defaultMilitary = false,
  defaultCitySlug,
  compact = false,
}: MortgageCalculatorProps) {
  const initial = buildInitialInputs(listing, defaultMilitary, defaultCitySlug)
  const [inputs, setInputs] = useState<CalculatorInputs>(initial)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [leadOpen, setLeadOpen] = useState<{ type: LeadEventType; title: string; subtitle?: string; submitLabel: string } | null>(null)

  // Recalculate on every input change
  const result = useMemo(() => calculate(inputs), [inputs])

  // Sync rate to loan-type/term default when user changes those
  useEffect(() => {
    setInputs((cur) => {
      const def = getDefaultRate(cur.loanType, cur.loanTerm)
      // Only auto-update if user hasn't customized rate
      if (Math.abs(cur.interestRate - def) < 0.001 || cur.interestRate === 0) return cur
      return cur
    })
  }, [inputs.loanType, inputs.loanTerm])

  // When loan type changes, snap down payment to legal minimum
  useEffect(() => {
    setInputs((cur) => {
      const minPct = MIN_DOWN_PAYMENT_PCT[cur.loanType]
      if (cur.downPaymentPct < minPct && cur.loanType !== 'cash') {
        const newPct = minPct
        const newDp = Math.round(cur.purchasePrice * (newPct / 100))
        return { ...cur, downPaymentPct: newPct, downPayment: newDp }
      }
      return cur
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.loanType])

  function update<K extends keyof CalculatorInputs>(key: K, val: CalculatorInputs[K]) {
    setInputs((cur) => ({ ...cur, [key]: val }))
  }

  // Special: down payment $ â % linkage
  function setDownPaymentDollars(v: number) {
    setInputs((cur) => ({
      ...cur,
      downPayment: v,
      downPaymentPct: cur.purchasePrice > 0 ? (v / cur.purchasePrice) * 100 : 0,
    }))
  }
  function setDownPaymentPct(v: number) {
    setInputs((cur) => ({
      ...cur,
      downPaymentPct: v,
      downPayment: Math.round(cur.purchasePrice * (v / 100)),
    }))
  }
  function setPurchasePrice(v: number) {
    setInputs((cur) => ({
      ...cur,
      purchasePrice: v,
      downPayment: Math.round(v * (cur.downPaymentPct / 100)),
    }))
  }

  const isVa = inputs.loanType === 'va'
  const isFha = inputs.loanType === 'fha'
  const isUsda = inputs.loanType === 'usda'
  const isCash = inputs.loanType === 'cash'

  // --------------------------------------------------------------------------
  // Lead capture trigger helpers
  // --------------------------------------------------------------------------

  function openLead(type: LeadEventType) {
    void trackInteraction('mortgage_lead_open', { event: type, loan: inputs.loanType })
    const cfg = LEAD_TRIGGERS[type]
    setLeadOpen(cfg)
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-6'}>
      {/* Loan type tabs */}
      <LoanTypeSelector
        value={inputs.loanType}
        onChange={(t) => update('loanType', t)}
        militaryHighlight
        compact={compact}
      />

      {/* Inputs grid */}
      <div className={'rounded-2xl border border-gray-200 bg-white ' + (compact ? 'p-4' : 'p-6 sm:p-8')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Home price">
            <CurrencyInput value={inputs.purchasePrice} onChange={setPurchasePrice} />
          </Field>
          {!isCash && (
            <Field label="Down payment">
              <div className="flex gap-2">
                <CurrencyInput
                  value={inputs.downPayment}
                  onChange={setDownPaymentDollars}
                  className="flex-1"
                />
                <PctInput
                  value={inputs.downPaymentPct}
                  onChange={setDownPaymentPct}
                  className="w-20"
                />
              </div>
            </Field>
          )}
          {!isCash && (
            <Field label="Interest rate">
              <PctInput
                value={inputs.interestRate}
                onChange={(v) => update('interestRate', v)}
                step={0.05}
              />
            </Field>
          )}
          {!isCash && (
            <Field label="Loan term">
              <select
                value={inputs.loanTerm}
                onChange={(e) => update('loanTerm', Number(e.target.value) as LoanTerm)}
                className={inputClass}
              >
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={25}>25 years</option>
                <option value={30}>30 years</option>
              </select>
            </Field>
          )}
          <Field label="Property tax (annual)">
            <CurrencyInput
              value={inputs.annualPropertyTax}
              onChange={(v) => update('annualPropertyTax', v)}
            />
            {!listing?.annualTaxes && (
              <span className="text-[11px] text-gray-500">Estimated from {defaultCitySlug || 'Hampton Roads'} avg rate.</span>
            )}
          </Field>
          <Field label="Homeowners insurance (annual)">
            <CurrencyInput
              value={inputs.annualInsurance}
              onChange={(v) => update('annualInsurance', v)}
            />
          </Field>
          <Field label="HOA / condo fee (monthly)">
            <CurrencyInput
              value={inputs.monthlyHoa}
              onChange={(v) => update('monthlyHoa', v)}
            />
          </Field>
          {!isCash && (
            <Field label="Credit score">
              <select
                value={inputs.creditScoreBand || '680-739'}
                onChange={(e) => update('creditScoreBand', e.target.value as CreditScoreBand)}
                className={inputClass}
              >
                <option value="<620">Below 620</option>
                <option value="620-679">620-679</option>
                <option value="680-739">680-739</option>
                <option value="740-799">740-799</option>
                <option value="800+">800+</option>
              </select>
            </Field>
          )}
        </div>

        {/* VA / military section */}
        {isVa && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldIcon /> VA loan options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="First-time VA use?">
                <select
                  value={inputs.isFirstTimeVaUse !== false ? '1' : '0'}
                  onChange={(e) => update('isFirstTimeVaUse', e.target.value === '1')}
                  className={inputClass}
                >
                  <option value="1">Yes  -  first use</option>
                  <option value="0">No  -  used before</option>
                </select>
              </Field>
              <Field label="Monthly BAH (optional)">
                <CurrencyInput
                  value={inputs.bahMonthly || 0}
                  onChange={(v) => update('bahMonthly', v)}
                />
              </Field>
              <Field label="Military status">
                <select
                  value={inputs.militaryStatus || 'active-duty'}
                  onChange={(e) => update('militaryStatus', e.target.value as MilitaryStatus)}
                  className={inputClass}
                >
                  <option value="active-duty">Active duty</option>
                  <option value="veteran">Veteran</option>
                  <option value="spouse">Military spouse</option>
                  <option value="reservist">Reservist / Guard</option>
                </select>
              </Field>
            </div>
          </div>
        )}

        {/* Affordability section (collapsed) */}
        {!compact && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {showAdvanced ? 'Hide' : 'Add'} income & debts (affordability)
            </button>
            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Gross monthly income">
                  <CurrencyInput
                    value={inputs.grossMonthlyIncome || 0}
                    onChange={(v) => update('grossMonthlyIncome', v)}
                  />
                </Field>
                <Field label="Monthly debts (cards, loans)">
                  <CurrencyInput
                    value={inputs.monthlyDebts || 0}
                    onChange={(v) => update('monthlyDebts', v)}
                  />
                </Field>
                <Field label="Desired max monthly payment">
                  <CurrencyInput
                    value={inputs.desiredMaxMonthly || 0}
                    onChange={(v) => update('desiredMaxMonthly', v)}
                  />
                </Field>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output */}
      <PaymentBreakdown result={result} compact={compact} />

      {/* BAH coverage card (only with BAH input) */}
      {result.bahCoverage && (
        <BahCoverageCard
          coverage={result.bahCoverage}
          onTrigger={() => openLead('va_bah_calculator_submit')}
        />
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          {result.warnings.map((w, i) => (
            <div key={i}>â¢ {w}</div>
          ))}
        </div>
      )}

      {/* CTA row */}
      {!isCash && (
        <div className={compact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
          <button
            type="button"
            onClick={() => openLead('listing_payment_estimate')}
            className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {listing ? 'Send me this estimate' : 'Get full payment breakdown'}
          </button>
          <button
            type="button"
            onClick={() => openLead('see_homes_in_payment_range')}
            className="px-4 py-3 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold"
          >
            See homes in this payment range
          </button>
        </div>
      )}

      {/* Disclaimers */}
      <p className="text-[11px] text-gray-500 leading-relaxed">
        {result.disclaimers.join(' ')}
      </p>

      {/* Lead form modal */}
      {leadOpen && (
        <LeadCaptureForm
          open
          onClose={() => setLeadOpen(null)}
          title={leadOpen.title}
          subtitle={leadOpen.subtitle}
          submitLabel={leadOpen.submitLabel}
          eventType={leadOpen.type}
          result={result}
          listing={listing}
          defaultMilitaryStatus={isVa ? 'active-duty' : 'civilian'}
        />
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// BAH coverage card  -  only shown when user enters BAH
// -----------------------------------------------------------------------------

function BahCoverageCard({
  coverage,
  onTrigger,
}: {
  coverage: NonNullable<ReturnType<typeof calculate>['bahCoverage']>
  onTrigger: () => void
}) {
  const { status, delta, pctOfBah } = coverage
  const headline =
    status === 'covered'
      ? 'Right at your BAH'
      : status === 'below'
      ? `Under BAH by ${fmtUsd(Math.abs(delta))}/mo`
      : `Over BAH by ${fmtUsd(Math.abs(delta))}/mo`

  const tone =
    status === 'covered'
      ? 'bg-blue-50 border-blue-200 text-blue-900'
      : status === 'below'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
      : 'bg-rose-50 border-rose-200 text-rose-900'

  return (
    <div className={`rounded-2xl border ${tone} p-5 sm:p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <ShieldIcon className="h-5 w-5" />
        <h4 className="font-semibold">{headline}</h4>
      </div>
      <p className="text-sm">
        Your estimated payment is {(pctOfBah * 100).toFixed(0)}% of your BAH. Veterans with full entitlement and good credit can often qualify for $0 down with VA financing.
      </p>
      <button
        type="button"
        onClick={onTrigger}
        className="mt-4 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold"
      >
        See what your VA benefit can buy in Hampton Roads
      </button>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Lead trigger configurations
// -----------------------------------------------------------------------------

const LEAD_TRIGGERS: Record<
  LeadEventType,
  { type: LeadEventType; title: string; subtitle?: string; submitLabel: string }
> = {
  mortgage_calculator_submit: {
    type: 'mortgage_calculator_submit',
    title: 'Send me my full payment breakdown',
    subtitle: 'A VaHome agent will follow up to confirm the numbers with a licensed lender.',
    submitLabel: 'Send my breakdown',
  },
  va_bah_calculator_submit: {
    type: 'va_bah_calculator_submit',
    title: 'See what your VA benefit can buy',
    subtitle: 'Get a personalized list of Hampton Roads homes that fit your BAH.',
    submitLabel: 'Send me homes',
  },
  listing_payment_estimate: {
    type: 'listing_payment_estimate',
    title: 'Send me this estimate',
    subtitle: "We'll email a detailed breakdown for this property.",
    submitLabel: 'Send to my email',
  },
  affordability_report_request: {
    type: 'affordability_report_request',
    title: 'Get a personalized affordability report',
    submitLabel: 'Send my report',
  },
  saved_payment_estimate: {
    type: 'saved_payment_estimate',
    title: 'Save this estimate',
    submitLabel: 'Save & send to me',
  },
  see_homes_in_payment_range: {
    type: 'see_homes_in_payment_range',
    title: 'See homes that fit your budget',
    subtitle: "We'll send a curated list within 24 hours.",
    submitLabel: 'Send me matches',
  },
  check_va_eligibility: {
    type: 'check_va_eligibility',
    title: 'Check your VA eligibility',
    submitLabel: 'Get my COE help',
  },
}

// -----------------------------------------------------------------------------
// Initial inputs builder
// -----------------------------------------------------------------------------

function buildInitialInputs(
  listing: ListingContext | undefined,
  defaultMilitary: boolean,
  citySlug: string | undefined,
): CalculatorInputs {
  const purchasePrice = listing?.price || 400_000
  const loanType: LoanType = defaultMilitary ? 'va' : 'conventional'
  const term: LoanTerm = 30
  const taxRate = listing?.annualTaxes
    ? (listing.annualTaxes / purchasePrice) * 100
    : getEstimatedTaxRate(citySlug || (listing?.city || '').toLowerCase().replace(/\s+/g, '-'))
  const annualPropertyTax = listing?.annualTaxes ?? Math.round(purchasePrice * (taxRate / 100))
  const annualInsurance = listing?.insuranceEstimate ?? Math.round(purchasePrice * (DEFAULT_INSURANCE_RATE_PCT / 100))
  const monthlyHoa = listing?.monthlyHoa ?? 0
  const dpPct = MIN_DOWN_PAYMENT_PCT[loanType]
  const downPayment = Math.round(purchasePrice * (dpPct / 100))
  return {
    purchasePrice,
    downPayment,
    downPaymentPct: dpPct,
    loanType,
    loanTerm: term,
    interestRate: getDefaultRate(loanType, term),
    annualPropertyTax,
    annualInsurance,
    monthlyHoa,
    creditScoreBand: '680-739',
    isFirstTimeVaUse: true,
    isFirstTimeBuyer: false,
    militaryStatus: defaultMilitary ? 'active-duty' : 'civilian',
  }
}

// -----------------------------------------------------------------------------
// Atoms
// -----------------------------------------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  )
}

function CurrencyInput({ value, onChange, className }: { value: number; onChange: (v: number) => void; className?: string }) {
  return (
    <div className={'relative ' + (className || '')}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
      <input
        type="text"
        inputMode="numeric"
        value={value.toLocaleString('en-US')}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^\d]/g, '')
          onChange(Number(cleaned) || 0)
        }}
        className={inputClass + ' pl-7'}
      />
    </div>
  )
}

function PctInput({ value, onChange, className, step = 0.5 }: { value: number; onChange: (v: number) => void; className?: string; step?: number }) {
  return (
    <div className={'relative ' + (className || '')}>
      <input
        type="number"
        step={step}
        min={0}
        value={value.toFixed(2)}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={inputClass + ' pr-7'}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || 'h-4 w-4 text-blue-700'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
