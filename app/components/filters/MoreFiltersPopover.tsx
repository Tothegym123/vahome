'use client'

// app/components/filters/MoreFiltersPopover.tsx
// =============================================================================
// Sqft range, year-built range, status chips, days-on-market.
// Wider popover (340px) since it has more inputs.
// =============================================================================

import { useState } from 'react'
import { STATUS_CHOICES, DEFAULT_STATUS, type Filters } from '../../lib/listing-filters'

type Props = {
  filters: Filters
  onApply: (next: Filters) => void
  onClose: () => void
}

const parseInt_ = (s: string): number | undefined => {
  const t = s.replace(/[^0-9]/g, '')
  if (!t) return undefined
  const n = parseInt(t, 10)
  return Number.isFinite(n) ? n : undefined
}

export default function MoreFiltersPopover({ filters, onApply, onClose }: Props) {
  const [minSqft, setMinSqft] = useState<string>(filters.min_sqft !== undefined ? String(filters.min_sqft) : '')
  const [maxSqft, setMaxSqft] = useState<string>(filters.max_sqft !== undefined ? String(filters.max_sqft) : '')
  const [minYear, setMinYear] = useState<string>(filters.min_year !== undefined ? String(filters.min_year) : '')
  const [maxYear, setMaxYear] = useState<string>(filters.max_year !== undefined ? String(filters.max_year) : '')
  const [domMax, setDomMax] = useState<string>(filters.dom_max !== undefined ? String(filters.dom_max) : '')
  const [statuses, setStatuses] = useState<string[]>(filters.status || DEFAULT_STATUS)

  const toggleStatus = (val: string) => {
    setStatuses((curr) =>
      curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val],
    )
  }

  const handleApply = () => {
    // Only persist `status` if it deviates from the default visible set, so
    // share URLs stay clean.
    const sameAsDefault =
      statuses.length === DEFAULT_STATUS.length &&
      statuses.every((s) => DEFAULT_STATUS.includes(s))
    onApply({
      ...filters,
      min_sqft: parseInt_(minSqft),
      max_sqft: parseInt_(maxSqft),
      min_year: parseInt_(minYear),
      max_year: parseInt_(maxYear),
      dom_max: parseInt_(domMax),
      status: sameAsDefault ? undefined : (statuses.length > 0 ? statuses : undefined),
    })
  }

  const handleClear = () => {
    setMinSqft('')
    setMaxSqft('')
    setMinYear('')
    setMaxYear('')
    setDomMax('')
    setStatuses(DEFAULT_STATUS)
    onApply({
      ...filters,
      min_sqft: undefined,
      max_sqft: undefined,
      min_year: undefined,
      max_year: undefined,
      dom_max: undefined,
      status: undefined,
    })
  }

  const inputCls =
    'w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500'

  return (
    <div
      role="dialog"
      aria-label="More filters"
      className="absolute z-50 right-0 mt-2 w-[340px] bg-white rounded-lg border border-gray-200 shadow-lg p-4 max-h-[80vh] overflow-y-auto"
    >
      {/* Square footage */}
      <div className="text-sm font-semibold text-gray-900 mb-2">Square Feet</div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          inputMode="numeric"
          value={minSqft}
          onChange={(e) => setMinSqft(e.target.value)}
          placeholder="No min"
          className={inputCls}
        />
        <span className="text-gray-400">–</span>
        <input
          type="text"
          inputMode="numeric"
          value={maxSqft}
          onChange={(e) => setMaxSqft(e.target.value)}
          placeholder="No max"
          className={inputCls}
        />
      </div>

      {/* Year built */}
      <div className="text-sm font-semibold text-gray-900 mb-2">Year Built</div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          inputMode="numeric"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
          placeholder="From"
          className={inputCls}
        />
        <span className="text-gray-400">–</span>
        <input
          type="text"
          inputMode="numeric"
          value={maxYear}
          onChange={(e) => setMaxYear(e.target.value)}
          placeholder="To"
          className={inputCls}
        />
      </div>

      {/* Status */}
      <div className="text-sm font-semibold text-gray-900 mb-2">Status</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_CHOICES.map((s) => {
          const isOn = statuses.includes(s.value)
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleStatus(s.value)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                isOn
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Days on market */}
      <div className="text-sm font-semibold text-gray-900 mb-2">Max Days on Market</div>
      <div className="mb-4">
        <input
          type="text"
          inputMode="numeric"
          value={domMax}
          onChange={(e) => setDomMax(e.target.value)}
          placeholder="Any"
          className={inputCls}
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
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
