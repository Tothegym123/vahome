'use client'

// app/components/filters/BedsBathsPopover.tsx
// =============================================================================
// Beds + baths "minimum" pickers. Both are "X+" semantics: choosing 3 means
// "3 or more". "Any" clears that constraint.
// =============================================================================

import { useState } from 'react'
import type { Filters } from '../../lib/listing-filters'

type Props = {
  filters: Filters
  onApply: (next: Filters) => void
  onClose: () => void
}

const BED_CHOICES: { value: number | undefined; label: string }[] = [
  { value: undefined, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]

const BATH_CHOICES: { value: number | undefined; label: string }[] = [
  { value: undefined, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 1.5, label: '1.5+' },
  { value: 2, label: '2+' },
  { value: 2.5, label: '2.5+' },
  { value: 3, label: '3+' },
]

export default function BedsBathsPopover({ filters, onApply, onClose }: Props) {
  const [beds, setBeds] = useState<number | undefined>(filters.beds)
  const [baths, setBaths] = useState<number | undefined>(filters.baths)

  const handleApply = () => {
    onApply({ ...filters, beds, baths })
  }

  const handleClear = () => {
    setBeds(undefined)
    setBaths(undefined)
    onApply({ ...filters, beds: undefined, baths: undefined })
  }

  const Pill = ({
    selected,
    label,
    onClick,
  }: { selected: boolean; label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-0 px-2 py-1.5 text-sm rounded-md border transition-colors ${
        selected
          ? 'bg-primary-500 text-white border-primary-500'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      role="dialog"
      aria-label="Beds and baths filter"
      className="absolute z-50 left-0 mt-2 w-[280px] bg-white rounded-lg border border-gray-200 shadow-lg p-4"
    >
      <div className="text-sm font-semibold text-gray-900 mb-2">Bedrooms</div>
      <div className="flex gap-1 mb-4">
        {BED_CHOICES.map((c) => (
          <Pill
            key={c.label}
            selected={beds === c.value}
            label={c.label}
            onClick={() => setBeds(c.value)}
          />
        ))}
      </div>

      <div className="text-sm font-semibold text-gray-900 mb-2">Bathrooms</div>
      <div className="flex gap-1 mb-4">
        {BATH_CHOICES.map((c) => (
          <Pill
            key={c.label}
            selected={baths === c.value}
            label={c.label}
            onClick={() => setBaths(c.value)}
          />
        ))}
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
