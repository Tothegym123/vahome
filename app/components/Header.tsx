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
  { label: 'Military Resources', href: '/military' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading, signOut, setShowAuthModal, setAuthView, theme } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const isDark = theme === 'dark'

  const handleLoginClick = () => { setAuthView('login'); setShowAuthModal(true) }
  const handleRegisterClick = () => { setAuthView('register'); setShowAuthModal(true) }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${isDark ? 'bg-gray-900 border-b border-gray-800' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-red-600">Va</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Home</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>.com</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-red-400' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'}`}>{link.label}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className={`w-20 h-10 rounded-lg animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
            ) : user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
                  <svg className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border py-2 z-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                      </div>
                      <Link href="/settings" className={`block px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setShowUserMenu(false)}>Settings</Link>
                      <Link href="/dashboard/favorites" className={`block px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setShowUserMenu(false)}>Saved Homes</Link>
                      <div className={`border-t mt-1 pt-1 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <button onClick={() => { signOut(); setShowUserMenu(false) }}
                          className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}>Sign Out</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleLoginClick}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`}>Sign In</button>
                <button onClick={handleRegisterClick}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">Get Started</button>
              </div>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`} aria-label="Toggle menu">
            <svg className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen
                ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />)
                : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-red-400' : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'}`}
                onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
            ))}
            <div className="mt-4 px-4 space-y-3">
              {user ? (
                <>
                  <Link href="/settings" className={`block text-center py-2.5 text-sm font-medium border rounded-lg ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'}`}
                    onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false) }}
                    className={`block w-full text-center py-2.5 text-sm font-medium border rounded-lg ${isDark ? 'text-red-400 border-red-800' : 'text-red-600 border-red-200'}`}>Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); handleLoginClick() }}
                    className={`block w-full text-center py-2.5 text-sm font-medium border rounded-lg ${isDark ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200'}`}>Sign In</button>
                  <button onClick={() => { setMobileMenuOpen(false); handleRegisterClick() }}
                    className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg">Get Started</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
