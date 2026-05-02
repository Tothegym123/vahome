import type { Metadata } from "next";
import Link from "next/link";
import NeighborhoodMatchLink from "../../../components/NeighborhoodMatchLink";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Virginia Beach (2026) | VaHome",
  description:
    "The Virginia Beach neighborhoods that work best for active-duty military families. Compared by base proximity, schools, flood zone, and resale strength.",
  alternates: { canonical: "https://vahome.com/military/military-friendly-neighborhoods/virginia-beach/" },
  openGraph: { title: "Military-Friendly Neighborhoods in Virginia Beach (2026)", description: "VB neighborhoods for active-duty military families.", url: "https://vahome.com/military/military-friendly-neighborhoods/virginia-beach/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Military-Friendly Neighborhoods in Virginia Beach (2026)",
  description: "Guide to the Virginia Beach neighborhoods that work best for sailors, soldiers, airmen, and military families across all Hampton Roads installations.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/military-friendly-neighborhoods/virginia-beach/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://vahome.com/military/military-friendly-neighborhoods/" },
    { "@type": "ListItem", position: 4, name: "Virginia Beach", item: "https://vahome.com/military/military-friendly-neighborhoods/virginia-beach/" },
  ],
};

const neighborhoods = [
  { name: "Princess Anne", bestFor: "NAS Oceana families", note: "Closest to Oceana's main gate. Some sections fall under AICUZ noise contours — verify per-address." },
  { name: "Kempsville", bestFor: "Mid-grade enlisted/officer at Oceana or NSN-east commute", note: "Mature neighborhood, established VB schools, mid-range pricing." },
  { name: "Thalia", bestFor: "Beach-lifestyle families on a moderate budget", note: "Near I-264, mature VB neighborhood, mostly X flood zone." },
  { name: "Ocean Park / Cape Story", bestFor: "JEB Little Creek-Fort Story sailors", note: "Beach-adjacent, direct to Little Creek. Some lots in AE flood zone." },
  { name: "Aragona Village", bestFor: "Buyers wanting VB schools at the most affordable price point", note: "1960s ranch-style homes. Solid VB Public Schools. Quick to I-264." },
  { name: "Pungo / Sandbridge / First Landing", bestFor: "Buyers wanting larger lots or coastal lifestyle", note: "Rural or coastal feel. Higher flood-risk profile in some sections." },
  { name: "Bayside / Pembroke (Town Center)", bestFor: "Single sailors and DINKs", note: "Walkable amenities, newer condos and townhomes." },
];

export default function VBNeighborhoodsPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Virginia Beach</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Virginia Beach</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Virginia Beach is the largest city in Hampton Roads and the residential center for sailors stationed at NAS Oceana, JEB Little Creek-Fort Story, and many at Naval Station Norfolk. Here is the breakdown by neighborhood, mapped to which base each fits best.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          VB is fully south of the Hampton Roads tunnels, so its commute story is straightforward: pick a neighborhood close to your gate, mind the AICUZ noise zone if you&rsquo;re near Oceana, and verify the FEMA flood zone before writing.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Virginia Beach City Public Schools rate well overall, but ratings vary by zone. Verify on Virginia&rsquo;s state report card before picking based on schools.
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
                <p className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: n.note }} />
                <NeighborhoodMatchLink name={n.name} />
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Pricing, school zoning, and FEMA flood designations vary by address. Verify on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>, <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>, and <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why VB Works for Military Families</h2>
        <ul className="mt-6 space-y-3 text-gray-700 list-disc list-inside">
          <li>Tunnel-free commute to NAS Oceana and JEB Little Creek-Fort Story.</li>
          <li>Stable, sustained appreciation makes resale at next PCS reliable.</li>
          <li>Virginia Beach City Public Schools are one of the larger and more consistent districts in the region.</li>
          <li>Beach access is a real lifestyle quality-of-life factor for many military families.</li>
          <li>Established Veteran community: highest concentration of veterans in Virginia is in Virginia Beach.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.census.gov/quickfacts/fact/table/virginiabeachcityvirginia,US/PST045224" target="_blank" rel="noopener noreferrer" className="underline">U.S. Census Bureau QuickFacts: Virginia Beach</a>.
        </p>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a custom VB neighborhood match?</p>
            <p className="text-blue-100 mt-1">Tell me your gaining command, paygrade, and family size.</p>
          </div>
          <Link href="/contact?source=vb-neighborhoods" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my custom match</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>; <a href="https://www.census.gov/quickfacts/fact/table/virginiabeachcityvirginia,US/PST045224" target="_blank" rel="noopener noreferrer" className="underline">U.S. Census Bureau</a>.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
