'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../components/AuthProvider'
import { createClient } from '../../lib/supabase/client'

export default function SearchesPage() {
  const { user } = useAuth()
  const [searches, setSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()

    const fetchSearches = async () => {
      const { data } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setSearches(data)
      setLoading(false)
    }

    fetchSearches()
  }, [user])

  const toggleAlert = async (searchId: string, currentState: boolean) => {
    const supabase = createClient()
    await supabase
      .from('saved_searches')
      .update({ alert_enabled: !currentState })
      .eq('id', searchId)

    setSearches(prev =>
      prev.map(s => s.id === searchId ? { ...s, alert_enabled: !currentState } : s)
    )
  }

  const deleteSearch = async (searchId: string) => {
    const supabase = createClient()
    await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId)

    setSearches(prev => prev.filter(s => s.id !== searchId))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
        <span className="text-sm text-gray-500">{searches.length} saved</span>
      </div>

      {searches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved searches yet</h3>
          <p className="text-gray-500 mb-6">Save your search criteria on the map page to get notified about new listings.</p>
          <a href="/map" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
            Search Homes
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map(search => {
            const criteria = search.criteria || {}
            return (
              <div key={search.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{search.name || 'Untitled Search'}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {criteria.city && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {criteria.city}
                        </span>
                      )}
                      {criteria.minPrice != null && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          ${(criteria.minPrice / 1000).toFixed(0)}K - ${((criteria.maxPrice || 5000000) / 1000).toFixed(0)}K
                        </span>
                      )}
                      {criteria.minBeds != null && criteria.minBeds > 0 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {criteria.minBeds}+ beds
                        </span>
                      )}
                      {criteria.type && criteria.type !== 'all' && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                          {criteria.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSearch(search.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlert(search.id, search.alert_enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        search.alert_enabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        search.alert_enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="text-sm text-gray-600">
                      {search.alert_enabled ? 'Alerts on' : 'Alerts off'}
                    </span>
                    {search.alert_enabled && (
                      <span className="text-xs text-gray-400 capitalize">({search.alert_frequency})</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    Saved {new Date(search.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
