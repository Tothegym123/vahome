import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commute to Joint Base Langley-Eustis (JBLE) | VaHome",
  description:
    "Commute times to JBLE from every major Hampton Roads neighborhood. HRBT, MMMBT, I-64, I-664 â what they mean for your daily drive to Langley AFB or Fort Eustis.",
  alternates: { canonical: "https://vahome.com/military/commute-to/joint-base-langley-eustis/" },
  openGraph: { title: "Commute to JBLE", description: "Drive times to Langley AFB and Fort Eustis from across Hampton Roads.", url: "https://vahome.com/military/commute-to/joint-base-langley-eustis/", type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Commute to Joint Base Langley-Eustis",
  description: "Practical drive-time guide to JBLE â Langley AFB and Fort Eustis â from Hampton, Newport News, Williamsburg, and South Hampton Roads.",
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" },
  publisher: { "@type": "Organization", name: "VaHome" },
  mainEntityOfPage: "https://vahome.com/military/commute-to/joint-base-langley-eustis/",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Commute To", item: "https://vahome.com/military/commute-to/" },
    { "@type": "ListItem", position: 4, name: "JBLE", item: "https://vahome.com/military/commute-to/joint-base-langley-eustis/" },
  ],
};

export default function CommuteToJBLE() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/joint-base-langley-eustis/" className="hover:underline">JBLE</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Commute</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Commute to Joint Base Langley-Eustis</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Choosing a Peninsula home for JBLE is mostly about which gate you'll use daily and whether your route crosses the Hampton Roads Bridge-Tunnel (HRBT). These tradeoffs matter every morning.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Approximate Drive Times</h2>
        <p className="mt-3 text-gray-700">
          Estimates below are typical free-flow drive times to the main gates. Peak HRBT/MMMBT congestion can add 20-40 minutes; check <a href="https://511virginia.org" target="_blank" rel="noopener noreferrer" className="underline">511virginia.org</a> live before committing.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b border-gray-200">From</th>
                <th className="text-left p-3 border-b border-gray-200">To Langley AFB</th>
                <th className="text-left p-3 border-b border-gray-200">To Fort Eustis</th>
                <th className="text-left p-3 border-b border-gray-200">Bridge crossings?</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-3 border-b border-gray-100">Hampton (Riverdale)</td><td className="p-3 border-b border-gray-100">~10 min</td><td className="p-3 border-b border-gray-100">~20 min</td><td className="p-3 border-b border-gray-100">None</td></tr>
              <tr><td className="p-3 border-b border-gray-100">Newport News (Denbigh)</td><td className="p-3 border-b border-gray-100">~20 min</td><td className="p-3 border-b border-gray-100">~10 min</td><td className="p-3 border-b border-gray-100">None</td></tr>
              <tr><td className="p-3 border-b border-gray-100">Yorktown</td><td className="p-3 border-b border-gray-100">~15 min</td><td className="p-3 border-b border-gray-100">~15 min</td><td className="p-3 border-b border-gray-100">None</td></tr>
              <tr><td className="p-3 border-b border-gray-100">Williamsburg</td><td className="p-3 border-b border-gray-100">~30 min</td><td className="p-3 border-b border-gray-100">~25 min</td><td className="p-3 border-b border-gray-100">None</td></tr>
              <tr><td className="p-3 border-b border-gray-100">Norfolk (Ocean View)</td><td className="p-3 border-b border-gray-100">~30 min*</td><td className="p-3 border-b border-gray-100">~40 min*</td><td className="p-3 border-b border-gray-100">HRBT</td></tr>
              <tr><td className="p-3 border-b border-gray-100">Suffolk (North)</td><td className="p-3 border-b border-gray-100">~30 min*</td><td className="p-3 border-b border-gray-100">~25 min*</td><td className="p-3 border-b border-gray-100">MMMBT</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          *Crossings to/from South Hampton Roads via HRBT (I-64) or MMMBT (I-664) â peak congestion can substantially increase these. The HRBT expansion project is improving but not yet complete; check the <a href="https://hrbtexpansion.org" target="_blank" rel="noopener noreferrer" className="underline">HRBT Expansion Project</a> for updates.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The HRBT Question</h2>
          <p className="mt-3 text-gray-700">
            If you're stationed at JBLE but your spouse works in Norfolk or Virginia Beach, the HRBT (I-64) and MMMBT (I-664) are the only direct vehicle routes. These are tunnels under the harbor â they're prone to congestion, weather closures, and incident delays.
          </p>
          <p className="mt-3 text-gray-700">
            The Peninsula side (Hampton, Newport News, York County) avoids both crossings if both jobs are on the Peninsula. For dual-military families with one parent on each side, neighborhoods near I-664 (north Hampton, north Suffolk) often offer better commute symmetry than HRBT-dependent areas.
          </p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Pick the right side for your JBLE commute</p>
            <p className="text-blue-100 mt-1">I'll map listings around your daily drive â and your spouse's, if applicable.</p>
          </div>
          <Link href="/contact?source=commute-jble" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get tailored options</Link>
        </div>
      </section>
    </main>
  );
}
