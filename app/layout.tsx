import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'VaHome.com | Homes for Sale in Hampton Roads, Virginia Beach & Norfolk',
  description: 'Search homes for sale in Hampton Roads, Virginia Beach, Norfolk, Chesapeake & Suffolk. Tom & Dariya Milan \u2014 your trusted local real estate experts at LPT Realty.',
  keywords: 'homes for sale, Virginia Beach, Hampton Roads, Norfolk, Chesapeake, real estate, LPT Realty, Tom Milan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
