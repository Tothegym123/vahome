'use client'

// app/components/filters/shared/PillRow.tsx
// =============================================================================
// Horizontal row of selectable pills. Used by Beds (range) and Baths (min-only)
// sections. The selection model is owned by the parent — this component is
// purely presentational and emits onSelect(value).
// =============================================================================

import React from 'react'

export type Pill = { value: string; label: string }

type Props = {
  pills: Pill[]
  isSelected: (value: string) => boolean
  isInRange?: (value: string) => boolean // for highlighting the inner range
  onSelect: (value: string) => void
  scroll?: boolean
}

export default function PillRow({ pills, isSelected, isInRange, onSelect, scroll = false }: Props) {
  return (
    <div
      className={`flex gap-2 ${scroll ? 'overflow-x-auto pb-1' : 'flex-wrap'}`}
      role="group"
    >
      {pills.map((p) => {
        const selected = isSelected(p.value)
        const inRange = !selected && isInRange ? isInRange(p.value) : false
        const cls = selected
          ? 'bg-red-600 text-white border-red-600'
          : inRange
          ? 'bg-red-50 text-red-700 border-red-300'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onSelect(p.value)}
            aria-pressed={selected}
            className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${cls}`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
