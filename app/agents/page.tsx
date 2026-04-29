export const metadata = {
  alternates: { canonical: "/agents/" },
  title: 'Meet the VaHome Team | Hampton Roads Real Estate Agents',
  description: 'Licensed Hampton Roads Realtors specializing in Virginia Beach, Norfolk, Chesapeake, military relocations, and VA loan transactions. Meet the VaHome team.',
};

export default function AgentsPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Meet the VaHome Team</h1>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          The VaHome team is a group of licensed Hampton Roads Realtors with combined experience that spans every major submarket in the region. From Virginia Beach oceanfront properties to Chesapeake suburban subdivisions, Norfolk historic homes to Newport News shipyard housing, our agents have walked through more than a thousand Hampton Roads homes and helped hundreds of clients buy or sell.
        </p>
        <p className="text-gray-700 leading-relaxed text-base mb-6">
          Several team members have direct military or military-spouse experience, giving us first-hand understanding of PCS moves, VA loans, on-base versus off-base housing decisions, and the realities of moving on government schedules. We work with active-duty service members from Naval Station Norfolk, Joint Base Langley-Eustis, NAS Oceana, Naval Medical Center Portsmouth, Naval Weapons Station Yorktown, and other installations across the region.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How We Work</h2>
        <p className="text-gray-700 leading-relaxed text-base mb-4">
          We focus on responsiveness, honest market analysis, and using technology to give clients clearer information faster than the typical real estate process. Whether you're working with a single agent or coordinating across the whole team, you'll get the same approach: clear communication, market-grounded advice, and a focus on your specific goals.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Same-day responses to most inquiries during business hours</li>
          <li>Detailed comparable-sales analysis on every showing</li>
          <li>Drive-time and BAH-aware home search for military families</li>
          <li>Direct connections to vetted lenders, inspectors, and contractors</li>
          <li>End-to-end coordination from search through closing</li>
        </ul>
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Service Area</h2>
        <p className="text-gray-700 leading-relaxed text-base mb-6">
          We work across all of Hampton Roads â Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, Newport News, Portsmouth, Yorktown, Williamsburg, and surrounding York County, James City County, and Gloucester. Tell us your search area and we'll connect you with the team member who knows that submarket best.
        </p>
        <div className="mt-8">
          <a href="/contact/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg">Contact the Team</a>
        </div>
      </section>
    </main>
  );
}
