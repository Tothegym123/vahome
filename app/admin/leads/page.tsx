'use client'

import { useState } from 'react'

const STAGES = [
  'New Leads',
  'Attempting Contact',
  'Hot (60 days)',
  'Warm (60-90 days)',
  'Cold/Nurturing',
  'Appointment Set',
  'Showing',
  'Under Contract',
  'Closed',
]

interface Lead {
  id: string
  first_name: string
  last_name: string | null
  email: string | null
  phone: string | null
  source: string | null
  source_detail: string | null
  pipeline_stage: string | null
  lead_score: number | null
  last_touch: string | null
  created_at: string
}

export default function AdminLeadsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function loadLeads(pw: string) {
    setLoading(true); setError(null)
    try {
      const r = await fetch('/api/admin/leads', { headers: { 'x-admin-password': pw } })
      if (r.status === 401) { setError('Invalid password'); setAuthed(false); return }
      const j = await r.json()
      setLeads(j.leads || [])
      setAuthed(true)
    } catch (e: any) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function updateStage(id: string, stage: string) {
    const r = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'x-admin-password': password, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pipeline_stage: stage }),
    })
    if (r.ok) setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, pipeline_stage: stage } : l)))
  }

  if (!authed) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-sm w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold mb-4">VaHome Admin &mdash; Leads</h1>
          <p className="text-gray-500 text-sm mb-4">Enter admin password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadLeads(password)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="Password"
          />
          <button
            onClick={() => loadLeads(password)}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.pipeline_stage === filter)
  const counts: Record<string, number> = {}
  leads.forEach((l) => {
    const s = l.pipeline_stage || 'New Leads'
    counts[s] = (counts[s] || 0) + 1
  })

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 text-sm">{leads.length} total &middot; {counts['New Leads'] || 0} new</p>
          </div>
          <button
            onClick={() => loadLeads(password)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}
          >
            All ({leads.length})
          </button>
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}
            >
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Stage</th>
                <th className="text-left px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {lead.first_name} {lead.last_name || ''}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {lead.email && <div>{lead.email}</div>}
                    {lead.phone && <div>{lead.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.source || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.pipeline_stage || 'New Leads'}
                      onChange={(e) => updateStage(lead.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    No leads in this stage yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
