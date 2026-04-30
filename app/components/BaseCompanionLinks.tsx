interface Props {
  baseSlug: string
  baseName: string
}

export default function BaseCompanionLinks({ baseSlug, baseName }: Props) {
  const links = [
    { href: `/military/homes-near/${baseSlug}/`, label: `Homes near ${baseName}`, desc: 'Browse current listings within commuting distance' },
    { href: `/military/best-neighborhoods-near/${baseSlug}/`, label: `Best neighborhoods near ${baseName}`, desc: 'Top neighborhoods for military families ranked by schools, commute, and housing' },
    { href: `/military/schools-near/${baseSlug}/`, label: `Schools near ${baseName}`, desc: 'School ratings, district maps, and military-friendly options' },
    { href: `/military/commute-to/${baseSlug}/`, label: `Commute to ${baseName}`, desc: 'Drive times from each Hampton Roads city, peak-hour adjusted' },
  ]
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Related Resources for {baseName}</h2>
      <p className="text-gray-600 mb-6">Continue exploring everything you need to plan your move.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map(l => (
          <a key={l.href} href={l.href} className="block p-5 border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{l.label}</h3>
            <p className="text-sm text-gray-600">{l.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
