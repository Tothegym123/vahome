'use client'

// app/components/filters/sections/DOMSection.tsx
// =============================================================================
// "Days on Market" — single dropdown: Any / ≤7 / ≤14 / ≤30 / ≤90.
// Stored in Filters as `dom_max: number | undefined`.
// =============================================================================

import Section from '../shared/Section'

const OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Any' },
  { value: '7', label: '7 days or less' },
  { value: '14', label: '14 days or less' },
  { value: '30', label: '30 days or less' },
  { value: '90', label: '90 days or less' },
]

type Props = {
  domMax?: number
  onChange: (next: { domMax?: number }) => void
}

export default function DOMSection({ domMax, onChange }: Props) {
  return (
    <Section id="filter-section-dom" title="Days on market">
      <select
        value={domMax !== undefined ? String(domMax) : ''}
        onChange={(e) => {
          const v = e.target.value
          onChange({ domMax: v === '' ? undefined : parseInt(v, 10) })
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Section>
  )
}
