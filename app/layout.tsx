import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthProvider from './components/AuthProvider'
import AuthModal from './components/AuthModal'
import OnboardingModal from './components/OnboardingModal'
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsEventTracker from './components/AnalyticsEventTracker'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://vahome.com"),
  title: 'VaHome.com | Homes for Sale in Hampton Roads, Virginia Beach & Norfolk',
  description: 'Search homes for sale in Hampton Roads, Virginia Beach, Norfolk, Chesapeake & Suffolk. The VaHome Team - your trusted local real estate experts at LPT Realty.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <AuthModal />
          <OnboardingModal />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
        <GoogleAnalytics gaId="G-6DVKNGSKMB" />
        <AnalyticsEventTracker />
      </body>
    </html>
  )
}
