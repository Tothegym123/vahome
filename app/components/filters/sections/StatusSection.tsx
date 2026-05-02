'use client'

// app/components/filters/sections/StatusSection.tsx
// =============================================================================
// Listing status checkboxes. We surface only the buyer-relevant statuses:
// Coming Soon, Active, Pending/Contingent (rolled into one "Under contract").
//
// Storage: `status: string[]` of canonical REIN status values. Empty array
// (or undefined) means "use DEFAULT_STATUS" on the server.
// =============================================================================

import Section from '../shared/Section'

type StatusOpt = { label: string; values: string[] }

const OPTIONS: StatusOpt[] = [
  { label: 'Coming Soon', values: ['Coming Soon'] },
  { label: 'Active', values: ['Active'] },
  { label: 'Under Contract / Pending', values: ['Pending', 'Contingent'] },
]

type Props = {
  status?: string[]
  onChange: (next: { status?: string[] }) => void
}

export default function StatusSection({ status, onChange }: Props) {
  const selected = new Set(status || [])

  const isOptOn = (opt: StatusOpt) => opt.values.every((v) => selected.has(v))

  const toggle = (opt: StatusOpt) => {
    const next = new Set(selected)
    if (isOptOn(opt)) {
      opt.values.forEach((v) => next.delete(v))
    } else {
      opt.values.forEach((v) => next.add(v))
    }
    const arr = Array.from(next)
    onChange({ status: arr.length > 0 ? arr : undefined })
  }

  return (
    <Section id="filter-section-status" title="Status">
      <div className="flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <label key={opt.label} className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-800">
            <input
              type="checkbox"
              checked={isOptOn(opt)}
              onChange={() => toggle(opt)}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </Section>
  )
}
