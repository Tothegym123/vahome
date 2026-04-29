import Link from 'next/link'

export const metadata = {
  alternates: { canonical: "/sell/" },
  title: 'Sell Your Home in Hampton Roads | VaHome.com',
  description:
    'Get a free, no-obligation home valuation from the VaHome Team. Selling in Virginia Beach, Norfolk, Chesapeake, Suffolk and beyond.',
}

export default function SellPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Sell Your Home</h1>
          <section className="max-w-4xl mx-auto px-6 py-8">
            <p className="text-gray-700 leading-relaxed text-base">{`Selling a home in Hampton Roads requires understanding what makes each submarket distinct. Virginia Beach oceanfront properties move on different timelines than Chesapeake suburban subdivisions or Norfolk historic homes. The VaHome team prepares a detailed, data-backed valuation for every seller based on recent comparable sales, current inventory, your home's specific features, and seasonal market trends. From there, we develop a custom marketing plan that may include professional photography and video, a Mapbox-powered interactive map listing, MLS syndication to all major search portals, social media advertising, and direct outreach to our buyer database. Our goal is to maximize your sale price while minimizing time on market and the stress of the selling process.`}</p>
          </section>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get a free, no-obligation valuation and a clear plan to maximize your sale price.
            The VaHome Team handles every step from listing to closing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-3">ð</div>
            <h3 className="font-bold text-gray-900 mb-2">Free Home Valuation</h3>
            <p className="text-sm text-gray-600">
              Real comps, real numbers, no AI guesses. We tour your home and price it to sell fast.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-3">ð¸</div>
            <h3 className="font-bold text-gray-900 mb-2">Pro Photography &amp; Marketing</h3>
            <p className="text-sm text-gray-600">
              HDR photography, drone footage, video tours, and full MLS + Zillow + Realtor.com syndication.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-3xl mb-3">ð¤</div>
            <h3 className="font-bold text-gray-900 mb-2">Negotiation &amp; Closing</h3>
            <p className="text-sm text-gray-600">
              We handle every offer, inspection, and contingency to get you to a smooth closing.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to start?</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your home and we&apos;ll send a free valuation within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?intent=estimate"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Free Valuation
            </Link>
            <a
              href="tel:+17577777577"
              className="inline-block border border-gray-300 hover:border-primary-500 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Call (757) 777-7577
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
