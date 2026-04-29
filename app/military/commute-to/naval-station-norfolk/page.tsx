import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commute to Naval Station Norfolk: Routes, Gates & Tunnel Timing (2026) | VaHome",
  description:
    "Driving routes, gate options, and tunnel timing for sailors commuting to Naval Station Norfolk. HRBT, MMMBT, Downtown Tunnel, and best practices.",
  alternates: { canonical: "https://vahome.com/military/commute-to/naval-station-norfolk/" },
  openGraph: { title: "Commute to Naval Station Norfolk", description: "Routes, gates, and tunnel timing.", url: "https://vahome.com/military/commute-to/naval-station-norfolk/", type: "article" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vahome.com/" },
    { "@type": "ListItem", position: 2, name: "Military", item: "https://vahome.com/military/" },
    { "@type": "ListItem", position: 3, name: "Commute To", item: "https://vahome.com/military/commute-to/" },
    { "@type": "ListItem", position: 4, name: "Naval Station Norfolk", item: "https://vahome.com/military/commute-to/naval-station-norfolk/" },
  ],
};

export default function CommuteNSNPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <nav className="text-xs text-blue-200 mb-4">
            <Link href="/military/" className="hover:underline">Military</Link>
            <span className="mx-2">/</span>
            <Link href="/military/bases/naval-station-norfolk/" className="hover:underline">Naval Station Norfolk</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Commute</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Commute to Naval Station Norfolk</h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl">
            NSN sits in central Norfolk on the Elizabeth River. Where you live decides whether you cross a tunnel, which gate you use, and how predictable your morning is.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">The Tunnel Question</h2>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Hampton Roads is split by water. NSN is on the southside in central Norfolk. If you live northside (Hampton, Newport News, Yorktown), you must cross either the Hampton Roads Bridge-Tunnel (HRBT) or Monitor-Merrimac Memorial Bridge-Tunnel (MMMBT) to get to NSN. Tunnel commutes can double during incidents or peak hours. The simplest rule: live southside if you can.
        </p>
        <p className="mt-3 text-xs text-gray-500 italic">
          Source: <a href="https://www.virginiadot.org/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOT</a> for current tunnel and bridge conditions.
        </p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Routes by Origin</h2>
          <div className="mt-6 space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">From Norfolk (East Beach, Larchmont, Ghent)</h3>
              <p>Direct via Hampton Blvd or I-564. Among the shortest commutes in the region. No tunnels.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Virginia Beach</h3>
              <p>I-264 west to I-64 west to I-564 east. No tunnel. Traffic builds 0700 and 1530.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Chesapeake (Greenbrier, Western Branch)</h3>
              <p>Downtown Tunnel via I-264 west, then I-64 east to I-564. Or MMMBT to I-564. Tunnel-dependent timing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Portsmouth</h3>
              <p>Downtown Tunnel via Effingham St / I-264. Tunnel choke point at peak hours.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Hampton / Newport News (northside)</h3>
              <p>HRBT via I-64 east, then I-564. The HRBT is the most-traveled tunnel in the region; major delays during peak hours and incidents.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">From Suffolk (Harbour View)</h3>
              <p>MMMBT via I-664 east, then I-64 east to I-564. Less peak congestion than HRBT but still tunnel-dependent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tunnel Timing Practical Tips</h2>
        <ul className="mt-6 space-y-3 text-gray-700 list-disc list-inside">
          <li><strong>Leave before 0530</strong> if you must cross HRBT or MMMBT for first watch â past that, single-incident delays can extend the trip 30+ minutes.</li>
          <li><strong>Friday afternoon is the worst</strong> â tunnel and bridge volume peaks Friday 1500-1800.</li>
          <li><strong>Track 511 Virginia or VDOT.org</strong> in real time before leaving. The app shows current tunnel speeds and any incidents.</li>
          <li><strong>Liberty release (1500-1530)</strong> creates predictable congestion at NSN&rsquo;s Gate 5 onto Hampton Blvd.</li>
        </ul>
      </section>

      <section className="bg-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">Pick a neighborhood that fits your gate.</p>
            <p className="text-blue-100 mt-1">Tell me your work gate and shift schedule. I will route you to corridors that minimize tunnel exposure.</p>
          </div>
          <Link href="/contact?source=nsn-commute" className="bg-white text-blue-900 font-semibold px-5 py-3 rounded-lg hover:bg-blue-50 self-start">Get my route plan</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-gray-500">
          Sources: <a href="https://cnrma.cnic.navy.mil/Installations/NAVSTA-Norfolk/" target="_blank" rel="noopener noreferrer" className="underline">CNIC NSN</a>; <a href="https://www.virginiadot.org/" target="_blank" rel="noopener noreferrer" className="underline">Virginia DOT</a>; <a href="https://www.511virginia.org/" target="_blank" rel="noopener noreferrer" className="underline">511 Virginia</a>.
        </p>
      </section>
    </main>
  );
}
