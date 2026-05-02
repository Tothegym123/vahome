'use client'

// app/components/filters/sections/SqftSection.tsx
// =============================================================================
// Square footage range, 0..10,000, step 100, with two-handle slider + min/max
// number inputs.
// =============================================================================

import { useEffect, useState } from 'react'
import Section from '../shared/Section'
import RangeSlider from '../shared/RangeSlider'

const SQFT_MIN = 0
const SQFT_MAX = 10_000
const SQFT_STEP = 100

type Props = {
  minSqft?: number
  maxSqft?: number
  onChange: (next: { minSqft?: number; maxSqft?: number }) => void
}

export default function SqftSection({ minSqft, maxSqft, onChange }: Props) {
  const lo = minSqft ?? SQFT_MIN
  const hi = maxSqft ?? SQFT_MAX

  const [minStr, setMinStr] = useState<string>(minSqft !== undefined ? String(minSqft) : '')
  const [maxStr, setMaxStr] = useState<string>(maxSqft !== undefined ? String(maxSqft) : '')

  useEffect(() => { setMinStr(minSqft !== undefined ? String(minSqft) : '') }, [minSqft])
  useEffect(() => { setMaxStr(maxSqft !== undefined ? String(maxSqft) : '') }, [maxSqft])

  const commitMin = () => {
    if (minStr === '') { onChange({ minSqft: undefined, maxSqft }); return }
    const n = parseInt(minStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) { onChange({ minSqft: undefined, maxSqft }); return }
    onChange({ minSqft: Math.max(0, n), maxSqft })
  }
  const commitMax = () => {
    if (maxStr === '') { onChange({ minSqft, maxSqft: undefined }); return }
    const n = parseInt(maxStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) { onChange({ minSqft, maxSqft: undefined }); return }
    onChange({ minSqft, maxSqft: Math.max(0, n) })
  }

  return (
    <Section id="filter-section-sqft" title="Square feet">
      <div className="text-xs text-gray-500 mb-2">
        {lo.toLocaleString()} – {hi >= SQFT_MAX ? `${SQFT_MAX.toLocaleString()}+` : hi.toLocaleString()} sqft
      </div>
      <RangeSlider
        min={SQFT_MIN}
        max={SQFT_MAX}
        step={SQFT_STEP}
        value={[lo, hi]}
        onChange={([newLo, newHi]) =>
          onChange({
            minSqft: newLo <= SQFT_MIN ? undefined : newLo,
            maxSqft: newHi >= SQFT_MAX ? undefined : newHi,
          })
        }
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Min sqft</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="No min"
            value={minStr}
            onChange={(e) => setMinStr(e.target.value)}
            onBlur={commitMin}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Max sqft</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="No max"
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
