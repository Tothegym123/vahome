'use client'

// app/components/filters/ActiveFilterChips.tsx
// =============================================================================
// Removable chips below the filter bar showing each currently-active filter.
// Clicking the X removes that filter and pushes a new URL.
// =============================================================================

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  parseFiltersFromSearchParams,
  serializeFiltersToQueryString,
  PROPERTY_TYPES,
  type Filters,
} from '../../lib/listing-filters'

function fmtPriceShort(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    return '$' + (Math.round(m * 10) / 10) + 'M'
  }
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'k'
  return '$' + n
}

type Chip = { key: string; label: string; clear: (f: Filters) => Filters }

function buildChips(f: Filters): Chip[] {
  const out: Chip[] = []

  if (f.min_price !== undefined || f.max_price !== undefined) {
    const lo = f.min_price !== undefined ? fmtPriceShort(f.min_price) : 'Any'
    const hi = f.max_price !== undefined ? fmtPriceShort(f.max_price) : 'Any'
    out.push({
      key: 'price',
      label: `Price: ${lo}–${hi}`,
      clear: (curr) => ({ ...curr, min_price: undefined, max_price: undefined }),
    })
  }
  if (f.beds !== undefined || f.max_beds !== undefined) {
    let label: string
    if (f.beds !== undefined && f.max_beds !== undefined) label = `${f.beds}–${f.max_beds} beds`
    else if (f.beds !== undefined) label = `${f.beds}+ beds`
    else label = `up to ${f.max_beds} beds`
    out.push({
      key: 'beds',
      label,
      clear: (curr) => ({ ...curr, beds: undefined, max_beds: undefined }),
    })
  }
  if (f.baths !== undefined) {
    out.push({
      key: 'baths',
      label: `${f.baths}+ baths`,
      clear: (curr) => ({ ...curr, baths: undefined }),
    })
  }
  if (f.type && f.type.length > 0) {
    f.type.forEach((t) => {
      const found = PROPERTY_TYPES.find((p) => p.value === t)
      out.push({
        key: `type:${t}`,
        label: found ? found.label : t,
        clear: (curr) => {
          const remaining = (curr.type || []).filter((v) => v !== t)
          return { ...curr, type: remaining.length > 0 ? remaining : undefined }
        },
      })
    })
  }
  if (f.min_sqft !== undefined || f.max_sqft !== undefined) {
    const lo = f.min_sqft !== undefined ? f.min_sqft.toLocaleString() : 'Any'
    const hi = f.max_sqft !== undefined ? f.max_sqft.toLocaleString() : 'Any'
    out.push({
      key: 'sqft',
      label: `${lo}–${hi} sqft`,
      clear: (curr) => ({ ...curr, min_sqft: undefined, max_sqft: undefined }),
    })
  }
  if (f.min_year !== undefined || f.max_year !== undefined) {
    const lo = f.min_year !== undefined ? String(f.min_year) : 'Any'
    const hi = f.max_year !== undefined ? String(f.max_year) : 'Any'
    out.push({
      key: 'year',
      label: `Built ${lo}–${hi}`,
      clear: (curr) => ({ ...curr, min_year: undefined, max_year: undefined }),
    })
  }
  if (f.status && f.status.length > 0) {
    out.push({
      key: 'status',
      label: `Status: ${f.status.join(', ')}`,
      clear: (curr) => ({ ...curr, status: undefined }),
    })
  }
  if (f.dom_max !== undefined) {
    out.push({
      key: 'dom',
      label: `≤ ${f.dom_max} days on market`,
      clear: (curr) => ({ ...curr, dom_max: undefined }),
    })
  }
  return out
}

export default function ActiveFilterChips() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const spObj: Record<string, string> = {}
  searchParams.forEach((v: string, k: string) => { spObj[k] = v })
  const filters = parseFiltersFromSearchParams(spObj)

  const chips = buildChips(filters)
  if (chips.length === 0) return null

  const remove = (chip: Chip) => {
    const next = chip.clear(filters)
    next.page = undefined
    const qs = serializeFiltersToQueryString(next)
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const clearAll = () => {
    // Preserve `q` and `city` (search input + URL-routed city slug); clear filters.
    const next: Filters = { q: filters.q, city: filters.city }
    const qs = serializeFiltersToQueryString(next)
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium"
        >
          {c.label}
          <button
            type="button"
            aria-label={`Remove ${c.label}`}
            onClick={() => remove(c)}
            className="ml-1 text-red-500 hover:text-red-700"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
