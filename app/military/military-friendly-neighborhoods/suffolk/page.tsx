import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Suffolk, VA | VaHome",
  description:
    "Best Suffolk neighborhoods for military families. Harbour View, Bennett's Creek, Driver, Hillpoint — strong schools, lower property taxes, and the MMMBT alternative to the HRBT.",
  alternates: { canonical: "https://www.vahome.com/military/military-friendly-neighborhoods/suffolk/" },
  openGraph: { title: "Suffolk Military-Friendly Neighborhoods", description: "Where to live in Suffolk for Hampton Roads military families.", url: "https://www.vahome.com/military/military-friendly-neighborhoods/suffolk/", type: "article" },
};

const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Military-Friendly Neighborhoods in Suffolk, VA", description: "Detailed guide to Suffolk neighborhoods for military families with school + commute context.", datePublished: "2026-04-29", dateModified: "2026-04-29", author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" }, publisher: { "@type": "Organization", name: "VaHome" }, mainEntityOfPage: "https://www.vahome.com/military/military-friendly-neighborhoods/suffolk/" };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
  { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
  { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://www.vahome.com/military/military-friendly-neighborhoods/" },
  { "@type": "ListItem", position: 4, name: "Suffolk", item: "https://www.vahome.com/military/military-friendly-neighborhoods/suffolk/" },
] };

export default function SuffolkMilitaryNeighborhoods() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Suffolk Neighborhoods</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Suffolk</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Suffolk is the largest city by area in Virginia, mixing rural farmland with strong commuter neighborhoods on the I-664/MMMBT corridor. Often the dual-commute sweet spot for Hampton Roads military couples.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Strategic location</p>
            <p className="mt-1 text-xl font-bold text-blue-700">I-664 / MMMBT</p>
            <p className="text-xs text-gray-600">HRBT alternative</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">BAH MHA</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">IZ325</p>
            <p className="text-xs text-gray-600">Norfolk MHA</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Property tax</p>
            <p className="mt-1 text-xl font-bold text-blue-700">Lower</p>
            <p className="text-xs text-gray-600">vs Norfolk/Portsmouth*</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Suffolk Neighborhoods</h2>
        <div className="mt-6 space-y-5">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Harbour View</p>
            <p className="text-sm text-gray-700 mt-2">North Suffolk's premier master-planned community. Manicured neighborhoods, retail at Harbour View Marketplace, walking trails. Quick I-664 access — under 25 min to NSN/Portsmouth, 25 min to JBLE/Newport News via MMMBT.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Officers and senior NCOs prioritizing dual-commute symmetry and resale.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Bennett's Creek / Bennett's Pasture</p>
            <p className="text-sm text-gray-700 mt-2">Established North Suffolk neighborhood with mature trees, larger lots, and quick MMMBT access. Strong public schools.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Families wanting space without going fully rural.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">River's Edge / Eagle Harbor</p>
            <p className="text-sm text-gray-700 mt-2">Newer construction along the Nansemond River. Waterfront and water-view options. Family-friendly.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Buyers wanting newer construction with water access.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Driver / Sleepy Hole</p>
            <p className="text-sm text-gray-700 mt-2">Established North Suffolk neighborhoods with country-club golf course (Sleepy Hole). Larger lots, mature character.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Senior officers wanting space and golf-community lifestyle.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Hillpoint Farms / Burbage Grant</p>
            <p className="text-sm text-gray-700 mt-2">Mid-tier suburban North Suffolk. Family-friendly, school-zoned to strong feeders. Mid-range pricing.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> First-time buyers and growing families.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Downtown Suffolk / Olde Towne</p>
            <p className="text-sm text-gray-700 mt-2">Historic downtown with revival energy — restaurants, breweries, walkable streetscape. Smaller homes, character architecture.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Walkability priority, character-home enthusiasts.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The Suffolk Commute Advantage</h2>
          <p className="mt-3 text-gray-700">North Suffolk neighborhoods sit on the I-664 corridor, giving you the MMMBT — the HRBT's much-quieter sibling tunnel. For dual-military couples where one parent is on the Peninsula and the other in Norfolk/Portsmouth, North Suffolk often delivers the most balanced commute.</p>
          <p className="mt-3 text-gray-700">Approximate drive times from Harbour View: NSN ~25 min, NMCP ~20 min, JBLE/Fort Eustis ~25 min via MMMBT, NAS Oceana ~35 min.</p>
          <p className="mt-3 text-xs text-gray-500 italic">Live conditions: <a href="https://511virginia.org" target="_blank" rel="noopener noreferrer" className="underline">511virginia.org</a>.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Things to Know Before Buying in Suffolk</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li><strong>Geography:</strong> Suffolk is huge (~400 sq mi). North Suffolk (Harbour View area) is the commuter sweet spot; rural Suffolk south of Route 58 has long commutes.</li>
          <li><strong>Schools:</strong> Suffolk Public Schools — verify per zone using <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>. Strong schools include Northern Shores Elementary and Driver Elementary in North Suffolk.</li>
          <li><strong>Flood:</strong> Some Nansemond River and creek-front lots have flood exposure. Verify FEMA per address.</li>
          <li><strong>Property tax:</strong> Suffolk's real estate tax rate is generally favorable vs Norfolk and Portsmouth.</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500 italic">
          Sources: <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>; <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>. *Property tax comparison: see <a href="https://www.suffolkva.us" target="_blank" rel="noopener noreferrer" className="underline">suffolkva.us</a> for current rates.
        </p>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Considering Suffolk?</p>
            <p className="text-blue-100 mt-1">If you have dual-commute symmetry needs, this is the city to look at.</p>
          </div>
          <Link href="/contact?source=suffolk" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my Suffolk list</Link>
        </div>
      </section>
    </main>
  );
}
