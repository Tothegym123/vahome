'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '../components/AuthProvider'
import { createClient } from '../lib/supabase/client'
import { sampleListings, getListingUrl, formatPriceFull, getFullAddress } from '../lib/listings'
import type { Listing } from '../lib/listings'
import FavoriteButton from '../components/FavoriteButton'

interface FavItem {
  id: string
  mls_number: string
  saved_at: string
  listing?: Listing
  order: number
}

export default function MyHomesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('saved_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (data) {
        const enriched: FavItem[] = data.map((fav, i) => {
          const listing = sampleListings.find(l => l.id.toString() === fav.mls_number)
          return { ...fav, listing, order: i }
        })
        setFavorites(enriched)
      }
      setLoading(false)
    }
    fetchFavorites()
  }, [user])

  const handleDragStart = useCallback((idx: number) => {
    dragItem.current = idx
    setDraggedIdx(idx)
  }, [])

  const handleDragEnter = useCallback((idx: number) => {
    dragOverItem.current = idx
    setDragOverIdx(idx)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) {
      setDraggedIdx(null)
      setDragOverIdx(null)
      return
    }
    const items = [...favorites]
    const draggedItem = items[dragItem.current]
    items.splice(dragItem.current, 1)
    items.splice(dragOverItem.current, 0, draggedItem)
    setFavorites(items)
    dragItem.current = null
    dragOverItem.current = null
    setDraggedIdx(null)
    setDragOverIdx(null)
  }, [favorites])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Touch drag support
  const touchStartRef = useRef<{ idx: number; startY: number; startX: number } | null>(null)
  const [touchDragIdx, setTouchDragIdx] = useState<number | null>(null)

  const handleTouchStart = useCallback((idx: number, e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { idx, startY: touch.clientY, startX: touch.clientX }
    dragItem.current = idx
    setDraggedIdx(idx)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.touches[0]
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const tileEl = elements.find(el => el.getAttribute('data-tile-idx'))
    if (tileEl) {
      const overIdx = parseInt(tileEl.getAttribute('data-tile-idx') || '-1')
      if (overIdx >= 0) {
        dragOverItem.current = overIdx
        setDragOverIdx(overIdx)
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    handleDragEnd()
    touchStartRef.current = null
    setTouchDragIdx(null)
  }, [handleDragEnd])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedListings = favorites.filter(f => selected.has(f.id) && f.listing).map(f => f.listing!)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Sign in to see My Homes</h1>
          <p className="text-gray-500 mb-6">Create an account or sign in to save and compare your favorite homes.</p>
          <Link href="/" className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Homes</h1>
            <p className="text-gray-500 mt-1">{favorites.length} saved home{favorites.length !== 1 ? 's' : ''} &middot; Drag to rearrange</p>
          </div>
          <div className="flex items-center gap-3">
            {favorites.length >= 2 && (
              <button
                onClick={() => { setCompareMode(!compareMode); setSelected(new Set()) }}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  compareMode
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {compareMode ? 'Done Comparing' : 'Compare Homes'}
              </button>
            )}
            <Link href="/map" className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
              Browse More
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">No saved homes yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Start browsing listings and tap the heart icon to save homes you love. They will appear here as draggable tiles you can rearrange and compare.</p>
            <Link href="/map" className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
              Start Browsing
            </Link>
          </div>
        ) : (
          <>
            {/* Draggable tile grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav, idx) => {
                const l = fav.listing
                const isDragging = draggedIdx === idx
                const isDragOver = dragOverIdx === idx && draggedIdx !== idx
                const isSelected = selected.has(fav.id)

                return (
                  <div
                    key={fav.id}
                    data-tile-idx={idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragEnter={() => handleDragEnter(idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onTouchStart={(e) => handleTouchStart(idx, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => compareMode && toggleSelect(fav.id)}
                    className={`
                      relative bg-white rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-200 cursor-grab active:cursor-grabbing select-none
                      ${isDragging ? 'opacity-40 scale-95 border-red-300 rotate-1' : ''}
                      ${isDragOver ? 'border-red-500 shadow-lg scale-[1.02] -translate-y-1' : 'border-transparent'}
                      ${compareMode && isSelected ? 'ring-3 ring-red-500 border-red-500' : ''}
                      ${compareMode ? 'cursor-pointer' : ''}
                      hover:shadow-md hover:-translate-y-0.5
                    `}
                  >
                    {/* Compare checkbox */}
                    {compareMode && (
                      <div className={`absolute top-3 left-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-white/90 text-transparent border-2 border-gray-300'
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Drag handle indicator */}
                    <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{opacity: isDragging ? 1 : undefined}}>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                      </svg>
                    </div>

                    {l ? (
                      <>
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={l.img}
                            alt={getFullAddress(l)}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <span className="text-white text-2xl font-black drop-shadow-lg">{formatPriceFull(l.price)}</span>
                          </div>
                          <div className="absolute top-3 right-3 z-10">
                            <FavoriteButton listingId={l.id} listingData={l} size="sm" />
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              l.status?.toLowerCase() === 'active' ? 'bg-green-500 text-white' :
                              l.status?.toLowerCase() === 'pending' ? 'bg-yellow-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>{l.status}</span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <span className="font-semibold">{l.beds} bd</span>
                            <span className="text-gray-300">|</span>
                            <span className="font-semibold">{l.baths} ba</span>
                            <span className="text-gray-300">|</span>
                            <span className="font-semibold">{l.sqft.toLocaleString()} sqft</span>
                            {l.yearBuilt && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span>{l.yearBuilt}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 font-medium">{l.address}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{l.city}, {l.state} {l.zip}</p>
                          {!compareMode && (
                            <Link
                              href={getListingUrl(l)}
                              className="mt-3 inline-block text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Details &rarr;
                            </Link>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="p-6">
                        <p className="font-semibold text-gray-900">MLS# {fav.mls_number}</p>
                        <p className="text-sm text-gray-500 mt-1">Listing data not available</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Comparison panel */}
            {compareMode && selectedListings.length >= 2 && (
              <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                  <h2 className="text-lg font-bold text-gray-900">Side-by-Side Comparison</h2>
                  <p className="text-sm text-gray-500">{selectedListings.length} homes selected</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-gray-500 font-medium w-40">Feature</th>
                        {selectedListings.map(l => (
                          <th key={l.id} className="text-center px-4 py-3 min-w-[180px]">
                            <img src={l.img} alt={l.address} className="w-full h-24 object-cover rounded-lg mb-2" />
                            <span className="text-xs text-gray-700 font-semibold">{l.address}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Price', fn: (l: Listing) => formatPriceFull(l.price) },
                        { label: 'Beds', fn: (l: Listing) => `${l.beds}` },
                        { label: 'Baths', fn: (l: Listing) => `${l.baths}${l.halfBaths ? ` + ${l.halfBaths} half` : ''}` },
                        { label: 'Sq Ft', fn: (l: Listing) => l.sqft.toLocaleString() },
                        { label: 'Year Built', fn: (l: Listing) => `${l.yearBuilt}` },
                        { label: 'Lot Size', fn: (l: Listing) => l.lotSize },
                        { label: 'Garage', fn: (l: Listing) => l.garage ? `${l.garage}-car` : 'None' },
                        { label: 'Type', fn: (l: Listing) => l.type },
                        { label: 'HOA', fn: (l: Listing) => l.hoaFee ? `$${l.hoaFee}/${l.hoaFrequency}` : 'None' },
                        { label: 'Tax', fn: (l: Listing) => `$${l.taxAmount.toLocaleString()}/yr` },
                        { label: 'City', fn: (l: Listing) => l.city },
                        { label: 'Status', fn: (l: Listing) => l.status },
                        { label: 'Days on Market', fn: (l: Listing) => `${l.daysOnMarket}` },
                        { label: 'Price/sqft', fn: (l: Listing) => `$${Math.round(l.price / l.sqft)}` },
                      ].map(row => (
                        <tr key={row.label} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-2.5 font-medium text-gray-600">{row.label}</td>
                          {selectedListings.map(l => (
                            <td key={l.id} className="px-4 py-2.5 text-center text-gray-900 font-medium">{row.fn(l)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {compareMode && selectedListings.length < 2 && selected.size > 0 && (
              <div className="mt-6 text-center text-gray-500 text-sm">
                Select at least 2 homes to compare
              </div>
            )}
            {compareMode && selected.size === 0 && (
              <div className="mt-6 text-center text-gray-500 text-sm">
                Tap on homes to select them for comparison
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
