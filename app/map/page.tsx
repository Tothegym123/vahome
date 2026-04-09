export const metadata = {
  title: 'Interactive Map Search | VaHome.com',
  description: 'Search Hampton Roads homes for sale on our interactive map. Virginia Beach, Norfolk, Chesapeake, Suffolk, Hampton, and Newport News listings.',
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">\ud83d\uddfa\ufe0f</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Interactive Map Search
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We\u2019re upgrading our map experience to Google Maps for faster, smoother
          home searching across Hampton Roads.
        </p>
        <p className="text-gray-500 mb-8">
          Browse thousands of listings with real-time filters, neighborhood video
          tours, and instant property details\u2014coming very soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/listings"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Browse Listings
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition"
          >
            Back to Home
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-10">
          \u00a9 {new Date().getFullYear()} The VaHome Team \u00b7 LPT Realty
        </p>
      </div>
    </div>
  );
}
