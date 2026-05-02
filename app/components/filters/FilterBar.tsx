'use client'

// app/components/filters/FilterBar.tsx
// =============================================================================
// Single-bar filter strip + "All filters" button that opens the FilterSheet.
//
// Wave B (this file): replaces the four-popover bar with summary chips +
// one master button. Clicking a summary chip opens the sheet scrolled to
// that section. Clicking "All filters" opens the sheet at the top.
//
// Filter state still lives in the URL (read via useSearchParams) — the sheet
// just keeps a local draft until the user commits via "See N homes".
// =============================================================================

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  parseFiltersFromSearchParams,
  type Filters,
  PROPERTY_TYPES,
} from '../../lib/listing-filters'
import FilterSheet from './FilterSheet'

function fmtPriceShort(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    return '$' + (Math.round(m * 10) / 10) + 'M'
  }
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'k'
  return '$' + n
}

function priceLabel(f: Filters): string | null {
  if (f.min_price !== undefined && f.max_price !== undefined) {
    return `${fmtPriceShort(f.min_price)}–${fmtPriceShort(f.max_price)}`
  }
  if (f.min_price !== undefined) return `${fmtPriceShort(f.min_price)}+`
  if (f.max_price !== undefined) return `Up to ${fmtPriceShort(f.max_price)}`
  return null
}

function bedsBathsLabel(f: Filters): string | null {
  const parts: string[] = []
  if (f.beds !== undefined && f.max_beds !== undefined) {
    parts.push(`${f.beds}–${f.max_beds} bd`)
  } else if (f.beds !== undefined) {
    parts.push(`${f.beds}+ bd`)
  } else if (f.max_beds !== undefined) {
    parts.push(`up to ${f.max_beds} bd`)
  }
  if (f.baths !== undefined) parts.push(`${f.baths}+ ba`)
  return parts.length > 0 ? parts.join(', ') : null
}

function homeTypeLabel(f: Filters): string | null {
  if (!f.type || f.type.length === 0) return null
  if (f.type.length === 1) {
    const found = PROPERTY_TYPES.find((p) => p.value === f.type![0])
    return found ? found.label : f.type[0]
  }
  if (f.type.length <= 2) {
    return f.type
      .map((t) => PROPERTY_TYPES.find((p) => p.value === t)?.label ?? t)
      .join(', ')
  }
  return `${f.type.length} types`
}

function activeCount(f: Filters): number {
  let c = 0
  if (f.min_price !== undefined || f.max_price !== undefined) c++
  if (f.beds !== undefined || f.max_beds !== undefined) c++
  if (f.baths !== undefined) c++
  if (f.type && f.type.length > 0) c++
  if (f.status && f.status.length > 0) c++
  if (f.min_sqft !== undefined || f.max_sqft !== undefined) c++
  if (f.min_year !== undefined || f.max_year !== undefined) c++
  if (f.dom_max !== undefined) c++
  return c
}

export default function FilterBar() {
  const searchParams = useSearchParams()
  const spObj: Record<string, string> = {}
  searchParams.forEach((v: string, k: string) => { spObj[k] = v })
  const filters = parseFiltersFromSearchParams(spObj)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [scrollTo, setScrollTo] = useState<string | null>(null)

  const openSheet = (sectionId?: string) => {
    setScrollTo(sectionId || null)
    setSheetOpen(true)
  }

  const pLabel = priceLabel(filters)
  const bbLabel = bedsBathsLabel(filters)
  const htLabel = homeTypeLabel(filters)
  const count = activeCount(filters)

  const chipBase =
    'px-3 py-2 text-sm font-medium border rounded-full hover:bg-gray-50 whitespace-nowrap inline-flex items-center gap-1'
  const chipActive = 'border-red-500 text-red-600 bg-red-50 hover:bg-red-50'

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {pLabel && (
          <button
            type="button"
            onClick={() => openSheet('filter-section-price')}
            className={`${chipBase} ${chipActive}`}
          >
            {pLabel}
          </button>
        )}
        {bbLabel && (
          <button
            type="button"
            onClick={() => openSheet('filter-section-beds')}
            className={`${chipBase} ${chipActive}`}
          >
            {bbLabel}
          </button>
        )}
        {htLabel && (
          <button
            type="button"
            onClick={() => openSheet('filter-section-home-type')}
            className={`${chipBase} ${chipActive}`}
          >
            {htLabel}
          </button>
        )}

        <button
          type="button"
          onClick={() => openSheet()}
          className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-7.172a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          All filters
          {count > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs font-semibold">
              {count}
            </span>
          )}
        </button>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initial={filters}
        scrollTo={scrollTo}
      />
    </>
  )
}
