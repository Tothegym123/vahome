import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Hampton, VA | VaHome",
  description:
    "Best Hampton neighborhoods for military families at Langley AFB or JBLE. Riverdale, Wythe, Phoebus, Fox Hill, Buckroe — verified school ratings and commute analysis.",
  alternates: { canonical: "https://www.vahome.com/military/military-friendly-neighborhoods/hampton/" },
  openGraph: { title: "Hampton Military-Friendly Neighborhoods", description: "Where to live in Hampton if you're at Langley AFB.", url: "https://www.vahome.com/military/military-friendly-neighborhoods/hampton/", type: "article" },
};

const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Military-Friendly Neighborhoods in Hampton, VA", description: "Detailed guide to Hampton neighborhoods for military families with school + commute context.", datePublished: "2026-04-29", dateModified: "2026-04-29", author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" }, publisher: { "@type": "Organization", name: "VaHome" }, mainEntityOfPage: "https://www.vahome.com/military/military-friendly-neighborhoods/hampton/" };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vahome.com/" },
  { "@type": "ListItem", position: 2, name: "Military", item: "https://www.vahome.com/military/" },
  { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://www.vahome.com/military/military-friendly-neighborhoods/" },
  { "@type": "ListItem", position: 4, name: "Hampton", item: "https://www.vahome.com/military/military-friendly-neighborhoods/hampton/" },
] };

export default function HamptonMilitaryNeighborhoods() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Hampton Neighborhoods</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Hampton</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Hampton hosts Langley AFB (part of JBLE) and is home to NASA Langley. Top-tier elementary schools, accessible price points, and waterfront character throughout.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Major installation</p>
            <p className="mt-1 text-xl font-bold text-blue-700">Langley AFB / JBLE</p>
            <p className="text-xs text-gray-600">F-22 Raptors, ACC HQ</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">School avg</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">6.1/10</p>
            <p className="text-xs text-gray-600">32 schools (GreatSchools)</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">BAH MHA</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">IZ325</p>
            <p className="text-xs text-gray-600">Norfolk MHA</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Hampton Neighborhoods</h2>
        <div className="mt-6 space-y-5">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Riverdale</p>
            <p className="text-sm text-gray-700 mt-2">Quiet, established suburban neighborhood north of I-64. Strong fit for Langley AFB families. Mature trees, ranch and split-level housing stock. Outside major flood zones.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Air Force families wanting low-stress family living near base.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Wythe</p>
            <p className="text-sm text-gray-700 mt-2">Historic walkable district close to downtown Hampton with bungalows and Victorians. Restaurants and parks. Tucker-Capps Elementary (10/10) zoned for parts of Wythe.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Buyers prioritizing walkability and character.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Fox Hill</p>
            <p className="text-sm text-gray-700 mt-2">Bay-front community on the Chesapeake. Boating culture, working-water character. Mix of cottages and larger waterfront homes.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Boating families; verify FEMA flood zones (some lots Zone AE).</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Phoebus</p>
            <p className="text-sm text-gray-700 mt-2">Historic harbor district near Fort Monroe. Walkable downtown with restaurants, breweries, antique shops. Phoebus High (7/10) is the highest-rated Hampton public high.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Walkable urban-feel buyers, Fort Monroe-adjacent.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Buckroe</p>
            <p className="text-sm text-gray-700 mt-2">Hampton's beach neighborhood on the Chesapeake Bay. Beach lifestyle without VB prices. Buckroe Beach Park is a community anchor.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Beach-lifestyle buyers willing to manage flood-zone exposure (many lots in AE/VE).</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Northampton (Bethel Manor area)</p>
            <p className="text-sm text-gray-700 mt-2">Adjacent to Langley AFB family housing area. Bethel Manor Elementary (10/10) — top-rated in Hampton. Quiet, family-oriented.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Air Force families wanting top elementary school + closest commute.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Things to Know Before Buying in Hampton</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li><strong>Flood exposure:</strong> Bay-front and harbor neighborhoods (Fox Hill, Buckroe, parts of Phoebus, Salt Ponds) commonly include Zone AE/VE lots. <Link href="/military/flood-zones/hampton-roads/" className="text-blue-700 underline">See flood zones guide</Link>.</li>
            <li><strong>Schools:</strong> Hampton city avg 6.1/10. Top elementary picks: Bethel Manor (10), Tucker-Capps (10). Top middle: Francis W. Jones Magnet (10). Top high: Phoebus (7). Verify zoning per address.</li>
            <li><strong>Commute:</strong> Most Hampton neighborhoods are under 20 min to Langley AFB. HRBT crossings only matter if you're commuting to South Hampton Roads.</li>
            <li><strong>BAH:</strong> Same Norfolk MHA (IZ325) — Hampton stretches BAH further than VB or Chesapeake.</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 italic">
            Sources: <a href="https://www.greatschools.org" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> April 2026; <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Considering Hampton?</p>
            <p className="text-blue-100 mt-1">I'll send a curated list filtered by your installation, school priority, and verified flood zones.</p>
          </div>
          <Link href="/contact?source=hampton" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my Hampton list</Link>
        </div>
      </section>
    </main>
  );
}
