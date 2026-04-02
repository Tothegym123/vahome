'use client'

import { useState } from 'react'

const searchTabs = [
  { label: 'Buy', active: true },
  { label: 'Sell', active: false },
  { label: 'Estimate', active: false },
  ]

export default function SearchBar() {
    const [activeTab, setActiveTab] = useState('Buy')
    const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Route to listings page with search query
        console.log('Search:', activeTab, query)
  }

  return (
        <div className="w-full max-w-2xl mx-auto">
          {/* Tabs */}
              <div className="flex gap-1 mb-3">
                {searchTabs.map((tab) => (
                    <button
                                  key={tab.label}
                                  onClick={() => setActiveTab(tab.label)}
                                  className={`px-6 py-2 rounded-t-lg text-sm font-semibold transition-all ${
                                                  activeTab === tab.label
                                                    ? 'bg-white text-primary-500 shadow-sm'
                                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                  }`}
                                >
                      {tab.label}
                    </button>button>
                  ))}
              </div>div>
        
          {/* Search Input */}
              <form onSubmit={handleSearch} className="relative">
                      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
                                <div className="flex-1 flex items-center px-5">
                                            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>svg>
                                            <input
                                                            type="text"
                                                            value={query}
                                                            onChange={(e) => setQuery(e.target.value)}
                                                            placeholder="City, Address, Zip, or Neighborhood"
                                                            className="w-full py-4 px-3 text-base text-gray-800 placeholder-gray-400 focus:outline-none"
                                                          />
                                </div>div>
                                <button
                                              type="submit"
                                              className="px-8 py-4 bg-primary-500 text-white font-semibold text-base hover:bg-primary-600 transition-colors"
                                            >
                                            Search
                                </button>button>
                      </div>div>
              </form>form>
        </div>div>
      )
}</div>
