'use client'

// app/components/filters/sections/YearBuiltSection.tsx
// =============================================================================
// Year built range slider, 1900..currentYear, step 1.
// =============================================================================

import { useEffect, useState } from 'react'
import Section from '../shared/Section'
import RangeSlider from '../shared/RangeSlider'

const YEAR_MIN = 1900
const YEAR_MAX = new Date().getFullYear()

type Props = {
  minYear?: number
  maxYear?: number
  onChange: (next: { minYear?: number; maxYear?: number }) => void
}

export default function YearBuiltSection({ minYear, maxYear, onChange }: Props) {
  const lo = minYear ?? YEAR_MIN
  const hi = maxYear ?? YEAR_MAX

  const [minStr, setMinStr] = useState<string>(minYear !== undefined ? String(minYear) : '')
  const [maxStr, setMaxStr] = useState<string>(maxYear !== undefined ? String(maxYear) : '')

  useEffect(() => { setMinStr(minYear !== undefined ? String(minYear) : '') }, [minYear])
  useEffect(() => { setMaxStr(maxYear !== undefined ? String(maxYear) : '') }, [maxYear])

  const commitMin = () => {
    if (minStr === '') { onChange({ minYear: undefined, maxYear }); return }
    const n = parseInt(minStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) { onChange({ minYear: undefined, maxYear }); return }
    const clamped = Math.max(YEAR_MIN, Math.min(YEAR_MAX, n))
    onChange({ minYear: clamped, maxYear })
  }
  const commitMax = () => {
    if (maxStr === '') { onChange({ minYear, maxYear: undefined }); return }
    const n = parseInt(maxStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) { onChange({ minYear, maxYear: undefined }); return }
    const clamped = Math.max(YEAR_MIN, Math.min(YEAR_MAX, n))
    onChange({ minYear, maxYear: clamped })
  }

  return (
    <Section id="filter-section-year" title="Year built">
      <div className="text-xs text-gray-500 mb-2">
        {lo} – {hi}
      </div>
      <RangeSlider
        min={YEAR_MIN}
        max={YEAR_MAX}
        step={1}
        value={[lo, hi]}
        onChange={([newLo, newHi]) =>
          onChange({
            minYear: newLo <= YEAR_MIN ? undefined : newLo,
            maxYear: newHi >= YEAR_MAX ? undefined : newHi,
          })
        }
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Min year</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(YEAR_MIN)}
            value={minStr}
            onChange={(e) => setMinStr(e.target.value)}
            onBlur={commitMin}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Max year</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder={String(YEAR_MAX)}
            value={maxStr}
            onChange={(e) => setMaxStr(e.target.value)}
            onBlur={commitMax}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </label>
      </div>
    </Section>
  )
}
