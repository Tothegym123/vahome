// app/components/mortgage/PaymentBreakdown.tsx
'use client'

import type { CalculationResult } from '@/app/lib/mortgage/types'
import { fmtUsd } from '@/app/lib/mortgage/calculations'

export interface PaymentBreakdownProps {
  result: CalculationResult
  /** When true, render a compact version (listing-page) */
  compact?: boolean
}

const COLORS = {
  pi: '#1e40af',     // blue-800
  tax: '#15803d',    // green-700
  ins: '#a16207',    // yellow-700
  hoa: '#9333ea',    // purple-600
  mi:  '#dc2626',    // red-600
}

export default function PaymentBreakdown({ result, compact = false }: PaymentBreakdownProps) {
  const p = result.payment
  const total = p.totalMonthly || 1   // avoid div-by-zero

  const slices = [
    { key: 'pi',  label: 'Principal & Interest', value: p.principalAndInterest, color: COLORS.pi },
    { key: 'tax', label: 'Property Tax',         value: p.propertyTax,          color: COLORS.tax },
    { key: 'ins', label: 'Homeowners Insurance', value: p.insurance,            color: COLORS.ins },
    { key: 'hoa', label: 'HOA',                  value: p.hoa,                  color: COLORS.hoa },
    { key: 'mi',  label: miLabel(result),        value: p.pmi + p.fhaMip + p.usdaAnnualFee, color: COLORS.mi },
  ].filter((s) => s.value > 0.01)

  return (
    <div
      className={
        'rounded-2xl border border-gray-200 bg-white ' +
        (compact ? 'p-4' : 'p-6 sm:p-8')
      }
    >
      <div className="flex items-baseline justify-between mb-4">
        <h3 className={compact ? 'text-base font-semibold text-gray-900' : 'text-lg font-semibold text-gray-900'}>
          Estimated monthly payment
        </h3>
        <div className={compact ? 'text-xl font-bold text-gray-900' : 'text-3xl font-bold text-gray-900'}>
          {fmtUsd(p.totalMonthly)}
          <span className={compact ? 'text-xs font-normal text-gray-500 ml-1' : 'text-sm font-normal text-gray-500 ml-1'}>/mo</span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100 mb-4">
        {slices.map((s) => (
          <div
            key={s.key}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: ${fmtUsd(s.value)}`}
          />
        ))}
      </div>

      {/* Legend rows */}
      <ul className="space-y-2">
        {slices.map((s) => (
          <li key={s.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-700">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="font-medium text-gray-900">{fmtUsd(s.value)}</span>
          </li>
        ))}
      </ul>

      {!compact && (
        <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <Stat label="Loan amount" value={fmtUsd(result.loanAmount)} />
          <Stat label="Cash to close" value={fmtUsd(result.cashToClose.total)} />
          {typeof result.debtToIncome === 'number' && (
            <Stat
              label="Debt-to-income"
              value={`${(result.debtToIncome * 100).toFixed(1)}%`}
              tone={result.debtToIncome > 0.43 ? 'warn' : 'ok'}
            />
          )}
          {result.affordabilityRange && (
            <Stat
              label="Affordable home range"
              value={`${fmtUsd(result.affordabilityRange.conservative)} – ${fmtUsd(result.affordabilityRange.aggressive)}`}
            />
          )}
        </div>
      )}
    </div>
  )
}

function miLabel(r: CalculationResult): string {
  if (r.payment.pmi > 0) return 'PMI (private mortgage insurance)'
  if (r.payment.fhaMip > 0) return 'FHA mortgage insurance'
  if (r.payment.usdaAnnualFee > 0) return 'USDA annual fee'
  if (r.payment.vaFundingFeeAmortized > 0) return 'VA funding fee (financed)'
  return 'Mortgage insurance'
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'warn' }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={
          'font-semibold ' +
          (tone === 'warn' ? 'text-red-700' : 'text-gray-900')
        }
      >
        {value}
      </div>
    </div>
  )
}
