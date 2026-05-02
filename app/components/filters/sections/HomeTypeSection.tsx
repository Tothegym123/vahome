'use client'

// app/components/filters/sections/HomeTypeSection.tsx
// =============================================================================
// Property/home type — grid of toggle chips. Multi-select. Storage in Filters
// is the `type: string[]` of canonical REIN type values from
// listing-filters.ts PROPERTY_TYPES.
// =============================================================================

import Section from '../shared/Section'
import { PROPERTY_TYPES } from '../../../lib/listing-filters'

type Props = {
  type?: string[]
  onChange: (next: { type?: string[] }) => void
}

export default function HomeTypeSection({ type, onChange }: Props) {
  const selected = new Set(type || [])

  const toggle = (v: string) => {
    const next = new Set(selected)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    const arr = Array.from(next)
    onChange({ type: arr.length > 0 ? arr : undefined })
  }

  return (
    <Section id="filter-section-home-type" title="Home type">
      <div className="grid grid-cols-2 gap-2">
        {PROPERTY_TYPES.map((p) => {
          const isOn = selected.has(p.value)
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => toggle(p.value)}
              aria-pressed={isOn}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${
                isOn
                  ? 'bg-red-50 text-red-700 border-red-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </Section>
  )
}
