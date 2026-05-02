'use client'

// app/components/filters/sections/PriceSection.tsx
// =============================================================================
// Price range section: two-handle slider + Min/Max number inputs that stay
// in sync. Slider goes 50k..10M (linear for the first cut). The "no min" /
// "no max" boundary is encoded as undefined in the parent filter state, so
// users can clear individual ends.
// =============================================================================

import { useEffect, useState } from 'react'
import Section from '../shared/Section'
import RangeSlider from '../shared/RangeSlider'

const PRICE_MIN = 50_000
const PRICE_MAX = 10_000_000
const PRICE_STEP = 25_000

type Props = {
  minPrice?: number
  maxPrice?: number
  onChange: (next: { minPrice?: number; maxPrice?: number }) => void
}

function fmtPrice(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return '$' + (Math.round(m * 10) / 10) + 'M'
  }
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'k'
  return '$' + n
}

export default function PriceSection({ minPrice, maxPrice, onChange }: Props) {
  const lo = minPrice ?? PRICE_MIN
  const hi = maxPrice ?? PRICE_MAX

  // Local input strings so the user can type freely (e.g. mid-edit "30")
  // before we coerce back to numbers on blur.
  const [minStr, setMinStr] = useState<string>(minPrice !== undefined ? String(minPrice) : '')
  const [maxStr, setMaxStr] = useState<string>(maxPrice !== undefined ? String(maxPrice) : '')

  useEffect(() => { setMinStr(minPrice !== undefined ? String(minPrice) : '') }, [minPrice])
  useEffect(() => { setMaxStr(maxPrice !== undefined ? String(maxPrice) : '') }, [maxPrice])

  const commitMin = () => {
    if (minStr === '') {
      onChange({ minPrice: undefined, maxPrice })
      return
    }
    const n = parseInt(minStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) {
      onChange({ minPrice: undefined, maxPrice })
      return
    }
    onChange({ minPrice: Math.max(0, n), maxPrice })
  }
  const commitMax = () => {
    if (maxStr === '') {
      onChange({ minPrice, maxPrice: undefined })
      return
    }
    const n = parseInt(maxStr.replace(/[^0-9]/g, ''), 10)
    if (!Number.isFinite(n)) {
      onChange({ minPrice, maxPrice: undefined })
      return
    }
    onChange({ minPrice, maxPrice: Math.max(0, n) })
  }

  return (
    <Section id="filter-section-price" title="Price">
      <div className="text-xs text-gray-500 mb-2">
        {fmtPrice(lo)} – {hi >= PRICE_MAX ? `${fmtPrice(PRICE_MAX)}+` : fmtPrice(hi)}
      </div>
      <RangeSlider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={[lo, hi]}
        onChange={([newLo, newHi]) => {
          onChange({
            minPrice: newLo <= PRICE_MIN ? undefined : newLo,
            maxPrice: newHi >= PRICE_MAX ? undefined : newHi,
          })
        }}
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <label className="block">
          <span className="block text-xs font-medium text-gray-600 mb-1">Min price</span>
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
          <span className="block text-xs font-medium text-gray-600 mb-1">Max price</span>
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
