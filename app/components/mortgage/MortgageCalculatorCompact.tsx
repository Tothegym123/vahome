// app/components/mortgage/MortgageCalculatorCompact.tsx
// Compact wrapper for use on listing detail pages.
// Shows a 1-row payment summary by default; expands to the full calculator when tapped.
'use client'

import { useState } from 'react'
import MortgageCalculator from '@/app/components/mortgage/MortgageCalculator'
import { calculate, fmtUsd } from '@/app/lib/mortgage/calculations'
import {
  getDefaultRate,
  getEstimatedTaxRate,
  DEFAULT_INSURANCE_RATE_PCT,
  MIN_DOWN_PAYMENT_PCT,
} from '@/app/lib/mortgage/loanAssumptions'
import type { ListingContext, CalculatorInputs } from '@/app/lib/mortgage/types'
import { trackInteraction } from '@/app/lib/mortgage/leadCapture'

export interface MortgageCalculatorCompactProps {
  listing: ListingContext
  defaultMilitary?: boolean
}

export default function MortgageCalculatorCompact({
  listing,
  defaultMilitary = false,
}: MortgageCalculatorCompactProps) {
  const [expanded, setExpanded] = useState(false)

  // Snapshot calculation with safe defaults (no user interaction yet)
  const snapshotInputs: CalculatorInputs = (() => {
    const loanType = defaultMilitary ? 'va' : 'conventional'
    const term = 30
    const dpPct = MIN_DOWN_PAYMENT_PCT[loanType]
    return {
      purchasePrice: listing.price,
      downPayment: Math.round(listing.price * (dpPct / 100)),
      downPaymentPct: dpPct,
      loanType,
      loanTerm: term,
      interestRate: getDefaultRate(loanType, term),
      annualPropertyTax:
        listing.annualTaxes ??
        Math.round(
          listing.price *
            (getEstimatedTaxRate(listing.city.toLowerCase().replace(/\s+/g, '-')) / 100),
        ),
      annualInsurance:
        listing.insuranceEstimate ??
        Math.round(listing.price * (DEFAULT_INSURANCE_RATE_PCT / 100)),
      monthlyHoa: listing.monthlyHoa ?? 0,
      creditScoreBand: '680-739',
      isFirstTimeVaUse: true,
      isFirstTimeBuyer: false,
      militaryStatus: defaultMilitary ? 'active-duty' : 'civilian',
    }
  })()
  const result = calculate(snapshotInputs)

  function onExpand() {
    if (!expanded) {
      void trackInteraction('listing_calc_expanded', {
        mlsId: listing.mlsId,
        price: listing.price,
        loan: snapshotInputs.loanType,
      })
    }
    setExpanded((v) => !v)
  }

  return (
    <section
      aria-label="Estimated monthly payment"
      className="rounded-2xl border border-gray-200 bg-white"
    >
      {/* Snapshot header  -  always visible */}
      <button
        type="button"
        onClick={onExpand}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 rounded-t-2xl"
      >
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
            Estimated payment
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {fmtUsd(result.payment.totalMonthly)}
            </span>
            <span className="text-sm text-gray-500">/mo</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {snapshotInputs.loanType === 'va' ? 'VA' : 'Conventional'} â¢{' '}
            {snapshotInputs.downPaymentPct.toFixed(0)}% down â¢ {snapshotInputs.loanTerm}-yr â¢{' '}
            {snapshotInputs.interestRate.toFixed(2)}%
          </div>
        </div>
        <div className="text-blue-600 text-sm font-semibold flex items-center gap-1">
          {expanded ? 'Hide' : 'Customize'}
          <ChevronIcon flipped={expanded} />
        </div>
      </button>

      {/* Full calculator on expand */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100">
          <MortgageCalculator
            listing={listing}
            defaultMilitary={defaultMilitary}
            defaultCitySlug={listing.city.toLowerCase().replace(/\s+/g, '-')}
            compact
          />
        </div>
      )}
    </section>
  )
}

function ChevronIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      className={'h-4 w-4 transition-transform ' + (flipped ? 'rotate-180' : '')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
