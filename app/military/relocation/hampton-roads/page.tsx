import type { Metadata } from 'next'
import Link from 'next/link'
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: 'Military Relocation to Hampton Roads VA | VaHome 2026 Guide',
  description:
    'Complete 2026 military relocation guide to Hampton Roads. Live near Naval Station Norfolk, NAS Oceana, JBLE & more. BAH-aware home search. VA loan ready.',
  alternates: { canonical: 'https://vahome.com/military/relocation/hampton-roads/' },
}

const bases = [
  { slug: 'naval-station-norfolk', name: 'Naval Station Norfolk', tier: 'Largest naval installation in the world.', cities: ['Norfolk', 'Virginia Beach', 'Chesapeake', 'Portsmouth'] },
  { slug: 'nas-oceana', name: 'NAS Oceana', tier: 'East Coast master jet base. F/A-18 Super Hornet squadrons.', cities: ['Virginia Beach'] },
  { slug: 'jeb-little-creek-fort-story', name: 'JEB Little Creek-Fort Story', tier: 'Navy Special Warfare and amphibious forces.', cities: ['Virginia Beach', 'Norfolk'] },
  { slug: 'joint-base-langley-eustis', name: 'Joint Base Langley-Eustis', tier: 'Air Combat Command HQ + Army Transportation Center.', cities: ['Hampton', 'Newport News', 'Yorktown', 'Williamsburg'] },
  { slug: 'naval-medical-center-portsmouth', name: 'Naval Medical Center Portsmouth', tier: 'Largest Navy medical facility on the East Coast.', cities: ['Portsmouth', 'Suffolk', 'Chesapeake'] },
  { slug: 'norfolk-naval-shipyard', name: 'Norfolk Naval Shipyard', tier: "One of the Navy's largest shipyards.", cities: ['Portsmouth', 'Chesapeake', 'Suffolk'] },
  { slug: 'coast-guard-base-portsmouth', name: 'Coast Guard Base Portsmouth', tier: 'Coast Guard Atlantic Area HQ.', cities: ['Portsmouth', 'Suffolk'] },
  { slug: 'dam-neck-annex', name: 'Dam Neck Annex', tier: 'NAS Oceana annex with specialized warfare units.', cities: ['Virginia Beach'] },
  { slug: 'naval-weapons-station-yorktown', name: 'Naval Weapons Station Yorktown', tier: 'Munitions storage and ordnance handling.', cities: ['Yorktown', 'Williamsburg', 'Newport News'] },
]

const cities = [
  { slug: 'virginia-beach', name: 'Virginia Beach', median: '$390K', summary: 'Largest Hampton Roads city. Oceanfront, golf-course communities, established family neighborhoods. Strongest proximity to NAS Oceana, JEB Little Creek, Dam Neck.' },
  { slug: 'norfolk', name: 'Norfolk', median: '$310K', summary: 'Most diverse housing stock. Ghent, Larchmont, Colonial Place. 10 minutes from Naval Station Norfolk.' },
  { slug: 'chesapeake', name: 'Chesapeake', median: '$355K', summary: 'Suburban with great schools and lower property taxes. Western Branch and Great Bridge are the most-popular zones.' },
  { slug: 'suffolk', name: 'Suffolk', median: '$320K', summary: 'Fastest-growing city. Harbour View and Burbage Grant are the new-construction hotspots.' },
  { slug: 'portsmouth', name: 'Portsmouth', median: '$255K', summary: 'Most affordable. Olde Towne historic district overlooking the Elizabeth River.' },
  { slug: 'hampton', name: 'Hampton', median: '$265K', summary: 'Closest to Langley AFB. Phoebus, Wythe, Buckroe Beach are top military neighborhoods.' },
  { slug: 'newport-news', name: 'Newport News', median: '$285K', summary: 'Shipyard town. Fort Eustis on one end, Newport News Shipbuilding on the other.' },
  { slug: 'williamsburg', name: 'Williamsburg', median: '$410K', summary: 'Top schools (Williamsburg-James City). Historic colonial heart of Virginia.' },
]

const bahTable = [
  { paygrade: 'E-5', withDeps: '$2,430', noDeps: '$2,082' },
  { paygrade: 'E-7', withDeps: '$2,718', noDeps: '$2,253' },
  { paygrade: 'O-3', withDeps: '$3,003', noDeps: '$2,538' },
  { paygrade: 'O-5', withDeps: '$3,318', noDeps: '$2,898' },
]

const faqs = [
  { q: 'How many military bases are in Hampton Roads?', a: 'There are 10 major military installations in Hampton Roads: Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, Joint Base Langley-Eustis (which includes both Langley AFB and Fort Eustis), Naval Medical Center Portsmouth, Norfolk Naval Shipyard, Coast Guard Base Portsmouth, Dam Neck Annex, and Naval Weapons Station Yorktown.' },
  { q: 'What\'s the BAH for Hampton Roads in 2026?', a: 'Hampton Roads is split into TWO Military Housing Areas per DTMO. VA298 Norfolk/Portsmouth (Southside — covers Norfolk, Portsmouth, Virginia Beach, Chesapeake, Suffolk; bases NSN, Oceana, Little Creek, NMCP, NSY, CGB Portsmouth) pays $108-225/mo more than VA297 Hampton/Newport News (Peninsula — covers Hampton, Newport News, Williamsburg, York County; bases JBLE and NWS Yorktown). 2026 examples with dependents: E-5 Southside $2,430 vs Peninsula $2,274; O-3 Southside $2,694 vs Peninsula $2,475. See the BAH calculator page for the full DTMO-sourced rate tables.' },
  { q: 'Can I use a VA loan in Hampton Roads?', a: 'Yes. Hampton Roads is one of the most VA-loan-friendly markets in the country. The 2026 county loan limit for most of the region is $766,550. Most sellers accept VA offers without issue.' },
  { q: 'Which Hampton Roads cities have the best schools for military families?', a: 'By overall public school ranking: York County, Williamsburg-James City, and Virginia Beach City Public Schools are typically the top three. Portsmouth, Norfolk, and Hampton have improving districts with strong magnet programs.' },
  { q: 'How early should I start my Hampton Roads PCS home search?', a: '90 days before your report-no-later date is ideal, especially for summer PCS season (May-August). Start with VA loan pre-approval, then connect with a Hampton Roads agent who handles military relocations regularly.' },
  { q: 'Do I have to live near my base?', a: 'No. BAH is paid based on your assigned duty station regardless of where you live. Many Hampton Roads military families live 25-35 minutes from base, in cheaper or better-school neighborhoods.' },
]

export default function HamptonRoadsRelocationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Military Relocation to Hampton Roads, Virginia (2026 Guide)',
        datePublished: '2026-04-28',
        dateModified: '2026-04-28',
        author: { '@type': 'Organization', name: 'VaHome Team' },
        publisher: {
          '@type': 'Organization',
          name: 'VaHome',
          logo: { '@type': 'ImageObject', url: 'https://vahome.com/logo.png' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vahome.com/' },
          { '@type': 'ListItem', position: 2, name: 'Military', item: 'https://vahome.com/military/' },
          { '@type': 'ListItem', position: 3, name: 'Relocation', item: 'https://vahome.com/military/relocation/' },
          { '@type': 'ListItem', position: 4, name: 'Hampton Roads' },
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
      {
        '@type': 'RealEstateAgent',
        name: 'VaHome Team',
        url: 'https://vahome.com/',
        telephone: '+17577777577',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '249 Central Park Ave Ste 300',
          addressLocality: 'Virginia Beach',
          addressRegion: 'VA',
          postalCode: '23462',
          addressCountry: 'US',
        },
      },
    ],
  }

  return (
    <main className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-sm text-blue-300 font-semibold mb-3">Updated April 2026 &middot; VaHome Team</div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Military Relocation to Hampton Roads, Virginia (2026 Guide)
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl">
            Hampton Roads is home to the largest concentration of active-duty military in the country. Wherever your orders are sending
            you &mdash; Naval Station Norfolk, NAS Oceana, JEB Little Creek, Langley-Eustis, or any of the seven other major installations
            in the region &mdash; the VaHome Team has helped hundreds of military families like yours find the right home, near the right base, on the right timeline.
          </p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-2xl font-bold text-gray-900">10</div><div className="text-xs text-gray-600">Major bases</div></div>
          <div><div className="text-2xl font-bold text-gray-900">~120K</div><div className="text-xs text-gray-600">Active duty</div></div>
          <div><div className="text-2xl font-bold text-gray-900">$355K</div><div className="text-xs text-gray-600">Median price</div></div>
          <div><div className="text-2xl font-bold text-gray-900">85%</div><div className="text-xs text-gray-600">VA-eligible inventory</div></div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-12 prose-headings:text-gray-900 prose-p:text-gray-700">
        {/* Why Hampton Roads */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Hampton Roads is the densest military region in the country</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hampton Roads spans seven cities and surrounding counties at the mouth of the Chesapeake Bay. It&rsquo;s the home of Naval Station Norfolk &mdash;
            the largest naval complex in the world &mdash; with more than 75,000 active-duty personnel based regionally and a defense-industrial economy that supports
            another 100,000+ civilian shipyard, contractor, and DoD employees.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            For military families, that density translates to options. Whether you want oceanfront living in Virginia Beach, walkable historic neighborhoods
            in Norfolk&rsquo;s Ghent district, large suburban lots in Chesapeake&rsquo;s Western Branch, or affordable starter homes in Hampton&rsquo;s Phoebus,
            you can pick the lifestyle and still keep your commute under 30 minutes from base.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The flip side: Hampton Roads gets a major <strong>PCS season inventory crunch every May&ndash;August</strong>. Tens of thousands of military families
            rotate in and out, prices spike, and the best homes go in days. The single biggest predictor of a smooth Hampton Roads PCS is starting your search early
            &mdash; ideally 90 days before your reporting date &mdash; with a Realtor who&rsquo;s been through dozens of summer moves and knows which neighborhoods absorb the demand.
          </p>
        </section>

        {/* Bases */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The 10 Hampton Roads military installations</h2>
          <p className="text-gray-700 mb-6">Each base has its own dedicated hub with drive-time search, BAH calculator, top neighborhoods, schools, and live MLS listings.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {bases.map((b) => (
              <Link
                key={b.slug}
                href={`/military/bases/${b.slug}/`}
                className="block border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="font-bold text-gray-900 mb-1">{b.name}</div>
                <div className="text-sm text-gray-600 mb-2">{b.tier}</div>
                <div className="text-xs text-gray-500">Where families live: {b.cities.join(', ')}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Best cities for Hampton Roads military families</h2>
          <p className="text-gray-700 mb-6">Each Hampton Roads city has a distinct identity, price range, school scene, and base-proximity profile.</p>
          <div className="space-y-4">
            {cities.map((c) => (
              <div key={c.slug} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                  <span className="text-sm text-gray-500">2026 median: {c.median}</span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{c.summary}</p>
                <Link href={`/military/military-friendly-neighborhoods/${c.slug}/`} className="text-blue-600 font-semibold text-sm hover:underline">
                  Best {c.name} neighborhoods for military &rarr;
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BAH */}
        <section className="mb-12 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Hampton Roads BAH 2026: what it covers</h2>
          <p className="text-gray-700 mb-4">
            Hampton Roads is split into two Military Housing Areas per DTMO: <strong>VA298 Norfolk/Portsmouth</strong> (Southside — Norfolk, Portsmouth, Virginia Beach, Chesapeake, Suffolk) and <strong>VA297 Hampton/Newport News</strong> (Peninsula — Hampton, Newport News, Williamsburg, York County). Norfolk/Portsmouth pays $108-225 more per paygrade. Selected 2026 Southside (VA298) BAH rates with dependents:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead className="bg-white"><tr>
                <th className="text-left p-3 border-b border-gray-200">Paygrade</th>
                <th className="text-left p-3 border-b border-gray-200">With dependents</th>
                <th className="text-left p-3 border-b border-gray-200">Without dependents</th>
              </tr></thead>
              <tbody>
                {bahTable.map((r) => (
                  <tr key={r.paygrade} className="border-b border-gray-100 last:border-0">
                    <td className="p-3 font-semibold">{r.paygrade}</td>
                    <td className="p-3">{r.withDeps}</td>
                    <td className="p-3">{r.noDeps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Quick rule of thumb: at 2026 rates and 6.5% mortgage rates, $1 of monthly BAH covers about $130 of home price for a typical VA loan with $0 down.
            So an E-5 with dependents in Norfolk MHA can comfortably target homes up to roughly $315,000; an O-5 can target up to roughly $430,000.
          </p>
          <Link
            href="/military/bah-calculator/hampton-roads/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm"
          >
            Run the full BAH calculator &rarr;
          </Link>
        </section>

        {/* VA loan */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Using a VA loan in Hampton Roads</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you&rsquo;re active duty, a veteran, or an eligible surviving spouse, the VA loan is almost always your best financing option in Hampton Roads.
            Key advantages: zero down, no PMI, competitive rates, flexible credit standards.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li><strong>2026 county VA loan limits:</strong> $766,550 for most of Hampton Roads</li>
            <li><strong>Funding fee:</strong> 1.40&ndash;3.30% (waived for disabled veterans)</li>
            <li><strong>Most Hampton Roads sellers</strong> accept VA loans without issue &mdash; about 41% of regional buyers use VA</li>
          </ul>
          <Link
            href="/military/va-loan-homes/hampton-roads/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm"
          >
            VA loan homes in Hampton Roads &rarr;
          </Link>
        </section>

        {/* PCS season */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">PCS season housing market in Hampton Roads</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hampton Roads has the most pronounced summer PCS-season market dynamic of any military region in the country.
            Between May and August, inventory drops 20&ndash;30%, multi-offer scenarios become routine, and median days on market drops from ~25 to ~12.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Start 90 days before your report-no-later date.</strong> Get pre-approved, line up your VA Realtor, set up listing alerts.
            Use your TLA househunting trip wisely &mdash; visit 15&ndash;25 specific homes, not drive around aimlessly.
            Be flexible on the 2-mile radius; homes 25 minutes from base can be 30% cheaper than homes 10 minutes from base.
          </p>
          <Link
            href="/military/pcs-to/hampton-roads/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm"
          >
            Complete PCS to Hampton Roads guide &rarr;
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl p-4 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition">&darr;</span>
                </summary>
                <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      {/* CTA strip */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Talk to a military relocation Realtor</h2>
          <p className="text-blue-100 mb-6">
            Hundreds of Hampton Roads military relocations since 2019. Free first call. No obligation.
          </p>
          <a
            href="tel:+17577777577"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg"
          >
            Call (757) 777-7577
          </a>
        </div>
      </section>
    
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-xs te