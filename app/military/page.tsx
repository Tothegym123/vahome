import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Military Real Estate in Hampton Roads | VaHome.com',
  description:
    'Real estate platform built for Hampton Roads military families. Drive-time home search by base, BAH-aware filters, VA loan tools, PCS guides. Norfolk, Oceana, JBLE & more.',
  alternates: { canonical: 'https://vahome.com/military/' },
}

const tier1Bases = [
  { slug: 'naval-station-norfolk', name: 'Naval Station Norfolk', branch: 'Navy', city: 'Norfolk' },
  { slug: 'nas-oceana', name: 'NAS Oceana', branch: 'Navy', city: 'Virginia Beach' },
  { slug: 'jeb-little-creek-fort-story', name: 'JEB Little Creek-Fort Story', branch: 'Navy / Army', city: 'Virginia Beach' },
  { slug: 'joint-base-langley-eustis', name: 'Joint Base Langley-Eustis', branch: 'Air Force / Army', city: 'Hampton / Newport News' },
]

const tier2Bases = [
  { slug: 'naval-medical-center-portsmouth', name: 'Naval Medical Center Portsmouth', branch: 'Navy', city: 'Portsmouth' },
  { slug: 'norfolk-naval-shipyard', name: 'Norfolk Naval Shipyard', branch: 'Navy', city: 'Portsmouth' },
  { slug: 'coast-guard-base-portsmouth', name: 'Coast Guard Base Portsmouth', branch: 'Coast Guard', city: 'Portsmouth' },
  { slug: 'dam-neck-annex', name: 'Dam Neck Annex', branch: 'Navy', city: 'Virginia Beach' },
  { slug: 'naval-weapons-station-yorktown', name: 'NWS Yorktown', branch: 'Navy', city: 'Yorktown' },
]

export default function MilitaryHomePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="inline-block bg-blue-600/20 border border-blue-400/30 rounded-full px-4 py-1 text-sm font-semibold mb-6">
            Built for military families
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Hampton Roads real estate, built for military families.
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mb-8 leading-relaxed">
            Drive-time home search by base. BAH-aware affordability. VA loan tools. PCS guides written by agents who&rsquo;ve done the move themselves.
            From Naval Station Norfolk to Joint Base Langley-Eustis &mdash; we cover all 10 Hampton Roads installations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/military/relocation/hampton-roads/"
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-3 rounded-lg"
            >
              Hampton Roads relocation guide
            </Link>
            <Link
              href="/military/bah-calculator/hampton-roads/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              BAH calculator
            </Link>
            <Link
              href="/military/pcs-to/hampton-roads/"
              className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg"
            >
              PCS to Hampton Roads
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600 mt-1">Military installations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">~120K</div>
            <div className="text-sm text-gray-600 mt-1">DoD personnel in region</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">41%</div>
            <div className="text-sm text-gray-600 mt-1">VA share of HR purchase loans</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">$355K</div>
            <div className="text-sm text-gray-600 mt-1">Median home price (Jan 2026)</div>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500 text-center max-w-3xl mx-auto px-4">
          Sources: <a href="https://www.hrmffa.org/about-us" target="_blank" rel="noopener noreferrer" className="underline">HRMFFA</a> (installations + personnel); <a href="https://jenniferdawnrealestate.com/hampton-roads-virginia-housing-market-overview" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a> (Jan 2026 median); <a href="https://www.tieronecoastal.com/va-loans-hampton-roads-military-buyers/" target="_blank" rel="noopener noreferrer" className="underline">2024 HMDA</a> (VA loan share).
        </p>
      </section>

      {/* Three pillars */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/military/relocation/hampton-roads/"
            className="block border border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">ðºï¸</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Relocation guide</h2>
            <p className="text-gray-600 text-sm">
              Complete 2026 guide to Hampton Roads &mdash; every base, every city, schools, BAH, VA loans, flood zones, PCS season.
            </p>
            <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">Read the guide &rarr;</span>
          </Link>

          <Link
            href="/military/bah-calculator/hampton-roads/"
            className="block border border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">ð°</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">BAH calculator</h2>
            <p className="text-gray-600 text-sm">
              2026 Norfolk MHA rates by paygrade &amp; dependents. See your max affordable home price &mdash; then jump straight to listings in range.
            </p>
            <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">Run the calculator &rarr;</span>
          </Link>

          <Link
            href="/military/va-loan-homes/hampton-roads/"
            className="block border border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">ðºð¸</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">VA loan homes</h2>
            <p className="text-gray-600 text-sm">
              $0 down. No PMI. 2026 limits, eligibility, funding fee. Browse VA-eligible homes across Hampton Roads.
            </p>
            <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">VA loan homes &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Bases grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Search by base</h2>
        <p className="text-gray-600 mb-8">
          Each base hub has drive-time radius search, BAH calculator, top neighborhoods, schools, and live MLS listings.
        </p>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Largest installations</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {tier1Bases.map((b) => (
            <Link
              key={b.slug}
              href={`/military/bases/${b.slug}/`}
              className="block border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{b.branch}</div>
              <div className="font-bold text-gray-900 mb-1">{b.name}</div>
              <div className="text-sm text-gray-500">{b.city}</div>
            </Link>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Other Hampton Roads installations</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tier2Bases.map((b) => (
            <Link
              key={b.slug}
              href={`/military/bases/${b.slug}/`}
              className="block border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{b.branch}</div>
              <div className="font-bold text-gray-900 mb-1">{b.name}</div>
              <div className="text-sm text-gray-500">{b.city}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Talk to a military relocation Realtor</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            The VaHome Team has helped hundreds of military families relocate to Hampton Roads since 2019. The first call is free and there&rsquo;s no obligation.
          </p>
          <a
            href="tel:+17577777577"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg"
          >
            Call (757) 777-7577
          </a>
        </div>
      </section>
    </main>
  )
}
