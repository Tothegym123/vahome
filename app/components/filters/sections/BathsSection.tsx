'use client'

// app/components/filters/sections/BathsSection.tsx
// =============================================================================
// Baths: min-only pill row. Any | 1+ | 1.5+ | 2+ | 2.5+ | 3+ | 4+. Re-click
// the selected pill to clear.
// =============================================================================

import Section from '../shared/Section'
import PillRow from '../shared/PillRow'

const PILLS = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '1.5', label: '1.5+' },
  { value: '2', label: '2+' },
  { value: '2.5', label: '2.5+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

type Props = {
  baths?: number
  onChange: (next: { baths?: number }) => void
}

export default function BathsSection({ baths, onChange }: Props) {
  const isSelected = (v: string) => {
    if (v === 'any') return baths === undefined
    return baths !== undefined && baths === parseFloat(v)
  }

  const onSelect = (v: string) => {
    if (v === 'any') {
      onChange({ baths: undefined })
      return
    }
    const n = parseFloat(v)
    if (baths === n) {
      onChange({ baths: undefined })
      return
    }
    onChange({ baths: n })
  }

  return (
    <Section id="filter-section-baths" title="Baths">
      <PillRow pills={PILLS} isSelected={isSelected} onSelect={onSelect} />
    </Section>
  )
}
