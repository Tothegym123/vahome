'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'
import NeighborhoodToursTab from './NeighborhoodToursTab'

type Lead = {
  id: string
  email: string
  created_at: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  tour_requests: number
  favorites: number
  last_active: string | null
}

type TourRequest = {
  id: string
  mls_number: string
  metadata: any
  created_at: string
  user_id: string | null
}

type Activity = {
  id: string
  action_type: string
  mls_number: string | null
  metadata: any
  created_at: string
  user_id: string | null
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'leads' | 'tours' | 'activity' | 'neighborhood_tours' | 'waitlist'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [tours, setTours] = useState<TourRequest[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [waitlistRows, setWaitlistRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalLeads: 0, totalTours: 0, totalFavorites: 0, newLeadsToday: 0 })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthenticated(true)
        loadData()
      } else if (res.status === 401) {
        setError('Invalid password')
      } else {
        setError('Server error \u2014 check ADMIN_PASSWORD env var on Vercel')
      }
    } catch (err) {
      setError('Network error \u2014 please try again')
    }
  }

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, updated_at')
        .order('updated_at', { ascending: false })

      const { data: tourRequests } = await supabase
        .from('search_activity')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: savedListings } = await supabase
        .from('saved_listings')
        .select('*')

      const { data: waitlistData } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })
      setWaitlistRows(waitlistData || [])

      const allTours = tourRequests?.filter(t => t.action_type === 'tour_request') || []

      const leadMap = new Map<string, Lead>()

      profiles?.forEach(p => {
        leadMap.set(p.id, {
          id: p.id,
          email: '',
          created_at: p.updated_at || '',
          first_name: p.first_name,
          last_name: p.last_name,
          phone: p.phone,
          tour_requests: 0,
          favorites: 0,
          last_active: p.updated_at,
        })
      })

      allTours.forEach(t => {
        if (t.user_id && leadMap.has(t.user_id)) {
          const lead = leadMap.get(t.user_id)!
          lead.tour_requests++
          if (!lead.last_active || t.created_at > lead.last_active) lead.last_active = t.created_at
          if (!lead.email && t.metadata?.email) lead.email = t.metadata.email
          if (!lead.phone && t.metadata?.phone) lead.phone = t.metadata.phone
          if (!lead.first_name && t.metadata?.name) lead.first_name = t.metadata.name
        } else {
          const key = t.metadata?.email || t.id
          if (!leadMap.has(key)) {
            leadMap.set(key, {
              id: t.id,
              email: t.metadata?.email || '',
              created_at: t.created_at,
              first_name: t.metadata?.name || 'Anonymous',
              last_name: null,
              phone: t.metadata?.phone || null,
              tour_requests: 1,
              favorites: 0,
              last_active: t.created_at,
            })
          } else {
            leadMap.get(key)!.tour_requests++
          }
        }
      })

      savedListings?.forEach(s => {
        if (s.user_id && leadMap.has(s.user_id)) {
          leadMap.get(s.user_id)!.favorites++
        }
      })

      const allLeads = Array.from(leadMap.values()).sort((a, b) =>
        (b.last_active || '').localeCompare(a.last_active || '')
      )

      const today = new Date().toISOString().split('T')[0]
      const newToday = allLeads.filter(l => l.created_at?.startsWith(today)).length

      setLeads(allLeads)
      setTours(allTours)
      setActivities(tourRequests || [])
      setStats({
        totalLeads: allLeads.length,
        totalTours: allTours.length,
        totalFavorites: savedListings?.length || 0,
        newLeadsToday: newToday,
      })
    } catch (err) {
      console.error('Error loading admin data:', err)
    }

    setLoading(false)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return diffMins + 'm ago'
    if (diffHours < 24) return diffHours + 'h ago'
    if (diffDays < 7) return diffDays + 'd ago'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getLeadScore = (lead: Lead) => {
    let score = 0
    score += lead.tour_requests * 30
    score += lead.favorites * 10
    if (lead.phone) score += 15
    if (lead.email) score += 10
    return Math.min(score, 100)
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-gray-400'
  }

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'tour_request': return 'Tour Request'
      case 'search': return 'Search'
      case 'page_view': return 'Page View'
      case 'favorite': return 'Saved Home'
      default: return type
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'tour_request': return 'bg-green-50 text-green-700'
      case 'search': return 'bg-blue-50 text-blue-700'
      case 'favorite': return 'bg-red-50 text-red-600'
      default: return 'bg-gray-50 text-gray-600'
    }
  }

  // Password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">VaHome Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-2xl font-bold">VaHome</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadData} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Refresh Data
            </button>
            <button onClick={() => setAuthenticated(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-medium">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
            {stats.newLeadsToday > 0 && (
              <p className="text-xs text-green-600 mt-1">+{stats.newLeadsToday} today</p>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-medium">Tour Requests</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalTours}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-medium">Saved Homes</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{stats.totalFavorites}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.totalLeads > 0 ? Math.round((stats.totalTours / Math.max(stats.totalLeads, 1)) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Tours / Leads</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-white rounded-t-xl border border-gray-200 border-b-0">
          <div className="flex border-b border-gray-200">
            {([
              { key: 'leads' as const, label: 'All Leads', count: leads.length },
              { key: 'tours' as const, label: 'Tour Requests', count: tours.length },
              { key: 'activity' as const, label: 'Activity Log', count: activities.length },
          { key: 'waitlist' as const, label: 'Waitlist', count: waitlistRows.length },
              { key: 'neighborhood_tours' as const, label: 'Video Links', count: 0 },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              {/* Leads Tab */}
              {activeTab === 'leads' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Score</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tours</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Favorites</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No leads yet</td></tr>
                      ) : (
                        leads.map((lead) => {
                          const score = getLeadScore(lead)
                          return (
                            <tr key={lead.id} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                                    {(lead.first_name || '?')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                      {lead.first_name || 'Unknown'} {lead.last_name || ''}
                                    </p>
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                      {lead.tour_requests > 0 ? 'Buyer' : 'Visitor'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{lead.email || '-'}</p>
                                <p className="text-sm text-gray-500">{lead.phone || '-'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                              </td>
                              <td className="px-6 py-4">
                                {lead.tour_requests > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                    {lead.tour_requests}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">0</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {lead.favorites > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                    {lead.favorites}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">0</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(lead.last_active)}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  {lead.tour_requests > 0 ? 'Tour Form' : 'Website'}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tour Requests Tab */}
              {activeTab === 'tours' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour Type</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Date</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MLS#</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tours.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No tour requests yet</td></tr>
                      ) : (
                        tours.map((tour) => (
                          <tr key={tour.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(tour.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900 text-sm">{tour.metadata?.name || 'Anonymous'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">{tour.metadata?.email || '-'}</p>
                              <p className="text-sm text-gray-500">{tour.metadata?.phone || '-'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900 max-w-[200px] truncate">{tour.metadata?.listing_address || '-'}</p>
                              {tour.metadata?.listing_price && (
                                <p className="text-sm text-green-600 font-medium">
                                  {'$'}{typeof tour.metadata.listing_price === 'number'
                                    ? tour.metadata.listing_price.toLocaleString()
                                    : tour.metadata.listing_price}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                tour.metadata?.tour_type === 'in-person'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-purple-50 text-purple-700'
                              }`}>
                                {tour.metadata?.tour_type === 'in-person' ? 'In Person' : tour.metadata?.tour_type || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {typeof tour.metadata?.date === 'object' ? (tour.metadata.date.dayName + ' ' + tour.metadata.date.monthDay) : (tour.metadata?.date || '-')} {tour.metadata?.time || ''}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tour.mls_number}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Activity Log Tab */}
              {activeTab === 'neighborhood_tours' && (
            <div className="p-6">
              <NeighborhoodToursTab />
            </div>
          )}

          {activeTab === 'activity' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MLS#</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activities.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No activity yet</td></tr>
                      ) : (
                        activities.map((act) => (
                          <tr key={act.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(act.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(act.action_type)}`}>
                                {getActionLabel(act.action_type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {act.metadata?.name || act.metadata?.email || (act.user_id ? act.user_id.slice(0, 8) + '...' : 'Anonymous')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{act.mls_number || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[300px] truncate">
                              {act.metadata?.listing_address || act.metadata?.search_criteria || JSON.stringify(act.metadata || {}).slice(0, 80)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            
            {/* Waitlist Tab */}
            {activeTab === 'waitlist' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {waitlistRows.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No waitlist submissions yet</td></tr>
                    ) : (
                      waitlistRows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${row.type === 'agent' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                              {row.type === 'agent' ? 'Agent' : 'Lender'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{row.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{row.phone || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
</>
          )}
        </div>
      </div>
    </div>
  )
}
