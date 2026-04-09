'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface SearchResult {
  name: string
  fullAddress: string
  mapboxId: string
  lng: number
  lat: number
  featureType: string
}

interface Props {
  onSelect: (result: SearchResult) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

// Hampton Roads center — biases suggestions toward local results
const PROXIMITY = '-76.26,36.86'
const COUNTRY = 'us'
const TYPES = 'address,place,locality,postcode,neighborhood,street'
const SESSION_IDLE_MS = 2 * 60 * 1000
const DEBOUNCE_MS = 200

function makeToken() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function MapboxSearchInput({
  onSelect,
  placeholder = 'Search by address, neighborhood, or city',
  className = '',
  inputClassName = '',
}: Props) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const sessionRef = useRef<{ token: string; lastUsed: number }>({
    token: makeToken(),
    lastUsed: Date.now(),
  })
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getSessionToken = useCallback(() => {
    const now = Date.now()
    if (now - sessionRef.current.lastUsed > SESSION_IDLE_MS) {
      sessionRef.current.token = makeToken()
    }
    sessionRef.current.lastUsed = now
    return sessionRef.current.token
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query || query.trim().length < 2) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const token = getSessionToken()
        const url =
          'https://api.mapbox.com/search/searchbox/v1/suggest' +
          '?q=' + encodeURIComponent(query) +
          '&language=en' +
          '&country=' + COUNTRY +
          '&proximity=' + PROXIMITY +
          '&types=' + TYPES +
          '&session_token=' + token +
          '&access_token=' + process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        const resp = await fetch(url)
        if (!resp.ok) throw new Error('Mapbox suggest ' + resp.status)
        const data = await resp.json()
        setSuggestions(data.suggestions || [])
        setOpen(true)
      } catch (e) {
        // Silent fail — log only
        // eslint-disable-next-line no-console
        console.warn('MapboxSearchInput suggest error:', e)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, getSessionToken])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleSelect = useCallback(
    async (sug: any) => {
      try {
        const token = getSessionToken()
        const url =
          'https://api.mapbox.com/search/searchbox/v1/retrieve/' + sug.mapbox_id +
          '?session_token=' + token +
          '&access_token=' + process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        const resp = await fetch(url)
        if (!resp.ok) throw new Error('Mapbox retrieve ' + resp.status)
        const data = await resp.json()
        const feat = data.features?.[0]
        if (!feat) return
        const [lng, lat] = feat.geometry.coordinates
        onSelect({
          name: feat.properties?.name || sug.name || '',
          fullAddress:
            feat.properties?.full_address ||
            feat.properties?.place_formatted ||
            sug.full_address ||
            sug.place_formatted ||
            '',
          mapboxId: sug.mapbox_id,
          lng,
          lat,
          featureType: feat.properties?.feature_type || sug.feature_type || '',
        })
        setQuery(feat.properties?.name || sug.name || '')
        setOpen(false)
        // Rotate session — retrieve closes the billable session per Mapbox docs
        sessionRef.current = { token: makeToken(), lastUsed: Date.now() }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('MapboxSearchInput retrieve error:', e)
      }
    },
    [getSessionToken, onSelect]
  )

  return (
    <div ref={containerRef} className={'relative ' + className}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        placeholder={placeholder}
        className={
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ' +
          inputClassName
        }
      />
      {loading && (
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          Searching...
        </div>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((s: any) => (
            <li key={s.mapbox_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                {(s.place_formatted || s.full_address) && (
                  <div className="truncate text-xs text-gray-500">
                    {s.place_formatted || s.full_address}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
