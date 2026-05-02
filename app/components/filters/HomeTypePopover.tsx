'use client'

// app/components/filters/HomeTypePopover.tsx
// =============================================================================
// Multi-select chips for property_type. PROPERTY_TYPES is the canonical list.
// =============================================================================

import { useState } from 'react'
import { PROPERTY_TYPES, type Filters } from '../../lib/listing-filters'

type Props = {
  filters: Filters
  onApply: (next: Filters) => void
  onClose: () => void
}

export default function HomeTypePopover({ filters, onApply, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>(filters.type || [])

  const toggle = (val: string) => {
    setSelected((curr) =>
      curr.includes(val) ? curr.filter((v) => v !== val) : [...curr, val],
    )
  }

  const handleApply = () => {
    onApply({ ...filters, type: selected.length > 0 ? selected : undefined })
  }

  const handleClear = () => {
    setSelected([])
    onApply({ ...filters, type: undefined })
  }

  return (
    <div
      role="dialog"
      aria-label="Home type filter"
      className="absolute z-50 left-0 mt-2 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg p-4"
    >
      <div className="text-sm font-semibold text-gray-900 mb-2">Home Type</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {PROPERTY_TYPES.map((p) => {
          const isOn = selected.includes(p.value)
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => toggle(p.value)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                isOn
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
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
