'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Buy', href: '/listings' },
  { label: 'Sell', href: '/sell' },
  { label: 'Map', href: '/map' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-primary-500">Va</span>
                <span className="text-navy-800">Home</span>
                <span className="text-gray-400 font-light">.com</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+17577777577"
              className="text-sm font-medium text-gray-600 hover:text-primary-500 transition-colors"
            >
              (757) 777-7577
            </a>
            <Link
              href="/contact"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 px-4 space-y-3">
              <a
                href="tel:+17577777577"
                className="block text-center py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg"
              >
                (757) 777-7577
              </a>
              <Link
                href="/contact"
                className="block text-center py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
