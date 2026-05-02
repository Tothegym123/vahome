'use client'

// app/components/filters/FilterSheet.tsx
// =============================================================================
// Right-side slide-in filter panel (Redfin-style).
//
// Owns LOCAL React state for the filter draft while the sheet is open, and
// only commits to the URL when the user clicks "See {N} homes". This avoids
// spamming server-rendered re-renders while the user is dragging sliders.
//
// The live count in the bottom CTA is debounced 250ms and fetched from
// /api/listings/count. The count uses the same applyFiltersToSupabaseQuery
// helper as the grid, so the number always matches the result page.
//
// Layout:
//   - Backdrop dims the page; click-outside or Esc closes.
//   - Sheet: 440px wide on desktop, full-screen slide-up on mobile (<768px).
//   - Top bar: title + close X.
//   - Scrollable section list (Price, Beds, Baths, Home Type, Status, Sqft,
//     Year Built, Days on Market).
//   - Sticky bottom: "Reset all" + "See N homes" red CTA.
// =============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
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

type Props = {
  open: boolean
  onClose: () => void
  initial: Filters
  scrollTo?: string | null   // section id to scroll to on open
}

export default function FilterSheet({ open, onClose, initial, scrollTo }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  // Local draft state. Reset to URL filters whenever sheet opens.
  const [draft, setDraft] = useState<Filters>(initial)

  // Re-seed draft from URL filters every time the sheet opens.
  useEffect(() => {
    if (open) setDraft(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Live count fetch (debounced 250ms).
  const [count, setCount] = useState<number | null>(null)
  const [counting, setCounting] = useState(false)

  // Build query string for the count request — strip page & q since count
  // applies across all pages, but we DO want q so the count matches the
  // grid (search term affects both).
  const countQs = useMemo(() => {
    const f: Filters = { ...draft, page: undefined }
    return serializeFiltersToQueryString(f)
  }, [draft])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setCounting(true)
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/listings/count${countQs ? `?${countQs}` : ''}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`count ${res.status}`)
        const json = await res.json()
        if (!cancelled) setCount(typeof json.count === 'number' ? json.count : null)
      } catch (err) {
        if (!cancelled) setCount(null)
      } finally {
        if (!cancelled) setCounting(false)
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [open, countQs])

  // Esc closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Lock background scroll while open.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Scroll to section when requested.
  const sheetBodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open || !scrollTo) return
    const t = setTimeout(() => {
      const el = document.getElementById(scrollTo)
      if (el && sheetBodyRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
    return () => clearTimeout(t)
  }, [open, scrollTo])

  const update = (patch: Partial<Filters>) => setDraft((prev) => ({ ...prev, ...patch }))

  const reset = () => {
    // Preserve q + city (search input + city slug); reset everything else.
    setDraft({ q: initial.q, city: initial.city })
  }

  const commit = () => {
    const next: Filters = { ...draft, page: undefined }
    const qs = serializeFiltersToQueryString(next)
    router.push(qs ? `${pathname}?${qs}` : pathname)
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[80] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed z-[81] bg-white shadow-2xl flex flex-col
                   inset-x-0 bottom-0 top-16 rounded-t-2xl
                   md:inset-y-0 md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-[440px] md:rounded-none
                   animate-[slideIn_250ms_ease-out]"
        style={{
          // Inline keyframes for the slide-in animation. Tailwind's `animate-`
          // utility above references `slideIn`; we provide it via a <style> tag
          // since the project doesn't have a custom keyframe in tailwind config.
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @media (max-width: 767px) {
            @keyframes slideIn {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 -mr-2 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body (scrollable) */}
        <div ref={sheetBodyRef} className="flex-1 overflow-y-auto">
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

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-5 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline"
          >
            Reset all
          </button>
          <button
            type="button"
            onClick={commit}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-60"
            disabled={counting && count === null}
          >
            {count === 0 ? 'No homes match' : counting && count === null ? 'Loading…' : `See ${(count ?? 0).toLocaleString()} homes`}
          </button>
        </div>
      </div>
    </>
  )
}
