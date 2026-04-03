import SearchBar from './components/SearchBar'
import AreaCard from './components/AreaCard'
import Link from 'next/link'

const areas = [
  { name: 'Virginia Beach', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=450&fit=crop', listingCount: 2400, href: '/listings?area=virginia-beach' },
  { name: 'Norfolk', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop', listingCount: 1200, href: '/listings?area=norfolk' },
  { name: 'Chesapeake', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=450&fit=crop', listingCount: 1800, href: '/listings?area=chesapeake' },
  { name: 'Suffolk', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop', listingCount: 950, href: '/listings?area=suffolk' },
  { name: 'Hampton', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=450&fit=crop', listingCount: 800, href: '/listings?area=hampton' },
  { name: 'Newport News', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop', listingCount: 700, href: '/listings?area=newport-news' },
]

export default function HomePage() {
  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&q=90)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/30 to-navy-900/65" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto pt-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Find Your Perfect Home in<br />
            <span className="text-primary-400">Hampton Roads</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Search thousands of homes for sale in Virginia Beach, Norfolk, Chesapeake & beyond.
          </p>

          <SearchBar />

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-white/70 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5,000+</div>
              <div>Active Listings</div>
            </div>
            
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10+</div>
              <div>Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== EXPLORE AREAS ========== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Explore Hampton Roads
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Browse homes for sale in the most popular cities across Hampton Roads, Virginia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <AreaCard key={area.name} {...area} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Work With Us
            </h2>
            <p className="text-gray-500 text-lg">
              The VaHome Team â your local Hampton Roads real estate experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We live, work, and invest in Hampton Roads. Nobody knows these neighborhoods better than we do.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">5-Star Service</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every client gets our full attention and we are committed to helping you find the best deal.</p>
            </div>

            {/* Card 3 */}
            <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Investor Insight</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                As active real estate investors, we spot value others miss. We&apos;ll help you find the best deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* ========== CTA SECTION ========== */}
      <section className="py-20 px-4 bg-primary-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Whether you&apos;re buying your first home or your fifth, we&apos;re here to help every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-primary-500 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg text-base"
            >
              Schedule a Consultation
            </Link>
            <a
              className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors border border-white/20 text-base"
            >
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
