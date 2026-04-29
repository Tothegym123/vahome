import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Schools Near Joint Base Langley-Eustis (JBLE) | VaHome",
  description:
    "Top public schools near JBLE â Hampton, Newport News, York County, Poquoson. Verified GreatSchools.org ratings April 2026 for elementary, middle, and high.",
  alternates: { canonical: "https://vahome.com/military/schools-near/joint-base-langley-eustis/" },
  openGraph: { title: "Schools Near JBLE", description: "Verified Peninsula school ratings for military families.", url: "https://vahome.com/military/schools-near/joint-base-langley-eustis/", type: "article" },
};

const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: "Schools Near Joint Base Langley-Eustis", description: "Verified school ratings near JBLE across Hampton, Newport News, York County, and Poquoson.", datePublished: "2026-04-29", dateModified: "2026-04-29", author: { "@type": "Person", name: "Tom Milan", jobTitle: "Realtor" }, publisher: { "@type": "Organization", name: "VaHome" }, mainEntityOfPage: "https://vahome.com/military/schools-near/joint-base-langley-eustis/" };
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
  { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
  { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
  { "@type": "ListItem", position: 3, name: "Schools Near", item: "https://vahome.com/military/schools-near/" },
  { "@type": "ListItem", position: 4, name: "JBLE", item: "https://vahome.com/military/schools-near/joint-base-langley-eustis/" },
] };

export default function SchoolsNearJBLE() {
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
            <span className="text-white">Schools</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Schools Near Joint Base Langley-Eustis</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Top-rated public schools across the Peninsula â Hampton, Newport News, York County, and Poquoson. Ratings verified against GreatSchools.org as of April 2026.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Schools by City</h2>
        <p className="mt-3 text-gray-700">Best schools you'd want to be zoned to within a reasonable JBLE commute. Always verify your specific address falls in the school's attendance zone before writing an offer.</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Hampton (avg 6.1)</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Bethel Manor Elementary <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Tucker-Capps Elementary <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Francis W. Jones Magnet Middle <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Thomas Eaton Middle <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Phoebus High <span className="text-blue-700 font-semibold">7/10</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">32 schools city-wide</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Newport News (avg 4.8)</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Deer Park Elementary <span className="text-blue-700 font-semibold">10/10</span></li>
              <li>Hilton Elementary <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Achievable Dream Middle/High <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>B.T. Washington Middle <span className="text-blue-700 font-semibold">7/10</span></li>
              <li>Woodside High <span className="text-blue-700 font-semibold">6/10</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">38 schools â wide variation by zone</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">York County (avg 7.8 â strongest)</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Mount Vernon Elementary <span className="text-blue-700 font-semibold">9/10</span></li>
              <li>Tabb Elementary <span className="text-blue-700 font-semibold">9/10</span></li>
              <li>Tabb High <span className="text-blue-700 font-semibold">9/10</span></li>
              <li>Grafton Middle <span className="text-blue-700 font-semibold">8/10</span></li>
              <li>Grafton High <span className="text-blue-700 font-semibold">8/10</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">12 schools â uniformly strong</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="font-bold text-gray-900">Poquoson (avg 6.7)</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li>Poquoson Elementary <span className="text-blue-700 font-semibold">7/10</span></li>
              <li>Poquoson Middle <span className="text-blue-700 font-semibold">7/10</span></li>
              <li>Poquoson High <span className="text-blue-700 font-semibold">6/10</span></li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Small district (3 schools), tight community</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.greatschools.org" target="_blank" rel="noopener noreferrer" className="underline">GreatSchools.org</a> ratings, accessed April 2026. Cross-verify with <a href="https://schoolquality.virginia.gov" target="_blank" rel="noopener noreferrer" className="underline">VA DOE</a>.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The York County Edge</h2>
          <p className="mt-3 text-gray-700">If schools are a top-3 priority and you're at JBLE, York County deserves first look â overall average 7.8/10 across 12 schools, with Tabb High at 9/10 and Grafton High at 8/10. Yorktown is roughly midway between Langley AFB and Fort Eustis, making it a strong commute compromise for either side of JBLE.</p>
          <p className="mt-3 text-gray-700">For Air Force families with elementary-age kids and short Langley commute priority, Bethel Manor Elementary (10/10) is on-base housing-adjacent in Hampton.</p>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">School-zoned listings near JBLE?</p>
            <p className="text-blue-100 mt-1">Tell me which schools, paygrade, and side of base â I'll match listings inside the right attendance zones.</p>
          </div>
          <Link href="/contact?source=schools-jble" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my list</Link>
        </div>
      </section>
    </main>
  );
}
