'use client'

import { useAuth } from './AuthProvider'

type Props = {
  title: string
  description: string
  icon: string
  isMilitary?: boolean
  children: React.ReactNode
}

export default function PremiumTeaser({ title, description, icon, isMilitary = false, children }: Props) {
  const { setShowAuthModal, setAuthView } = useAuth()

  const handleUnlock = () => {
    setAuthView('register')
    setShowAuthModal(true)
  }

  const accent = isMilitary ? '#C5A55A' : '#dc2626'
  const accentBg = isMilitary ? 'rgba(197,165,90,0.06)' : 'rgba(220,38,38,0.04)'

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${isMilitary ? 'rgba(197,165,90,0.15)' : '#fee2e2'}` }}>
      {/* Blurred preview */}
      <div className="filter blur-[3px] opacity-60 pointer-events-none select-none">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentBg} 0%, rgba(255,255,255,0.95) 50%, ${accentBg} 100%)` }}>
        <div className="text-center px-6 max-w-sm">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: accentBg }}>
            <span className="text-2xl">{icon}</span>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-5">{description}</p>
          <button
            onClick={handleUnlock}
            className="px-8 py-3 text-sm font-bold text-white rounded-xl transition-colors shadow-lg hover:shadow-xl"
            style={{ background: accent }}
          >
            <svg className="w-4 h-4 inline mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Sign Up to Unlock
          </button>
        </div>
      </div>
    </div>
  )
}
