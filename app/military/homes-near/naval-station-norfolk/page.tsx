import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Homes for Sale Near Naval Station Norfolk | VA Loan Friendly | VaHome",
  description:
    "Browse homes for sale near Naval Station Norfolk with commute times, BAH match, and VA loan eligibility. Filtered for active-duty Navy buyers stationed at NSN.",
  alternates: { canonical: "https://vahome.com/military/homes-near/naval-station-norfolk/" },
  openGraph: {
    title: "Homes for Sale Near Naval Station Norfolk",
    description:
      "Listings within 30 minutes of Naval Station Norfolk Gate 5. BAH-priced, VA loan friendly, commute-ranked.",
    url: "https://vahome.com/military/homes-near/naval-station-norfolk/",
    type: "website",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  name: "Homes for Sale Near Naval Station Norfolk",
  description:
    "Curated listings within a 30-minute commute of Naval Station Norfolk, filtered for VA loan eligibility and BAH affordability.",
  numberOfItems: 8,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Norfolk - East Beach", url: "https://vahome.com/listings?city=norfolk&neighborhood=east-beach" },
    { "@type": "ListItem", position: 2, name: "Norfolk - Larchmont", url: "https://vahome.com/listings?city=norfolk&neighborhood=larchmont" },
    { "@type": "ListItem", position: 3, name: "Virginia Beach - Thalia", url: "https://vahome.com/listings?city=virginia-beach&neighborhood=thalia" },
    { "@type": "ListItem", position: 4, name: "Chesapeake - Greenbrier", url: "https://vahome.com/listings?city=chesapeake&neighborhood=greenbrier" },
    { "@type": "ListItem", position: 5, name: "Portsmouth - Churchland", url: "https://vahome.com/listings?city=portsmouth&neighborhood=churchland" },
    { "@type": "ListItem", position: 6, name: "Suffolk - Harbour View", url: "https://vahome.com/listings?city=suffolk&neighborhood=harbour-view" },
    { "@type": "ListItem", position: 7, name: "Hampton - Phoebus", url: "https://vahome.com/listings?city=hampton&neighborhood=phoebus" },
    { "@type": "ListItem", position: 8, name: "Newport News - Port Warwick", url: "https://vahome.com/listings?city=newport-news&neighborhood=port-warwick" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Homes Near Bases", item: "https://vahome.com/military/homes-near/" },
    { "@type": "ListItem", position: 4, name: "Naval Station Norfolk", item: "https://vahome.com/military/homes-near/naval-station-norfolk/" },
  ],
};

const commuteCorridors = [
  { city: "Norfolk", drive: "5-15 min", median: "$315K", bestFor: "Single sailors, dual-mil, walk-to-base lifestyle", highlights: ["East Beach", "Larchmont", "Ghent", "Riverpoint"] },
  { city: "Virginia Beach (north)", drive: "15-25 min", median: "$385K", bestFor: "Families wanting beach access & strong schools", highlights: ["Thalia", "Aragona Village", "Bayside"] },
  { city: "Chesapeake (Greenbrier)", drive: "20-30 min", median: "$365K", bestFor: "Top-rated schools, newer construction", highlights: ["Greenbrier", "Western Branch"] },
  { city: "Portsmouth (Churchland)", drive: "15-25 min", median: "$285K", bestFor: "Lower price point, BAH stretches further", highlights: ["Churchland", "Westhaven"] },
];

export default function HomesNearNSNPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/naval-station-norfolk/" className="hover:underline">Naval Station Norfolk</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Homes for Sale</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Homes for Sale Near Naval Station Norfolk
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Listings within a 30-minute commute of Gate 5, filtered for VA loan eligibility and 2026 BAH affordability. Built for sailors stationed at NSN.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/listings?duty_station=naval-station-norfolk&va_eligible=true" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50">
              Browse all listings
            </Link>
            <Link href="/military/bah-calculator/hampton-roads/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">
              Check my BAH
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Link href="/listings?duty_station=naval-station-norfolk&max_drive=15" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">15 min commute or less</Link>
            <Link href="/listings?duty_station=naval-station-norfolk&max_drive=30" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">30 min commute or less</Link>
            <Link href="/listings?duty_station=naval-station-norfolk/amax_price=350000" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">Under $350K (E-6 BAH)</Link>
            <Link href="/listings?duty_station=naval-station-norfolk&max_price=500000" className="border border-gray-300 rounded-lg px-3 py-2 text-center hover:border-blue-600 hover:text-blue-700">Under $500K (O-3+ BAH)</Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Naval Station Norfolk is the largest naval base in the world, and finding a home that puts you close to Gate 5 without overshooting your BAH is the single biggest decision of a Norfolk PCS. This page narrows Hampton Roads inventory down to the corridors that actually make sense for NSN sailors: short commute, VA-loan friendly sellers, neighborhoods with strong resale, and price points that match real 2026 BAH rates.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Every listing here has been screened for the four things that matter most when you are stationed at NSN: drive time to base, school quality if you have kids, flood-zone risk (a real factor in Hampton Roads), and whether the seller&rsquo;s price puts a VA loan within reach.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Commute Corridors to NSN</h2>
          <p className="mt-3 text-gray-700">Four corridors handle 90% of NSN home purchases. Pick by lifestyle, not just price.</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {commuteCorridors.map((c) => (
              <div key={c.city} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">{c.city}</h3>
                  <span className="text-sm text-blue-700 font-semibold">{c.drive}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Median: {c.median}</p>
                <p className="text-sm text-gray-700 mt-3">{c.bestFor}</p>
                <p className="text-xs text-gray-500 mt-3 uppercase tracking-wide">Top neighborhoods</p>
                <p className="text-sm text-gray-800 mt-1">{c.highlights.join(" - ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Filter For (NSN-specific)</h2>
        <div className="mt-6 space-y-5 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">1. Commute under 30 minutes</h3>
            <p>Hampton Roads traffic at the tunnels (HRBT, MMMBT, Downtown Tunnel) can double a commute during 0600 PT or 1530 liberty. Stay east of the tunnels for NSN unless you are willing to leave at 0500.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">2. Flood zone X (or higher AE/VE with insurance baked in)</h3>
            <p>Norfolk has serious flood exposure. Always check the FEMA flood zone before you write, and price flood insurance into the offer if it is AE/VE. Lenders will require it.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3. VA-loan friendly seller</h3>
            <p>Most Norfolk sellers will take a VA loan. The deal-breaker is condition. VA appraisers are strict on roof, HVAC, and termites. Skip houses with obvious deferred maintenance unless the seller will fix or credit.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">4. Resale at next PCS</h3>
            <p>You will PCS again in 2-4 years. Buy in a neighborhood with consistent sales history, not one with 6+ listings sitting over 90 days. Larchmont, East Beach, Greenbrier, and Thalia all have proven resale.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a curated list emailed to you?</p>
            <p className="text-blue-100 mt-1">Tell me your paygrade, dependents, and report date. I will send NSN-only matches inside 24 hours.</p>
          </div>
          <Link href="/contact?source=nsn-listings" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">
            Request my list
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900">Related</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/bases/naval-station-norfolk/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Naval Station Norfolk hub</p>
            <p className="text-gray-600 mt-1">Full base overview, BAH, neighborhoods.</p>
          </Link>
          <Link href="/military/best-neighborhoods-near/naval-station-norfolk/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">Best neighborhoods near NSN</p>
            <p className="text-gray-600 mt-1">Top 8 neighborhoods ranked.</p>
          </Link>
          <Link href="/military/pcs-to/hampton-roads/" className="border border-gray-200 rounded-lg p-4 hover:border-blue-600">
            <p className="font-semibold text-gray-900">PCS to Hampton Roads</p>
            <p className="text-gray-600 mt-1">Full PCS playbook.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
