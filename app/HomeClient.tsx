'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const civPills = ['Virginia Beach', 'Under $350K', 'Waterfront', 'New Construction', 'Open Houses']
const milPills = [
  { label: 'Near NAS Oceana', icon: '\uD83C\uDF96\uFE0F' },
  { label: 'Under BAH', icon: '\uD83D\uDCB0' },
  { label: 'Near Norfolk NS', icon: '\u2693' },
  { label: 'VA Loan Ready', icon: '' },
  { label: 'Near Langley', icon: '\u2708\uFE0F' },
  { label: 'Near Little Creek', icon: '' },
]


const militaryBasesList = [
  { name: "Naval Station Norfolk", shortName: "NS Norfolk", branch: "Navy", lat: 36.9466, lng: -76.3036 },
  { name: "NAS Oceana", shortName: "NAS Oceana", branch: "Navy", lat: 36.8207, lng: -76.0331 },
  { name: "Dam Neck Annex", shortName: "Dam Neck", branch: "Navy", lat: 36.7920, lng: -75.9710 },
  { name: "JEB Little Creek-Fort Story", shortName: "Little Creek", branch: "Navy", lat: 36.9178, lng: -76.1601 },
  { name: "Naval Medical Center Portsmouth", shortName: "NMCP", branch: "Navy", lat: 36.8446, lng: -76.3039 },
  { name: "Norfolk Naval Shipyard", shortName: "NNSY", branch: "Navy", lat: 36.8271, lng: -76.2946 },
  { name: "NSA Hampton Roads", shortName: "NSA HR", branch: "Navy", lat: 36.9480, lng: -76.3350 },
  { name: "Naval Weapons Station Yorktown", shortName: "NWS Yorktown", branch: "Navy", lat: 37.2317, lng: -76.5636 },
  { name: "Joint Base Langley-Eustis (Langley AFB)", shortName: "JBLE Langley", branch: "Air Force", lat: 37.0832, lng: -76.3605 },
  { name: "Joint Base Langley-Eustis (Fort Eustis)", shortName: "JBLE Ft Eustis", branch: "Army", lat: 37.1518, lng: -76.5879 },
  { name: "Joint Staff J7 Suffolk", shortName: "J7 Suffolk", branch: "Joint", lat: 36.7282, lng: -76.5836 },
  { name: "Camp Peary", shortName: "Camp Peary", branch: "DoD", lat: 37.2905, lng: -76.6158 },
  { name: "USCG Base Portsmouth", shortName: "USCG Portsmouth", branch: "Coast Guard", lat: 36.8354, lng: -76.2932 },
  { name: "MARFORCOM Norfolk", shortName: "MARFORCOM", branch: "Marines", lat: 36.9460, lng: -76.3130 },
]

const listings = [
  {
    address: '1247 Crossbow Lane',
    city: 'Chesapeake',
    state: 'VA',
    zip: '23322',
    price: '$425,000',
    beds: 4, baths: 3, sqft: '2,480',
    commute: '14 min to NAS Oceana',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    badge: 'New',
    badgeColor: 'bg-emerald-500',
  },
  {
    address: '834 Ocean Shore Ave',
    city: 'Virginia Beach',
    state: 'VA',
    zip: '23451',
    price: '$389,900',
    beds: 3, baths: 2.5, sqft: '1,920',
    commute: '8 min to JEB Little Creek',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    address: '2105 Harbor Point Dr',
    city: 'Norfolk',
    state: 'VA',
    zip: '23518',
    price: '$549,000',
    beds: 5, baths: 3.5, sqft: '3,200',
    commute: '11 min to Naval Station Norfolk',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    badge: 'Hot',
    badgeColor: 'bg-amber-500',
  },
]

const neighborhoods = [
  { name: 'Virginia Beach', count: 842, from: '$275K', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { name: 'Chesapeake', count: 631, from: '$245K', img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80' },
  { name: 'Norfolk', count: 487, from: '$195K', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80' },
  { name: 'Newport News', count: 394, from: '$180K', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80' },
  { name: 'Hampton', count: 289, from: '$165K', img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80' },
  { name: 'Suffolk', count: 204, from: '$230K', img: 'https://images.unsplash.com/photo-1600573472556-e636c2acda9e?w=600&q=80' },
]

const bases = [
  { code: 'NS', name: 'Naval Station Norfolk', area: 'Norfolk', homes: '1,247' },
  { code: 'JB', name: 'JEB Little Creek-Fort Story', area: 'Virginia Beach', homes: '893' },
  { code: 'NO', name: 'NAS Oceana', area: 'Virginia Beach', homes: '756' },
  { code: 'LE', name: 'Joint Base Langley-Eustis', area: 'Hampton', homes: '438' },
  { code: 'NN', name: 'Newport News Shipbuilding', area: 'Newport News', homes: '512' },
]

export default function HomeClient() {
  const [mode, setMode] = useState<'civilian' | 'military'>('civilian')
  const [flash, setFlash] = useState(false)
  const [selectedBaseIdx, setSelectedBaseIdx] = useState<number>(-1)

  // Load saved base from localStorage on mount
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

  const handleBaseSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value)
    setSelectedBaseIdx(idx)
    if (idx >= 0) {
      try { localStorage.setItem('vahome_selected_base', JSON.stringify(militaryBasesList[idx])) } catch {}
    } else {
      try { localStorage.removeItem('vahome_selected_base') } catch {}
    }
  }, [])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isMil = mode === 'military'

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in'), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    const els = wrapperRef.current?.querySelectorAll('.fade')
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [mode])

  // Restore preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vahome-mode')
      if (stored === 'military') setMode('military')
    } catch {}
  }, [])

  const toggleMode = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
    setMode((prev) => {
      const next = prev === 'civilian' ? 'military' : 'civilian'
      try { localStorage.setItem('vahome-mode', next) } catch {}
      return next
    })
  }, [])

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

        /* Civilian mode */
        .civilian .hero-bg { background: linear-gradient(135deg, #fef2f2 0%, #fff 40%, #f0f4ff 100%); }
        .civilian .section-alt { background: #f9fafb; }
        .civilian .card-bg { background: #fff; border: 1px solid #f0f0f0; }
        .civilian .card-bg:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.06); }
        .civilian .text-themed { color: #111; }
        .civilian .text-secondary-themed { color: #6b7280; }
        .civilian .text-muted-themed { color: #9ca3af; }
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

        /* Military mode */
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
        .military .search-box-c:focus-within { box-shadow: 0 0 30px rgba(197,165,90,0.08); border-color: rgba(197,165,90,0.4); }
        .military .btn-primary-c { background: #C5A55A; color: #091729; }
        .military .btn-primary-c:hover { background: #D4B96E; }
        .military .pill-c { background: rgba(197,165,90,0.08); color: #C5A55A; }
        .military .overlay-grad { background: linear-gradient(to top, rgba(9,23,41,0.85) 0%, transparent 60%); }
        .military .stat-c { background: rgba(197,165,90,0.05); border: 1px solid rgba(197,165,90,0.08); }
        .military .divider-c { background: rgba(197,165,90,0.08); }
        .military .footer-bg-c { background: #0B1A2B; border-top: 1px solid rgba(197,165,90,0.08); }
        .military .input-c { color: #fff; }
        .military .input-c::placeholder { color: rgba(255,255,255,0.2); }

        /* Toggle */
        .toggle-track { width: 56px; height: 28px; border-radius: 999px; position: relative; cursor: pointer; transition: all 0.4s ease; }
        .civilian .toggle-track { background: #e5e7eb; }
        .military .toggle-track { background: rgba(197,165,90,0.3); }
        .toggle-thumb { width: 22px; height: 22px; border-radius: 50%; position: absolute; top: 3px; transition: all 0.4s cubic-bezier(0.4,0,0.2,1); display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .civilian .toggle-thumb { left: 3px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .military .toggle-thumb { left: 31px; background: #C5A55A; box-shadow: 0 2px 12px rgba(197,165,90,0.4); }

        /* Military-only */
        .mil-only { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.6s ease, opacity 0.5s ease, margin 0.5s ease; margin: 0; }
        .military .mil-only { max-height: 2000px; opacity: 1; }

        /* Flash */
        .mode-flash { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 100; opacity: 0; transition: opacity 0.3s ease; }
        .mode-flash.active { opacity: 1; }
        .civilian .mode-flash { background: rgba(220,38,38,0.03); }
        .military .mode-flash { background: rgba(197,165,90,0.06); }

        /* Commute emphasis in military */
        .military .commute-accent { color: #C5A55A; font-weight: 600; }
      `}</style>

      <div ref={wrapperRef} className={`mode-wrapper ${mode}`}>
        {/* Flash overlay */}
        <div className={`mode-flash ${flash ? 'active' : ''}`} />

        {/* ===== HERO ===== */}
        <section className="hero-bg morph pt-24 pb-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">

            {/* Toggle bar */}
            <div className="fade flex items-center justify-center gap-3 mb-8">
              <span className="text-xs font-semibold text-muted-themed morph">Civilian</span>
              <div className="toggle-track" onClick={toggleMode}>
                <div className="toggle-thumb">
                  <span>{isMil ? '\uD83C\uDF96\uFE0F' : '\uD83C\uDFE0'}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-themed morph">Military</span>
            </div>

            {/* Military badge */}
            <div className="mil-only mb-6">
              <div className="accent-bg-soft-c morph accent-border-c morph inline-flex items-center gap-2 px-4 py-2 rounded-full border">
                <svg className="w-4 h-4 accent-color morph" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2l2.5 1.5L15 2v3.07l2.5 1.5L16 9.5l1.5 2.93L15 14v3l-2.5-1.5L10 17l-2.5-1.5L5 17v-3l-2.5-1.57L4 9.5 2.5 6.57 5 5.07V2l2.5 1.5L10 2z" clipRule="evenodd" /></svg>
                <span className="accent-color morph text-xs font-semibold">#1 Military-Friendly Real Estate in Hampton Roads</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="fade font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-themed morph max-w-4xl mb-5">
              <span>{isMil ? 'Mission-ready homes in' : 'Find your perfect'}</span><br />
              <span className="accent-color morph">{isMil ? 'Hampton Roads' : 'Hampton Roads home'}</span>
            </h1>

            <p className="fade text-secondary-themed morph text-lg max-w-2xl mb-8 leading-relaxed">
              {isMil
                ? 'PCS-ing to Hampton Roads? Search homes near your base with real commute times, VA loan filtering, and BAH-friendly pricing \u2014 built for military families.'
                : 'Explore 2,800+ homes across Chesapeake, Virginia Beach, Norfolk & beyond with real-time MLS data and interactive maps.'}
            </p>

            {/* Search */}
            <div className="fade search-box-c morph rounded-2xl p-2 max-w-2xl">
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-3 px-5">
                  <svg className="w-5 h-5 text-muted-themed morph" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    type="text"
                    className="w-full py-3 bg-transparent input-c morph outline-none text-base"
                    placeholder={isMil ? 'Search by base name, city, or ZIP...' : 'City, ZIP, neighborhood...'}
                  />
                </div>
                <button className="btn-primary-c morph font-semibold px-7 py-3 rounded-xl transition text-sm shrink-0">Search</button>
              </div>
            </div>

            {/* Pills */}
            <div className="fade flex flex-wrap gap-2 mt-5">
              {isMil
                ? milPills.map((p) => (
                    <span key={p.label} className="pill-c morph text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:opacity-70 transition">
                      {p.icon ? `${p.icon} ` : ''}{p.label}
                    </span>
                  ))
                : civPills.map((p) => (
                    <span key={p} className="pill-c morph text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:opacity-70 transition">
                      {p}
                    </span>
                  ))}
            </div>

            {/* Stats */}
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
              <span>{'\uD83C\uDF96\uFE0F'} VA Loan Specialists</span>
              <span className="opacity-30">|</span>
              <span>{'\uD83D\uDCCD'} 10 Base Commute Times</span>
              <span className="opacity-30">|</span>
              <span>{'\uD83D\uDCB0'} BAH Calculator</span>
              <span className="opacity-30">|</span>
              <span>{'\u26A1'} 24hr PCS Response</span>
            </div>
          </section>

          {/* Base Selector */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="text-sm font-semibold" style={{ color: '#C5A55A' }}>
                {'🏛️'} Select Your Base:
              </label>
              <div className="relative">
                <select
                  value={selectedBaseIdx}
                  onChange={handleBaseSelect}
                  className="appearance-none bg-white/10 border-2 rounded-xl px-5 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 cursor-pointer min-w-[280px]"
                  style={{ borderColor: 'rgba(197,165,90,0.4)', color: '#C5A55A', background: 'rgba(197,165,90,0.08)' }}
                >
                  <option value={-1} style={{ color: '#333', background: '#fff' }}>Choose your duty station...</option>
                  {militaryBasesList.map((base, i) => (
                    <option key={i} value={i} style={{ color: '#333', background: '#fff' }}>
                      {base.shortName} ({base.branch})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4" style={{ color: '#C5A55A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {selectedBaseIdx >= 0 && (
                <span className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: 'rgba(197,165,90,0.15)', color: '#C5A55A' }}>
                  {'✓'} Saved - drive times will appear on listings
                </span>
              )}
            </div>
          </div>
        </div>

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
                <div key={l.address} className="fade card-lift card-bg morph rounded-2xl overflow-hidden">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img src={l.img} alt={l.address} className="card-img w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 accent-bg-c morph text-white text-xs font-bold px-2.5 py-1 rounded-lg">{l.price}</div>
                    {l.badge && (
                      <div className={`absolute top-3 right-3 ${l.badgeColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>{l.badge}</div>
                    )}
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
                </div>
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
                      {[
                        { val: '10', label: 'Bases' },
                        { val: 'VA', label: 'Loan Experts' },
                        { val: 'BAH', label: 'Calculator' },
                        { val: '24h', label: 'Response' },
                      ].map((s) => (
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
                  {[
                    'Real-time price pills on every listing',
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
                <Link key={n.name} href="#" className="fade card-lift group relative rounded-2xl overflow-hidden aspect-[3/2] block">
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
                {
                  initials: 'SM',
                  name: 'Sarah M.',
                  text: isMil
                    ? "We PCS'd from San Diego and found our dream home in 2 weeks. The commute time feature was a game-changer \u2014 we knew exactly how far we'd be from Little Creek."
                    : 'Found our dream home in Chesapeake in just two weeks. The interactive map made searching so easy \u2014 we could see every listing with real prices.',
                  role: isMil ? 'Navy Spouse \u00B7 Chesapeake' : 'First-Time Buyer \u00B7 Chesapeake',
                },
                {
                  initials: 'JD',
                  name: 'James D.',
                  text: isMil
                    ? 'The base commute calculator saved us hours of research. We found a home within BAH and 12 minutes from Norfolk Naval Station.'
                    : 'The map search is incredible. I could see every listing near the base with actual prices. No other site does this for Hampton Roads.',
                  role: isMil ? 'Active Duty Navy \u00B7 Norfolk' : 'Homebuyer \u00B7 Norfolk',
                },
                {
                  initials: 'RL',
                  name: 'Robert L.',
                  text: isMil
                    ? "Third PCS and first time using VaHome. VA loan guidance was spot-on and we closed before we even arrived at Langley."
                    : 'The neighborhood video tours helped me evaluate areas remotely. Closed on two properties within a month.',
                  role: isMil ? 'Air Force Family \u00B7 Hampton' : 'Investor \u00B7 Virginia Beach',
                },
              ].map((t) => (
                <div key={t.initials} className="fade card-bg morph rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-amber-400 text-sm">{'\u2605\u2605\u2605\u2605\u2605'}</span>
                  </div>
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
                {isMil
                  ? "PCS doesn't have to be stressful. Let us handle the housing part."
                  : "Whether you're buying your first home or investing \u2014 we're here to help."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-white font-bold px-8 py-3.5 rounded-xl transition text-sm" style={{ color: '#111' }}>
                  {isMil ? 'Start PCS Search' : 'Start Searching'}
                </button>
                <button className="bg-white/15 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition text-sm">
                  {isMil ? 'Talk to a Military Specialist' : 'Schedule a Call'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
