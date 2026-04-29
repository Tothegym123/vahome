import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Military-Friendly Neighborhoods in Hampton Roads | VaHome",
  description: "Compare every Hampton Roads city for military families. Virginia Beach, Norfolk, Chesapeake, Portsmouth, Hampton, Newport News, Suffolk Ã¢ÂÂ schools, BAH, commute, and flood-zone context for each.",
  alternates: { canonical: "https://vahome.com/military/military-friendly-neighborhoods/" },
  openGraph: { title: "Military-Friendly Neighborhoods in Hampton Roads", description: "All 7 Hampton Roads cities ranked for military families.", url: "https://vahome.com/military/military-friendly-neighborhoods/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Military-Friendly Neighborhoods in Hampton Roads",
  description: "Comprehensive directory of every Hampton Roads city's neighborhood guide for military families with school, BAH, commute, and flood context.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/military-friendly-neighborhoods/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Military-Friendly Neighborhoods", item: "https://vahome.com/military/military-friendly-neighborhoods/" },
  ],
};

const cities = [
  { slug: "virginia-beach", name: "Virginia Beach", short: "Largest city; NAS Oceana, JEB Little Creek-Fort Story; strong VB Public Schools (avg 6.4)", schoolAvg: "6.4" },
  { slug: "norfolk", name: "Norfolk", short: "World's largest naval station; Ghent, Larchmont, East Beach; flagship urban core", schoolAvg: "5.0" },
  { slug: "chesapeake", name: "Chesapeake", short: "Greenbrier, Great Bridge, Western Branch; family-friendly suburban; strong schools (6.0+ avg)", schoolAvg: "6.0+" },
  { slug: "portsmouth", name: "Portsmouth", short: "Naval Medical Center, NNSY, CGB Portsmouth; lowest-priced South Hampton Roads city", schoolAvg: "varies" },
  { slug: "hampton", name: "Hampton", short: "Langley AFB / JBLE; Bethel Manor (10/10), Tucker-Capps (10/10), historic Phoebus", schoolAvg: "6.1" },
  { slug: "newport-news", name: "Newport News", short: "Fort Eustis / JBLE; Hilton Village, Kiln Creek; verify school zones (district avg 4.8)", schoolAvg: "4.8" },
  { slug: "suffolk", name: "Suffolk", short: "Harbour View, Bennett's Creek; MMMBT corridor; dual-commute sweet spot", schoolAvg: "varies" },
  { slug: "williamsburg", name: "Williamsburg / James City County", short: "Colonial historic district; top-rated WJCC schools; quiet for JBLE/NWS Yorktown commuters", schoolAvg: "strong" },
];

export default function MFNIndexPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Military-Friendly Neighborhoods</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Military-Friendly Neighborhoods in Hampton Roads</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Every Hampton Roads city has a different fit for military families. Click any city for a full neighborhood breakdown, schools, BAH, commute, and flood-zone context.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">All 8 Hampton Roads Cities</h2>
        <p className="mt-3 text-gray-700 text-sm">School averages from GreatSchools.org (April 2026). All cities share Norfolk MHA (IZ325) for BAH.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {cities.map((c) => (
            <Link key={c.slug} href={`/military/military-friendly-neighborhoods/${c.slug}/`} className="border border-gray-200 rounded-lg p-5 hover:border-blue-600 hover:shadow-sm">
              <div className="flex items-baseline justify-between">
                <p className="font-bold text-gray-900 text-lg">{c.name}</p>
                <p className="text-xs text-gray-500">School avg {c.schoolAvg}</p>
              </div>
              <p className="text-sm text-gray-700 mt-2">{c.short}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How to Pick the Right City</h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li><strong>Closest commute to base:</strong> Match city to your installation. Norfolk for NSN, VB for NAS Oceana / JEB / Dam Neck, Hampton/Newport News for JBLE, Portsmouth for NMCP/NNSY/CGB.</li>
            <li><strong>Top schools:</strong> York County (avg 7.8/10) and Virginia Beach (6.4) lead. Verify per-zone since district averages hide variation.</li>
            <li><strong>Stretch your BAH:</strong> Hampton, Newport News, Portsmouth, and Suffolk have lower median home prices than VB or Chesapeake.</li>
            <li><strong>Dual-commute symmetry:</strong> North Suffolk (Harbour View) on the I-664/MMMBT corridor is the sweet spot when one parent commutes to the Peninsula and the other to South Hampton Roads.</li>
            <li><strong>Flood-zone awareness:</strong> Norfolk Hague, Portsmouth Olde Towne, VB Sandbridge, and Hampton Buckroe all have AE/VE-zone parcels. <Link href="/military/flood-zones/hampton-roads/" className="text-blue-700 underline">See flood zones guide</Link>.</li>
          </ul>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Need help picking?</p>
            <p className="text-blue-100 mt-1">Tell me your installation, paygrade, and school priorities Ã¢ÂÂ I'll suggest 2-3 cities to start with.</p>
          </div>
          <Link href="/contact?source=mfn-index" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my recommendations</Link>
        </div>
      </section>
    </main>
  );
}
