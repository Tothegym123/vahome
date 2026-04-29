import { Metadata } from "next";

const CITY_INTROS: Record<string, string> = {
  "virginia-beach": "Virginia Beach is the largest city in Hampton Roads and one of Virginia's most desirable real estate markets. Home buyers here can choose from oceanfront condos along the boardwalk, golf-course communities in Kempsville, established family neighborhoods in Great Neck, and waterfront properties along the Lynnhaven River. The city's combination of strong public schools, mild coastal climate, and proximity to Naval Air Station Oceana keeps housing demand consistent year-round. The median home price in Virginia Beach typically tracks slightly above the regional average, with active inventory ranging from sub-$300K starter homes to multi-million-dollar luxury estates. The VaHome team specializes in Virginia Beach real estate and can help you navigate everything from VA loan eligibility to school zone boundaries.",
  "norfolk": "Norfolk offers some of the most diverse housing options in Hampton Roads, from historic Ghent townhomes and Larchmont craftsmen to modern condos in the booming Downtown waterfront district. As home to Naval Station Norfolk, the largest naval base in the world, the city has consistent demand from active-duty military and DoD civilians, making it especially friendly to VA loan buyers. Neighborhoods like Colonial Place, Edgewater, and Park Place each have distinct character and price ranges. Norfolk also leads the region in walkability, with neighborhoods like Ghent and Riverview ranking among the most walkable in Virginia. Median home prices here are typically more accessible than Virginia Beach, making Norfolk a popular choice for first-time buyers and military families on PCS orders.",
  "chesapeake": "Chesapeake is Virginia's second-largest city by area and offers a mix of suburban subdivisions, rural acreage, and waterfront properties along the Intracoastal Waterway. Western Branch, Greenbrier, and Great Bridge are among the most sought-after neighborhoods, with top-rated public schools and easy access to I-64 and the Chesapeake Expressway. Chesapeake is known for its lower property taxes and larger lot sizes compared to neighboring cities, making it attractive to families looking for more space. Newer construction is common in areas like Edinburgh and Cahoon Plantation, while established neighborhoods like Hickory and Indian River offer more mature settings. The VaHome team has deep experience guiding buyers through Chesapeake's varied submarkets.",
  "suffolk": "Suffolk is Hampton Roads' fastest-growing city and one of the largest in Virginia by land area. Home buyers find a mix of new-construction subdivisions in northern neighborhoods like Harbour View and Burbage Grant, charming historic homes in Downtown Suffolk, and substantial rural and waterfront properties throughout the south of the city. Suffolk's lower cost of living, generous lot sizes, and easy commute to Naval Medical Center Portsmouth and Norfolk Naval Shipyard make it especially appealing to growing families and military households. Public schools in Suffolk include several highly rated options, and the city has invested heavily in parks, trails, and waterfront access in recent years.",
  "hampton": "Hampton is one of the oldest English-speaking settlements in America and offers an exceptional value proposition for home buyers in Hampton Roads. Neighborhoods like Phoebus, Wythe, and Buckroe Beach combine historic charm with proximity to Joint Base Langley-Eustis, making the city particularly popular with Air Force and Army families. Hampton's median home price is typically among the most accessible in the region, with single-family homes available well under $300,000 in many neighborhoods. Buckroe Beach offers oceanfront and bayfront living, while Fox Hill and Aberdeen Gardens provide established family neighborhoods. The VaHome team can help you find homes near Langley AFB, including ones that fit BAH for various paygrades.",
  "newport-news": "Newport News is a long, narrow city stretching along the James River with neighborhoods that range dramatically in price and character. Hilton Village offers historic English-village-style homes, while Port Warwick provides newer mixed-use community living with restaurants and shops on-site. Denbigh and Kiln Creek offer suburban subdivisions popular with families. Newport News is home to Newport News Shipbuilding, the city's largest employer, as well as Joint Base Langley-Eustis (Fort Eustis side). Median home prices remain among the most accessible in Hampton Roads, making this a strong choice for first-time buyers and shipyard workers. Public schools in some neighborhoods are highly rated, while others have improved substantially in recent years.",
  "portsmouth": "Portsmouth combines historic naval heritage with affordable, character-rich neighborhoods. Olde Towne Portsmouth offers tree-lined streets of restored 18th and 19th century homes with sweeping Elizabeth River views. Churchland, Cradock, and West Park View provide established family neighborhoods at price points well below comparable Norfolk or Virginia Beach properties. The city is home to Norfolk Naval Shipyard, one of the Navy's oldest and largest shipyards, ensuring consistent demand from civilian shipyard workers and active-duty Navy personnel. Portsmouth's median home prices are among the lowest in Hampton Roads, making it especially appealing to first-time buyers, investors, and military families seeking a VA loan property close to base.",
  "yorktown": "Yorktown is a charming historic town on the York River, best known for the decisive battle of the American Revolution that ended here in 1781. Today, Yorktown offers picturesque homes ranging from waterfront colonials to newer subdivisions in nearby Tabb and Grafton. The town is part of York County, which consistently ranks among the top public school systems in Virginia, making it a top choice for families. Yorktown is also conveniently located near Joint Base Langley-Eustis (Fort Eustis side) and Naval Weapons Station Yorktown, with manageable commutes to both. Home prices in Yorktown and surrounding York County tend to be higher than the regional average, reflecting strong school quality and lower density.",
  "williamsburg": "Williamsburg combines colonial-era history with one of Virginia's most distinctive real estate markets. Homes here range from restored historic properties in the Historic Triangle to newer single-family construction in master-planned communities like Ford's Colony and Kingsmill. The city is anchored by The College of William & Mary, Colonial Williamsburg, and Busch Gardens, supporting a robust tourism and educational economy. Williamsburg's home prices reflect the area's desirability, with strong demand from retirees, second-home buyers, and families drawn by James City County's highly rated schools. Many neighborhoods offer golf courses, pools, and clubhouses as part of HOA amenities."
};


export function generateMetadata({ searchParams }: { searchParams: { city?: string; q?: string } }): Metadata {
  const city = searchParams.city;
  const query = searchParams.q;
  
  let title = "Homes for Sale in Hampton Roads";
  let description = "Browse homes for sale in Hampton Roads, Virginia. Find your perfect property in Virginia Beach, Norfolk, Chesapeake, and more.";
  
  if (city) {
    title = "Homes for Sale in " + city + ", VA";
    description = "Browse homes for sale in " + city + ", Virginia. View listings, prices, and property details with VaHome.com.";
  } else if (query) {
    title = "Search Results: " + query;
    description = "Property search results for " + query + " in Hampton Roads, Virginia.";
  }
  title += " | VaHome.com";
  
  return {
    title,
    description,
    alternates: {
      canonical: city ? "/listings/?city=" + encodeURIComponent(city) : "/listings/",
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function ListingsPage({
  searchParams,
}: {
  searchParams: { city?: string; q?: string };
}) {
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
          {(() => {
            const c = (searchParams?.city || "").toString().toLowerCase().replace(/\s+/g, "-");
            const intro = CITY_INTROS[c];
            if (!intro) return null;
            return (
              <section className="max-w-4xl mx-auto px-6 py-8">
                <p className="text-gray-700 leading-relaxed text-base">{intro}</p>
              </section>
            );
          })()}
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
