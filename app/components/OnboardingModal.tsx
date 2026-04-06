'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import { useAuth } from './AuthProvider'

const militaryBasesList = [
  { name: 'Naval Station Norfolk', shortName: 'NS Norfolk', branch: 'Navy', lat: 36.9466, lng: -76.3036 },
  { name: 'NAS Oceana', shortName: 'NAS Oceana', branch: 'Navy', lat: 36.8207, lng: -76.0331 },
  { name: 'Dam Neck Annex', shortName: 'Dam Neck', branch: 'Navy', lat: 36.7920, lng: -75.9710 },
  { name: 'JEB Little Creek-Fort Story', shortName: 'Little Creek', branch: 'Navy', lat: 36.9178, lng: -76.1601 },
  { name: 'Naval Medical Center Portsmouth', shortName: 'NMCP', branch: 'Navy', lat: 36.8446, lng: -76.3039 },
  { name: 'Norfolk Naval Shipyard', shortName: 'NNSY', branch: 'Navy', lat: 36.8271, lng: -76.2946 },
  { name: 'NSA Hampton Roads', shortName: 'NSA HR', branch: 'Navy', lat: 36.9480, lng: -76.3350 },
  { name: 'Naval Weapons Station Yorktown', shortName: 'NWS Yorktown', branch: 'Navy', lat: 37.2317, lng: -76.5636 },
  { name: 'Joint Base Langley-Eustis (Langley AFB)', shortName: 'JBLE Langley', branch: 'Air Force', lat: 37.0832, lng: -76.3605 },
  { name: 'Joint Base Langley-Eustis (Fort Eustis)', shortName: 'JBLE Ft Eustis', branch: 'Army', lat: 37.1518, lng: -76.5879 },
  { name: 'Joint Staff J7 Suffolk', shortName: 'J7 Suffolk', branch: 'Joint', lat: 36.7282, lng: -76.5836 },
  { name: 'Camp Peary', shortName: 'Camp Peary', branch: 'DoD', lat: 37.2905, lng: -76.6158 },
  { name: 'USCG Base Portsmouth', shortName: 'USCG Portsmouth', branch: 'Coast Guard', lat: 36.8354, lng: -76.2932 },
  { name: 'MARFORCOM Norfolk', shortName: 'MARFORCOM', branch: 'Marines', lat: 36.9460, lng: -76.3130 },
]

export default function OnboardingModal() {
  const { user, showOnboarding, setShowOnboarding, refreshProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<'civilian' | 'military'>('civilian')
  const [selectedBase, setSelectedBase] = useState('')
  const [workAddress1, setWorkAddress1] = useState('')
  const [workAddress2, setWorkAddress2] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const handleFinish = useCallback(async () => {
    if (!user) return
    setSaving(true)
    try {
      const base = militaryBasesList.find(b => b.shortName === selectedBase)
      const updates: Record<string, unknown> = {
        mode,
        onboarding_complete: true,
        work_address_1: workAddress1 || null,
        work_address_2: workAddress2 || null,
      }
      if (base) {
        updates.selected_base = JSON.stringify(base)
        try { localStorage.setItem('vahome_selected_base', JSON.stringify(base)) } catch {}
      }
      if (mode === 'military') {
        try { localStorage.setItem('vahome-mode', 'military') } catch {}
      }
      await supabase.from('user_profiles').update(updates).eq('id', user.id)
      await refreshProfile()
      setShowOnboarding(false)
    } catch (err) {
      console.error('Onboarding save error:', err)
    }
    setSaving(false)
  }, [user, mode, selectedBase, workAddress1, workAddress2, supabase, refreshProfile, setShowOnboarding])

  if (!showOnboarding || !user) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="px-8 pt-8 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 && 'Welcome to VaHome!'}
              {step === 2 && (mode === 'military' ? 'Select Your Base' : 'Where Do You Work?')}
              {step === 3 && 'Work Addresses'}
            </h2>
            <button onClick={() => { setShowOnboarding(false); handleFinish() }} className="text-sm text-gray-400 hover:text-gray-600">Skip</button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && 'Help us personalize your experience. This takes 30 seconds.'}
            {step === 2 && mode === 'military' && 'We\'ll show you drive times to your base on every listing.'}
            {step === 2 && mode === 'civilian' && 'Add up to 2 work addresses for commute time calculations.'}
            {step === 3 && 'Add a second work address (optional).'}
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Step 1: Civilian or Military */}
          {step === 1 && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('civilian')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  mode === 'civilian' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-3xl">&#x1F3E0;</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Civilian</div>
                  <div className="text-sm text-gray-500">I&apos;m looking for a home in Hampton Roads</div>
                </div>
                {mode === 'civilian' && <svg className="w-6 h-6 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              </button>
              <button
                onClick={() => setMode('military')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  mode === 'military' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-3xl">&#x1F396;&#xFE0F;</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Military / DoD</div>
                  <div className="text-sm text-gray-500">I&apos;m PCS-ing or stationed in Hampton Roads</div>
                </div>
                {mode === 'military' && <svg className="w-6 h-6 text-amber-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              </button>
            </div>
          )}

          {/* Step 2: Base selection (military) or Work address 1 (civilian) */}
          {step === 2 && mode === 'military' && (
            <div>
              <select
                value={selectedBase}
                onChange={(e) => setSelectedBase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
              >
                <option value="">Choose your duty station...</option>
                {militaryBasesList.map((base) => (
                  <option key={base.shortName} value={base.shortName}>
                    {base.name} ({base.branch})
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Address <span className="text-gray-400">(optional)</span></label>
                <input
                  type="text"
                  value={workAddress1}
                  onChange={(e) => setWorkAddress1(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  placeholder="e.g., 123 Main St, Norfolk, VA"
                />
              </div>
            </div>
          )}

          {step === 2 && mode === 'civilian' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Address 1</label>
              <input
                type="text"
                value={workAddress1}
                onChange={(e) => setWorkAddress1(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="e.g., 123 Main St, Norfolk, VA"
              />
              <p className="text-xs text-gray-400 mt-2">We&apos;ll calculate drive times from listings to your workplace.</p>
            </div>
          )}

          {/* Step 3: Second work address */}
          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Address 2 <span className="text-gray-400">(optional)</span></label>
              <input
                type="text"
                value={workAddress2}
                onChange={(e) => setWorkAddress2(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                placeholder="e.g., 456 Commerce Blvd, Virginia Beach, VA"
              />
              <p className="text-xs text-gray-400 mt-2">Add a second location if your household has two workplaces.</p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="px-8 pb-8 flex justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Back</button>
          ) : <div />}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Finish Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
