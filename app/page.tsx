import HomeClient from './HomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VaHome.com â Real Estate in Hampton Roads, Virginia | Tom Milan, Realtor',
  description: 'Search Hampton Roads homes for sale. Military mode for PCS-ing service members with BAH-matched listings, base commute filters, and VA-loan home guides for Virginia Beach, Norfolk, Chesapeake, Portsmouth, Hampton, Newport News, Suffolk, and Williamsburg.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'VaHome.com â Real Estate in Hampton Roads, Virginia',
    description: 'Search Hampton Roads homes with military mode, BAH-matched listings, and VA-loan guides.',
    url: 'https://vahome.com/',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
