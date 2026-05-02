'use client'

// app/components/filters/PricePopover.tsx
// =============================================================================
// Two-input min/max price filter. Empty input == undefined (no constraint).
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import type { Filters } from '../../lib/listing-filters'

type Props = {
  filters: Filters
  onApply: (next: Filters) => void
  onClose: () => void
}

const parseOrUndefined = (s: string): number | undefined => {
  const t = s.replace(/[^0-9]/g, '')
  if (!t) return undefined
  const n = parseInt(t, 10)
  return Number.isFinite(n) ? n : undefined
}

export default function PricePopover({ filters, onApply, onClose }: Props) {
  const [minStr, setMinStr] = useState<string>(filters.min_price !== undefined ? String(filters.min_price) : '')
  const [maxStr, setMaxStr] = useState<string>(filters.max_price !== undefined ? String(filters.max_price) : '')
  const minRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    minRef.current?.focus()
  }, [])

  const handleApply = () => {
    onApply({
      ...filters,
      min_price: parseOrUndefined(minStr),
      max_price: parseOrUndefined(maxStr),
    })
  }

  const handleClear = () => {
    onApply({ ...filters, min_price: undefined, max_price: undefined })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Price filter"
      className="absolute z-50 left-0 mt-2 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg p-4"
      onKeyDown={onKeyDown}
    >
      <div className="text-sm font-semibold text-gray-900 mb-3">Price</div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Min</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
            <input
              ref={minRef}
              type="text"
              inputMode="numeric"
              value={minStr}
              onChange={(e) => setMinStr(e.target.value)}
              placeholder="No min"
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="text-gray-400 mt-5">–</div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Max</label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxStr}
              onChange={(e) => setMaxStr(e.target.value)}
              placeholder="No max"
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
