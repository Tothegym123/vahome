\'use client\'

// app/components/filters/sections/PriceSection.tsx
// =============================================================================
// Price range section: two-handle slider + Min/Max number inputs that stay
// in sync. Slider uses a piecewise non-linear scale so the popular
// $200K-$800K range gets ~50% of slider travel, with compressed ends:
//   slider %    -> price
//     0%        -> $0
//    15%        -> $200K
//    65%        -> $800K
//   100%        -> $20M
// =============================================================================

import { useEffect, useState } from \'react\'
import Section from \'../shared/Section\'
import RangeSlider from \'../shared/RangeSlider\'

const PRICE_MIN = 0
const PRICE_MAX = 20_000_000
const SLIDER_RANGE = 1000   // slider works on 0..1000 internally

// Anchor points for the piecewise mapping
const ANCHOR_LOW_PRICE = 200_000      // $200K
const ANCHOR_LOW_SLIDER = 150         // 15% of 1000
const ANCHOR_MID_PRICE = 800_000      // $800K
const ANCHOR_MID_SLIDER = 650         // 65% of 1000

// Convert slider position (0..1000) to real price ($0..$20M)
function sliderToPrice(s: number): number {
  if (s <= ANCHOR_LOW_SLIDER) {
    // 0..15%  ->  $0..$200K
    return Math.round((s / ANCHOR_LOW_SLIDER) * ANCHOR_LOW_PRICE)
  }
  if (s <= ANCHOR_MID_SLIDER) {
    // 15..65%  ->  $200K..$800K
    const frac = (s - ANCHOR_LOW_SLIDER) / (ANCHOR_MID_SLIDER - ANCHOR_LOW_SLIDER)
    return Math.round(ANCHOR_LOW_PRICE + frac * (ANCHOR_MID_PRICE - ANCHOR_LOW_PRICE))
  }
  // 65..100%  ->  $800K..$20M
  const frac = (s - ANCHOR_MID_SLIDER) / (SLIDER_RANGE - ANCHOR_MID_SLIDER)
  return Math.round(ANCHOR_MID_PRICE + frac * (PRICE_MAX - ANCHOR_MID_PRICE))
}

// Convert real price back to slider position (0..1000). Inverse of sliderToPrice.
function priceToSlider(p: number): number {
  if (p <= ANCHOR_LOW_PRICE) {
    return Math.round((p / ANCHOR_LOW_PRICE) * ANCHOR_LOW_SLIDER)
  }
  if (p <= ANCHOR_MID_PRICE) {
    const frac = (p - ANCHOR_LOW_PRICE) / (ANCHOR_MID_PRICE - ANCHOR_LOW_PRICE)
    return Math.round(ANCHOR_LOW_SLIDER + frac * (ANCHOR_MID_SLIDER - ANCHOR_LOW_SLIDER))
  }
  const frac = Math.min(p - ANCHOR_MID_PRICE, PRICE_MAX - ANCHOR_MID_PRICE) / (PRICE_MAX - ANCHOR_MID_PRICE)
  return Math.round(ANCHOR_MID_SLIDER + frac * (SLIDER_RANGE - ANCHOR_MID_SLIDER))
}

// Snap a price to a nice step. Step size grows with price tier:
//   <  $200K   -> nearest $5k
//   < $800K    -> nearest $25k
//   else       -> nearest $100k
function snapPrice(p: number): number {
  if (p < ANCHOR_LOW_PRICE) return Math.round(p / 5_000) * 5_000
  if (p < ANCHOR_MID_PRICE) return Math.round(p / 25_000) * 25_000
  return Math.round(p / 100_000) * 100_000
}

type Props = {
  minPrice?: number
  maxPrice?: number
  onChange: (next: { minPrice?: number; maxPrice?: number }) => void
}

function fmtPrice(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return \'$\' + (Math.round(m * 10) / 10) + \'M\'
  }
  if (n >= 1_000) return \'$\' + Math.round(n / 1_000) + \'k\'
  return \'$\' + n
}

export default function PriceSection({ minPrice, maxPrice, onChange }: Props) {
  const lo = minPrice ?? PRICE_MIN
  const hi = maxPrice ?? PRICE_MAX

  // Local input strings so the user can type freely (e.g. mid-edit "30")
  // before we coerce back to numbers on blur.
  const [minStr, setMinStr] = useState<string>(minPrice !== undefined ? String(minPrice) : \'\')
  const [maxStr, setMaxStr] = useState<string>(maxPrice !== undefined ? String(maxPrice) : \'\')

  useEffect(() => { setMinStr(minPrice !== undefined ? String(minPrice) : \'\') }, [minPrice])
  useEffect(() => { setMaxStr(maxPrice !== undefined ? String(maxPrice) : \'\') }, [maxPrice])

  const commitMin = () => {
    if (minStr === \'\') {
      onChange({ minPrice: undefined, maxPrice })
      return
    }
    const n = parseInt(minStr.replace(/[^0-9]/g, \'\'), 10)
    if (!Number.isFinite(n)) {
      onChange({ minPrice: undefined, maxPrice })
      return
    }
    onChange({ minPrice: Math.max(0, n), maxPrice })
  }
  const commitMax = () => {
    if (maxStr === \'\') {
      onChange({ minPrice, maxPrice: undefined })
      return
    }
    const n = parseInt(maxStr.replace(/[^0-9]/g, \'\'), 10)
    if (!Number.isFinite(n)) {
      onChange({ minPrice, maxPrice: undefined })
      return
    }
    onChange({ minPrice, maxPrice: Math.max(0, n) })
  }

  return (
    <Section id="filter-section-price" title="Price">
      <div className="text-xs text-gray-500 mb-2">
        {fmtPrice(lo)} - {hi >= PRICE_MAX ? `${fmtPrice(PRICE_MAX)}+` : fmtPrice(hi)}
      </div>
      <RangeSlider
        min={0}
        max={SLIDER_RANGE}
        step={1}
        value={[priceToSlider(lo), priceToSlider(hi)]}
        onChange={([newLoSlider, newHiSlider]) => {
          const newLo = snapPrice(sliderToPrice(newLoSlider))
          const newHi = snapPrice(sliderToPrice(newHiSlider))
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
            onKeyDown={(e) => { if (e.key === \'Enter\') (e.target as HTMLInputElement).blur() }}
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
            onKeyDown={(e) => { if (e.key === \'Enter\') (e.target as HTMLInputElement).blur() }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </label>
      </div>
    </Section>
  )
}
