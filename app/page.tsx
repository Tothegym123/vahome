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
