// app/lib/cities.ts
// =============================================================================
// Source of truth for the 10 priority Hampton Roads city listing landing pages
// served at /listings/[city-slug]/. Each city has unique SEO content, FAQs,
// and a list of nearby cities for internal linking.
//
// Powered by app/listings/[id]/page.tsx — when params.id matches a slug here,
// the city landing page renders. Otherwise the route falls through to 404.
// =============================================================================

export type CityFaq = {
  q: string;
  a: string;
};

export type CityData = {
  slug: string;                  // URL slug (e.g. "virginia-beach")
  displayName: string;           // Title-case city as it appears in REIN data ("Virginia Beach")
  county: string;                // For metadata + content
  intro: string;                 // 1 paragraph, shows above the listings grid
  neighborhoodsHeading: string;  // H2 for neighborhoods section
  neighborhoods: string;         // 1–2 paragraphs, shows below the grid
  marketSnapshotHeading: string;
  marketSnapshot: string;        // 1 paragraph, broad market context (no hard numbers we can't verify)
  faqs: CityFaq[];               // 4 FAQs covering Tom's keyword targets
  nearby: string[];              // 3–4 nearby city slugs for cross-linking
};

export const CITIES: Record<string, CityData> = {
  "virginia-beach": {
    slug: "virginia-beach",
    displayName: "Virginia Beach",
    county: "City of Virginia Beach (independent city)",
    intro:
      "Virginia Beach is the largest city in Hampton Roads and one of Virginia's most desirable real estate markets. From oceanfront condos along the boardwalk to golf-course communities in Kempsville, established family neighborhoods in Great Neck, and waterfront homes along the Lynnhaven River, the housing inventory here is unusually varied. The city's strong public schools, mild coastal climate, and proximity to Naval Air Station Oceana keep buyer demand consistent year-round, and active inventory typically ranges from sub-$300K starter homes to multi-million-dollar luxury estates.",
    neighborhoodsHeading: "Neighborhoods to know in Virginia Beach",
    neighborhoods:
      "Buyers shopping Virginia Beach typically end up looking at a handful of distinct submarkets. The North End and Oceanfront/Beach Borough draw second-home buyers and short-term rental investors. Great Neck and Birdneck offer established single-family neighborhoods with mature trees and proximity to the bay. Kempsville and Salem are convenient family-friendly suburbs with strong school zones. Sandbridge has its own sub-market of beach houses with rental potential. For military buyers stationed at NAS Oceana or Dam Neck Annex, neighborhoods like Red Mill, Dam Neck Estates, and Kings Grant are popular for their commute time. The VaHome team can help you weigh school zones, BAH alignment, and resale prospects across all of these areas.",
    marketSnapshotHeading: "Virginia Beach market snapshot",
    marketSnapshot:
      "Virginia Beach generally tracks slightly above the regional Hampton Roads median, but the spread between submarkets is wider than most cities — oceanfront and waterfront homes can easily double the city-wide median, while inland starter neighborhoods come in well below it. Property taxes in Virginia Beach are middle of the regional pack. VA-loan-eligible inventory is plentiful given the heavy military presence. If you're a buyer weighing Virginia Beach against a neighboring city, the differentiators usually come down to commute, school zone, and access to the beach.",
    faqs: [
      {
        q: "How do I find Virginia Beach homes for sale that fit my budget?",
        a: "Use the listings grid above to browse current Virginia Beach inventory pulled live from the REIN MLS. You can refine by price, bedrooms, square footage, and home type using the filter sidebar on /listings/?city=Virginia Beach. The VaHome team can also set up a saved search and email you when matching homes hit the market.",
      },
      {
        q: "What is real estate like in Virginia Beach, VA?",
        a: "Virginia Beach real estate is shaped by three main drivers: the oceanfront/resort area, the military presence at NAS Oceana and Dam Neck, and the area's reputation as one of the safest cities of its size in the country. That mix creates steady year-round demand and a wider variety of housing stock than you'd find in most coastal markets — from $250K starter ranches to $5M+ oceanfront estates.",
      },
      {
        q: "Are houses for sale in Virginia Beach a good investment?",
        a: "Virginia Beach has historically held value well, supported by the military economy, in-migration of retirees and PCS-relocating families, and limited buildable land in desirable submarkets. Coastal exposure means flood insurance is a meaningful line item in the eastern parts of the city — a VaHome agent can help you understand AE/X flood zones before you write an offer.",
      },
      {
        q: "What are the most popular neighborhoods in Virginia Beach?",
        a: "The most-searched neighborhoods include Great Neck, Kempsville, Sandbridge, Red Mill, Salem, Pungo (for buyers wanting acreage), and the Oceanfront. Each has a distinct price point, school zone, and lifestyle — see the neighborhoods section above for more detail.",
      },
    ],
    nearby: ["chesapeake", "norfolk", "suffolk", "portsmouth"],
  },

  "norfolk": {
    slug: "norfolk",
    displayName: "Norfolk",
    county: "City of Norfolk (independent city)",
    intro:
      "Norfolk offers some of the most diverse housing options in Hampton Roads — historic Ghent townhomes, Larchmont craftsmen, modern downtown condos, and bungalow neighborhoods in Park Place and Colonial Place. As home to Naval Station Norfolk (the largest naval complex in the world) and the headquarters of NATO Allied Command Transformation, the city has consistent demand from active-duty military, DoD civilians, and contractors, making it especially friendly to VA loan buyers.",
    neighborhoodsHeading: "Neighborhoods to know in Norfolk",
    neighborhoods:
      "Norfolk's neighborhoods are character-rich and range widely in price. Ghent is the city's walkable historic district with restored townhomes, restaurants, and proximity to ODU. Larchmont, Edgewater, and Algonquin Park are established waterfront-adjacent neighborhoods popular with families. Colonial Place and Riverview offer 1920s-era craftsman bungalows at relatively accessible prices. East Beach is a planned coastal community with newer construction. Wards Corner, Fairlawn, and West Ghent are more affordable urban neighborhoods that have seen substantial reinvestment over the last decade. For Navy families stationed at Naval Station Norfolk, neighborhoods like Larchmont, Ocean View, and Lochhaven offer short commutes.",
    marketSnapshotHeading: "Norfolk market snapshot",
    marketSnapshot:
      "Norfolk's median home prices are typically more accessible than Virginia Beach, which makes the city a popular choice for first-time buyers and military families on PCS orders. The trade-off is a more urban setting with older housing stock — many homes were built before 1950, which means more character but also more attention to systems (roof, HVAC, electrical) at inspection time. Coastal flooding is a meaningful consideration in low-lying neighborhoods, so flood-zone review is part of the standard VaHome buyer process here.",
    faqs: [
      {
        q: "How do I search for Norfolk homes for sale?",
        a: "The grid above shows Norfolk homes pulled live from the REIN MLS. Click any listing for full property details. To filter by price, bedrooms, or other criteria, use the filter sidebar on /listings/?city=Norfolk.",
      },
      {
        q: "What is real estate like in Norfolk, VA?",
        a: "Norfolk real estate is character-driven and varied — you'll see early-1900s craftsmen, 1920s townhomes, mid-century brick ranches, and modern infill condos all in the same city. Prices are generally more accessible than Virginia Beach, but variability between neighborhoods is significant. The military presence is the dominant demand driver, with strong year-round VA loan activity.",
      },
      {
        q: "Are houses for sale in Norfolk close to the naval base?",
        a: "Many neighborhoods in Norfolk are within a 15-minute commute of Naval Station Norfolk — Larchmont, Lochhaven, Algonquin Park, Ocean View, and East Beach are particularly popular among Navy families. Use the listings grid to see current inventory, and a VaHome agent can help you evaluate gate-to-doorstep time and BAH-aligned price ranges.",
      },
      {
        q: "Is Norfolk a walkable city?",
        a: "Norfolk leads Hampton Roads in walkability. Ghent, Downtown Norfolk, Park Place, and parts of Colonial Place have grid-pattern streets, sidewalks, and walkable amenities. Most other parts of the city are more car-dependent, similar to other Hampton Roads suburbs.",
      },
    ],
    nearby: ["virginia-beach", "portsmouth", "chesapeake", "hampton"],
  },

  "chesapeake": {
    slug: "chesapeake",
    displayName: "Chesapeake",
    county: "City of Chesapeake (independent city)",
    intro:
      "Chesapeake is Virginia's second-largest city by area and offers a mix of suburban subdivisions, rural acreage, and waterfront properties along the Intracoastal Waterway. Western Branch, Greenbrier, and Great Bridge are among the most sought-after neighborhoods, with top-rated public schools and easy access to I-64 and the Chesapeake Expressway. The city is known for lower property taxes and larger lot sizes compared to neighboring Virginia Beach and Norfolk, which makes it especially attractive to families looking for more space.",
    neighborhoodsHeading: "Neighborhoods to know in Chesapeake",
    neighborhoods:
      "Chesapeake's neighborhoods divide roughly into north-of-the-canal (more developed, closer to I-64 and Norfolk) and south-of-the-canal (more rural and waterfront). Greenbrier and Edinburgh are popular newer subdivisions with strong school zones. Great Bridge has small-town feel with historic charm and good schools. Western Branch offers established single-family neighborhoods convenient to Portsmouth and the shipyard. Cahoon Plantation is a planned golf-course community. South Norfolk is the city's older, walkable urban district. For waterfront buyers, neighborhoods along the Intracoastal Waterway and the Elizabeth River branches offer dock-out access; deep-water neighborhoods are particularly popular with boating families.",
    marketSnapshotHeading: "Chesapeake market snapshot",
    marketSnapshot:
      "Chesapeake's median home prices are typically in the middle of the regional range, but lot sizes are larger and property taxes lower than most neighboring cities — so the dollar-per-square-foot or dollar-per-acre value is often better than Virginia Beach or Norfolk. Newer construction is common in northern Chesapeake (Edinburgh, Cahoon, Bells Mill area), while established neighborhoods like Hickory and Indian River offer more mature settings. Buyers shopping Chesapeake often weigh it against Suffolk for more land and lower price-per-square-foot.",
    faqs: [
      {
        q: "Where can I find Chesapeake homes for sale right now?",
        a: "The listings grid above shows current Chesapeake inventory from the REIN MLS, refreshed continuously. Click into any listing for full details. Use /listings/?city=Chesapeake to refine by price, bedrooms, or property type.",
      },
      {
        q: "What is real estate like in Chesapeake, VA?",
        a: "Chesapeake real estate is suburban-leaning, with newer subdivisions in northern areas, established single-family neighborhoods in the middle, and rural/waterfront acreage in the south. Property taxes are among the most favorable in the region, and lot sizes tend to be larger than in Virginia Beach or Norfolk — making Chesapeake a popular choice for families wanting more space without leaving the metro area.",
      },
      {
        q: "Are houses for sale in Chesapeake good for families?",
        a: "Chesapeake Public Schools are consistently among the highest-rated in Hampton Roads, and the city has invested heavily in parks, libraries, and recreation centers. Greenbrier, Western Branch, and Great Bridge are particularly popular family neighborhoods. A VaHome agent can help you align school zone preferences with current inventory.",
      },
      {
        q: "Does Chesapeake have waterfront homes?",
        a: "Yes — Chesapeake has substantial waterfront inventory along the Intracoastal Waterway, the Elizabeth River branches, and assorted creeks. Dock-out and deep-water properties trade at premium prices and are popular with boating buyers. Use the search to filter for waterfront-adjacent neighborhoods.",
      },
    ],
    nearby: ["virginia-beach", "portsmouth", "suffolk", "norfolk"],
  },

  "suffolk": {
    slug: "suffolk",
    displayName: "Suffolk",
    county: "City of Suffolk (independent city)",
    intro:
      "Suffolk is Hampton Roads' fastest-growing city and one of the largest in Virginia by land area. Buyers find a mix of new-construction subdivisions in northern neighborhoods like Harbour View and Burbage Grant, charming historic homes in Downtown Suffolk, and substantial rural and waterfront properties throughout the southern half of the city. Suffolk's lower cost of living, generous lot sizes, and easy commute to Naval Medical Center Portsmouth and Norfolk Naval Shipyard make it especially appealing to growing families and military households.",
    neighborhoodsHeading: "Neighborhoods to know in Suffolk",
    neighborhoods:
      "Suffolk's housing geography is shaped by its enormous footprint — neighborhoods range from dense planned communities in the north to working farms in the south. Harbour View is the city's flagship newer-construction master-planned area with retail, restaurants, and easy access to the Monitor-Merrimac Bridge-Tunnel and Newport News. Burbage Grant and The Riverfront offer family-friendly subdivisions. Downtown Suffolk has historic homes and walkable amenities. Driver, Crittenden, and Eclipse are quieter waterfront neighborhoods on the Nansemond River. Whaleyville and the south of the city are rural — buyers there are generally seeking acreage, hunting land, or homestead-style properties.",
    marketSnapshotHeading: "Suffolk market snapshot",
    marketSnapshot:
      "Suffolk's median home prices are among the most accessible in Hampton Roads, but the spread is wide because of how much the city varies in character. Northern Suffolk subdivisions trade at prices comparable to Chesapeake newer-construction neighborhoods. Rural southern Suffolk lots can go on the market at very different price points depending on acreage and improvements. The city has invested significantly in infrastructure and schools over the last decade, and continues to draw new residents from elsewhere in the region.",
    faqs: [
      {
        q: "How do I browse Suffolk homes for sale?",
        a: "The grid above pulls Suffolk homes live from REIN. Click any listing for full details, photos, and tax history. Use /listings/?city=Suffolk to filter by price, bedrooms, square footage, year built, and other criteria.",
      },
      {
        q: "What is real estate like in Suffolk, VA?",
        a: "Suffolk real estate spans a remarkable range — new-construction townhomes in Harbour View, established single-family in The Riverfront, historic homes downtown, and rural acreage in the south. Prices are generally more accessible than the Beach or Norfolk, and lot sizes tend to be substantially larger. The city has been growing fast and continues to add inventory.",
      },
      {
        q: "Are houses for sale in Suffolk good for VA loans?",
        a: "Yes. Suffolk's stock includes many single-family and newer-construction properties that are straightforward for VA financing, plus an attractive commute to Naval Medical Center Portsmouth, Norfolk Naval Shipyard, and Naval Station Norfolk via the Monitor-Merrimac. A VaHome agent can help you align BAH for your paygrade with current Suffolk inventory.",
      },
      {
        q: "What's the difference between Northern and Southern Suffolk?",
        a: "Northern Suffolk (above Route 58/Western Branch area) is more developed — newer subdivisions, retail centers, and shorter commutes to the metro. Southern Suffolk is much more rural, with larger acreage, working farms, and small towns like Whaleyville. Buyers usually have a clear preference based on lifestyle.",
      },
    ],
    nearby: ["chesapeake", "portsmouth", "isle-of-wight", "newport-news"],
  },

  "portsmouth": {
    slug: "portsmouth",
    displayName: "Portsmouth",
    county: "City of Portsmouth (independent city)",
    intro:
      "Portsmouth combines historic naval heritage with affordable, character-rich neighborhoods. Olde Towne Portsmouth offers tree-lined streets of restored 18th- and 19th-century homes with sweeping Elizabeth River views — one of the largest collections of pre-Revolutionary architecture in the country. Churchland, Cradock, and West Park View provide established family neighborhoods at price points well below comparable Norfolk or Virginia Beach properties. The city is home to Norfolk Naval Shipyard, one of the Navy's oldest and largest, ensuring consistent demand from civilian shipyard workers and active-duty Navy personnel.",
    neighborhoodsHeading: "Neighborhoods to know in Portsmouth",
    neighborhoods:
      "Portsmouth's neighborhoods are concentrated and walkable, more like Norfolk than Chesapeake or Suffolk. Olde Towne is the historic district — restored Federal and Victorian homes, brick sidewalks, and the Elizabeth River right at your doorstep. Park View and Cavalier Manor offer established mid-century neighborhoods. Churchland (technically a section of Portsmouth that abuts Suffolk) is suburban-feeling with newer construction. Cradock is a federally registered historic district built for shipyard workers in the WWI era. Westhaven and Fairview are smaller neighborhoods with strong identity. For Navy families, Cradock, Park View, and parts of Olde Towne are within a short commute of NNSY.",
    marketSnapshotHeading: "Portsmouth market snapshot",
    marketSnapshot:
      "Portsmouth has some of the most accessible median home prices in Hampton Roads, which makes it especially appealing to first-time buyers, investors, and military families seeking VA loan properties close to Norfolk Naval Shipyard. The trade-off is older housing stock — many neighborhoods predate 1960 — and buyers should plan for inspection scrutiny. The city has been investing in waterfront and downtown revitalization, and Olde Towne in particular has seen meaningful appreciation in recent years.",
    faqs: [
      {
        q: "How do I find Portsmouth homes for sale?",
        a: "The listings grid above shows current Portsmouth inventory live from the REIN MLS. Use /listings/?city=Portsmouth to refine by price, bedrooms, and other filters. Click into any listing for the full property page with photos and details.",
      },
      {
        q: "What is real estate like in Portsmouth, VA?",
        a: "Portsmouth real estate is character-rich and accessible. The city has an unusual concentration of historic homes — Olde Towne includes some of the oldest residential architecture in Virginia — paired with established mid-century neighborhoods and pockets of newer suburban development. Prices are generally lower than Norfolk or the Beach, with the trade-off being older systems in much of the housing stock.",
      },
      {
        q: "Are houses for sale in Portsmouth a good value?",
        a: "Portsmouth often offers more square footage and more architectural character per dollar than neighboring cities. For buyers willing to do some renovation, the value can be exceptional. For move-in-ready buyers, Olde Towne and pockets of Park View have a steady supply of restored homes — those typically command a premium relative to other Portsmouth neighborhoods but are still accessible by regional standards.",
      },
      {
        q: "Is Portsmouth close to the naval shipyard?",
        a: "Yes — Norfolk Naval Shipyard (NNSY) is in Portsmouth, not Norfolk despite the name. Many Portsmouth neighborhoods are within 10–15 minutes of the gate, including Cradock (which was originally built to house shipyard workers), Park View, and parts of Olde Towne.",
      },
    ],
    nearby: ["norfolk", "chesapeake", "suffolk", "virginia-beach"],
  },

  "hampton": {
    slug: "hampton",
    displayName: "Hampton",
    county: "City of Hampton (independent city)",
    intro:
      "Hampton is one of the oldest English-speaking settlements in America and offers an exceptional value proposition for home buyers in Hampton Roads. Neighborhoods like Phoebus, Wythe, and Buckroe Beach combine historic charm with proximity to Joint Base Langley-Eustis (Langley side), making the city particularly popular with Air Force families. Median home prices in Hampton are among the most accessible in the region, with single-family homes available well under $300,000 in many neighborhoods.",
    neighborhoodsHeading: "Neighborhoods to know in Hampton",
    neighborhoods:
      "Hampton's neighborhoods are diverse and well-defined. Buckroe Beach offers oceanfront and bayfront living with a small-town feel — popular with retirees and second-home buyers. Phoebus is a historic downtown-adjacent district with walkable amenities and Victorian-era homes. Wythe and Olde Wythe are established single-family neighborhoods. Fox Hill, Aberdeen Gardens, and Tide Mill are family-oriented mid-century areas. Hampton Roads Center Parkway corridor has newer construction popular with military families. For Air Force families assigned to Langley, neighborhoods like Riverdale, Northampton, and Foxhill are within a short commute.",
    marketSnapshotHeading: "Hampton market snapshot",
    marketSnapshot:
      "Hampton's median home prices are typically among the lowest in the metro, which means meaningful house-for-the-money for buyers willing to look on the Peninsula side of Hampton Roads. The Peninsula vs. Southside trade-off is real — commute times to Norfolk, Virginia Beach, and the major naval bases are longer because of the bridge-tunnels. But for buyers whose work or duty station is on the Peninsula (Langley, Fort Eustis, Newport News Shipbuilding, NASA Langley), Hampton is one of the strongest value plays in the region.",
    faqs: [
      {
        q: "How do I search Hampton homes for sale?",
        a: "The grid above pulls Hampton homes live from the REIN MLS. Use /listings/?city=Hampton to filter by price, bedrooms, square footage, and home type. Click any listing for the full property page.",
      },
      {
        q: "What is real estate like in Hampton, VA?",
        a: "Hampton real estate is one of the best value stories in Hampton Roads. The city has a deep stock of single-family homes, oceanfront and bayfront properties at Buckroe, walkable historic neighborhoods like Phoebus, and convenient access to Langley and Fort Eustis. Prices are generally below the regional median, which has kept Hampton popular with first-time buyers and PCS-relocating military.",
      },
      {
        q: "Are houses for sale in Hampton near Langley AFB?",
        a: "Yes. Many Hampton neighborhoods are within a 10–20 minute commute of Joint Base Langley-Eustis (Langley side). Riverdale, Northampton, Mercury Boulevard corridor, and parts of Fox Hill are particularly popular with Air Force families. A VaHome agent can help you align BAH for your paygrade with available inventory.",
      },
      {
        q: "Does Hampton have waterfront homes?",
        a: "Yes — Buckroe Beach offers oceanfront and bayfront properties on the Chesapeake Bay, and other Hampton neighborhoods have river and creek frontage. Buckroe in particular has seen renewed buyer interest as a relatively affordable Hampton Roads beach community.",
      },
    ],
    nearby: ["newport-news", "yorktown", "norfolk", "york-county"],
  },

  "newport-news": {
    slug: "newport-news",
    displayName: "Newport News",
    county: "City of Newport News (independent city)",
    intro:
      "Newport News is a long, narrow city stretching along the James River with neighborhoods that range dramatically in price and character. Hilton Village offers historic English-village-style homes built in the 1910s; Port Warwick provides newer mixed-use community living with restaurants and shops on-site. Denbigh, Kiln Creek, and Riverside offer suburban subdivisions popular with families. The city is home to Newport News Shipbuilding (the largest industrial employer in Virginia) and Joint Base Langley-Eustis (Fort Eustis side).",
    neighborhoodsHeading: "Neighborhoods to know in Newport News",
    neighborhoods:
      "Newport News neighborhoods are concentrated along the city's long north–south axis. Hilton Village (south end) is a National Register historic district with English-cottage-style homes — one of the country's earliest planned communities. Port Warwick is a newer master-planned community with residential, retail, and dining. Riverside and Hidenwood are established mid-century neighborhoods popular with shipyard professionals. Denbigh, Kiln Creek, and Lee Hall (north end) offer suburban subdivisions and easy access to Fort Eustis. Coleman Place, Stoneybrook, and Beechmont are family-friendly mid-density neighborhoods. The Peninsula's Lee Hall and Endview communities are convenient for Fort Eustis families.",
    marketSnapshotHeading: "Newport News market snapshot",
    marketSnapshot:
      "Newport News has some of the most accessible median home prices in Hampton Roads, paired with strong public schools in some neighborhoods (notably the south end and parts of the central city). Many neighborhoods have older housing stock with character, while north-end areas like Kiln Creek and Riverside Country Club have newer, more uniform construction. The city's two largest employers — Newport News Shipbuilding and Fort Eustis — anchor consistent housing demand across multiple price tiers.",
    faqs: [
      {
        q: "How do I find Newport News homes for sale?",
        a: "The grid above shows live Newport News inventory from REIN. Use /listings/?city=Newport News to filter by price, bedrooms, and other criteria. Click any listing for the full property page with photos and details.",
      },
      {
        q: "What is real estate like in Newport News, VA?",
        a: "Newport News real estate is among the most varied in the region — historic Hilton Village in the south, master-planned Port Warwick in the central city, and suburban Kiln Creek and Lee Hall in the north. Prices are generally accessible, and the city's two big employers (the shipyard and Fort Eustis) keep demand steady. Buyers usually have a clear south-vs-north preference.",
      },
      {
        q: "Are houses for sale in Newport News close to Fort Eustis?",
        a: "Yes — north-end Newport News neighborhoods like Kiln Creek, Lee Hall, Endview, and Denbigh are convenient to Joint Base Langley-Eustis (Fort Eustis side) and Newport News-Williamsburg International Airport. Commute times to Fort Eustis from these areas are typically 10–20 minutes.",
      },
      {
        q: "What is Hilton Village like?",
        a: "Hilton Village is a National Register historic district built in 1918 as one of the first planned communities in the U.S. — designed for shipyard workers during WWI. Today it's known for its English-cottage architecture, mature trees, and walkability to small shops along Warwick Boulevard.",
      },
    ],
    nearby: ["hampton", "yorktown", "york-county", "williamsburg"],
  },

  "williamsburg": {
    slug: "williamsburg",
    displayName: "Williamsburg",
    county: "City of Williamsburg (independent city, surrounded by James City and York Counties)",
    intro:
      "Williamsburg combines colonial-era history with one of Virginia's most distinctive real estate markets. Homes here range from restored historic properties in the Historic Triangle to newer single-family construction in master-planned communities like Ford's Colony, Kingsmill, and Governor's Land. The city is anchored by The College of William & Mary, Colonial Williamsburg, and Busch Gardens, supporting a robust tourism and educational economy that keeps the area attractive to retirees and second-home buyers.",
    neighborhoodsHeading: "Neighborhoods and communities to know in Williamsburg",
    neighborhoods:
      "Williamsburg's housing is heavily clustered in master-planned communities. Ford's Colony is one of Virginia's largest gated golf-course communities, with multiple neighborhoods inside its perimeter. Kingsmill on the James offers waterfront and golf-course homes. Governor's Land is another high-amenity gated community. Closer to the historic district, Berkeley's Green, Kingspoint, and Skipwith Farms are established neighborhoods with character. New Town is a mixed-use walkable urban village. James City County and York County both surround the City of Williamsburg, and many properties marketed as 'Williamsburg' are technically in those counties — important for tax rates and school zoning. James City County schools are highly rated.",
    marketSnapshotHeading: "Williamsburg market snapshot",
    marketSnapshot:
      "Williamsburg home prices reflect the area's desirability and amenity-rich communities. Many homes here are in HOAs that provide golf, pools, clubhouses, and gated security — which adds both monthly cost and resale appeal. The market is meaningfully different from the rest of Hampton Roads: less military demand, more retiree and second-home buyer demand, and a stronger tilt toward larger lots and HOA communities. Williamsburg is roughly an hour from Norfolk and the Beach, so buyers here typically aren't commuting daily to those cities.",
    faqs: [
      {
        q: "How do I search Williamsburg homes for sale?",
        a: "The grid above shows current Williamsburg listings live from the REIN MLS. Note that homes marketed as 'Williamsburg' may be in the City of Williamsburg, James City County, or York County — each has different tax rates and school zones. Use /listings/?city=Williamsburg to filter by price and other criteria.",
      },
      {
        q: "What is real estate like in Williamsburg, VA?",
        a: "Williamsburg real estate is amenity-driven, with much of the inventory inside master-planned communities like Ford's Colony, Kingsmill, and Governor's Land. The market draws retirees, second-home buyers, and W&M-affiliated faculty. Prices generally run higher than the average for Hampton Roads, but the lifestyle and amenity package is also unusually strong.",
      },
      {
        q: "Are houses for sale in Williamsburg good for retirees?",
        a: "Williamsburg consistently ranks well as a retirement destination — a combination of lower humidity than the coast, strong healthcare (Sentara, Riverside, William & Mary), substantial cultural amenities (Colonial Williamsburg, the Muscarelle Museum), and HOA-managed communities that handle exterior maintenance. Many of the master-planned communities are popular with retirees specifically.",
      },
      {
        q: "Is Williamsburg part of Hampton Roads?",
        a: "Williamsburg sits at the northwest edge of the Hampton Roads metro area. It's in the same MSA but has a distinct character — more historic, more amenity-driven, and less military-influenced than the cities closer to the naval bases. About an hour from downtown Norfolk depending on traffic.",
      },
    ],
    nearby: ["yorktown", "york-county", "newport-news", "hampton"],
  },

  "yorktown": {
    slug: "yorktown",
    displayName: "Yorktown",
    county: "York County",
    intro:
      "Yorktown is a charming historic town on the York River, best known as the site of the decisive 1781 Revolutionary War battle. Today, Yorktown offers picturesque homes ranging from waterfront colonials to newer subdivisions in nearby Tabb and Grafton. The town is part of York County, which consistently ranks among the top public school systems in Virginia, making it a top choice for families. Yorktown is also conveniently located near Joint Base Langley-Eustis (Fort Eustis side) and Naval Weapons Station Yorktown.",
    neighborhoodsHeading: "Neighborhoods to know in and around Yorktown",
    neighborhoods:
      "Most homes in the Yorktown area are technically in York County, with the historic Yorktown village itself being the smallest part. Tabb (south of Yorktown proper) is a popular family suburb with consistently strong schools — neighborhoods like Marlbank, Coventry, and Running Man are particularly sought after. Grafton (between Tabb and Yorktown) offers a mix of established and newer construction. Seaford and Dandy are quieter waterfront and rural neighborhoods. The Yorktown waterfront itself has a small inventory of historic homes that rarely come to market. For military families, Tabb and Grafton are the most popular for their commute to Langley AFB and Fort Eustis.",
    marketSnapshotHeading: "Yorktown market snapshot",
    marketSnapshot:
      "Home prices in the Yorktown/York County area tend to be higher than the regional average, reflecting strong school quality and lower density. The county has limited inventory at any given time — when a well-priced home in a desirable neighborhood like Coventry or Marlbank hits the market, it often goes under contract quickly. Buyers should be prepared to move fast and have financing pre-approval in hand.",
    faqs: [
      {
        q: "How do I find Yorktown homes for sale?",
        a: "The grid above shows live Yorktown-area inventory from the REIN MLS. Note that 'Yorktown' often refers to the broader York County area including Tabb and Grafton. Use /listings/?city=Yorktown to refine your search by price and other criteria.",
      },
      {
        q: "What is real estate like in Yorktown, VA?",
        a: "Yorktown-area real estate (including Tabb and Grafton) is family-friendly and school-driven. York County Schools consistently rank among Virginia's strongest, which keeps demand high in the county's family neighborhoods. Inventory turnover tends to be lower than in Norfolk or the Beach — meaning homes often sell quickly when they hit the market.",
      },
      {
        q: "Are houses for sale in Yorktown good for military families?",
        a: "Yes — Yorktown/York County is convenient to both Joint Base Langley-Eustis (Fort Eustis side) and Naval Weapons Station Yorktown. Tabb and Grafton in particular are popular with military families because of the school quality and the commute. A VaHome agent can help you align BAH for your paygrade with current inventory.",
      },
      {
        q: "Is Yorktown the same as York County?",
        a: "Not exactly — Yorktown is a small historic village within York County. Most homes marketed as 'Yorktown' are technically in surrounding York County areas like Tabb, Grafton, Seaford, or Dandy. The shared county-wide school system is one of the area's biggest draws.",
      },
    ],
    nearby: ["york-county", "newport-news", "williamsburg", "hampton"],
  },

  "york-county": {
    slug: "york-county",
    displayName: "York County",
    county: "York County",
    intro:
      "York County encompasses Yorktown, Tabb, Grafton, and Seaford on the Peninsula, as well as a small portion north of the York River. The county is best known for its consistently top-ranked public school system, which draws families from across Hampton Roads. Home buyers find a mix of established suburban subdivisions, newer-construction master-planned communities, and waterfront properties along the York River and the Chesapeake Bay tributaries.",
    neighborhoodsHeading: "Communities to know in York County",
    neighborhoods:
      "York County's inventory is concentrated in three main areas. Tabb is the largest and most popular — neighborhoods like Coventry, Running Man, Brentwood, and Marlbank consistently see strong demand from families. Grafton offers a mix of established and newer-construction neighborhoods. Yorktown village proper is small and rarely-traded. Seaford is quieter, more rural, and attracts buyers wanting more land and water access. The northern part of the county (across the York River, including Lackey and Dare) is more rural still. For military families, the southern and central parts of the county (Tabb, Grafton) are most popular for their commute to Langley AFB, Fort Eustis, and Naval Weapons Station Yorktown.",
    marketSnapshotHeading: "York County market snapshot",
    marketSnapshot:
      "York County typically commands higher prices than the regional average, with the school system as the primary driver. Inventory tends to be tighter than in larger Hampton Roads cities, and well-located homes in family neighborhoods often go under contract within days. The county has invested in new schools and recreational amenities over the past decade, reinforcing its position as one of the most desirable family markets in the metro.",
    faqs: [
      {
        q: "How do I search York County homes for sale?",
        a: "The grid above shows live York County listings (including Tabb, Grafton, Seaford, and Yorktown) pulled from the REIN MLS. Use /listings/?city=York County to refine by price, bedrooms, and other filters.",
      },
      {
        q: "What is real estate like in York County, VA?",
        a: "York County real estate is school-system-driven. The public schools are consistently top-ranked in Virginia, which keeps family demand strong year-round and inventory tight. Pricing is generally above the regional median, but the trade-off is among the best public school value in the metro.",
      },
      {
        q: "Are houses for sale in York County good for military families?",
        a: "Yes. York County is convenient to Joint Base Langley-Eustis (Fort Eustis side, ~15 min), Naval Weapons Station Yorktown (in-county), and reachable to Langley AFB. The schools are one of the strongest reasons military families gravitate here — with frequent PCS moves, school continuity matters. A VaHome agent can help you find inventory that aligns with your paygrade BAH.",
      },
      {
        q: "What's the difference between York County and Yorktown?",
        a: "York County is the broader jurisdiction; Yorktown is a small historic village within it. Most homes marketed as 'Yorktown' are actually in the surrounding York County areas (Tabb, Grafton, Seaford). The school system and tax rate are the same county-wide.",
      },
    ],
    nearby: ["yorktown", "newport-news", "williamsburg", "hampton"],
  },
};

export const CITY_SLUGS = Object.keys(CITIES);

export function getCity(slug: string): CityData | undefined {
  return CITIES[slug.toLowerCase()];
}

// Convert a REIN city value (e.g. "Virginia Beach") to a city slug.
export function citySlugFromName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;
  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
  return CITIES[slug] ? slug : undefined;
}
