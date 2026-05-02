'use client'

// app/components/filters/FilterSidebar.tsx
// =============================================================================
// Persistent left sidebar with all filter sections always visible (desktop).
// Hidden on mobile (<md); the FilterSheet handles mobile via the FilterBar's
// mobile-only "Filters" button.
//
// Live URL updates with a 400ms debounce — no Apply button. Every change to
// the local draft schedules a router.push() so the server re-renders the grid.
// Re-syncs from the URL when navigation comes from another source (chip
// removal, search submit, etc.).
//
// Reuses every section component from sections/* (Wave B 9aed2b0). Each
// section keeps its own narrow prop signature; the sidebar adapts them to a
// single Filters draft.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  parseFiltersFromSearchParams,
  serializeFiltersToQueryString,
  type Filters,
} from '../../lib/listing-filters'
import PriceSection from './sections/PriceSection'
import BedsSection from './sections/BedsSection'
import BathsSection from './sections/BathsSection'
import HomeTypeSection from './sections/HomeTypeSection'
import StatusSection from './sections/StatusSection'
import SqftSection from './sections/SqftSection'
import YearBuiltSection from './sections/YearBuiltSection'
import DOMSection from './sections/DOMSection'

export default function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filters from the URL on every render.
  const spObj: Record<string, string> = {}
  searchParams.forEach((v: string, k: string) => { spObj[k] = v })
  const urlFilters = parseFiltersFromSearchParams(spObj)

  // Local draft — keeps UI snappy while sliders drag, before the debounced URL push.
  const [draft, setDraft] = useState<Filters>(urlFilters)

  // Re-sync from the URL when it changes from elsewhere (chip removal, search
  // submit, browser back/forward). Compare on the serialized form so we don't
  // clobber an in-flight slider drag.
  const spKey = searchParams.toString()
  useEffect(() => {
    const next: Record<string, string> = {}
    searchParams.forEach((v: string, k: string) => { next[k] = v })
    setDraft(parseFiltersFromSearchParams(next))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey])

  // Debounced URL push.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pushDraft = (next: Filters) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Always preserve q + city (owned by the search input above) and reset
      // pagination since the result set just changed.
      const merged: Filters = {
        ...next,
        q: urlFilters.q,
        city: urlFilters.city,
        page: undefined,
      }
      const qs = serializeFiltersToQueryString(merged)
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, 400)
  }

  const update = (patch: Partial<Filters>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      pushDraft(next)
      return next
    })
  }

  const reset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const cleared: Filters = { q: urlFilters.q, city: urlFilters.city }
    setDraft(cleared)
    const qs = serializeFiltersToQueryString(cleared)
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <aside className="hidden md:block w-[320px] flex-shrink-0">
      <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-3">
        <div className="flex items-center justify-between mb-2 pb-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={reset}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Reset all
          </button>
        </div>

        <div className="pb-6">
          <PriceSection
            minPrice={draft.min_price}
            maxPrice={draft.max_price}
            onChange={(v) => update({ min_price: v.minPrice, max_price: v.maxPrice })}
          />
          <BedsSection
            beds={draft.beds}
            maxBeds={draft.max_beds}
            onChange={(v) => update({ beds: v.beds, max_beds: v.maxBeds })}
          />
          <BathsSection
            baths={draft.baths}
            onChange={(v) => update({ baths: v.baths })}
          />
          <HomeTypeSection
            type={draft.type}
            onChange={(v) => update({ type: v.type })}
          />
          <StatusSection
            status={draft.status}
            onChange={(v) => update({ status: v.status })}
          />
          <SqftSection
            minSqft={draft.min_sqft}
            maxSqft={draft.max_sqft}
            onChange={(v) => update({ min_sqft: v.minSqft, max_sqft: v.maxSqft })}
          />
          <YearBuiltSection
            minYear={draft.min_year}
            maxYear={draft.max_year}
            onChange={(v) => update({ min_year: v.minYear, max_year: v.maxYear })}
          />
          <DOMSection
            domMax={draft.dom_max}
            onChange={(v) => update({ dom_max: v.domMax })}
          />
        </div>
      </div>
    </aside>
  )
}
