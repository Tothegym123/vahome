// app/components/mortgage/LoanTypeSelector.tsx
'use client'

import type { LoanType } from '@/app/lib/mortgage/types'

const LOAN_TYPES: { id: LoanType; label: string; tag?: string; military?: boolean }[] = [
  { id: 'conventional', label: 'Conventional' },
  { id: 'fha', label: 'FHA' },
  { id: 'va', label: 'VA', tag: '$0 down', military: true },
  { id: 'usda', label: 'USDA', tag: '$0 down' },
  { id: 'jumbo', label: 'Jumbo' },
  { id: 'cash', label: 'Cash' },
]

export interface LoanTypeSelectorProps {
  value: LoanType
  onChange: (next: LoanType) => void
  /** When true, the VA tab gets the prominent military accent. */
  militaryHighlight?: boolean
  /** Compact mode for listing pages */
  compact?: boolean
}

export default function LoanTypeSelector({
  value,
  onChange,
  militaryHighlight = false,
  compact = false,
}: LoanTypeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Loan type"
      className={
        'flex flex-wrap gap-1.5 ' +
        (compact ? 'text-xs' : 'text-sm')
      }
    >
      {LOAN_TYPES.map((t) => {
        const active = t.id === value
        const isVa = t.id === 'va'
        const baseClasses = compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={[
              baseClasses,
              'rounded-lg font-medium transition-colors flex items-center gap-1.5',
              active
                ? isVa && militaryHighlight
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ].join(' ')}
          >
            {t.label}
            {t.tag && (
              <span
                className={
                  'px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ' +
                  (active
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600 border border-gray-200')
                }
              >
                {t.tag}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
