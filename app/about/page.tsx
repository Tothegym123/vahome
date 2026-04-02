export default function AboutPage() {
    return (
          <div className="pt-24 pb-20 min-h-screen">
                <div className="max-w-4xl mx-auto px-4">
                  {/* Hero */}
                        <div className="text-center mb-16">
                                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Tom & Dariya Milan</h1>h1>
                                  <p className="text-gray-500 text-lg">
                                              Your trusted real estate team in Hampton Roads, Virginia.
                                  </p>p>
                        </div>div>
                
                  {/* Photo + Bio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                                  <div className="aspect-[4/5] bg-gray-100 rounded-2xl flex items-center justify-center">
                                              <span className="text-gray-400 text-sm">Team Photo</span>span>
                                  </div>div>
                                  <div>
                                              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>h2>
                                              <div className="space-y-4 text-gray-600 leading-relaxed">
                                                            <p>
                                                                            We&apos;re Tom and Dariya Milan, a husband-and-wife real estate team based in Virginia Beach.
                                                                            With over a decade of experience in the Hampton Roads market, we&apos;ve helped families find
                                                                            their perfect homes across Virginia Beach, Norfolk, Chesapeake, Suffolk, and beyond.
                                                            </p>p>
                                                            <p>
                                                                            As active real estate investors ourselves, we bring a unique perspective to every transaction.
                                                                            We don&apos;t just find houses — we identify value, spot potential issues, and negotiate the best
                                                                            deals for our clients.
                                                            </p>p>
                                                            <p>
                                                                            Whether you&apos;re a first-time buyer, military family relocating to Hampton Roads, or looking
                                                                            for your dream luxury home, we&apos;re here to guide you every step of the way.
                                                            </p>p>
                                              </div>div>
                                  </div>div>
                        </div>div>
                
                  {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                          {[
            { number: '10+', label: 'Years Experience' },
            { number: '11', label: '5-Star Reviews' },
            { number: '100+', label: 'Homes Sold' },
            { number: '#1', label: 'Client Satisfaction' },
                      ].map((stat) => (
                                    <div key={stat.label} className="text-center p-6 bg-gray-50 rounded-2xl">
                                                  <div className="text-3xl font-black text-primary-500 mb-1">{stat.number}</div>div>
                                                  <div className="text-sm text-gray-500">{stat.label}</div>div>
                                    </div>div>
                                  ))}
                        </div>div>
                
                  {/* Brokerage */}
                        <div className="bg-navy-900 rounded-2xl p-10 text-center text-white">
                                  <h3 className="text-xl font-bold mb-2">Proudly Affiliated With</h3>h3>
                                  <div className="text-3xl font-black text-primary-400 mb-4">LPT Realty</div>div>
                                  <p className="text-gray-400 text-sm max-w-lg mx-auto">
                                              249 Central Park Ave Ste 300, Virginia Beach, VA 23462
                                  </p>p>
                        </div>div>
                </div>div>
          </div>div>
        )
}</div>
