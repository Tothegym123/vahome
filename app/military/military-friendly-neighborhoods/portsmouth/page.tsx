import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Portsmouth, VA | VaHome",
  description:
    "Best Portsmouth neighborhoods for military families stationed at Norfolk Naval Shipyard, Naval Medical Center Portsmouth, or Coast Guard Base Portsmouth. Olde Towne, Churchland, Western Branch, more.",
  alternates: { canonical: "https://vahome.com/military/military-friendly-neighborhoods/portsmouth/" },
  openGraph: { title: "Portsmouth Military-Friendly Neighborhoods", description: "Where to live in Portsmouth if you're stationed at NNSY, NMCP, or CG Base Portsmouth.", url: "https://vahome.com/military/military-friendly-neighborhoods/portsmouth/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Military-Friendly Neighborhoods in Portsmouth, VA",
  description: "Detailed guide to Portsmouth neighborhoods for military families — Olde Towne, Churchland, Western Branch, Park View, Cradock, Port Norfolk — with commute, school, and BAH context.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/military-friendly-neighborhoods/portsmouth/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://vahome.com/military/military-friendly-neighborhoods/" },
    { "@type": "ListItem", position: 4, name: "Portsmouth", item: "https://vahome.com/military/military-friendly-neighborhoods/portsmouth/" },
  ],
};

export default function PortsmouthMilitaryNeighborhoods() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Portsmouth Neighborhoods</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Portsmouth</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Portsmouth hosts three significant military installations — Norfolk Naval Shipyard (the Navy's oldest, despite the name), Naval Medical Center Portsmouth, and Coast Guard Base Portsmouth. Often the most affordable city in South Hampton Roads.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Major installations</p>
            <p className="mt-1 text-xl font-bold text-blue-700">NNSY, NMCP, CG Base</p>
            <p className="text-xs text-gray-600">3 in city limits</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">BAH MHA</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">IZ325</p>
            <p className="text-xs text-gray-600">Norfolk MHA</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Median sale price</p>
            <p className="mt-1 text-xl font-bold text-blue-700">Lowest in SHR*</p>
            <p className="text-xs text-gray-600">*per REIN MLS reports</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Portsmouth Neighborhoods</h2>
        <div className="mt-6 space-y-5">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Olde Towne Portsmouth</p>
            <p className="text-sm text-gray-700 mt-2">Historic walkable district along the Elizabeth River with cobblestone streets, ferry to Norfolk Waterside, and 18th/19th century homes. Premium address but check flood zones — many lots are AE.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> NNSY shipyard workers, history buffs, walkability priority.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Churchland</p>
            <p className="text-sm text-gray-700 mt-2">Suburban West Portsmouth with established neighborhoods, larger lots, and Churchland High School. Quick I-664 access for commutes to Suffolk or Newport News via the MMMBT.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Families wanting space, dual-commute households.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Western Branch</p>
            <p className="text-sm text-gray-700 mt-2">Crosses the Portsmouth/Chesapeake city line. Strong public schools (Western Branch HS, Chesapeake side) and varied housing stock from ranches to newer construction.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Families prioritizing schools while keeping NNSY/NMCP commute reasonable.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Cradock</p>
            <p className="text-sm text-gray-700 mt-2">Compact WWI-era planned community next to NNSY. Affordable starter homes, walkable. Listed on the National Register of Historic Places. Closest residential neighborhood to the shipyard.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Junior enlisted at NNSY, first-time buyers.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Park View</p>
            <p className="text-sm text-gray-700 mt-2">Quiet residential area near NMCP with mid-century homes. Tree-lined streets, walkable to Park View Elementary.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Hospital corpsmen and medical staff at NMCP.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Port Norfolk</p>
            <p className="text-sm text-gray-700 mt-2">Waterfront historic neighborhood, smaller and more affordable than Olde Towne. Direct views of the Norfolk skyline. Verify FEMA flood zones carefully.</p>
            <p className="text-sm text-gray-600 mt-2"><strong>Best for:</strong> Buyers wanting waterfront on a tighter budget.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Things to Know Before Buying in Portsmouth</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li><strong>Flood exposure:</strong> Portsmouth has significant low-lying waterfront. Always pull the FEMA flood map for any specific address before writing an offer. <Link href="/military/flood-zones/hampton-roads/" className="text-blue-700 underline">See our flood zones guide</Link>.</li>
            <li><strong>Schools:</strong> Portsmouth Public Schools ratings vary widely by zone. Verify per-school at <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">schoolquality.virginia.gov</a>. Western Branch (Chesapeake side) and Churchland are typically the strongest options.</li>
            <li><strong>Property tax:</strong> Portsmouth's real estate tax rate is among the higher in Hampton Roads. Factor this into your max-home-price math.</li>
            <li><strong>BAH:</strong> Same Norfolk MHA (IZ325) as Norfolk and Virginia Beach — your BAH stretches further here because median prices are lower.</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 italic">
            Sources: <a href="https://msc.fema.gov" target="_blank" rel="noopener noreferrer" className="underline">FEMA Flood Map Service Center</a>; <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>; <a href="https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/" target="_blank" rel="noopener noreferrer" className="underline">DTMO BAH</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>.
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Considering Portsmouth?</p>
            <p className="text-blue-100 mt-1">I'll send a curated list filtered by your installation, BAH, and verified flood zones.</p>
          </div>
          <Link href="/contact?source=portsmouth" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my Portsmouth list</Link>
        </div>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
