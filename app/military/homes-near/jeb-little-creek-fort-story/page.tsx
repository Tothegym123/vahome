import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Homes for Sale Near JEB Little Creek-Fort Story | VaHome",
  description:
    "Browse homes for sale near Joint Expeditionary Base Little Creek-Fort Story. VA loan eligible, BAH-priced, with neighborhood corridor breakdowns for active-duty buyers.",
  alternates: { canonical: "https://vahome.com/military/homes-near/jeb-little-creek-fort-story/" },
  openGraph: { title: "Homes for Sale Near JEB Little Creek-Fort Story", description: "VA-eligible listings near JEB.", url: "https://vahome.com/military/homes-near/jeb-little-creek-fort-story/", type: "website" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Homes Near Bases", item: "https://vahome.com/military/homes-near/" },
    { "@type": "ListItem", position: 4, name: "JEB Little Creek-Fort Story", item: "https://vahome.com/military/homes-near/jeb-little-creek-fort-story/" },
  ],
};

const corridors = [
  { name: "Norfolk (East Beach)", note: "Newest housing stock in Norfolk. Bay-adjacent. Some lots in AE flood zone — verify per-address." },
  { name: "Norfolk (Bayview / Ocean View)", note: "Direct, short commute. Mix of historic and recent rebuild homes. Bay frontage areas have higher flood-insurance cost." },
  { name: "Norfolk (Larchmont, Ghent)", note: "Historic, tree-lined streets, ~15 min commute via Hampton Blvd or I-64." },
  { name: "Virginia Beach (Ocean Park, Cape Story)", note: "Beach-adjacent VB neighborhoods, established homes, direct to Little Creek." },
  { name: "Virginia Beach (Birdneck, Lynnhaven)", note: "Inland VB, mostly X flood zone. Longer commute via Shore Dr or I-264." },
  { name: "Virginia Beach (Sandbridge / First Landing)", note: "Closest to Fort Story. Coastal lots, higher flood risk overall." },
];

export default function HomesNearJEBPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/jeb-little-creek-fort-story/" className="hover:underline">JEB Little Creek-Fort Story</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Homes for Sale</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Homes for Sale Near JEB Little Creek-Fort Story</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Listings near JEB Little Creek and Fort Story. Filter by VA eligibility, drive-time corridor, and 2026 BAH affordability. Built for sailors, soldiers, and special warfare families.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/listings?duty_station=jeb-little-creek-fort-story&va_eligible=true" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50">Browse all listings</Link>
            <Link href="/military/bah-calculator/hampton-roads/" className="border border-white/40 text-white px-5 py-3 rounded-lg hover:bg-white/10">Check my BAH</Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          JEB Little Creek-Fort Story sits on the Chesapeake Bay where Norfolk and Virginia Beach meet. Most sailors and soldiers live in northern Norfolk or northern Virginia Beach. The big housing variable is flood zone: anything bay-facing or oceanfront should be checked on FEMA&rsquo;s map before writing.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Best Commute Corridors</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {corridors.map((c) => (
              <div key={c.name} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
                <p className="text-sm text-gray-700 mt-2">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Verify per-address pricing on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a> and FEMA flood designation on <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What to Filter For</h2>
        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">1. FEMA flood zone</h3>
            <p>The northeast Hampton Roads coast has more AE/VE exposure than other areas. Always pull the FEMA flood map for the specific address.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">2. Bay/ocean elevation</h3>
            <p>Even properties technically in flood zone X may sit at low elevation, raising insurance pricing and resale risk during major storm events.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3. School quality</h3>
            <p>Norfolk and Virginia Beach school zones near JEB vary widely. Verify on <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700">VDOE&rsquo;s state report card</a>.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a curated list?</p>
            <p className="text-blue-100 mt-1">Tell me your command, paygrade, family size, and report date.</p>
          </div>
          <Link href="/contact?source=jeb-listings" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Request my list</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/JEB-Little-Creek-Fort-Story/" target="_blank" rel="noopener noreferrer" className="underline">CNIC JEB Little Creek-Fort Story</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
