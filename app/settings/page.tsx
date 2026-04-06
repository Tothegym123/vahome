'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { createClient } from '@/app/lib/supabase/client'
import Link from 'next/link'

const militaryBasesList = [
  { name: 'Naval Station Norfolk', lat: 36.9466, lng: -76.3036 },
  { name: 'JEB Little Creek-Fort Story', lat: 36.9167, lng: -76.1750 },
  { name: 'NAS Oceana', lat: 36.8207, lng: -76.0330 },
  { name: 'Dam Neck Annex', lat: 36.8057, lng: -75.9682 },
  { name: 'Naval Medical Center Portsmouth', lat: 36.8422, lng: -76.3008 },
  { name: 'Norfolk Naval Shipyard', lat: 36.8191, lng: -76.2946 },
  { name: 'Naval Weapons Station Yorktown', lat: 37.2279, lng: -76.5631 },
  { name: 'Fort Eustis', lat: 37.1578, lng: -76.5877 },
  { name: 'Langley AFB', lat: 37.0832, lng: -76.3605 },
  { name: 'Coast Guard Base Portsmouth', lat: 36.8354, lng: -76.2938 },
  { name: 'Camp Peary', lat: 37.3204, lng: -76.6149 },
  { name: 'Cheatham Annex', lat: 37.2458, lng: -76.5797 },
  { name: 'NMCP Annex', lat: 36.8464, lng: -76.3052 },
  { name: 'NSA Hampton Roads', lat: 36.9371, lng: -76.3366 },
]

export default function SettingsPage() {
  const { user, profile, loading, profileLoading, refreshProfile, setShowAuthModal, setAuthView } = useAuth()
  const supabase = createClient()

  const [mode, setMode] = useState<'civilian' | 'military'>('civilian')
  const [selectedBase, setSelectedBase] = useState('')
  const [workAddress1, setWorkAddress1] = useState('')
  const [workAddress2, setWorkAddress2] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (profile) {
      setMode(profile.mode || 'civilian')
      setSelectedBase(profile.selected_base || '')
      setWorkAddress1(profile.work_address_1 || '')
      setWorkAddress2(profile.work_address_2 || '')
    }
    if (user) {
      setFirstName(user.user_metadata?.first_name || '')
      setLastName(user.user_metadata?.last_name || '')
      setPhone(user.user_metadata?.phone || '')
    }
  }, [profile, user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaved(false)

    try {
      // Update user metadata
      await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName, phone }
      })

      // Update profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          mode,
          selected_base: mode === 'military' ? selectedBase : null,
          work_address_1: workAddress1 || null,
          work_address_2: workAddress2 || null,
          onboarding_complete: true,
        })
        .eq('id', user.id)

      if (error) throw error

      // Sync localStorage
      localStorage.setItem('vahome-mode', mode)
      if (mode === 'military' && selectedBase) {
        localStorage.setItem('vahome-selected-base', selectedBase)
      }

      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save settings. Please try again.')
    }
    setSaving(false)
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to access Settings</h1>
            <p className="text-gray-500 mb-6">Create a free account to personalize your home search experience.</p>
            <button
              onClick={() => { setAuthView('login'); setShowAuthModal(true) }}
              className="px-8 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isMil = mode === 'military'
  const accent = isMil ? '#C5A55A' : '#dc2626'

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Customize your VaHome experience</p>
        </div>

        {/* Success banner */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm font-medium text-green-800">Settings saved successfully!</span>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(757) 555-0100"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={user.email || ''} disabled
                className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Mode Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Mode
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMode('civilian')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${mode === 'civilian' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="text-2xl block mb-1">🏠</span>
              <span className={`text-sm font-bold ${mode === 'civilian' ? 'text-red-600' : 'text-gray-700'}`}>Civilian</span>
            </button>
            <button onClick={() => setMode('military')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${mode === 'military' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="text-2xl block mb-1">🎖️</span>
              <span className={`text-sm font-bold ${mode === 'military' ? 'text-yellow-700' : 'text-gray-700'}`}>Military</span>
            </button>
          </div>

          {/* Base selector for military */}
          {isMil && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Base / Installation</label>
              <select value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white">
                <option value="">Select your base...</option>
                {militaryBasesList.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Work Addresses Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Work Addresses
          </h2>
          <p className="text-sm text-gray-500 mb-4">We&apos;ll show drive times from listings to your work locations.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Address 1</label>
              <input type="text" value={workAddress1} onChange={(e) => setWorkAddress1(e.target.value)}
                placeholder="e.g. 123 Main St, Norfolk, VA 23510"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Address 2 <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" value={workAddress2} onChange={(e) => setWorkAddress2(e.target.value)}
                placeholder="e.g. 456 Commerce Ave, Virginia Beach, VA 23462"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          style={{ background: accent }}>
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Saving...
            </span>
          ) : 'Save Settings'}
        </button>

        {/* Danger zone */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</h3>
          <p className="text-sm text-gray-500">Need to delete your account? <a href="mailto:tom@vahomes.com" className="text-red-600 hover:text-red-700 font-medium">Contact us</a></p>
        </div>
      </div>
    </div>
  )
}
