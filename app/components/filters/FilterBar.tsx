'use client'

// app/components/filters/FilterBar.tsx
// =============================================================================
// FilterBar — sticky row of "Price", "Beds / Baths", "Home Type", "More
// Filters" buttons. Each button toggles a popover anchored to it.
//
// Filter state lives in the URL (read via useSearchParams). When a popover's
// "Apply" button fires, we router.push() the new URL and the server re-renders
// the listing grid. This keeps the page SSR-friendly and shareable.
//
// Wave A: used on /listings only. Wave B will reuse the same component on
// /map by mounting it above the map and consuming the same URL params.
// =============================================================================

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  parseFiltersFromSearchParams,
  serializeFiltersToQueryString,
  type Filters,
  PROPERTY_TYPES,
} from '../../lib/listing-filters'
import PricePopover from './PricePopover'
import BedsBathsPopover from './BedsBathsPopover'
import HomeTypePopover from './HomeTypePopover'
import MoreFiltersPopover from './MoreFiltersPopover'

type PopoverKey = 'price' | 'bedsBaths' | 'homeType' | 'more' | null

function fmtPriceShort(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    return '$' + (Math.round(m * 10) / 10) + 'M'
  }
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'k'
  return '$' + n
}

function priceLabel(f: Filters): string {
  if (f.min_price !== undefined && f.max_price !== undefined) {
    return `${fmtPriceShort(f.min_price)}–${fmtPriceShort(f.max_price)}`
  }
  if (f.min_price !== undefined) return `${fmtPriceShort(f.min_price)}+`
  if (f.max_price !== undefined) return `Up to ${fmtPriceShort(f.max_price)}`
  return 'Price'
}

function bedsBathsLabel(f: Filters): string {
  const parts: string[] = []
  if (f.beds !== undefined) parts.push(`${f.beds}+ bd`)
  if (f.baths !== undefined) parts.push(`${f.baths}+ ba`)
  return parts.length > 0 ? parts.join(' / ') : 'Beds / Baths'
}

function homeTypeLabel(f: Filters): string {
  if (!f.type || f.type.length === 0) return 'Home Type'
  if (f.type.length === 1) {
    const found = PROPERTY_TYPES.find((p) => p.value === f.type![0])
    return found ? found.label : f.type[0]
  }
  return `${f.type.length} types`
}

function moreFiltersLabel(f: Filters): string {
  let count = 0
  if (f.min_sqft !== undefined || f.max_sqft !== undefined) count++
  if (f.min_year !== undefined || f.max_year !== undefined) count++
  if (f.status && f.status.length > 0) count++
  if (f.dom_max !== undefined) count++
  return count > 0 ? `More (${count})` : 'More Filters'
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<PopoverKey>(null)

  // Convert ReadonlyURLSearchParams → plain object for the parser.
  const spObj: Record<string, string> = {}
  searchParams.forEach((v: string, k: string) => { spObj[k] = v })
  const filters = parseFiltersFromSearchParams(spObj)

  const containerRef = useRef<HTMLDivElement>(null)

  // Outside click + Escape close.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const apply = (next: Filters) => {
    // Reset pagination whenever filters change.
    const merged: Filters = { ...next, page: undefined }
    const qs = serializeFiltersToQueryString(merged)
    const url = qs ? `${pathname}?${qs}` : pathname
    router.push(url)
    setOpen(null)
  }

  const btnBase =
    'px-4 py-2.5 text-sm font-medium border rounded-lg hover:bg-gray-50 flex items-center whitespace-nowrap'
  const btnInactive = 'border-gray-300 text-gray-700'
  const btnActive = 'border-primary-500 text-primary-600 bg-primary-50'

  const isPriceActive = filters.min_price !== undefined || filters.max_price !== undefined
  const isBedsBathsActive = filters.beds !== undefined || filters.baths !== undefined
  const isHomeTypeActive = !!filters.type && filters.type.length > 0
  const isMoreActive =
    filters.min_sqft !== undefined ||
    filters.max_sqft !== undefined ||
    filters.min_year !== undefined ||
    filters.max_year !== undefined ||
    (filters.status && filters.status.length > 0) ||
    filters.dom_max !== undefined

  return (
    <div ref={containerRef} className="flex items-center gap-2 flex-wrap">
      {/* Price */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === 'price' ? null : 'price')}
          className={`${btnBase} ${isPriceActive ? btnActive : btnInactive}`}
          aria-expanded={open === 'price'}
          aria-haspopup="dialog"
        >
          {priceLabel(filters)}
          <Chevron open={open === 'price'} />
        </button>
        {open === 'price' && (
          <PricePopover filters={filters} onApply={apply} onClose={() => setOpen(null)} />
        )}
      </div>

      {/* Beds / Baths */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === 'bedsBaths' ? null : 'bedsBaths')}
          className={`${btnBase} ${isBedsBathsActive ? btnActive : btnInactive}`}
          aria-expanded={open === 'bedsBaths'}
          aria-haspopup="dialog"
        >
          {bedsBathsLabel(filters)}
          <Chevron open={open === 'bedsBaths'} />
        </button>
        {open === 'bedsBaths' && (
          <BedsBathsPopover filters={filters} onApply={apply} onClose={() => setOpen(null)} />
        )}
      </div>

      {/* Home Type */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === 'homeType' ? null : 'homeType')}
          className={`${btnBase} ${isHomeTypeActive ? btnActive : btnInactive}`}
          aria-expanded={open === 'homeType'}
          aria-haspopup="dialog"
        >
          {homeTypeLabel(filters)}
          <Chevron open={open === 'homeType'} />
        </button>
        {open === 'homeType' && (
          <HomeTypePopover filters={filters} onApply={apply} onClose={() => setOpen(null)} />
        )}
      </div>

      {/* More Filters */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === 'more' ? null : 'more')}
          className={`${btnBase} ${isMoreActive ? btnActive : btnInactive}`}
          aria-expanded={open === 'more'}
          aria-haspopup="dialog"
        >
          {moreFiltersLabel(filters)}
          <Chevron open={open === 'more'} />
        </button>
        {open === 'more' && (
          <MoreFiltersPopover filters={filters} onApply={apply} onClose={() => setOpen(null)} />
        )}
      </div>
    </div>
  )
}
