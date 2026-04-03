import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-black tracking-tight mb-4">
              <span className="text-primary-400">Va</span>
              <span className="text-white">Home</span>
              <span className="text-gray-500 font-light">.com</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted real estate experts in Hampton Roads, Virginia.
              Serving Virginia Beach, Norfolk, Chesapeake, Suffolk & beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-3">
              {['Buy a Home', 'Sell Your Home', 'Blog', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Areas We Serve</h3>
            <ul className="space-y-3">
              {['Virginia Beach', 'Norfolk', 'Chesapeake', 'Suffolk', 'Hampton', 'Newport News'].map((area) => (
                <li key={area}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                249 Central Park Ave Ste 300<br />Virginia Beach, VA 23462
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:tom@vahome.com" className="hover:text-primary-400 transition-colors">tom@vahome.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} VaHome.com. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* REIN MLS Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 leading-relaxed">
            &copy; 2026 REIN, Inc. All Rights Reserved. Information deemed reliable but not guaranteed.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            The listings data displayed on this website is provided in part by the Real Estate Information Network, Inc. (REIN) and is authorized for display by participating Broker Members of REIN. REIN&rsquo;s listings are based upon data submitted by its Broker Members, and REIN makes no representation or warranty regarding the accuracy of the data. All users of REIN&rsquo;s listings database should confirm the accuracy of the listing information directly with the listing agent.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            REIN&rsquo;s listings data and information are protected under federal copyright laws. Federal law prohibits, among other acts, the unauthorized copying, reproduction, redistribution, or creation of derivative works from any part of copyrighted material, including certain compilations of data and information. COPYRIGHT VIOLATORS MAY BE SUBJECT TO SEVERE FINES AND PENALTIES UNDER FEDERAL LAW.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            REIN updates its listings on a daily basis. Data last updated: {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            This website does not include all properties available for sale at this time.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            Some or all of the listings (or listings data) represented on this website may have been enhanced with data not provided by REIN. Such enhancements include, but are not limited to, a Mortgage Calculator. The source of these enhancements is: Vahome Info LLC.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-3">
            IDX information is provided exclusively for consumers&rsquo; personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing.
          </p>
        </div>
      </div>
    </footer>
  )
}
