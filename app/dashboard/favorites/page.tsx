'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/AuthProvider'
import { createClient } from '../../lib/supabase/client'
import { sampleListings, getListingUrl, formatPriceFull, getFullAddress } from '../../lib/listings'
import type { Listing } from '../../lib/listings'
import FavoriteButton from '../../components/FavoriteButton'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        const enriched = data.map(fav => {
          const listing = sampleListings.find(l => l.id.toString() === fav.mls_number)
          return { ...fav, listing }
        })
        setFavorites(enriched)
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Saved Homes</h1>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Homes</h1>
        <span className="text-sm text-gray-500">{favorites.length} saved</span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved homes yet</h3>
          <p className="text-gray-500 mb-6">Start browsing and tap the heart icon to save homes you love.</p>
          <a href="/map/" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Browse Homes
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map(fav => {
            const l = fav.listing as Listing | undefined
            if (!l) {
              return (
                <div key={fav.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">MLS# {fav.mls_number}</p>
                      <p className="text-sm text-gray-500">Saved {new Date(fav.saved_at).toLocaleDateString()}</p>
                    </div>
                    <FavoriteButton listingId={Number(fav.mls_number)} size="sm" />
                  </div>
                </div>
              )
            }
            return (
              <a key={fav.id} href={getListingUrl(l)} className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="relative w-36 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={l.img} alt={getFullAddress(l)} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <FavoriteButton listingId={l.id} listingData={l} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-xl font-bold text-gray-900">{formatPriceFull(l.price)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        l.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {l.beds} bd | {l.baths} ba | {l.sqft.toLocaleString()} sqft
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{getFullAddress(l)}</p>
                    <p className="text-xs text-gray-400 mt-2">Saved {new Date(fav.saved_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
