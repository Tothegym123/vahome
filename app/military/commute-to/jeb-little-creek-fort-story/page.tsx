import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Commute to JEB Little Creek-Fort Story (2026) | VaHome",
  description:
    "Driving routes, gates, and traffic timing for sailors and soldiers commuting to JEB Little Creek and Fort Story.",
  alternates: { canonical: "https://vahome.com/military/commute-to/jeb-little-creek-fort-story/" },
  openGraph: { title: "Commute to JEB Little Creek-Fort Story", description: "Routes, gates, and traffic timing.", url: "https://vahome.com/military/commute-to/jeb-little-creek-fort-story/", type: "article" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Commute To", item: "https://vahome.com/military/commute-to/" },
    { "@type": "ListItem", position: 4, name: "JEB Little Creek-Fort Story", item: "https://vahome.com/military/commute-to/jeb-little-creek-fort-story/" },
  ],
};

export default function CommuteJEBPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/jeb-little-creek-fort-story/" className="hover:underline">JEB Little Creek-Fort Story</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Commute</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Commute to JEB Little Creek-Fort Story</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Two installations, two different commute patterns. Here is how to route to each gate.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Two Bases, Two Commutes</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          JEB Little Creek-Fort Story is a single command, but the work locations are physically separate. Little Creek is in northern Virginia Beach on the Chesapeake Bay (Shore Drive corridor). Fort Story is at Cape Henry, where the bay meets the Atlantic. Most sailors and soldiers live close to their primary work site rather than splitting the difference.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://cnrma.cnic.navy.mil/Installations/JEB-Little-Creek-Fort-Story/" target="_blank" rel="noopener noreferrer" className="underline">CNIC JEB Little Creek-Fort Story</a>.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Routes to Little Creek</h2>
          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">From Norfolk (East Beach, Bayview, Larchmont)</h3>
              <p>Direct via Shore Dr or Hampton Blvd. Among the shortest commutes in the region.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Virginia Beach (Ocean Park, Cape Story, Birdneck)</h3>
              <p>Direct via Shore Dr or Atlantic Ave. No tunnel needed.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Chesapeake</h3>
              <p>I-64 east via Norfolk, then Shore Dr. Tunnel-free routing but I-64 backups affect timing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Routes to Fort Story</h2>
        <div className="mt-6 space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900">From Virginia Beach (Sandbridge, First Landing, Atlantic Ave)</h3>
            <p>Atlantic Ave or Shore Dr east to the Fort Story gate at Cape Henry.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">From Norfolk and Chesapeake</h3>
            <p>Shore Dr east is the primary route. Adds about 10-15 minutes versus Little Creek depending on origin.</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Pick a neighborhood that fits your gate.</p>
            <p className="text-blue-100 mt-1">Tell me whether you report to Little Creek or Fort Story. I will route you to the right corridor.</p>
          </div>
          <Link href="/contact?source=jeb-commute" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my route plan</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/JEB-Little-Creek-Fort-Story/" target="_blank" rel="noopener noreferrer" className="underline">CNIC JEB Little Creek-Fort Story</a>; <a href="https://www.virginiadot.org/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOT</a>.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
