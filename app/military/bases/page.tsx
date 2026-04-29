import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hampton Roads Military Bases: Complete Installation Guide | VaHome",
  description: "Comprehensive directory of all 9 major military installations in Hampton Roads, Virginia. Naval Station Norfolk, NAS Oceana, JEB Little Creek-Fort Story, JBLE, and more. Housing, BAH, schools, commute info for each.",
  alternates: { canonical: "https://vahome.com/military/bases/" },
  openGraph: { title: "Hampton Roads Military Bases", description: "All 9 installations with housing, BAH, and PCS guides.", url: "https://vahome.com/military/bases/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hampton Roads Military Bases: Complete Installation Guide",
  description: "Directory of every major military installation in the Hampton Roads metro area with PCS-relevant housing, BAH, and neighborhood guidance.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/bases/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Bases", item: "https://vahome.com/military/bases/" },
  ],
};

const tier1 = [
  { slug: "naval-station-norfolk", name: "Naval Station Norfolk", short: "World's largest naval station; 75 ships, 134 aircraft, ~46K sailors and dependents", branch: "Navy", city: "Norfolk" },
  { slug: "nas-oceana", name: "Naval Air Station Oceana", short: "Master Jet Base; F/A-18 Super Hornets and F-35C; AICUZ noise zones", branch: "Navy", city: "Virginia Beach" },
  { slug: "jeb-little-creek-fort-story", name: "JEB Little Creek-Fort Story", short: "Joint Expeditionary Base; SEALs, EOD, amphibious training", branch: "Navy / Army", city: "Virginia Beach" },
  { slug: "joint-base-langley-eustis", name: "Joint Base Langley-Eustis", short: "F-22 Raptors at Langley + Army Transportation Corps at Eustis", branch: "Air Force / Army", city: "Hampton / Newport News" },
];

const tier2 = [
  { slug: "naval-medical-center-portsmouth", name: "Naval Medical Center Portsmouth", short: "Largest Navy hospital on the East Coast", branch: "Navy", city: "Portsmouth" },
  { slug: "norfolk-naval-shipyard", name: "Norfolk Naval Shipyard", short: "Navy's oldest shipyard; nuclear submarine and carrier maintenance", branch: "Navy", city: "Portsmouth" },
  { slug: "coast-guard-base-portsmouth", name: "Coast Guard Base Portsmouth", short: "Largest Coast Guard base on the East Coast", branch: "Coast Guard", city: "Portsmouth" },
  { slug: "dam-neck-annex", name: "Dam Neck Annex", short: "NSWC, NSW DEVGRU, Atlantic training facility", branch: "Navy", city: "Virginia Beach" },
  { slug: "naval-weapons-station-yorktown", name: "NWS Yorktown", short: "Navy ordnance + USCG TRACEN Yorktown", branch: "Navy / Coast Guard", city: "Yorktown" },
];

export default function MilitaryBasesIndexPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Bases</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Hampton Roads Military Bases</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            The Hampton Roads metro hosts one of the largest concentrations of U.S. military installations in the country. Click any base for full PCS, housing, BAH, schools, and commute guidance.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Major Installations</h2>
        <p className="mt-3 text-gray-700 text-sm">Tier-1 installations with the largest active-duty populations and dependent housing demand.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {tier1.map((b) => (
            <Link key={b.slug} href={`/military/bases/${b.slug}/`} className="border border-gray-200 rounded-lg p-5 hover:border-blue-600 hover:shadow-sm">
              <p className="font-bold text-gray-900">{b.name}</p>
              <p className="text-xs text-gray-500 mt-1">{b.branch} - {b.city}</p>
              <p className="text-sm text-gray-700 mt-2">{b.short}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Specialized & Supporting Installations</h2>
          <p className="mt-3 text-gray-700 text-sm">Critical specialized installations with significant military and civilian populations.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {tier2.map((b) => (
              <Link key={b.slug} href={`/military/bases/${b.slug}/`} className="border border-gray-200 rounded-lg p-5 bg-white hover:border-blue-600 hover:shadow-sm">
                <p className="font-bold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-500 mt-1">{b.branch} - {b.city}</p>
                <p className="text-sm text-gray-700 mt-2">{b.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">All Bases Share One Norfolk MHA (IZ325)</h2>
        <p className="mt-3 text-gray-700">Every Hampton Roads installation falls inside the same Norfolk Military Housing Area, so BAH rates are identical regardless of which base you're at. Use our <Link href="/military/bah-calculator/hampton-roads/" className="text-blue-700 underline">BAH calculator</Link> or jump to a paygrade page:</p>
        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
          <Link href="/military/bah/e-5/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">E-5: $2,430/mo</Link>
          <Link href="/military/bah/e-6/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">E-6: $2,559/mo</Link>
          <Link href="/military/bah/o-3/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-3: $2,694/mo</Link>
          <Link href="/military/bah/o-4/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-4: $3,054/mo</Link>
          <Link href="/military/bah/o-5/norfolk-mha/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">O-5: $3,318/mo</Link>
          <Link href="/military/bah-calculator/hampton-roads/" className="border border-gray-200 rounded-lg p-3 hover:border-blue-600">Full BAH table</Link>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Don't see your base?</p>
            <p className="text-blue-100 mt-1">If you're PCS-ing to any Hampton Roads installation, I can help. Tell me where you're heading.</p>
          </div>
          <Link href="/contact?source=bases-index" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my PCS plan</Link>
        </div>
      </section>
    </main>
  );
}
