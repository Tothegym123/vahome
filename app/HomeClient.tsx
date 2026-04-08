'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from './components/AuthProvider'
import MortgageCalculator from './components/MortgageCalculator'
import PremiumTeaser from './components/PremiumTeaser'

declare global {
  interface Window {
    _fadeObserver?: IntersectionObserver;
  }
}

const civPills = ['Virginia Beach', 'Under $350K', 'Waterfront', 'New Construction', 'Open Houses']
const milPills = [
  { label: 'Near Naval Air Station Oceana', icon: '\u{1F396}\uFE0F' },
  { label: 'Under BAH', icon: '\u{1F4B0}' },
  { label: 'Near Norfolk NS', icon: '\u2693' },
  { label: 'VA Loan Ready', icon: '' },
  { label: 'Near Joint Base Langley-Eustis', icon: '\u2708\uFE0F' },
  { label: 'Near Joint Expeditionary Base Little Creek', icon: '' },
]

const listings = [
  {
    address: '1247 Crossbow Lane', city: 'Chesapeake', state: 'VA', zip: '23322',
    price: '$425,000', beds: 4, baths: 3, sqft: '2,480',
    commute: '14 min to Naval Air Station Oceana',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    badge: 'New', badgeColor: 'bg-emerald-500',
  },
  {
    address: '834 Ocean Shore Ave', city: 'Virginia Beach', state: 'VA', zip: '23451',
    price: '$389,900', beds: 3, baths: 2.5, sqft: '1,920',
    commute: '8 min to Joint Expeditionary Base Little Creek',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    address: '2105 Harbor Point Dr', city: 'Norfolk', state: 'VA', zip: '23518',
    price: '$549,000', beds: 5, baths: 3.5, sqft: '3,200',
    commute: '11 min to Naval Station Norfolk',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    badge: 'Hot', badgeColor: 'bg-amber-500',
  },
]

const neighborhoods = [
  { name: 'Virginia Beach', count: 842, from: '$275K', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { name: 'Chesapeake', count: 631, from: '$245K', img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80' },
  { name: 'Norfolk', count: 487, from: '$195K', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80' },
  { name: 'Newport News', count: 394, from: '$180K', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80' },
  { name: 'Hampton', count: 289, from: '$165K', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80' },
  { name: 'Suffolk', count: 204, from: '$230K', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80' },
]

const bases = [
  { code: 'NS', name: 'Naval Station Norfolk', area: 'Norfolk', homes: '1,247' },
  { code: 'JB', name: 'Joint Expeditionary Base Little Creek-Fort Story', area: 'Virginia Beach', homes: '893' },
  { code: 'NO', name: 'Naval Air Station Oceana', area: 'Virginia Beach', homes: '756' },
  { code: 'LE', name: 'Joint Base Langley-Eustis', area: 'Hampton', homes: '438' },
  { code: 'NN', name: 'Newport News Shipbuilding', area: 'Newport News', homes: '512' },
]

const militaryBasesList = [
  { name: 'Naval Station Norfolk', shortName: 'Naval Station Norfolk', branch: 'Navy', lat: 36.9466, lng: -76.3036 },
  { name: 'Naval Air Station Oceana', shortName: 'Naval Air Station Oceana', branch: 'Navy', lat: 36.8207, lng: -76.0331 },
  { name: 'Dam Neck Annex', shortName: 'Dam Neck Annex', branch: 'Navy', lat: 36.7920, lng: -75.9710 },
  { name: 'Joint Expeditionary Base Little Creek-Fort Story', shortName: 'Joint Expeditionary Base Little Creek', branch: 'Navy', lat: 36.9178, lng: -76.1601 },
  { name: 'Naval Medical Center Portsmouth', shortName: 'Naval Medical Center Portsmouth', branch: 'Navy', lat: 36.8446, lng: -76.3039 },
  { name: 'Norfolk Naval Shipyard', shortName: 'Norfolk Naval Shipyard', branch: 'Navy', lat: 36.8271, lng: -76.2946 },
  { name: 'Naval Support Activity Hampton Roads', shortName: 'Naval Support Activity Hampton Roads', branch: 'Navy', lat: 36.9480, lng: -76.3350 },
  { name: 'Naval Weapons Station Yorktown', shortName: 'Naval Weapons Station Yorktown', branch: 'Navy', lat: 37.2317, lng: -76.5636 },
  { name: 'Joint Base Langley-Eustis (Langley Air Force Base)', shortName: 'Joint Base Langley-Eustis (Langley)', branch: 'Air Force', lat: 37.0832, lng: -76.3605 },
  { name: 'Joint Base Langley-Eustis (Fort Eustis)', shortName: 'Joint Base Langley-Eustis (Fort Eustis)', branch: 'Army', lat: 37.1518, lng: -76.5879 },
  { name: 'Joint Staff J7 Suffolk', shortName: 'Joint Staff J7 Suffolk', branch: 'Joint', lat: 36.7282, lng: -76.5836 },
  { name: 'Camp Peary', shortName: 'Camp Peary', branch: 'DoD', lat: 37.2905, lng: -76.6158 },
  { name: 'United States Coast Guard Base Portsmouth', shortName: 'Coast Guard Base Portsmouth', branch: 'Coast Guard', lat: 36.8354, lng: -76.2932 },
  { name: 'Marine Forces Command Norfolk', shortName: 'Marine Forces Command', branch: 'Marines', lat: 36.9460, lng: -76.3130 },
]

export default function HomeClient() {
  const { user, profile, setShowAuthModal, setAuthView, theme, setTheme } = useAuth()
  const [mode, setMode] = useState<'civilian' | 'military'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vahome-mode')
        if (stored === 'military') return 'military'
      } catch {}
    }
    return 'civilian'
  })
  const [flash, setFlash] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isMil = mode === 'military'
  const isLoggedIn = !!user

  // Base selector state (for military mode)
  const [selectedBaseIdx, setSelectedBaseIdx] = useState<number>(-1)

  // Sync mode with profile
  useEffect(() => {
    if (profile?.mode) {
      setMode(profile.mode)
    } else {
      try {
        const stored = localStorage.getItem('vahome-mode')
        if (stored === 'military') setMode('military')
      } catch {}
    }
  }, [profile])

  // Restore base selection
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vahome_selected_base')
      if (saved) {
        const base = JSON.parse(saved)
        const idx = militaryBasesList.findIndex(b => b.shortName === base.shortName)
        if (idx !== -1) setSelectedBaseIdx(idx)
      }
    } catch {}
  }, [])

  // Scroll reveal - re-observe on mode change, immediately reveal visible elements
  useEffect(() => {
    const els = wrapperRef.current?.querySelectorAll('.fade')
    if (!els) return

    // Reset all fade elements first
    els.forEach((el) => el.classList.remove('in'))

    // Small delay to allow CSS reset, then set up observer
    const raf = requestAnimationFrame(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('in'), i * 80)
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '50px' }
      )
      els.forEach((el) => observer.observe(el))
      window._fadeObserver = observer
    })
    return () => {
      cancelAnimationFrame(raf)
      if (window._fadeObserver) window._fadeObserver.disconnect()
    }
  }, [mode])

  const toggleMode = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
    setMode((prev) => {
      const next = prev === 'civilian' ? 'military' : 'civilian'
      try { localStorage.setItem('vahome-mode', next) } catch {}
      return next
    })
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'bright' ? 'dark' : 'bright')
  }, [theme, setTheme])

  const handleBaseSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value)
    setSelectedBaseIdx(idx)
    if (idx >= 0) {
      try { localStorage.setItem('vahome_selected_base', JSON.stringify(militaryBasesList[idx])) } catch {}
    } else {
      try { localStorage.removeItem('vahome_selected_base') } catch {}
    }
  }, [])

  const handleGetStarted = () => {
    setAuthView('register')
    setShowAuthModal(true)
  }

  return (
    <>
      <style>{`
        .mode-wrapper { transition: background-color 0.6s ease, color 0.6s ease; }
        .morph { transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }
        .fade { opacity: 0; transform: translateY(20px); transition: all 0.7s ease; }
        .fade.in { opacity: 1; transform: translateY(0); }
        .card-lift { transition: all 0.4s ease; }
        .card-lift:hover { transform: translateY(-6px); }
        .card-lift:hover .card-img { transform: scale(1.05); }
        .card-img { transition: transform 0.6s ease; }
        .civilian .hero-bg { background: linear-gradient(135deg, #fef2f2 0%, #fff 40%, #f0f4ff 100%); }
        .civilian .section-alt { background: #f9fafb; }
        .civilian .card-bg { background: #fff; border: 1px solid #f0f0f0; }
        .civilian .card-bg:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.06); }
        .civilian .text-themed { color: #111; }
        .civilian .text-secondary-themed { color: #6b7280; }
        .civilian .text-muted-themed { color: #9ca3af; }
        .toggle-label-c { color: #374151; }
        .military .toggle-label-c { color: #e5e7eb; }
        .civilian .accent-color { color: #dc2626; }
        .civilian .accent-bg-c { background: #dc2626; }
        .civilian .accent-bg-soft-c { background: rgba(220,38,38,0.06); }
        .civilian .accent-border-c { border-color: rgba(220,38,38,0.15); }
        .civilian .search-box-c { background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 4px 30px rgba(0,0,0,0.04); }
        .civilian .search-box-c:focus-within { box-shadow: 0 8px 40px rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.3); }
        .civilian .btn-primary-c { background: #dc2626; color: #fff; }
        .civilian .btn-primary-c:hover { background: #b91c1c; }
        .civilian .pill-c { background: rgba(220,38,38,0.06); color: #dc2626; }
        .civilian .overlay-grad { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
        .civilian .stat-c { background: #f9fafb; }
        .civilian .divider-c { background: #f0f0f0; }
        .civilian .footer-bg-c { background: #f9fafb; border-top: 1px solid #f0f0f0; }
        .civilian .input-c { color: #111; }
        .civilian .input-c::placeholder { color: #d1d5db; }
        .military { background: #091729; color: #fff; }
        .military .hero-bg { background: linear-gradient(135deg, #0B1A2B 0%, #091729 50%, #0F2235 100%); }
        .military .section-alt { background: #0F2235; }
        .military .card-bg { background: #0F2235; border: 1px solid rgba(197,165,90,0.1); }
        .military .card-bg:hover { box-shadow: 0 20px 50px rgba(197,165,90,0.05); border-color: rgba(197,165,90,0.25); }
        .military .text-themed { color: #fff; }
        .military .text-secondary-themed { color: rgba(255,255,255,0.5); }
        .military .text-muted-themed { color: rgba(255,255,255,0.25); }
        .military .accent-color { color: #C5A55A; }
        .military .accent-bg-c { background: #C5A55A; }
        .military .accent-bg-soft-c { background: rgba(197,165,90,0.08); }
        .military .accent-border-c { border-color: rgba(197,165,90,0.15); }
        .military .search-box-c { background: rgba(255,255,255,0.04); border: 1px solid rgba(197,165,90,0.15); }
        .military .search-box-c:focus-within { box-shadow: 0 0 30px rgba(197,165,900,0.4); }
        .military .btn-primary-c { background: #C5A55A; color: #091729; }
        .military .btn-primary-c:hover { background: #D4B96E; }
        .military .pill-c { background: rgba(197,165,90,0.08); color: #C5A55A; }
        .military .overlay-grad { background: linear-gradient(to top, rgba(9,23,41,0.85) 0%, transparent 60%); }
        .military .stat-c { background: rgba(197,165,90,0.05); border: 1px solid rgba(197,165,90,0.08); }
        .military .divider-c { background: rgba(197,165,90,0.08); }
        .military .footer-bg-c { background: #0B1A2B; border-top: 1px solid rgba(197,165,90,0.08); }
        .military .input-c { color: #fff; }
        .military .input-c::placeholder { color: rgba(255,255,255,0.2); }
        .toggle-track { width: 72px; height: 36px; border-radius: 999px; position: relative; cursor: pointer; transition: all 0.4s ease; }
        .civilian .toggle-track { background: #e5e7eb; }
        .military .toggle-track { background: rgba(197,165,90,0.3); }
        .toggle-thumb { width: 28px; height: 28px; border-radius: 50%; position: absolute; top: 4px; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .civilian .toggle-thumb { left: 4px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .military .toggle-thumb { left: 40px; background: #C5A55A; box-shadow: 0 2px 12px rgba(197,165,90,0.4); }
        .mil-only { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.6s ease, opacity 0.5s ease, margin 0.5s ease; margin: 0; }
        .military .mil-only { max-height: 2000px; opacity: 1; }
        .mode-flash { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 100; opacity: 0; transition: opacity 0.3s ease; }
        .mode-flash.active { opacity: 1; }
        .civilian .mode-flash { background: rgba(220,38,38,0.03); }
        .military .mode-flash { background: rgba(197,165,90,0.06); }
        .military .commute-accent { color: #C5A55A; font-weight: 600; }
        /* === THEME OVERRIDES === */
        .civilian.dark { background: #111827; color: #fff; }
        .civilian.dark .hero-bg { background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%); }
        .civilian.dark .section-alt { background: #1f2937; }
        .civilian.dark .card-bg { background: #1f2937; border-color: rgba(220,38,38,0.15); }
        .civilian.dark .card-bg:hover { box-shadow: 0 20px 50px rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.3); }
        .civilian.dark .text-themed { color: #fff; }
        .civilian.dark .text-secondary-themed { color: rgba(255,255,255,0.6); }
        .civilian.dark .text-muted-themed { color: rgba(255,255,255,0.3); }
        .civilian.dark .search-box-c { background: rgba(255,255,255,0.05); border-color: rgba(220,38,38,0.2); }
        .civilian.dark .stat-c { background: rgba(220,38,38,0.06); border-color: rgba(220,38,38,0.1); }
        .civilian.dark .divider-c { background: rgba(255,255,255,0.08); }
        .civilian.dark .footer-bg-c { background: #0f172a; border-top: 1px solid rgba(255,255,255,0.08); }
        .civilian.dark .toggle-track { background: rgba(220,38,38,0.3); }
        .civilian.dark .input-c { color: #fff; }
        .civilian.dark .input-c::placeholder { color: rgba(255,255,255,0.25); }
        .civilian.dark .overlay-grad { background: linear-gradient(to top, rgba(17,24,39,0.85) 0%, transparent 60%); }
        .civilian.dark .pill-c { background: rgba(220,38,38,0.12); color: #fca5a5; }
        /* Military + Bright */
        .military.bright { background: #fff; color: #111; }
        .military.bright .hero-bg { background: linear-gradient(135deg, #fffbeb 0%, #fff 40%, #fefce8 100%); }
        .military.bright .section-alt { background: #f9fafb; }
        .military.bright .card-bg { background: #fff; border-color: rgba(197,165,90,0.2); }
        .military.bright .card-bg:hover { box-shadow: 0 20px 50px rgba(197,165,90,0.1); border-color: rgba(197,165,90,0.4); }
        .military.bright .text-themed { color: #111; }
        .military.bright .text-secondary-themed { color: #6b7280; }
        .military.bright .text-muted-themed { color: #9ca3af; }
        .military.bright .search-box-c { background: #fff; border-color: #e5e7eb; }
        .military.bright .stat-c { background: rgba(197,165,90,0.06); border-color: rgba(197,165,90,0.12); }
        .military.bright .divider-c { background: rgba(197,165,90,0.15); }
        .military.bright .footer-bg-c { background: #fafaf9; border-top: 1px solid rgba(197,165,90,0.12); }
        .military.bright .toggle-track { background: #e5e7eb; }
        .military.bright .input-c { color: #111; }
        .military.bright .input-c::placeholder { color: #d1d5db; }
        .military.bright .overlay-grad { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
        .military.bright .pill-c { background: rgba(197,165,90,0.1); color: #92722C; }
        .military.bright .commute-accent { color: #92722C; }
        /* Theme toggle button */
        .theme-toggle-btn { border: 1px solid transparent; padding: 6px; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: transparent; }
        .bright .theme-toggle-btn { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); }
        .bright .theme-toggle-btn:hover { background: rgba(0,0,0,0.08); }
        .dark .theme-toggle-btn { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
        .dark .theme-toggle-btn:hover { background: rgba(255,255,255,0.12); }
      `}</style>

      <div ref={wrapperRef} className={`mode-wrapper ${mode} ${theme}`}>
        <div className={`mode-flash ${flash ? 'active' : ''}`} />

        {/* ===== HERO ===== */}
        <section className="hero-bg morph pt-24 pb-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="fade flex items-center justify-center gap-3 mb-8">
              <span className="text-base font-bold toggle-label-c morph">Civilian Mode</span>
              <div className="toggle-track" onClick={toggleMode}>
                <div className="toggle-thumb">
                  <span>{isMil ? '\u{1F396}\uFE0F' : '\u{1F3E0}'}</span>
                </div>
              </div>
              <span className="text-base font-bold toggle-label-c morph">Military Mode</span>
              <div style={{width:1,height:20,margin:'0 8px'}} className="divider-c"></div>
              <button onClick={toggleTheme} className="theme-toggle-btn" title={theme === 'bright' ? 'Switch to dark mode' : 'Switch to bright mode'}>
                {theme === 'bright' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>
                )}
              </button>
            </div>

            <div className="mil-only mb-6">
              <div className="accent-bg-soft-c morph accent-border-c morph inline-flex items-center gap-2 px-4 py-2 rounded-full border">
                <svg className="w-4 h-4 accent-color morph" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2l2.5 1.5L15 2v3.07l2.5 1.5L16 9.5l1.5 2.93L15 14v3l-2.5-1.5L10 17l-2.5-1.5L5 17v-3l-2.5-1.57L4 9.5 2.5 6.57 5 5.07V2l2.5 1.5L10 2z" clipRule="evenodd" /></svg>
                <span className="accent-color morph text-xs font-semibold">#1 Military-Friendly Real Estate in Hampton Roads</span>
              </div>
            </div>

            {/* Logged-in welcome */}
            {isLoggedIn && (user?.user_metadata?.first_name || user?.user_metadata?.full_name || user?.user_metadata?.name) && (
              <div className="fade mb-4">
                <span className="text-sm font-medium text-secondary-themed morph">
                  Welcome back, {user.user_metadata.first_name || (user.user_metadata.full_name || user.user_metadata.name || "").split(" ")[0]}! {isMil ? '\u{1F396}\uFE0F' : '\u{1F44B}'}
                </span>
              </div>
            )}

            <h1 className="fade font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-themed morph max-w-4xl mb-5">
              <span>{isMil ? 'Mission-ready homes in' : 'Find your perfect'}</span><br />
              <span className="accent-color morph">{isMil ? 'Hampton Roads' : 'Hampton Roads home'}</span>
            </h1>

            <p className="fade text-secondary-themed morph text-lg max-w-2xl mb-8 leading-relaxed">
              {isMil
                ? 'PCS-ing to Hampton Roads? Search homes near your base with real commute times, VA loan filtering, and BAH-friendly pricing \u2014 built for military families.'
                : 'Explore 2,800+ homes across Chesapeake, Virginia Beach, Norfolk & beyond with real-time MLS data and interactive maps.'}
            </p>

            <div className="fade search-box-c morph rounded-2xl p-2 max-w-2xl">
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-3 px-5">
                  <svg className="w-5 h-5 text-muted-themed morph" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" className="w-full py-3 bg-transparent input-c morph outline-none text-base"
                    placeholder={isMil ? 'Search by base name, city, or ZIP...' : 'City, ZIP, neighborhood...'} />
                </div>
                <button className="btn-primary-c morph font-semibold px-7 py-3 rounded-xl transition text-sm shrink-0">Search</button>
              </div>
            </div>

            <div className="fade flex flex-wrap gap-2 mt-5">
              {isMil
                ? milPills.map((p) => (
                    <span key={p.label} className="pill-c morph text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:opacity-70 transition">
                      {p.icon ? `${p.icon} ` : ''}{p.label}
                    </span>
                  ))
                : civPills.map((p) => (
                    <span key={p} className="pill-c morph text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:opacity-70 transition">{p}</span>
                  ))}
            </div>

            <div className="fade grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mt-12">
              <div className="stat-c morph rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-themed morph">2,847</div>
                <div className="text-[10px] text-muted-themed morph mt-0.5">Active Listings</div>
              </div>
              <div className="stat-c morph rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-themed morph">$342K</div>
                <div className="text-[10px] text-muted-themed morph mt-0.5">Median Price</div>
              </div>
              <div className="stat-c morph rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-themed morph">18</div>
                <div className="text-[10px] text-muted-themed morph mt-0.5">Avg Days on Market</div>
              </div>
              <div className="stat-c morph rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-themed morph">{isMil ? '10' : '98%'}</div>
                <div className="text-[10px] text-muted-themed morph mt-0.5">{isMil ? 'Military Bases' : 'Satisfaction'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MILITARY COMMUTE BANNER ===== */}
        <div className="mil-only">
          <section className="accent-bg-c morph py-4">
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold" style={{ color: '#091729' }}>
              <span>{'\u{1F396}\uFE0F'} VA Loan Specialists</span>
              <span className="opacity-30">|</span>
              <span>{'\u{1F4CD}'} 10 Base Commute Times</span>
              <span className="opacity-30">|</span>
              <span>{'\u{1F4B0}'} BAH Calculator</span>
              <span className="opacity-30">|</span>
              <span>{'\u26A1'} 24hr PCS Response</span>
            </div>
          </section>
        </div>

        {/* ===== BASE SELECTOR (Military mode) ===== */}
        <div className="mil-only">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="text-sm font-semibold" style={{ color: '#C5A55A' }}>
                {'\u{1F3DB}\uFE0F'} Select Your Base:
              </label>
              <div className="relative">
                <select value={selectedBaseIdx} onChange={handleBaseSelect}
                  className="appearance-none bg-white/10 border-2 rounded-xl px-5 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer min-w-[280px]"
                  style={{ borderColor: 'rgba(197,165,90,0.4)', color: '#C5A55A', background: 'rgba(197,165,90,0.08)' }}>
                  <option value={-1} style={{ color: '#333', background: '#fff' }}>Choose your duty station...</option>
                  {militaryBasesList.map((base, i) => (
                    <option key={i} value={i} style={{ color: '#333', background: '#fff' }}>{base.shortName} ({base.branch})</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#C5A55A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {selectedBaseIdx >= 0 && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(197,165,90,0.15)', color: '#C5A55A' }}>
                  {'\u2713'} Saved - drive times will appear on listings
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== PREMIUM: MORTGAGE CALCULATOR (logged in) or TEASER (logged out) ===== */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="fade">
              <div className="text-center mb-8">
                <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Tools</span>
                <h2 className="font-serif text-3xl text-themed morph mt-1">
                  {isMil ? 'VA Loan Calculator' : 'Mortgage Calculator'}
                </h2>
              </div>
              <div className="max-w-md mx-auto">
                {isLoggedIn ? (
                  <MortgageCalculator isMilitary={isMil} />
                ) : (
                  <PremiumTeaser
                    title={isMil ? 'VA Loan Calculator' : 'Mortgage Calculator'}
                    description="Sign up to calculate your monthly payment with taxes, insurance, and PMI included."
                    icon={isMil ? '\u{1F396}\uFE0F' : '\u{1F4B0}'}
                    isMilitary={isMil}
                  >
                    <MortgageCalculator isMilitary={isMil} />
                  </PremiumTeaser>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== PREMIUM: SCHOOL INFO TEASER (logged out only) ===== */}
        {!isLoggedIn && (
          <section className="py-12 section-alt morph">
            <div className="max-w-7xl mx-auto px-6">
              <div className="fade max-w-2xl mx-auto">
                <PremiumTeaser
                  title="Detailed School Ratings"
                  description="Get GreatSchools ratings, student-teacher ratios, and test scores for every listing."
                  icon={'\u{1F3EB}'}
                  isMilitary={isMil}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold text-lg">9</div>
                      <div><div className="font-semibold text-gray-900">Ocean Lakes Elementary</div><div className="text-sm text-gray-500">Rating: 9/10 &middot; 450 students</div></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg">8</div>
                      <div><div className="font-semibold text-gray-900">Kellam Middle School</div><div className="text-sm text-gray-500">Rating: 8/10 &middot; 820 students</div></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold text-lg">8</div>
                      <div><div className="font-semibold text-gray-900">Ocean Lakes High School</div><div className="text-sm text-gray-500">Rating: 8/10 &middot; 2,100 students</div></div>
                    </div>
                  </div>
                </PremiumTeaser>
              </div>
            </div>
          </section>
        )}

        {/* ===== PREMIUM: WORK COMMUTE (logged in only, if addresses set) ===== */}
        {isLoggedIn && profile?.work_address_1 && (
          <section className="py-12 section-alt morph">
            <div className="max-w-7xl mx-auto px-6">
              <div className="fade text-center mb-8">
                <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Personalized</span>
                <h2 className="font-serif text-3xl text-themed morph mt-1">Your Work Commutes</h2>
                <p className="text-secondary-themed morph text-sm mt-2">Drive times from featured listings to your workplace</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {listings.map((l) => (
                  <div key={l.address} className="card-bg morph rounded-xl p-4 text-center">
                    <div className="text-sm font-semibold text-themed morph mb-1">{l.address}</div>
                    <div className="text-xs text-muted-themed morph mb-3">{l.city}, {l.state}</div>
                    <div className="text-3xl font-black accent-color morph">~25</div>
                    <div className="text-xs text-secondary-themed morph">min to {profile.work_address_1?.split(',')[0]}</div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-themed morph mt-4">
                <Link href="/settings" className="accent-color morph hover:underline">Edit work addresses in Settings</Link>
              </p>
            </div>
          </section>
        )}

        {/* ===== FEATURED LISTINGS ===== */}
        <section id="listings" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="fade flex items-end justify-between mb-12">
              <div>
                <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Featured</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-themed morph mt-1">
                  {isMil ? 'BAH-Friendly Picks' : 'Handpicked Homes'}
                </h2>
              </div>
              <Link href="/map" className="accent-color morph text-sm font-semibold hover:opacity-70 transition">View all &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <Link key={l.address} href={`/listings?q=${encodeURIComponent(l.address + ' ' + l.city)}`} className="fade card-lift card-bg morph rounded-2xl overflow-hidden block">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={l.img} alt={l.address} className="card-img w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 accent-bg-c morph text-white text-xs font-bold px-2.5 py-1 rounded-lg">{l.price}</div>
                    {l.badge && <div className={`absolute top-3 right-3 ${l.badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>{l.badge}</div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-themed morph">{l.address}</h3>
                    <p className="text-muted-themed morph text-xs mt-1">{l.city}, {l.state} {l.zip}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-secondary-themed morph">
                      <span>{l.beds} bd</span><span className="text-muted-themed morph">|</span>
                      <span>{l.baths} ba</span><span className="text-muted-themed morph">|</span>
                      <span>{l.sqft} sqft</span>
                    </div>
                    <div className="mt-3 pt-3 border-t divider-c morph">
                      <div className={`flex items-center gap-1.5 text-xs ${isMil ? 'commute-accent' : 'text-muted-themed'} morph`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{l.commute}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MILITARY PCS HUB ===== */}
        <div className="mil-only">
          <section id="military" className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="card-bg morph rounded-3xl p-8 sm:p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="accent-bg-soft-c morph accent-border-c morph inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4">
                      <svg className="w-3.5 h-3.5 accent-color morph" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2l2.5 1.5L15 2v3.07l2.5 1.5L16 9.5l1.5 2.93L15 14v3l-2.5-1.5L10 17l-2.5-1.5L5 17v-3l-2.5-1.57L4 9.5 2.5 6.57 5 5.07V2l2.5 1.5L10 2z" clipRule="evenodd" /></svg>
                      <span className="accent-color morph text-xs font-semibold">Military PCS Center</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl text-themed morph mb-5">{"PCS to Hampton Roads?"}<br />{"We've Got Your Six."}</h2>
                    <p className="text-secondary-themed morph leading-relaxed mb-8">{"Home to the world's largest naval base and 10 major military installations. We help service members find homes with VA loan guidance, BAH-friendly pricing, and real-time base commute calculations."}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[{ val: '10', label: 'Bases' },{ val: 'VA', label: 'Loan Experts' },{ val: 'BAH', label: 'Calculator' },{ val: '24h', label: 'Response' }].map((s) => (
                        <div key={s.label} className="stat-c morph rounded-xl p-3 text-center">
                          <div className="text-xl font-bold accent-color morph">{s.val}</div>
                          <div className="text-[10px] text-muted-themed morph">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary-c morph font-semibold px-6 py-3 rounded-xl transition text-sm">Military Relocation Guide</button>
                  </div>
                  <div className="space-y-2">
                    {bases.map((b) => (
                      <div key={b.code} className="flex items-center gap-4 p-4 rounded-xl stat-c morph cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="accent-bg-soft-c morph w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                          <span className="accent-color morph text-xs font-bold">{b.code}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-themed morph">{b.name}</div>
                          <div className="text-xs text-muted-themed morph">{b.area} &middot; {b.homes} homes nearby</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===== MAP CTA ===== */}
        <section id="map-section" className="py-20 section-alt morph">
          <div className="max-w-7xl mx-auto px-6">
            <div className="fade grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map preview" className="w-full h-full object-cover" />
                  <div className="overlay-grad morph absolute inset-0" />
                  <div className="absolute top-[25%] left-[30%] accent-bg-c morph text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">$329K</div>
                  <div className="absolute top-[50%] left-[60%] accent-bg-c morph text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">$425K</div>
                  <div className="absolute top-[65%] left-[40%] accent-bg-c morph text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg animate-pulse">$289K</div>
                </div>
              </div>
              <div>
                <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Interactive Map</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-themed morph mt-2 mb-5">
                  {isMil ? 'Find Homes Near Your Base' : 'Search Like a Local'}
                </h2>
                <p className="text-secondary-themed morph leading-relaxed mb-8">
                  {isMil
                    ? 'Our interactive map shows every listing with real-time commute calculations to all 10 military installations. Filter by BAH range, base proximity, and VA loan eligibility.'
                    : 'Our interactive map shows every active listing in Hampton Roads with real-time pricing, neighborhood boundaries, and filtering tools.'}
                </p>
                <div className="space-y-3 mb-8">
                  {['Real-time price pills on every listing',
                    isMil ? 'Commute times to all 10 bases' : 'Neighborhood video tours',
                    isMil ? 'Filter by BAH range & VA eligibility' : 'Draw custom search boundaries',
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="accent-bg-soft-c morph w-8 h-8 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 accent-color morph" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm text-secondary-themed morph">{feat}</span>
                    </div>
                  ))}
                </div>
                <Link href="/map" className="btn-primary-c morph font-semibold px-6 py-3 rounded-xl transition text-sm inline-block">Open Map Search</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== NEIGHBORHOODS ===== */}
        <section id="neighborhoods" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="fade text-center mb-12">
              <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Explore</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-themed morph mt-1">Hampton Roads Neighborhoods</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {neighborhoods.map((n) => (
                <Link key={n.name} href={`/listings?city=${encodeURIComponent(n.name)}`} className="fade card-lift group relative rounded-2xl overflow-hidden aspect-[3/2] block">
                  <img src={n.img} alt={n.name} className="card-img w-full h-full object-cover" />
                  <div className="overlay-grad morph absolute inset-0" />
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <h3 className="font-semibold text-lg">{n.name}</h3>
                    <p className="text-white/60 text-sm">{n.count} homes &middot; From {n.from}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-20 section-alt morph">
          <div className="max-w-7xl mx-auto px-6">
            <div className="fade text-center mb-12">
              <span className="accent-color morph text-xs font-bold tracking-widest uppercase">Testimonials</span>
              <h2 className="font-serif text-3xl text-themed morph mt-1">
                {isMil ? 'Military Families Love VaHome' : 'What Our Clients Say'}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { initials: 'SM', name: 'Sarah M.',
                  text: isMil ? "We PCS'd from San Diego and found our dream home in 2 weeks. The commute time feature was a game-changer." : 'Found our dream home in Chesapeake in just two weeks. The interactive map made searching so easy.',
                  role: isMil ? 'Navy Spouse \u00B7 Chesapeake' : 'First-Time Buyer \u00B7 Chesapeake' },
                { initials: 'JD', name: 'James D.',
                  text: isMil ? 'The base commute calculator saved us hours of research. We found a home within BAH and 12 minutes from Naval Station Norfolk.' : 'The map search is incredible. I could see every listing near the base with actual prices.',
                  role: isMil ? 'Active Duty Navy \u00B7 Norfolk' : 'Homebuyer \u00B7 Norfolk' },
                { initials: 'RL', name: 'Robert L.',
                  text: isMil ? "Third PCS and first time using VaHome. VA loan guidance was spot-on and we closed before we even arrived at Langley." : 'The neighborhood video tours helped me evaluate areas remotely. Closed on two properties within a month.',
                  role: isMil ? 'Air Force Family \u00B7 Hampton' : 'Investor \u00B7 Virginia Beach' },
              ].map((t) => (
                <div key={t.initials} className="fade card-bg morph rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3"><span className="text-amber-400 text-sm">{'\u2605\u2605\u2605\u2605\u2605'}</span></div>
                  <p className="text-secondary-themed morph text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full accent-bg-soft-c morph flex items-center justify-center text-xs font-bold accent-color morph">{t.initials}</div>
                    <div>
                      <div className="text-sm font-semibold text-themed morph">{t.name}</div>
                      <div className="text-xs text-muted-themed morph">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="fade accent-bg-c morph rounded-3xl p-12 text-center relative overflow-hidden">
              <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">
                {isMil ? 'Welcome to Hampton Roads, Shipmate' : 'Ready to Find Home?'}
              </h2>
              <p className="text-white/70 text-lg mb-8">
                {isLoggedIn
                  ? (isMil ? 'Your personalized military home search is ready.' : 'Your personalized home search tools are unlocked.')
                  : (isMil ? "PCS doesn't have to be stressful. Sign up for personalized tools." : "Sign up for mortgage calculators, school data, and commute times.")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isLoggedIn ? (
                  <>
                    <Link href="/map" className="bg-white font-bold px-8 py-3.5 rounded-xl transition text-sm" style={{ color: '#111' }}>
                      {isMil ? 'Start PCS Search' : 'Search Homes'}
                    </Link>
                    <Link href="/settings" className="bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition text-sm">
                      My Settings
                    </Link>
                  </>
                ) : (
                  <>
                    <button onClick={handleGetStarted} className="bg-white font-bold px-8 py-3.5 rounded-xl transition text-sm" style={{ color: '#111' }}>
                      {isMil ? 'Create Free Account' : 'Get Started Free'}
                    </button>
                    <button onClick={handleGetStarted} className="bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition text-sm">
                      {isMil ? 'Talk to a Military Specialist' : 'Schedule a Call'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
