import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Norfolk (2026) | VaHome",
  description:
    "The Norfolk neighborhoods that work best for active-duty military families. Compared by base proximity, schools, flood zone, and resale strength.",
  alternates: { canonical: "https://vahome.com/military/military-friendly-neighborhoods/norfolk/" },
  openGraph: { title: "Military-Friendly Neighborhoods in Norfolk (2026)", description: "Norfolk neighborhoods for active-duty military families.", url: "https://vahome.com/military/military-friendly-neighborhoods/norfolk/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Military-Friendly Neighborhoods in Norfolk (2026)",
  description: "Guide to the Norfolk neighborhoods that work best for sailors and military families across all Hampton Roads installations.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/military-friendly-neighborhoods/norfolk/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://vahome.com/military/military-friendly-neighborhoods/" },
    { "@type": "ListItem", position: 4, name: "Norfolk", item: "https://vahome.com/military/military-friendly-neighborhoods/norfolk/" },
  ],
};

const neighborhoods = [
  { name: "East Beach", bestFor: "NSN officers, JEB Little Creek senior enlisted", note: "Newest housing stock in Norfolk. Direct Chesapeake Bay access. Some lots in AE flood zone." },
  { name: "Larchmont", bestFor: "NSN families wanting historic, walkable Norfolk", note: "Tree-lined streets, classic 1920s-50s homes, walkable to ODU and Lafayette River. Mostly X flood zone." },
  { name: "Ghent", bestFor: "Single sailors and DINKs at NSN", note: "Most walkable urban Norfolk neighborhood. Restaurants, bars, character. X flood zone." },
  { name: "Bayview / Ocean View", bestFor: "JEB Little Creek-Fort Story families", note: "Bay-adjacent corridor, mix of historic and rebuilt homes. AE flood zone in many sections." },
  { name: "Riverpoint / Park Place", bestFor: "Mid-grade enlisted at NSN", note: "Established Norfolk neighborhoods. Mid-range pricing. Verify school zone and flood designation per-address." },
  { name: "Colonial Place", bestFor: "Quiet residential families with school-age kids", note: "Small bungalows, mature trees, near Lafayette River. Verify school zone." },
];

export default function NorfolkNeighborhoodsPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Norfolk</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Norfolk</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Norfolk is the residential core for sailors stationed at Naval Station Norfolk and JEB Little Creek-Fort Story. Here is the breakdown of Norfolk neighborhoods mapped to which base each fits best.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Norfolk neighborhoods cluster around the Lafayette River, the Elizabeth River, and the Chesapeake Bay. Most neighborhoods near these waterfronts have meaningful flood-zone exposure (AE/VE) and require verification on FEMA&rsquo;s map before writing.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Norfolk Public Schools have mixed ratings. The strongest school options are typically magnet and charter programs. Verify zone-specific ratings on Virginia&rsquo;s state report card.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Neighborhoods by Best-Fit Base</h2>
          <div className="mt-8 space-y-5">
            {neighborhoods.map((n) => (
              <article key={n.name} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900">{n.name}</h3>
                <p className="text-sm text-blue-700 mt-1 font-semibold">Best for: {n.bestFor}</p>
                <p className="mt-2 text-gray-700">{n.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Pricing, school zoning, and FEMA flood designations vary by address. Verify on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>, <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>, and <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Norfolk Offers Military Families</h2>
        <ul className="mt-6 space-y-3 text-gray-700 list-disc list-inside">
          <li>Closest residential city to Naval Station Norfolk and JEB Little Creek-Fort Story.</li>
          <li>Walkable historic neighborhoods (Ghent, Larchmont) with strong character.</li>
          <li>Active military community: highest concentration of Navy personnel in Hampton Roads.</li>
          <li>Mid-range pricing relative to Virginia Beach, especially inland of the bay.</li>
          <li>Strong public university (Old Dominion University) and proximity to Eastern Virginia Medical School.</li>
        </ul>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a custom Norfolk neighborhood match?</p>
            <p className="text-blue-100 mt-1">Tell me your gaining command, paygrade, and family size.</p>
          </div>
          <Link href="/contact?source=norfolk-neighborhoods" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my custom match</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://cnrma.cnic.navy.mil/Installations/NAVSTA-Norfolk/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NSN</a>.
        </p>
      </section>
    </main>
  );
}
