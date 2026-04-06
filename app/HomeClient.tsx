'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from './components/AuthProvider'
import MortgageCalculator from './components/MortgageCalculator'
import PremiumTeaser from './components/PremiumTeaser'

const civPills = ['Virginia Beach', 'Under $350K', 'Waterfront', 'New Construction', 'Open Houses']
const milPills = [
  { label: 'Near NAS Oceana', icon: '\u{1F396}\uFE0F' },
  { label: 'Under BAH', icon: '\u{1F4B0}' },
  { label: 'Near Norfolk NS', icon: '\u2693' },
  { label: 'VA Loan Ready', icon: '' },
  { label: 'Near Langley', icon: '\u2708\uFE0F' },
  { label: 'Near Little Creek', icon: '' },
]

const listings = [
  { address: '1247 Crossbow Lane', city: 'Chesapeake', state: 'VA', zip: '23322', price: '$425,000', beds: 4, baths: 3, sqft: '2,480', commute: '14 min to NAS Oceana', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', badge: 'New', badgeColor: 'bg-emerald-500' },
  { address: '834 Ocean Shore Ave', city: 'Virginia Beach', state: 'VA', zip: '23451', price: '$389,900', beds: 3, baths: 2.5, sqft: '1,920', commute: '8 min to JEB Little Creek', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { address: '2105 Harbor Point Dr', city: 'Norfolk', state: 'VA', zip: '23518', price: '$549,000', beds: 5, baths: 3.5, sqft: '3,200', commute: '11 min to Naval Station Norfolk', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', badge: 'Hot', badgeColor: 'bg-amber-500' },
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

export default function HomeClient() {
  const { user, profile, setShowAuthModal, setAuthView, theme, setTheme } = useAuth()
  const [isMil, setIsMil] = useState(false)
  const [selectedBase, setSelectedBase] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const wrapperRef = useRef(null)
  const mode = isMil ? 'military' : 'civilian'

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleMode = useCallback(() => {
    setIsMil(prev => !prev)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'bright' ? 'dark' : 'bright')
  }, [theme, setTheme])

  const handleSignup = (view) => {
    setAuthView(view)
    setShowAuthModal(true)
  }

  return (
    <div ref={wrapperRef} className={`mode-wrapper ${mode} ${theme}`}>
      <style>{`
        /* ===== GENERAL ===== */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }

        .mode-wrapper { transition: background-color 0.3s ease, color 0.3s ease; }

        /* ===== CIVILIAN MODE (DEFAULT BRIGHT) ===== */
        .civilian {
          background: #fff;
          color: #000;
        }
        .civilian .hero-bg {
          background: linear-gradient(135deg, #fff 0%, #f3f4f6 40%, #ffffff 100%);
        }
        .civilian .section-alt { background: #f9fafb; }
        .civilian .card-bg {
          background: #fff;
          border: 1px solid rgba(220,38,38,0.1);
          transition: all 0.3s ease;
        }
        .civilian .card-bg:hover {
          box-shadow: 0 20px 50px rgba(220,38,38,0.05);
          border-color: rgba(220,38,38,0.25);
        }
        .civilian .text-themed { color: #000; }
        .civilian .text-secondary-themed { color: #4b5563; }
        .civilian .text-muted-themed { color: #9ca3af; }
        .civilian .search-box-c {
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 30px rgba(0,0,0,0.04);
        }
        .civilian .search-box-c:focus-within {
          box-shadow: 0 8px 40px rgba(220,38,38,0.12);
          border-color: rgba(220,38,38,0.4);
        }
        .civilian .stat-c {
          background: rgba(220,38,38,0.06);
          border: 1px solid rgba(220,38,38,0.1);
        }
        .civilian .divider-c { background: rgba(220,38,38,0.15); }
        .civilian .footer-bg-c {
          background: #fafaf9;
          border-top: 1px solid rgba(220,38,38,0.12);
        }
        .civilian .toggle-track { background: #e5e7eb; }
        .civilian .input-c { color: #000; }
        .civilian .input-c::placeholder { color: #d1d5db; }
        .civilian .overlay-grad { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
        .civilian .pill-c {
          background: rgba(220,38,38,0.1);
          color: #7f1d1d;
        }
        .civilian .commute-accent { color: #991b1b; }

        /* ===== MILITARY MODE (DEFAULT DARK) ===== */
        .military {
          background: #111827;
          color: #fff;
        }
        .military .hero-bg {
          background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
        }
        .military .section-alt { background: #1f2937; }
        .military .card-bg {
          background: #1f2937;
          border: 1px solid rgba(197,165,90,0.1);
          transition: all 0.3s ease;
        }
        .military .card-bg:hover {
          box-shadow: 0 20px 50px rgba(197,165,90,0.08);
          border-color: rgba(197,165,90,0.25);
        }
        .military .text-themed { color: #fff; }
        .military .text-secondary-themed { color: rgba(255,255,255,0.7); }
        .military .text-muted-themed { color: rgba(255,255,255,0.4); }
        .military .search-box-c {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(197,165,90,0.15);
        }
        .military .search-box-c:focus-within {
          box-shadow: 0 0 30px rgba(197,165,90,0.15);
          border-color: rgba(197,165,90,0.4);
        }
        .military .stat-c {
          background: rgba(197,165,90,0.08);
          border: 1px solid rgba(197,165,90,0.1);
        }
        .military .divider-c { background: rgba(255,255,255,0.08); }
        .military .footer-bg-c {
          background: #0f172a;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .military .toggle-track { background: rgba(197,165,90,0.3); }
        .military .toggle-thumb {
          background: #C5A55A;
          box-shadow: 0 2px 8px rgba(197,165,90,0.3);
        }
        .military .input-c { color: #fff; }
        .military .input-c::placeholder { color: rgba(255,255,255,0.3); }
        .military .overlay-grad { background: linear-gradient(to top, rgba(17,24,39,0.85) 0%, transparent 60%); }
        .military .pill-c {
          background: rgba(197,165,90,0.12);
          color: #fff;
        }
        .military .commute-accent { color: #fbbf24; }

        /* ===== THEME OVERRIDES ===== */
        /* Civilian + Dark: dark backgrounds, red accents */
        .civilian.dark { background: #111827; color: #fff; }
        .civilian.dark .hero-bg { background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%); }
        .civilian.dark .section-alt { background: #1f2937; }
        .civilian.dark .card-bg { background: #1f2937; border: 1px solid rgba(220,38,38,0.1); }
        .civilian.dark .card-bg:hover { box-shadow: 0 20px 50px rgba(220,38,38,0.05); border-color: rgba(220,38,38,0.25); }
        .civilian.dark .text-themed { color: #fff; }
        .civilian.dark .text-secondary-themed { color: rgba(255,255,255,0.5); }
        .civilian.dark .text-muted-themed { color: rgba(255,255,255,0.25); }
        .civilian.dark .search-box-c { background: rgba(255,255,255,0.04); border: 1px solid rgba(220,38,38,0.15); }
        .civilian.dark .search-box-c:focus-within { box-shadow: 0 0 30px rgba(220,38,38,0.15); border-color: rgba(220,38,38,0.4); }
        .civilian.dark .stat-c { background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.08); }
        .civilian.dark .divider-c { background: rgba(255,255,255,0.08); }
        .civilian.dark .footer-bg-c { background: #0f172a; border-top: 1px solid rgba(255,255,255,0.08); }
        .civilian.dark .toggle-track { background: rgba(220,38,38,0.3); }
        .civilian.dark .input-c { color: #fff; }
        .civilian.dark .input-c::placeholder { color: rgba(255,255,255,0.2); }
        .civilian.dark .overlay-grad { background: linear-gradient(to top, rgba(17,24,39,0.85) 0%, transparent 60%); }
        .civilian.dark .pill-c { background: rgba(220,38,38,0.12); }

        /* Military + Bright: light backgrounds, gold accents */
        .military.bright { background: #fff; color: #111; }
        .military.bright .hero-bg { background: linear-gradient(135deg, #fffbeb 0%, #fff 40%, #fefce8 100%); }
        .military.bright .section-alt { background: #f9fafb; }
        .military.bright .card-bg { background: #fff; border: 1px solid rgba(197,165,90,0.15); }
        .military.bright .card-bg:hover { box-shadow: 0 20px 50px rgba(197,165,90,0.08); border-color: rgba(197,165,90,0.35); }
        .military.bright .text-themed { color: #111; }
        .military.bright .text-secondary-themed { color: #6b7280; }
        .military.bright .text-muted-themed { color: #9ca3af; }
        .military.bright .search-box-c { background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 4px 30px rgba(0,0,0,0.04); }
        .military.bright .search-box-c:focus-within { box-shadow: 0 8px 40px rgba(197,165,90,0.12); border-color: rgba(197,165,90,0.4); }
        .military.bright .stat-c { background: rgba(197,165,90,0.06); border: 1px solid rgba(197,165,90,0.1); }
        .military.bright .divider-c { background: rgba(197,165,90,0.15); }
        .military.bright .footer-bg-c { background: #fafaf9; border-top: 1px solid rgba(197,165,90,0.12); }
        .military.bright .toggle-track { background: #e5e7eb; }
        .military.bright .toggle-thumb { background: #C5A55A; box-shadow: 0 2px 8px rgba(197,165,90,0.3); }
        .military.bright .input-c { color: #111; }
        .military.bright .input-c::placeholder { color: #d1d5db; }
        .military.bright .overlay-grad { background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%); }
        .military.bright .pill-c { background: rgba(197,165,90,0.1); }
        .military.bright .commute-accent { color: #92722C; }

        /* Military bright banner override */
        .military.bright .mil-only section[class*="accent-bg-c"] { color: #fff; }

        /* Theme toggle button */
        .theme-toggle-btn {
          border: 1px solid transparent;
        }
        .bright .theme-toggle-btn {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.08);
        }
        .bright .theme-toggle-btn:hover {
          background: rgba(0,0,0,0.08);
        }
        .dark .theme-toggle-btn {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .dark .theme-toggle-btn:hover {
          background: rgba(255,255,255,0.12);
        }
        .civilian.dark .theme-toggle-btn { border-color: rgba(220,38,38,0.15); }
        .military.bright .theme-toggle-btn { border-color: rgba(197,165,90,0.2); }

        /* ===== TOGGLE TRACK & THUMB ===== */
        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          transition: all 0.3s ease;
          position: relative;
        }
        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .civilian .toggle-thumb { background: #fff; }
        .military .toggle-thumb { background: #C5A55A; }

        /* ===== MIL-ONLY CLASS ===== */
        .mil-only { display: none; }
        .military .mil-only { display: block; }

        /* ===== ANIMATIONS ===== */
        @keyframes modeFlash {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }
        .mode-flash { animation: modeFlash 0.4s ease-out; }

        @keyframes cardLift {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .card-lift { animation: cardLift 0.5s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade { animation: fadeIn 0.6s ease-out; }

        /* ===== LAYOUT ===== */
        main { width: 100%; }
        section {
          width: 100%;
          padding: 60px 20px;
          margin: 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        h1 { font-size: 3rem; font-weight: 800; margin: 20px 0; line-height: 1.2; }
        h2 { font-size: 2rem; font-weight: 700; margin: 30px 0 20px; }
        h3 { font-size: 1.3rem; font-weight: 600; margin: 15px 0; }
        p { font-size: 1rem; line-height: 1.6; margin: 10px 0; }
        a { color: inherit; text-decoration: none; transition: all 0.3s ease; }

        button {
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          border-radius: 8px;
          font-weight: 600;
        }

        input, textarea, select {
          border: none;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        /* ===== HERO SECTION ===== */
        .hero-section {
          background: var(--hero-bg);
          position: relative;
          overflow: hidden;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 20px;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(220,38,38,0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }
        .military .hero-section::before {
          background: radial-gradient(circle at 20% 50%, rgba(197,165,90,0.1) 0%, transparent 50%);
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }
        .hero-section h1 { margin: 20px auto; max-width: 600px; }
        .hero-section p { font-size: 1.2rem; margin: 15px auto; max-width: 500px; opacity: 0.9; }

        /* ===== SEARCH BOX ===== */
        .search-box {
          background: var(--card-bg);
          border: 1px solid rgba(220,38,38,0.1);
          border-radius: 12px;
          padding: 24px;
          margin: 30px auto;
          max-width: 500px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.04);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .military .search-box {
          border-color: rgba(197,165,90,0.1);
        }
        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.95rem;
        }
        .search-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .military .search-btn {
          background: linear-gradient(135deg, #C5A55A, #92722C);
        }
        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220,38,38,0.3);
        }
        .military .search-btn:hover {
          box-shadow: 0 8px 20px rgba(197,165,90,0.3);
        }

        /* ===== PILLS ===== */
        .pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin: 30px auto;
        }
        .pill {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pill:hover { transform: scale(1.05); }

        /* ===== STATS ===== */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 40px auto;
          max-width: 600px;
        }
        .stat {
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(220,38,38,0.1);
        }
        .military .stat {
          border-color: rgba(197,165,90,0.1);
        }
        .stat-number { font-size: 2rem; font-weight: 700; margin: 10px 0; }
        .stat-label { font-size: 0.85rem; opacity: 0.7; }

        /* ===== MIL BANNER ===== */
        .mil-banner {
          background: linear-gradient(135deg, rgba(197,165,90,0.15), rgba(197,165,90,0.05));
          border: 1px solid rgba(197,165,90,0.2);
          border-radius: 12px;
          padding: 20px;
          margin: 40px auto;
          max-width: 600px;
          text-align: center;
        }
        .mil-banner-title { font-size: 1.2rem; font-weight: 700; margin: 10px 0; }
        .mil-banner-desc { font-size: 0.95rem; opacity: 0.8; }

        /* ===== BASE SELECTOR ===== */
        .base-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin: 30px auto;
          max-width: 600px;
        }
        .base-btn {
          padding: 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 2px solid rgba(197,165,90,0.2);
          background: transparent;
          transition: all 0.3s ease;
        }
        .base-btn:hover, .base-btn.active {
 &�       border-color: rgba(197,165,90,0.8);
          background: rgba(197,165,90,0.1);
        }

        /* ===== CARDS ===== */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin: 40px auto;
        }
        .card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .card:hover { transform: translateY(-10px); }
        .card-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }
        .card-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-size: 1.2rem; font-weight: 700; margin: 10px 0; }
        .card-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 15px 0;
          font-size: 0.9rem;
        }
        .card-meta-item { text-align: center; }
        .card-meta-label { opacity: 0.7; font-size: 0.8rem; }
        .card-meta-value { font-weight: 600; margin-top: 4px; }

        /* ===== NEIGHBORHOOD CARDS ===== */
        .neighborhood-card {
          position: relative;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          group/card;
        }
        .neighborhood-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .neighborhood-card:hover img { transform: scale(1.05); }
        .neighborhood-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #fff;
        }
        .neighborhood-name { font-size: 1.3rem; font-weight: 700; }
        .neighborhood-meta { font-size: 0.85rem; opacity: 0.85; margin-top: 5px; }

        /* ===== TESTIMONIALS ===== */
        .testimonial-card {
          padding: 30px;
          border-radius: 12px;
          border: 1px solid rgba(220,38,38,0.1);
          text-align: center;
        }
        .military .testimonial-card {
          border-color: rgba(197,165,90,0.1);
        }
        .testimonial-text { font-style: italic; margin: 20px 0; line-height: 1.8; }
        .testimonial-author { font-weight: 700; margin-top: 15px; }
        .testimonial-role { font-size: 0.9rem; opacity: 0.7; }

        /* ===== CTA SECTION ===== */
        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin: 30px 0;
        }
        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          color: #fff;
          font-size: 1rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .military .btn-primary {
          background: linear-gradient(135deg, #C5A55A, #92722C);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(220,38,38,0.3);
        }
        .military .btn-primary:hover {
          box-shadow: 0 12px 30px rgba(197,165,90,0.3);
        }
        .btn-secondary {
          padding: 14px 32px;
          background: transparent;
          border: 2px solid currentColor;
          color: inherit;
          font-size: 1rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(220,38,38,0.1);
        }
        .military .btn-secondary:hover {
          background: rgba(197,165,90,0.1);
        }

        /* ===== FOOTER ===== */
        .footer {
          background: var(--footer-bg);
          border-top: 1px solid rgba(220,38,38,0.1);
          padding: 60px 20px 30px;
        }
        .military .footer {
          border-top-color: rgba(197,165,90,0.1);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }
        .footer-col h4 { margin: 20px 0 15px; }
        .footer-col a {
          display: block;
          margin: 8px 0;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }
        .footer-col a:hover { opacity: 1; }
        .footer-bottom {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid rgba(220,38,38,0.1);
          opacity: 0.6;
          font-size: 0.9rem;
        }
        .military .footer-bottom {
          border-top-color: rgba(197,165,90,0.1);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          h1 { font-size: 2rem; }
          h2 { font-size: 1.5rem; }
          section { padding: 40px 20px; }
          .cards-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .cta-buttons { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; }
          .hero-section { min-height: 500px; padding: 60px 20px; }
        }
      `}</style>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="hero-section hero-bg">
          <div className="hero-content">
            <h1 className="text-themed">Find Your Military Home</h1>
            <p className="text-secondary-themed">Discover homes near military bases with our specialized search platform</p>

            {/* Mode Toggle + Theme Toggle */}
            <div className="fade flex items-center justify-center gap-3 mb-8">
              <span className="text-xs font-semibold text-muted-themed morph">Civilian</span>
              <div className="toggle-track" onClick={toggleMode}>
                <div className="toggle-thumb">
                  <span>{isMil ? '\u{1F396}\uFE0F' : '\u{1F3E0}'}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-themed morph">Military</span>

              <div className="w-px h-5 bg-current opacity-10 mx-2" />

              <button
                onClick={toggleTheme}
                className="theme-toggle-btn morph flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                aria-label={theme === 'bright' ? 'Switch to dark mode' : 'Switch to bright mode'}
              >
                <span className="text-sm">{theme === 'bright' ? '\u2600\uFE0F' : '\u{1F319}'}</span>
                <span className="text-muted-themed morph">{theme === 'bright' ? 'Bright' : 'Dark'}</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="search-box search-box-c card-bg">
              <input type="text" placeholder="Address, city, or zip..." className="search-input input-c" />
              <button className="search-btn">Search</button>
            </div>

            {/* Pills */}
            <div className="pills-row">
              {(isMil ? milPills : civPills).map((pill, i) => (
                <button key={i} className="pill pill-c">
                  {typeof pill === 'string' ? pill : `${pill.icon} ${pill.label}`}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat card-bg stat-c">
                <div className="stat-number text-themed">12K+</div>
                <div className="stat-label text-secondary-themed">Active Listings</div>
              </div>
              <div className="stat card-bg stat-c">
                <div className="stat-number text-themed">{isMil ? '14' : '6'}</div>
                <div className="stat-label text-secondary-themed">{isMil ? 'Military Bases' : 'Cities'}</div>
              </div>
              <div className="stat card-bg stat-c">
                <div className="stat-number text-themed">4.9★</div>
                <div className="stat-label text-secondary-themed">Trusted Agents</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MIL COMMUTE BANNER ===== */}
        {isMil && (
          <section className="mil-only section-alt">
            <div className="container">
              <div className="mil-banner accent-bg-c">
                <div className="mil-banner-title text-themed">🎖️ Prioritizing Military Families</div>
                <div className="mil-banner-desc text-secondary-themed">
                  We specialize in homes near major military installations. Filter by commute time, BAH limits, and military-friendly neighborhoods.
                </div>
              </div>

              {selectedBase && (
                <div className="mil-banner accent-bg-c">
                  <div className="mil-banner-title text-themed">Selected Base: {militaryBasesList.find(b => b.name === selectedBase)?.shortName}</div>
                </div>
              )}

              <div className="mil-banner-title text-themed mt-6">Choose Your Base</div>
              <div className="base-selector">
                {bases.map((base) => (
                  <button
                    key={base.code}
                    className={`base-btn ${selectedBase === base.name ? 'active' : ''} text-secondary-themed`}
                    onClick={() => setSelectedBase(selectedBase === base.name ? null : base.name)}
                  >
                    <div className="font-bold text-themed">{base.code}</div>
                    <div className="text-xs text-muted-themed">{base.homes} homes</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== MORTGAGE CALCULATOR ===== */}
        <section className="section-alt">
          <div className="container">
            <h2 className="text-themed">Mortgage Calculator</h2>
            <p className="text-secondary-themed mb-8">Estimate your monthly payment with our interactive calculator</p>
            <MortgageCalculator />
          </div>
        </section>

        {/* ===== PREMIUM TEASER: SCHOOL INFO ===== */}
        {!user && (
          <section>
            <div className="container">
              <h2 className="text-themed">Find Schools & Commute Times</h2>
              <p className="text-secondary-themed mb-8">Unlock detailed school ratings, commute analysis, and neighborhood insights</p>
              <PremiumTeaser onSignup={handleSignup} />
            </div>
          </section>
        )}

        {/* ===== WORK COMMUTE (Logged in + Address) ===== */}
        {user && profile?.address && (
          <section className="section-alt">
            <div className="container">
              <h2 className="text-themed">Work Commute from {profile.address}</h2>
              <div className="cards-grid">
                {[
                  { place: 'Downtown Norfolk', time: '18 min', distance: '12 mi' },
                  { place: 'Naval Station Norfolk', time: '22 min', distance: '16 mi' },
                  { place: 'NAS Oceana', time: '14 min', distance: '9 mi' },
                ].map((commute, i) => (
                  <div key={i} className="card card-bg card-lift">
                    <div className="card-content">
                      <div className="text-themed font-bold text-lg">{commute.place}</div>
                      <div className="commute-accent text-lg font-bold mt-4">{commute.time}</div>
                      <div className="text-secondary-themed text-sm">{commute.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== FEATURED LISTINGS ===== */}
        <section>
          <div className="container">
            <h2 className="text-themed">Featured Listings</h2>
            <p className="text-secondary-themed mb-8">Handpicked homes perfect for your lifestyle</p>

            <div className="cards-grid">
              {listings.map((listing, i) => (
                <div key={i} className="card card-bg card-lift">
                  <div className="relative">
                    <img src={listing.img} alt={listing.address} className="card-img" />
                    {listing.badge && (
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-bold ${listing.badgeColor}`}>
                        {listing.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 overlay-grad" />
                  </div>
                  <div className="card-content">
                    <div className="text-themed font-bold text-lg">{listing.price}</div>
                    <div className="text-secondary-themed text-sm">{listing.address}</div>
                    <div className="text-secondary-themed text-xs">{listing.city}, {listing.state} {listing.zip}</div>
                    <div className="card-meta">
                      <div className="card-meta-item">
                        <div className="card-meta-label">Beds</div>
                        <div className="card-meta-value text-themed">{listing.beds}</div>
                      </div>
                      <div className="card-meta-item">
                        <div className="card-meta-label">Baths</div>
                        <div className="card-meta-value text-themed">{listing.baths}</div>
                      </div>
                      <div className="card-meta-item">
                        <div className="card-meta-label">SqFt</div>
                        <div className="card-meta-value text-themed">{listing.sqft}</div>
                      </div>
                    </div>
                    <div className="commute-accent text-sm mt-4 font-semibold">⏱️ {listing.commute}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MILITARY PCS HUB ===== */}
        {isMil && (
          <section className="mil-only section-alt">
            <div className="container">
              <h2 className="text-themed">Military PCS Hub</h2>
              <p className="text-secondary-themed mb-8">Everything you need for your permanent change of station</p>

              <div className="cards-grid">
                {[
                  { title: 'Base Directory', desc: 'Find all military bases in the Hampton Roads area', emoji: '🎖️' },
                  { title: 'BAH Calculator', desc: 'Calculate housing allowance for your rank and base', emoji: '💰' },
                  { title: 'Moving Guides', desc: 'Step-by-step PCS relocation resources', emoji: '📦' },
                  { title: 'School Finder', desc: 'Find top-rated schools near bases', emoji: '🏫' },
                ].map((item, i) => (
                  <div key={i} className="card card-bg card-lift">
                    <div className="card-content">
                      <div className="text-3xl mb-3">{item.emoji}</div>
                      <div className="text-themed font-bold text-lg">{item.title}</div>
                      <div className="text-secondary-themed text-sm mt-2">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== MAP CTA ===== */}
        <section className="section-alt">
          <div className="container text-center">
            <h2 className="text-themed">Explore by Map</h2>
            <p className="text-secondary-themed mb-8 max-w-2xl mx-auto">
              Visualize properties, military bases, schools, and commute times all in one interactive map
            </p>
            <button className="btn-primary" onClick={() => handleSignup('explore')}>
              Open Interactive Map
            </button>
          </div>
        </section>

        {/* ===== NEIGHBORHOODS ===== */}
        <section>
          <div className="container">
            <h2 className="text-themed">Explore Neighborhoods</h2>
            <p className="text-secondary-themed mb-8">Discover the best areas to live in Hampton Roads</p>

            <div className="cards-grid">
              {neighborhoods.map((neighborhood, i) => (
                <div key={i} className="neighborhood-card card-lift">
                  <img src={neighborhood.img} alt={neighborhood.name} />
                  <div className="neighborhood-card-overlay">
                    <div className="neighborhood-name">{neighborhood.name}</div>
                    <div className="neighborhood-meta">{neighborhood.count} listings from {neighborhood.from}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="section-alt">
          <div className="container">
            <h2 className="text-themed text-center">What Our Clients Say</h2>

            <div className="cards-grid">
              {[
                { text: 'Found our perfect home near NAS Oceana in just 2 weeks. The military-focused features made all the difference!', author: 'Sarah M.', role: 'Navy Family' },
                { text: 'The commute calculator helped us choose a neighborhood that works perfectly for our family. Highly recommend!', author: 'James T.', role: 'Coast Guard' },
                { text: 'Best real estate experience we\'ve had. They understand military life and it shows in every detail.', author: 'Michelle K.', role: 'Army Spouse' },
              ].map((testimonial, i) => (
                <div key={i} className="testimonial-card card-bg card-lift">
                  <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                  <div className="testimonial-text text-secondary-themed">{testimonial.text}</div>
                  <div className="testimonial-author text-themed">{testimonial.author}</div>
                  <div className="testimonial-role text-muted-themed">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section>
          <div className="container">
            <div className="cta-content">
              <h2 className="text-themed">Ready to Find Your Next Home?</h2>
              <p className="text-secondary-themed mb-8">
                Join thousands of military families and civilians finding their perfect home in Hampton Roads
              </p>
              <div className="cta-buttons">
                <button className="btn-primary" onClick={() => handleSignup('signup')}>
                  Get Started Free
                </button>
                <button className="btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="footer footer-bg-c">
          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="text-themed">Browse</h4>
              <a href="#" className="text-secondary-themed">All Listings</a>
              <a href="#" className="text-secondary-themed">Military Homes</a>
              <a href="#" className="text-secondary-themed">Neighborhoods</a>
              <a href="#" className="text-secondary-themed">Military Bases</a>
            </div>
            <div className="footer-col">
              <h4 className="text-themed">Tools</h4>
              <a href="#" className="text-secondary-themed">Mortgage Calculator</a>
              <a href="#" className="text-secondary-themed">School Finder</a>
              <a href="#" className="text-secondary-themed">Commute Times</a>
              <a href="#" className="text-secondary-themed">Market Insights</a>
            </div>
            <div className="footer-col">
              <h4 className="text-themed">Company</h4>
              <a href="#" className="text-secondary-themed">About Us</a>
              <a href="#" className="text-secondary-themed">Blog</a>
              <a href="#" className="text-secondary-themed">Contact</a>
              <a href="#" className="text-secondary-themed">Careers</a>
            </div>
            <div className="footer-col">
              <h4 className="text-themed">Legal</h4>
              <a href="#" className="text-secondary-themed">Privacy Policy</a>
              <a href="#" className="text-secondary-themed">Terms of Service</a>
              <a href="#" className="text-secondary-themed">Disclaimer</a>
              <a href="#" className="text-secondary-themed">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom text-secondary-themed">
            &copy; 2024 MilitaryHomeFinder. All rights reserved. | Made for military families, by people who understand military life.
          </div>
        </footer>
      </main>
    </div>
  )
}
