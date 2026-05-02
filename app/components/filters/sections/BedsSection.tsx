'use client'

// app/components/filters/sections/BedsSection.tsx
// =============================================================================
// Beds: "Tap two numbers to select a range". Pills: Any | Studio | 1 | 2 | 3
// | 4 | 5+. First click sets min, second click sets max (auto-swap if user
// picks a smaller second value). Re-clicking the lone selected pill clears.
// "Any" clears the whole selection.
//
// Storage model in Filters: beds = min, max_beds = max (max is informational
// today since applyFiltersToSupabaseQuery doesn't yet use it; but we keep it
// in URL so the chip can render the range).
// =============================================================================

import Section from '../shared/Section'
import PillRow from '../shared/PillRow'

const PILLS = [
  { value: 'any', label: 'Any' },
  { value: '0', label: 'Studio' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
]

type Props = {
  beds?: number       // min
  maxBeds?: number    // max
  onChange: (next: { beds?: number; maxBeds?: number }) => void
}

export default function BedsSection({ beds, maxBeds, onChange }: Props) {
  const minSet = beds !== undefined
  const maxSet = maxBeds !== undefined

  const isSelected = (v: string) => {
    if (v === 'any') return !minSet && !maxSet
    const n = parseInt(v, 10)
    return (minSet && beds === n) || (maxSet && maxBeds === n)
  }
  const isInRange = (v: string) => {
    if (!minSet || !maxSet) return false
    const n = parseInt(v, 10)
    return n > (beds as number) && n < (maxBeds as number)
  }

  const onSelect = (v: string) => {
    if (v === 'any') {
      onChange({ beds: undefined, maxBeds: undefined })
      return
    }
    const n = parseInt(v, 10)

    // Re-click the lone selected pill = clear that endpoint
    if (minSet && !maxSet && beds === n) {
      onChange({ beds: undefined, maxBeds: undefined })
      return
    }
    if (!minSet && maxSet && maxBeds === n) {
      onChange({ beds: undefined, maxBeds: undefined })
      return
    }
    if (minSet && maxSet && (beds === n || maxBeds === n)) {
      // re-click an endpoint of the range: drop both
      onChange({ beds: undefined, maxBeds: undefined })
      return
    }

    if (!minSet && !maxSet) {
      // first click — set min only
      onChange({ beds: n, maxBeds: undefined })
      return
    }

    if (minSet && !maxSet) {
      // second click — set max (auto-swap if needed)
      const lo = Math.min(beds as number, n)
      const hi = Math.max(beds as number, n)
      if (lo === hi) {
        onChange({ beds: lo, maxBeds: undefined })
      } else {
        onChange({ beds: lo, maxBeds: hi })
      }
      return
    }

    if (minSet && maxSet) {
      // both are set; treat new click as a reset to "min only"
      onChange({ beds: n, maxBeds: undefined })
      return
    }
  }

  return (
    <Section
      id="filter-section-beds"
      title="Beds"
      hint="Tap one number for a minimum, or two numbers to select a range."
    >
      <PillRow
        pills={PILLS}
        isSelected={isSelected}
        isInRange={isInRange}
        onSelect={onSelect}
      />
    </Section>
  )
}
