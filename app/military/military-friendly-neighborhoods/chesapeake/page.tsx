import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Chesapeake (2026) | VaHome",
  description:
    "Chesapeake neighborhoods that work best for active-duty military families. Top-rated Chesapeake Public Schools, mostly X flood zone, tunnel-free routes to NSN.",
  alternates: { canonical: "https://vahome.com/military/military-friendly-neighborhoods/chesapeake/" },
  openGraph: { title: "Military-Friendly Neighborhoods in Chesapeake (2026)", description: "Chesapeake neighborhoods for active-duty military families.", url: "https://vahome.com/military/military-friendly-neighborhoods/chesapeake/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Military-Friendly Neighborhoods in Chesapeake (2026)",
  description: "Guide to the Chesapeake neighborhoods that work best for sailors and military families across all Hampton Roads installations.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/military-friendly-neighborhoods/chesapeake/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://vahome.com/military/military-friendly-neighborhoods/" },
    { "@type": "ListItem", position: 4, name: "Chesapeake", item: "https://vahome.com/military/military-friendly-neighborhoods/chesapeake/" },
  ],
};

const neighborhoods = [
  { name: "Greenbrier", bestFor: "Families wanting top-rated schools, suburban setting, and a 20-30 min commute to NSN", note: "Established suburban neighborhood. Mostly X flood zone. Solid mix of single-family homes and townhomes." },
  { name: "Great Bridge", bestFor: "Families prioritizing the highest-rated Chesapeake schools (Hickory High = 9, Grassfield = 8)", note: "Historic neighborhood with mature trees. Houses Hickory High School, the highest-rated public high school in Chesapeake." },
  { name: "Western Branch", bestFor: "Buyers wanting a slightly shorter commute to NSN via I-664 / MMMBT", note: "Northwest corner of Chesapeake. Quieter, more established. Direct access to MMMBT for northside commutes." },
  { name: "Deep Creek", bestFor: "Mid-grade enlisted who want Chesapeake schools at a moderate price point", note: "Older neighborhood. Deep Creek Middle and High School both rated. Some homes need updating." },
  { name: "South Norfolk (Chesapeake)", bestFor: "Buyers wanting affordable Chesapeake addresses", note: "Historic Chesapeake corridor at the Norfolk border. Lower price point. Verify school zoning per address." },
];

export default function ChesapeakeNeighborhoodsPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Chesapeake</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Chesapeake</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Chesapeake is the southside go-to for military families prioritizing top-rated schools, mostly X flood zone designations, and a 20-30 minute commute to NSN. Here is the breakdown by neighborhood.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-gray-700 text-lg leading-relaxed">
          Chesapeake Public Schools rate among the highest in the Hampton Roads region, with Hickory High School scoring 9/10 and several elementary and middle schools rated 7-8. For NSN sailors, Chesapeake trades a slightly longer commute (vs. living directly in Norfolk) for materially stronger schools and lower flood-zone exposure.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          School ratings sourced from <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> as of April 2026 (Chesapeake city averages: Elementary 6.0, Middle 6.4, High 5.9 across 38 rated schools).
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Chesapeake Neighborhoods for Military Families</h2>
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
            Pricing, school zoning, and FEMA flood designations vary by address. Verify on <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>, <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">VDOE</a>, and <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top-Rated Chesapeake Schools (2026)</h2>
        <p className="mt-3 text-gray-700">From GreatSchools.org as of April 2026:</p>
        <ul className="mt-4 space-y-2 text-gray-700">
          <li><strong>Hickory High School:</strong> rated 9 (highest in Chesapeake)</li>
          <li><strong>Grassfield High School:</strong> rated 8</li>
          <li><strong>Great Bridge High School:</strong> rated 7</li>
          <li><strong>Cedar Road Elementary:</strong> rated 8</li>
          <li><strong>G.A. Treakle Elementary:</strong> rated 8</li>
          <li><strong>Southwestern Elementary:</strong> rated 8</li>
          <li><strong>Great Bridge Intermediate:</strong> rated 8</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500 italic">Verify per-address zoning at <a href="https://cpschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Chesapeake Public Schools</a>.</p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Chesapeake Works for Military Families</h2>
          <ul className="mt-6 space-y-3 text-gray-700 list-disc list-inside">
            <li>Top-rated public schools, especially Hickory High School (9/10).</li>
            <li>Mostly X flood zone (lower flood insurance cost than waterfront Norfolk/VB).</li>
            <li>Tunnel-free or single-tunnel routes to NSN, NAS Oceana, and JEB Little Creek-Fort Story.</li>
            <li>Newer construction available in Greenbrier and Grassfield areas.</li>
            <li>Strong resale at next PCS — Chesapeake homes have consistent sales history.</li>
          </ul>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Want a Chesapeake home search?</p>
            <p className="text-blue-100 mt-1">Tell me your gaining command, paygrade, and family size. I will route you to the right corridor.</p>
          </div>
          <Link href="/contact?source=chesapeake-neighborhoods" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my custom match</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://www.greatschools.org/" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> (school ratings, April 2026); <a href="https://cpschools.com/" target="_blank" rel="noopener noreferrer" className="underline">Chesapeake Public Schools</a>; <a href="https://schoolquality.virginia.gov/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOE</a>; <a href="https://www.reinmls.com/news" target="_blank" rel="noopener noreferrer" className="underline">REIN MLS</a>; <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer" className="underline">FEMA MSC</a>.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
