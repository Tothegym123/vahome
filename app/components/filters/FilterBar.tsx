'use client'

// app/components/filters/FilterBar.tsx
// =============================================================================
// Top-of-grid strip: result count + active filter chips on every viewport,
// plus a mobile-only "Filters" button that opens the slide-in FilterSheet.
//
// Desktop filters live in the persistent left sidebar (FilterSidebar). The
// FilterSheet stays as the mobile-only experience (full-screen on <md).
// =============================================================================

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  parseFiltersFromSearchParams,
  type Filters,
} from '../../lib/listing-filters'
import ActiveFilterChips from './ActiveFilterChips'
import FilterSheet from './FilterSheet'

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

type Props = {
  resultCount: number
}

export default function FilterBar({ resultCount }: Props) {
  const searchParams = useSearchParams()
  const spObj: Record<string, string> = {}
  searchParams.forEach((v: string, k: string) => { spObj[k] = v })
  const filters = parseFiltersFromSearchParams(spObj)

  const [sheetOpen, setSheetOpen] = useState(false)
  const count = activeCount(filters)

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {resultCount === 0
          ? 'No matches'
          : `${resultCount.toLocaleString()} ${resultCount === 1 ? 'home' : 'homes'}`}
      </span>

      <div className="flex-1 min-w-0">
        <ActiveFilterChips />
      </div>

      {/* Mobile-only filter button */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="md:hidden ml-auto inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 whitespace-nowrap"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-7.172a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        Filters
        {count > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-xs font-semibold">
            {count}
          </span>
        )}
      </button>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initial={filters}
      />
    </div>
  )
}
