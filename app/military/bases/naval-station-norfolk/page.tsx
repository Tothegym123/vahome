import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Naval Station Norfolk Housing & Best Neighborhoods 2026 | VaHome',
  description:
    'Active-duty Navy housing guide for Naval Station Norfolk. BAH-aware home search, drive-time map, neighborhoods, schools, VA loans. Local Hampton Roads experts.',
  alternates: { canonical: 'https://vahome.com/military/bases/naval-station-norfolk/' },
}

const stats = [
  { label: 'Active duty in region', value: '~75,000' },
  { label: 'Median price within 30 min', value: '$324,500' },
  { label: 'Active VA-eligible listings', value: '~1,400' },
  { label: 'BAH (E-5 with deps)', value: '$2,430' },
]

const cities = [
  { name: 'Norfolk', drive: '10 min', median: '$295K', summary: 'The most direct option. Ghent, Larchmont, Colonial Place. Strong walkability and downtown access.', slug: 'norfolk' },
  { name: 'Virginia Beach', drive: '20ÃÂ¢ÃÂÃÂ30 min', median: '$390K', summary: 'More space, newer construction, stronger schools. Kings Grant, Salem, Kempsville.', slug: 'virginia-beach' },
  { name: 'Chesapeake', drive: '25ÃÂ¢ÃÂÃÂ30 min', median: '$355K', summary: 'Larger lots, lower property taxes, top schools in Western Branch and Great Bridge.', slug: 'chesapeake' },
  { name: 'Portsmouth', drive: '15ÃÂ¢ÃÂÃÂ20 min via Midtown Tunnel', median: '$255K', summary: 'Most affordable. Olde Towne and Churchland are popular military neighborhoods.', slug: 'portsmouth' },
]

const bahRows = [
  { paygrade: 'E-5', deps: '$2,430', noDeps: '$2,082', maxHome: '$320K' },
  { paygrade: 'E-7', deps: '$2,718', noDeps: '$2,253', maxHome: '$358K' },
  { paygrade: 'O-3', deps: '$3,003', noDeps: '$2,538', maxHome: '$395K' },
  { paygrade: 'O-5', deps: '$3,318', noDeps: '$2,898', maxHome: '$437K' },
]

const neighborhoods = [
  { name: 'Ghent', city: 'Norfolk', drive: '10 min', median: '$365K', blurb: 'Historic rowhouses, walkable shops and restaurants. Popular with O-3+ without kids or with younger kids.' },
  { name: 'Larchmont', city: 'Norfolk', drive: '8 min', median: '$425K', blurb: 'Mid-century single-family homes between ODU and the Lafayette River. Top-rated schools.' },
  { name: 'Colonial Place', city: 'Norfolk', drive: '12 min', median: '$355K', blurb: 'Bungalows and craftsmen on the Lafayette River. Walkable to Granby Street.' },
  { name: 'Edgewater', city: 'Norfolk', drive: '14 min', median: '$355K', blurb: 'Smaller historic neighborhood with tightly held inventory. Quick Hampton Blvd access.' },
  { name: 'Park Place', city: 'Norfolk', drive: '15 min', median: '$250K', blurb: 'Affordable historic Norfolk. Significant rehab activity, up-and-coming.' },
  { name: 'Kings Grant', city: 'Virginia Beach', drive: '22 min', median: '$485K', blurb: 'Mid-century cul-de-sac neighborhood off Little Neck Road. Top VB schools, large lots.' },
  { name: 'Western Branch', city: 'Chesapeake', drive: '25 min', median: '$370K', blurb: 'Established suburban with top-rated Chesapeake schools. Lower property tax than Norfolk.' },
  { name: 'Olde Towne', city: 'Portsmouth', drive: '18 min', median: '$385K', blurb: 'Restored 18th- and 19th-century homes overlooking the Elizabeth River.' },
]

const faqs = [
  { q: 'What\'s the average commute time to Naval Station Norfolk?', a: 'From central Norfolk, 10 minutes. From central Virginia Beach, 25 minutes. From Chesapeake, 25 minutes. From Portsmouth via Midtown Tunnel, 20 minutes (longer during peak hours).' },
  { q: 'Where do most NSN officers and senior enlisted live?', a: 'The most popular neighborhoods are Ghent and Larchmont in Norfolk (close-in, walkable), Kings Grant and Great Neck in Virginia Beach (better schools, longer commute), and Western Branch in Chesapeake (suburban, top-rated schools).' },
  { q: 'What\'s the BAH for Naval Station Norfolk in 2026?', a: 'NSN is in the Norfolk MHA (VA058). 2026 BAH ranges from $1,758/month (E-1 with deps) to $3,729/month (O-7+ with deps). Use the BAH calculator for your specific paygrade.' },
  { q: 'Can I use a VA loan to buy a home near Naval Station Norfolk?', a: 'Yes. About 60% of buyers near NSN use VA loans. The 2026 county loan limit is $766,550. Most NSN-area sellers are comfortable with VA offers.' },
  { q: 'Should I buy or rent for my Naval Station Norfolk tour?', a: 'Most E-5+ with dependents on a 24+ month tour come out ahead financially by buying with a VA loan, especially given Hampton Roads\' generally appreciating market.' },
  { q: 'How early should I start my NSN home search?', a: '90 days before your report-no-later date is ideal. Summer PCS season (May-August) inventory tightens fast.' },
]

export default function NavalStationNorfolkPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: 'Naval Station Norfolk',
        description: 'The largest naval complex in the world, home port to the Atlantic Fleet.',
        address: { '@type': 'PostalAddress', addressLocality: 'Norfolk', addressRegion: 'VA', addressCountry: 'US' },
        geo: { '@type': 'GeoCoordinates', latitude: 36.9489, longitude: -76.3275 },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vahome.com/' },
          { '@type': 'ListItem', position: 2, name: 'Military', item: 'https://vahome.com/military/' },
          { '@type': 'ListItem', position: 3, name: 'Bases', item: 'https://vahome.com/military/bases/' },
          { '@type': 'ListItem', position: 4, name: 'Naval Station Norfolk' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-sm text-blue-300 font-semibold mb-3">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/" className="hover:underline">Bases</Link>
            <span className="mx-2">/</span>
            <span>Naval Station Norfolk</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Naval Station Norfolk Housing &amp; Relocation Guide (2026)
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl">
            The largest naval complex in the world. Find your home near NSN with the VaHome Team &mdash; military relocation
            specialists in Hampton Roads since 2019.
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* About */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Naval Station Norfolk</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Naval Station Norfolk (NSN) sits at the western edge of the city of Norfolk on the Hampton Roads harbor. It is the largest naval complex in the world by personnel and waterfront,
            home port to more than 75 ships and 130 aircraft, and headquarters to the Atlantic Fleet. Roughly 75,000 active-duty Navy personnel are assigned regionally, plus tens of thousands of supporting civilian DoD and contractor employees.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The base has multiple gates: Gate 5 (main entrance off Hampton Boulevard), Gate 1 (off I-564), Gate 6 (off Princess Anne Road), and others.
            Most off-base traffic flows through Gate 5 and Gate 22. Morning rush hour (06:00&ndash;07:30) and shift change (15:30&ndash;16:30) are the highest-traffic windows.
          </p>
          <p className="text-gray-700 leading-relaxed">
            NSN is the operational anchor for Atlantic-side U.S. Navy life. If you have orders to NSN, you&rsquo;re likely on a 24- to 36-month accompanied tour.
            Many families decide that&rsquo;s enough time to buy rather than rent &mdash; at 2026 BAH rates and Hampton Roads prices, the math typically favors ownership for E-5 and above with dependents.
          </p>
        </section>

        {/* Best cities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Best cities to live near Naval Station Norfolk</h2>
          <div className="space-y-4">
            {cities.map((c) => (
              <div key={c.slug} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
                  <span className="text-sm text-gray-500">{c.drive} &middot; median {c.median}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{c.summary}</p>
                <Link href={`/military/military-friendly-neighborhoods/${c.slug}/`} className="text-blue-600 font-semibold text-sm hover:underline">
                  Best {c.name} neighborhoods for military families &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BAH */}
        <section className="mb-12 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">BAH near Naval Station Norfolk: what your paygrade covers</h2>
          <p className="text-gray-700 mb-4">NSN is in the Norfolk MHA (VA058). Selected 2026 BAH rates and approximate home prices covered:</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Paygrade</th>
                  <th className="text-left p-3">With deps</th>
                  <th className="text-left p-3">Without deps</th>
                  <th className="text-left p-3">Approx. home price covered*</th>
                </tr>
              </thead>
              <tbody>
                {bahRows.map((r) => (
                  <tr key={r.paygrade} className="border-t border-gray-100">
                    <td className="p-3 font-semibold">{r.paygrade}</td>
                    <td className="p-3">{r.deps}</td>
                    <td className="p-3">{r.noDeps}</td>
                    <td className="p-3">{r.maxHome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            *Assumes 6.5% rate, $0 down VA loan, 1.0% Norfolk-area property tax, standard insurance.
          </p>
          <Link
            href="/military/bah-calculator/hampton-roads/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm"
          >
            Use the full BAH calculator &rarr;
          </Link>
        </section>

        {/* VA loan */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Using a VA loan to buy near NSN</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most NSN buyers use a VA loan. Hampton Roads has one of the highest VA-loan acceptance rates in the country, and NSN-area sellers
            are especially comfortable with VA buyers since 50%+ of regional buyers are military.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li>Zero down payment</li>
            <li>No private mortgage insurance</li>
            <li>2026 county loan limit: $766,550 (most NSN-area properties qualify)</li>
            <li>Funding fee: 1.65% (5%+ down, first use) to 3.30% (subsequent use, no down payment)</li>
            <li>VA-friendly Hampton Roads lenders typically close in 25&ndash;30 days</li>
          </ul>
          <Link
            href="/military/va-loan-homes/hampton-roads/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm"
          >
            VA loan homes in Hampton Roads &rarr;
          </Link>
        </section>

        {/* Top neighborhoods */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top neighborhoods near Naval Station Norfolk</h2>
          <p className="text-gray-700 mb-6">The 8 most popular neighborhoods for NSN-assigned military families, ranked by drive time and value.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {neighborhoods.map((n) => (
              <div key={n.name} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{n.name}</h3>
                  <span className="text-xs text-gray-500">{n.drive}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">{n.city} &middot; median {n.median}</div>
                <p className="text-gray-700 text-sm">{n.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Local Realtor commentary */}
        <section className="mb-12 bg-gradient-to-br from-blue-50 to-slate-50 border-l-4 border-blue-600 rounded-r-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Local Realtor commentary</h2>
          <p className="text-gray-700 leading-relaxed italic mb-4">
            &ldquo;I&rsquo;ve helped more than 80 NSN families relocate over the last four years. The single biggest mistake I see is buyers who pick a neighborhood
            based on a 9pm Sunday Google Maps drive time. Try driving from your prospective neighborhood to NSN&rsquo;s Gate 5 at 6:45 AM on a Tuesday in July
            &mdash; it&rsquo;s a different world. Tunnels matter. Hampton Boulevard&rsquo;s traffic patterns matter. The neighborhoods that look identical on paper
            can be a 12-minute commute or a 35-minute commute depending on the day.&rdquo;
          </p>
          <div className="text-sm text-gray-700">
            <strong>Tom Milan</strong>, VaHome Team &middot; Licensed Realtor, Virginia &middot; 2025&ndash;2026 Top Producer
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl p-4 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition">&darr;</span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related bases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Hampton Roads bases</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Link href="/military/bases/nas-oceana/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">NAS Oceana</Link>
            <Link href="/military/bases/jeb-little-creek-fort-story/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">JEB Little Creek-Fort Story</Link>
            <Link href="/military/bases/joint-base-langley-eustis/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">Joint Base Langley-Eustis</Link>
            <Link href="/military/bases/naval-medical-center-portsmouth/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">NMC Portsmouth</Link>
            <Link href="/military/bases/norfolk-naval-shipyard/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">Norfolk Naval Shipyard</Link>
            <Link href="/military/bases/coast-guard-base-portsmouth/" className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-gray-700">Coast Guard Base Portsmouth</Link>
          </div>
        </section>
      </article>

      {/* CTA strip */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Schedule a 15-minute NSN relocation call</h2>
          <p className="text-blue-100 mb-6">Free first call &middot; No obligation &middot; Direct line to a military-experienced agent</p>
          <a
            href="tel:+17577777577"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg"
          >
            Call (757) 777-7577
          </a>
        </div>
      </section>
    
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAVSTA-Norfolk/" target="_blank" rel="noopener noreferrer" className="underline">Commander, Navy Region Mid-Atlantic (CNIC)</a> for installation facts; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH Calculator</a> for 2026 Norfolk MHA rates.
        </p>
      </section>
    </main>
  )
}
