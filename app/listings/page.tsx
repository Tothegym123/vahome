export default function ListingsPage() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Search / Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by city, zip, address..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            Price
          </button>
          <button className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            Beds / Baths
          </button>
          <button className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            Home Type
          </button>
          <button className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
            More Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Homes for Sale in Hampton Roads</h1>
          <span className="text-sm text-gray-500">0 results</span>
        </div>

        {/* Placeholder for listings grid */}
        <div className="bg-gray-50 rounded-2xl p-16 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">MLS Integration Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Property listings from REIN MLS will appear here once the data feed is connected.
          </p>
        </div>
      </div>
    </div>
  )
}
