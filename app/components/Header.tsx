'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'

const navLinks = [
  { label: 'Buy', href: '/listings' },
  { label: 'Sell', href: '/sell' },
  { label: 'Map', href: '/map' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Military Resources', href: '/military-resources' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading, signOut, setShowAuthModal, setAuthView } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLoginClick = () => { setAuthView('login'); setShowAuthModal(true) }
  const handleRegisterClick = () => { setAuthView('register'); setShowAuthModal(true) }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-primary-500">Va</span>
                <span className="text-navy-800">Home</span>
                <span className="text-gray-400 font-light">.com</span>
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-500 transition-colors">{link.label}</Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+17577777577" className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors">(757) 777-7577</a>
            {loading ? (
              <div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard/favorites" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowUserMenu(false)}>Saved Homes</Link>
                      <Link href="/dashboard/searches" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowUserMenu(false)}>Saved Searches</Link>
                      <Link href="/dashboard/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowUserMenu(false)}>My Profile</Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={() => { signOut(); setShowUserMenu(false) }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign Out</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleLoginClick} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Sign In</button>
                <button onClick={handleRegisterClick} className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors shadow-sm">Get Started</button>
              </div>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle menu">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
            ))}
            <div className="mt-4 px-4 space-y-3">
              <a href="tel:+17577777577" className="block text-center py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg">(757) 777-7577</a>
              {user ? (
                <>
                  <Link href="/dashboard/favorites" className="block text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Saved Homes</Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false) }} className="block w-full text-center py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg">Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); handleLoginClick() }} className="block w-full text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg">Sign In</button>
                  <button onClick={() => { setMobileMenuOpen(false); handleRegisterClick() }} className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg">Get Started</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
