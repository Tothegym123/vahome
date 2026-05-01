import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Homes for Sale Near NAS Oceana | VA Loan Friendly | VaHome",
  description:
    "Browse homes for sale near Naval Air Station Oceana, Virginia Beach. VA loan eligible, BAH-priced, with neighborhood corridor breakdowns for active-duty Navy buyers.",
  alternates: { canonical: "https://vahome.com/military/homes-near/nas-oceana/" },
  openGraph: {
    title: "Homes for Sale Near NAS Oceana",
    description: "VA-eligible, BAH-priced listings near NAS Oceana.",
    url: "https://vahome.com/military/homes-near/nas-oceana/",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Homes Near Bases", item: "https://vahome.com/military/homes-near/" },
    { "@type": "ListItem", position: 4, name: "NAS Oceana", item: "https://vahome.com/military/homes-near/nas-oceana/" },
  ],
};

const corridors = [
  { name: "Princess Anne (Virginia Beach)", note: "Closest residential corridor to Oceana's main gate. Suburban, family-oriented." },
  { name: "Kempsville (Virginia Beach)", note: "Mature neighborhoods, easy commute via Princess Anne Rd." },
  { name: "Bayside / Pembroke (Virginia Beach)", note: "Town Center walkability and amenities. Slightly longer commute." },
  { name: "Aragona Village (Virginia Beach)", note: "1960s-1970s housing stock at moderate prices, reasonable VB schools." },
  { name: "Greenbrier (Chesapeake)", note: "Top-rated public schools and newer construction. 20-30 min via I-264." },
  { name: "Norfolk (Larchmont, East Beach)", note: "Historic neighborhoods. Longer commute but no tunnel needed." },
];

export default function HomesNearOceanaPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/nas-oceana/" className="hover:underline">NAS Oceana</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Homes for Sale</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Homes for Sale Near NAS Oceana</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Listings near Naval Air Station Oceana&rsquo;s main gate. Filter by VA loan eligibility, drive-time corridor, and 2026 BAH affordability. Built for sailors stationed at the Atlantic Fleet&rsquo;s Master Jet Base.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/listings?duty_station=nas-oceana&va_eligible=true" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50">Browse all listings</Link>
            <Link href="/military/bah-calculator/hampton-roads/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">Check my BAH</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Link href="/listings?duty_station=nas-oceana&max_drive=15" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">15 min commute or less</Link>
            <Link href="/listings?duty_station=nas-oceana&max_drive=30" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">30 min commute or less</Link>
            <Link href="/listings?duty_station=nas-oceana&va_eligible=true" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">VA loan eligible</Link>
            <Link href="/listings?duty_station=nas-oceana&new_construction=true" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">New construction</Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          NAS Oceana is on the southside of Hampton Roads, so its housing market is concentrated in Virginia Beach with overflow into Chesapeake. The biggest advantage versus the northside bases: no harbor-tunnel commute. The trade-off: VB has a slightly higher median home price than Norfolk, and the closest neighborhoods to Oceana are firmly suburban rather than urban.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          The corridors below are the ones where VA-eligible inventory is most consistent. For per-property data (price, school zone, FEMA flood zone, square footage), use the listing search.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Commute Corridors to NAS Oceana</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {corridors.map((c) => (
              <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
                <p className="text-sm text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: c.note }} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Specific drive times depend on your assigned gate and time of day. Tunnel and bridge closures (Lesner Bridge construction, Atlantic Ave events) can affect commutes. Verify current pricing on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Filter For (Oceana-specific)</h2>
        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">1. AICUZ noise zones</h3>
            <p>Oceana publishes AICUZ (Air Installation Compatible Use Zone) noise contours. Some VB neighborhoods sit under jet flight paths and have meaningful aircraft noise. The Navy maintains an AICUZ map. Lenders may also flag homes inside high-noise zones for disclosure. <a href="https://www.cnic.navy.mil/regions/cnrma/installations/nas_oceana/about/installation_guide/community_resources.html" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">CNIC NAS Oceana community resources</a>.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">2. Flood zone (FEMA)</h3>
            <p>Virginia Beach has both AE and X zones. Oceanfront and bayfront lots are higher-risk. Always pull the FEMA flood map for the specific address before writing. <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">FEMA Flood Map Service Center</a>.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3. School quality (Virginia DOE)</h3>
            <p>Virginia Beach City Public Schools rate well overall, but ratings vary by zone. Verify on Virginia&rsquo;s state report card. <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">schoolquality.virginia.gov</a>.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">4. VA loan condition standards</h3>
            <p>VA appraisals are stricter than conventional on roof, HVAC, and termite condition. Older Kempsville and Aragona Village homes often need pre-flighting on these items.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a curated list emailed?</p>
            <p className="text-blue-100 mt-1">Tell me your paygrade, dependents, and report date. I will send Oceana-only matches inside 24 hours.</p>
          </div>
          <Link href="/contact?source=oceana-listings" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Request my list</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-bold text-gray-900">Related</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/bases/nas-oceana/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">NAS Oceana hub</p>
            <p className="text-gray-600 mt-1">Full base overview.</p>
          </Link>
          <Link href="/military/best-neighborhoods-near/nas-oceana/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Best neighborhoods near Oceana</p>
            <p className="text-gray-600 mt-1">Compared by commute, schools, flood risk.</p>
          </Link>
          <Link href="/military/commute-to/nas-oceana/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Commute to NAS Oceana</p>
            <p className="text-gray-600 mt-1">Routes and timing.</p>
          </Link>
        </div>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
