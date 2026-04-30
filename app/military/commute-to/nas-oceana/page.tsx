import type { Metadata } from "next";
import Link from "next/link";
import HamptonRoadsAreaGuide from '../../../components/HamptonRoadsAreaGuide'

export const metadata: Metadata = {
  title: "Commute to NAS Oceana: Routes, Gates & Timing (2026) | VaHome",
  description:
    "Driving routes, gate options, and traffic timing for sailors commuting to Naval Air Station Oceana, Virginia Beach. AICUZ, I-264 patterns, and tunnel-free advantage.",
  alternates: { canonical: "https://vahome.com/military/commute-to/nas-oceana/" },
  openGraph: { title: "Commute to NAS Oceana", description: "Routes, gates, and traffic timing.", url: "https://vahome.com/military/commute-to/nas-oceana/", type: "article" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Commute To", item: "https://vahome.com/military/commute-to/" },
    { "@type": "ListItem", position: 4, name: "NAS Oceana", item: "https://vahome.com/military/commute-to/nas-oceana/" },
  ],
};

export default function CommuteOceanaPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/nas-oceana/" className="hover:underline">NAS Oceana</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Commute</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Commute to NAS Oceana</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            Routes, gates, and traffic timing for sailors stationed at the Atlantic Fleet&rsquo;s Master Jet Base in Virginia Beach.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Oceana&rsquo;s Commute Is Easier Than NSN&rsquo;s</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          NAS Oceana is on the southside of Hampton Roads, in the south-central section of Virginia Beach. Unlike Naval Station Norfolk, the commute does not involve any harbor tunnels (HRBT, MMMBT, Downtown). For most VB-based sailors, this means shorter and more predictable drive times. The trade-off is that the closest neighborhoods are firmly suburban rather than the urban Norfolk options.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana</a>.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Main Routes</h2>
          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">From Virginia Beach (Princess Anne, Kempsville)</h3>
              <p>Direct via Princess Anne Rd or Independence Blvd. Generally light traffic outside of school release time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Virginia Beach (Bayside / Pembroke / Town Center)</h3>
              <p>I-264 west to Independence Blvd south, or surface streets via Holland Rd. Traffic builds during 0700 and 1530.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Chesapeake (Greenbrier, Western Branch)</h3>
              <p>I-64 east to I-264 east, exit at Independence Blvd or Lynnhaven Pkwy. Tunnel-free but I-64 can back up at the I-664 split.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Norfolk (Larchmont, East Beach, Ghent)</h3>
              <p>I-264 east is the primary route. The Downtown Tunnel is bypassable for southbound traffic. Drive time depends heavily on rush hour.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">AICUZ Noise Zones</h2>
        <p className="mt-3 text-gray-700">
          NAS Oceana publishes Air Installation Compatible Use Zone (AICUZ) maps showing high-noise areas under the jet flight paths. Some Virginia Beach neighborhoods sit inside these contours and have meaningful aircraft noise. Lenders may flag homes in high-noise zones for disclosure. Always check the AICUZ designation for an address before writing.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.cnic.navy.mil/regions/cnrma/installations/nas_oceana.html" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana Ã¢ÂÂ AICUZ resources</a>.
        </p>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Pick a neighborhood that fits your gate.</p>
            <p className="text-blue-100 mt-1">Tell me your gate assignment and shift schedule. I will route you to the right corridor.</p>
          </div>
          <Link href="/contact?source=oceana-commute" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my route plan</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAS-Oceana/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NAS Oceana</a>; <a href="https://www.virginiadot.org/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOT</a> for current traffic conditions and tunnel/bridge alerts.
        </p>
      </section>
      <HamptonRoadsAreaGuide />
    </main>
  );
}
