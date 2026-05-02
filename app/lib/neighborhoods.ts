// app/lib/neighborhoods.ts
// =============================================================================
// All 80 Hampton Roads neighborhoods served at /neighborhoods/[slug]/.
//
// 20 carry rich migrated copy from the legacy Lofty site (cleaned of
// branding boilerplate). The remaining 60 render a clean templated page —
// neighborhood name + parent-city context + live REIN listings filtered to
// the subdivision. They never show {{Placeholder}} text the way the old
// Lofty site did (per neighborhood-content-analysis.md the legacy site had
// 41 broken {{Neighborhood Name}} pages and 17 thin pages — both
// categories now render as clean stubs with real listings).
//
// Listings are matched to a neighborhood with a case-insensitive
// substring search against listings.subdivision (REIN's column for the
// subdivision/community name, e.g. 'GREEN RUN', 'OCEAN VIEW EAST'). The
// match pattern defaults to the displayName lowercased; override via
// `subdivisionPattern` when REIN's name differs from the slug.
// =============================================================================

export type NeighborhoodData = {
  slug: string;
  displayName: string;
  citySlug: string;            // matches keys in app/lib/cities.ts
  parentCityName: string;
  hasFullContent: boolean;
  intro?: string;
  lifestyle?: string;
  marketSnapshot?: string;
  // Optional REIN-subdivision matching override. Default: displayName.toLowerCase().
  subdivisionPattern?: string;
};

export const NEIGHBORHOODS: Record<string, NeighborhoodData> = {
  "avalon": {
    slug: "avalon",
    displayName: "Avalon",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: true,
    intro: "Avalon is a Virginia Beach neighborhood known for its suburban charm, established residential character, and convenient location. It's ideal for buyers seeking a quality suburban community with the feel of a well-established neighborhood.",
    lifestyle: "Avalon offers a charming, suburban lifestyle with established community character and residential appeal. Residents enjoy suburban comfort, established neighborhoods, convenient access, and a pleasant living environment. The neighborhood provides a quality suburban living experience.",
    marketSnapshot: "Whether you're buying your family home or relocating to a charming community, Avalon provides the perfect combination of suburban charm and established living.",
  },
  "battlefieldcommons": {
    slug: "battlefieldcommons",
    displayName: "Battlefield Commons",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: true,
    intro: "Battlefield Commons is a peaceful, well-established neighborhood known for its quiet streets, stable residential character, and convenient central location. It's ideal for buyers seeking a quiet community with established neighborhood stability and convenient access to shopping and services.",
    lifestyle: "Battlefield Commons offers a peaceful, well-established residential lifestyle with quiet, tree-lined streets and community stability. Residents enjoy peaceful living, convenient location access, established neighborhood character, and proximity to shopping and dining. The neighborhood provides a serene, stable environment.",
    marketSnapshot: "Whether you're buying in an established community or relocating to a peaceful neighborhood, Battlefield Commons provides the perfect combination of peace and convenient location.",
  },
  "bellinghamchesapeake": {
    slug: "bellinghamchesapeake",
    displayName: "Bellingham",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "brandermill": {
    slug: "brandermill",
    displayName: "Brandermill",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: true,
    intro: "Brandermill is a well-established Virginia Beach neighborhood known for its quiet streets, mature trees and landscaping, convenient access to shops and dining, and established residential character. It's ideal for buyers seeking a peaceful, mature community with convenient shopping and dining access.",
    lifestyle: "Brandermill offers a peaceful, well-established residential lifestyle with mature landscaping and quiet character. Residents enjoy mature trees, peaceful streets, convenient shopping and dining, and the stability of an established neighborhood. The area provides a comfortable, established environment perfect for families seeking peaceful living.",
    marketSnapshot: "Whether you're buying in a stable community or relocating to a peaceful neighborhood, Brandermill provides the perfect balance of maturity, tranquility, and shopping convenience.",
  },
  "camelotchesapeake": {
    slug: "camelotchesapeake",
    displayName: "Camelot",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "chesapeakesouthside": {
    slug: "chesapeakesouthside",
    displayName: "Chesapeake Southside",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "deepcreekchesapeake": {
    slug: "deepcreekchesapeake",
    displayName: "Deep Creek",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "edinburghchesapeake": {
    slug: "edinburghchesapeake",
    displayName: "Edinburgh",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "grassfieldchesapeake": {
    slug: "grassfieldchesapeake",
    displayName: "Grassfield",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "greatbridgechesapeake": {
    slug: "greatbridgechesapeake",
    displayName: "Great Bridge",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: true,
    intro: "Great Bridge is a historic Chesapeake neighborhood known for its strong school reputation, family-oriented community character, and established residential appeal. It's ideal for buyers seeking a family-focused Chesapeake community with excellent schools and neighborhood stability.",
    lifestyle: "Great Bridge offers a family-oriented lifestyle with excellent schools and historic community character. Residents enjoy highly-rated schools, family-friendly amenities, established neighborhoods, and a strong sense of community. The area provides outstanding schools and family living in a historic setting.",
    marketSnapshot: "Whether you're buying your family home or relocating to a family-focused community, Great Bridge provides the perfect combination of excellent schools, historic character, and family-oriented Chesapeake living.",
  },
  "greenbrierchesapeake": {
    slug: "greenbrierchesapeake",
    displayName: "Greenbrier",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "hearthtonegreenbrier": {
    slug: "hearthtonegreenbrier",
    displayName: "Hearthstone at Greenbrier",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: true,
    intro: "Hearthstone at Greenbrier is a Chesapeake neighborhood near the Greenbrier area, known for its convenient access to area amenities, shopping, and schools. It's ideal for buyers seeking a Chesapeake community with modern conveniences and family-friendly living.",
    lifestyle: "Hearthstone at Greenbrier offers a convenient, family-friendly lifestyle near Greenbrier's excellent amenities. Residents enjoy proximity to quality shopping and dining, convenient highway access, and access to family-friendly services and schools. The neighborhood provides modern, convenient Chesapeake living.",
    marketSnapshot: "Whether you're buying in Chesapeake or relocating near Greenbrier, Hearthstone at Greenbrier provides the perfect combination of convenience and family-friendly amenities.",
  },
  "hickoryridgegreenbrier": {
    slug: "hickoryridgegreenbrier",
    displayName: "Hickory Ridge",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "hickorysignalchesapeake": {
    slug: "hickorysignalchesapeake",
    displayName: "Hickory Signal",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "indigopark": {
    slug: "indigopark",
    displayName: "Indigo Park",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "summerparkchesapeake": {
    slug: "summerparkchesapeake",
    displayName: "Summer Park",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "theriverfront": {
    slug: "theriverfront",
    displayName: "The Riverfront",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "waterfrontchesapeake": {
    slug: "waterfrontchesapeake",
    displayName: "Waterfront Chesapeake",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "chesapeakewesternbranch": {
    slug: "chesapeakewesternbranch",
    displayName: "Western Branch",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "woodlake": {
    slug: "woodlake",
    displayName: "Woodlake",
    citySlug: "chesapeake",
    parentCityName: "Chesapeake",
    hasFullContent: false,
  },
  "aberdeengardens": {
    slug: "aberdeengardens",
    displayName: "Aberdeen Gardens",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "buckroe": {
    slug: "buckroe",
    displayName: "Buckroe",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "farmfreshareanewmarketcreek": {
    slug: "farmfreshareanewmarketcreek",
    displayName: "Farm Fresh / New Market Creek",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "foxhillhampton": {
    slug: "foxhillhampton",
    displayName: "Fox Hill",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "hamptonroads": {
    slug: "hamptonroads",
    displayName: "Hampton Roads",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "lasalleheights": {
    slug: "lasalleheights",
    displayName: "LaSalle Heights",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "mallorypark": {
    slug: "mallorypark",
    displayName: "Mallory Park",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "northhampton": {
    slug: "northhampton",
    displayName: "Northhampton",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "oldpointcomfort": {
    slug: "oldpointcomfort",
    displayName: "Old Point Comfort",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "phoebus": {
    slug: "phoebus",
    displayName: "Phoebus",
    citySlug: "hampton",
    parentCityName: "Hampton",
    hasFullContent: false,
  },
  "deerfieldwindsor": {
    slug: "deerfieldwindsor",
    displayName: "Deerfield / Windsor",
    citySlug: "newport-news",
    parentCityName: "Newport News",
    hasFullContent: false,
  },
  "denbigh": {
    slug: "denbigh",
    displayName: "Denbigh",
    citySlug: "newport-news",
    parentCityName: "Newport News",
    hasFullContent: false,
  },
  "hidenwood": {
    slug: "hidenwood",
    displayName: "Hidenwood",
    citySlug: "newport-news",
    parentCityName: "Newport News",
    hasFullContent: false,
  },
  "newportnewscitycenter": {
    slug: "newportnewscitycenter",
    displayName: "Newport News City Center",
    citySlug: "newport-news",
    parentCityName: "Newport News",
    hasFullContent: false,
  },
  "chesapeakeshoresandbayview": {
    slug: "chesapeakeshoresandbayview",
    displayName: "Chesapeake Shores & Bayview",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "colonialplace": {
    slug: "colonialplace",
    displayName: "Colonial Place",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "easternshoreofvirginianorfolk": {
    slug: "easternshoreofvirginianorfolk",
    displayName: "Eastern Shore Area",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "ghent": {
    slug: "ghent",
    displayName: "Ghent",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "lakewoodareavirginiabeach": {
    slug: "lakewoodareavirginiabeach",
    displayName: "Lakewood Area",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "lambertspoint": {
    slug: "lambertspoint",
    displayName: "Lamberts Point",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "larchmont": {
    slug: "larchmont",
    displayName: "Larchmont",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "norfolkwaterfront": {
    slug: "norfolkwaterfront",
    displayName: "Norfolk Waterfront",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "norviewandthetownpoint": {
    slug: "norviewandthetownpoint",
    displayName: "Norview & Town Point",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "oceanview": {
    slug: "oceanview",
    displayName: "Ocean View",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "wardscorner": {
    slug: "wardscorner",
    displayName: "Wards Corner",
    citySlug: "norfolk",
    parentCityName: "Norfolk",
    hasFullContent: false,
  },
  "brightonportsmouth": {
    slug: "brightonportsmouth",
    displayName: "Brighton",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "portsmouthchurchland": {
    slug: "portsmouthchurchland",
    displayName: "Churchland",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "crescenthillsportsmouth": {
    slug: "crescenthillsportsmouth",
    displayName: "Crescent Hills",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "meadowbrook": {
    slug: "meadowbrook",
    displayName: "Meadowbrook",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "oldetowneportsmouth": {
    slug: "oldetowneportsmouth",
    displayName: "Olde Towne Portsmouth",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "portsmouthwaterfront": {
    slug: "portsmouthwaterfront",
    displayName: "Portsmouth Waterfront",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "westernbranchportsmouth": {
    slug: "westernbranchportsmouth",
    displayName: "Western Branch",
    citySlug: "portsmouth",
    parentCityName: "Portsmouth",
    hasFullContent: false,
  },
  "burnsideatnorthsuffolk": {
    slug: "burnsideatnorthsuffolk",
    displayName: "Burnside at North Suffolk",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "carrolltonisleofwight": {
    slug: "carrolltonisleofwight",
    displayName: "Carrollton / Isle of Wight",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "chuckatuck": {
    slug: "chuckatuck",
    displayName: "Chuckatuck",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "driverandlakeland": {
    slug: "driverandlakeland",
    displayName: "Driver & Lakeland",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "eclipse": {
    slug: "eclipse",
    displayName: "Eclipse",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "harbourviewsuffolk": {
    slug: "harbourviewsuffolk",
    displayName: "Harbour View",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "isleofwightcounty": {
    slug: "isleofwightcounty",
    displayName: "Isle of Wight County",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "plantersmill": {
    slug: "plantersmill",
    displayName: "Planters Mill",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "sleepyhole": {
    slug: "sleepyhole",
    displayName: "Sleepy Hole",
    citySlug: "suffolk",
    parentCityName: "Suffolk",
    hasFullContent: false,
  },
  "alanton": {
    slug: "alanton",
    displayName: "Alanton",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Alanton is an established east-side neighborhood known for its mature residential character, proximity to the prestigious Great Neck and First Colonial areas, and quiet established streets. It's ideal for buyers seeking an established neighborhood with proven stability and quality nearby schools.",
    lifestyle: "Alanton offers a mature, established residential lifestyle with quality neighborhoods nearby and stable community character. Residents enjoy proximity to prestigious neighborhoods, access to top-rated First Colonial schools, mature trees and landscaping, and the stability of an established east-side community. The neighborhood provides an established, quality living environment.",
    marketSnapshot: "Whether you're buying in an established community or relocating to a quality neighborhood, Alanton provides the perfect combination of established character and east-side location.",
  },
  "bayisland": {
    slug: "bayisland",
    displayName: "Bay Island",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Bay Island is an exclusive waterfront community in the Lynnhaven area, known for its private beach access, quiet residential setting, and premium waterfront properties. It's ideal for buyers seeking a prestigious waterfront lifestyle with privacy and natural beauty.",
    lifestyle: "Bay Island offers an exclusive waterfront lifestyle with private beach access and peaceful residential character. Residents enjoy pristine waterfront views, private beach privileges, quiet tree-lined streets, and the natural serenity of the Lynnhaven waterfront area. The neighborhood provides an upscale, exclusive environment for discerning buyers.",
    marketSnapshot: "Whether you're buying a waterfront home or relocating to an exclusive community, Bay Island provides the perfect balance of luxury, privacy, and natural waterfront beauty.",
  },
  "chicsbeach": {
    slug: "chicsbeach",
    displayName: "Chic's Beach",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Chic's Beach is a bay-front neighborhood known for its casual beach lifestyle, tight-knit community feel, and waterfront access. It's ideal for buyers seeking an informal, beach-oriented community with authentic coastal character and established neighborhood bonds.",
    lifestyle: "Chic's Beach offers a casual, authentic beach lifestyle with bay-front living and strong community character. Residents enjoy bay access, relaxed beach living, a tight-knit neighborhood feel, and authentic coastal community spirit. The neighborhood provides a genuine, established beach community atmosphere.",
    marketSnapshot: "Whether you're buying a bay-front home or relocating to a casual beach community, Chic's Beach provides the perfect combination of bay-front living and authentic beach character.",
  },
  "croatanbeach": {
    slug: "croatanbeach",
    displayName: "Croatan Beach",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Croatan Beach is an oceanfront neighborhood known for its exclusive beach lifestyle, direct ocean access, and premium residential properties. It's ideal for buyers seeking an oceanfront lifestyle with the appeal and exclusivity of beach living.",
    lifestyle: "Croatan Beach offers an exclusive oceanfront lifestyle with direct beach access and natural coastal beauty. Residents enjoy oceanfront views, beach privileges, exclusive residential character, and the natural serenity of coastal Virginia Beach living. The neighborhood provides a premier oceanfront environment for those seeking coastal living.",
    marketSnapshot: "Whether you're buying oceanfront or relocating to a beach community, Croatan Beach provides the perfect oceanfront lifestyle and exclusive coastal living.",
  },
  "greatneck": {
    slug: "greatneck",
    displayName: "Great Neck",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Great Neck is a prestigious east-side neighborhood known for its larger lot sizes, established character, and proximity to the highly-regarded First Colonial High School corridor. It's ideal for buyers seeking an upscale, established community with quality homes and strong schools.",
    lifestyle: "Great Neck offers a refined, prestigious lifestyle with spacious lots and established residential character. Residents enjoy larger home sites, mature landscaping and trees, proximity to top-rated First Colonial corridor schools, and the prestige of an established east-side address. The neighborhood provides an upscale environment for discerning buyers.",
    marketSnapshot: "Whether you're buying a premium home or relocating to a prestigious neighborhood, Great Neck provides the perfect combination of larger lots, established quality, and east-side prestige.",
  },
  "greenrun": {
    slug: "greenrun",
    displayName: "Green Run",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Green Run is a family-friendly Virginia Beach neighborhood known for its excellent schools, beautiful parks, convenient shopping, and easy beach access. It's ideal for buyers seeking a quality family community with top-rated schools and recreational opportunities.",
    lifestyle: "Green Run offers an active, family-oriented lifestyle with excellent schools and recreational amenities. Residents enjoy highly-rated schools, beautiful parks and recreational facilities, convenient shopping and dining, and easy access to Virginia Beach's attractions and beaches. The neighborhood provides outstanding schools, parks, and family-friendly living.",
    marketSnapshot: "Whether you're buying your family home or relocating to a quality school community, Green Run provides the perfect combination of excellent schools, recreation, and family living.",
  },
  "kempsville": {
    slug: "kempsville",
    displayName: "Kempsville",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Kempsville is a large, well-established Virginia Beach neighborhood known for its diverse housing options, excellent schools, central location, and established residential character. It's ideal for buyers seeking a mature community with proven school performance and convenient access to everything Virginia Beach offers.",
    lifestyle: "Kempsville offers a vibrant, established lifestyle with diverse housing options and family-friendly amenities. Residents enjoy highly-rated schools, convenient shopping and dining, good highway access, and an established community with strong neighborhood character. The area provides excellent schools, diverse housing, and central location convenience.",
    marketSnapshot: "Whether you're buying your family home or relocating to an established community, Kempsville provides the perfect combination of excellent schools, diverse housing options, and central Virginia Beach living.",
  },
  "lakechristopher": {
    slug: "lakechristopher",
    displayName: "Lake Christopher",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Lake Christopher is a scenic family-friendly neighborhood known for its beautiful waterfront views, lake-oriented recreational amenities, parks, and convenient shopping access. It's ideal for buyers seeking an active family lifestyle with waterfront beauty and modern conveniences.",
    lifestyle: "Lake Christopher offers an attractive, family-friendly waterfront lifestyle with scenic views and recreational opportunities. Residents enjoy lake access, beautiful parks and trails, quality shopping and dining nearby, and a strong community atmosphere. The neighborhood provides excellent family amenities and scenic waterfront beauty.",
    marketSnapshot: "Whether you're buying on the lake or relocating to a family-friendly community, Lake Christopher provides the perfect balance of scenic waterfront living and modern suburban convenience.",
  },
  "lakeshores": {
    slug: "lakeshores",
    displayName: "Lake Shores",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Lake Shores is a peaceful, established lakeside community known for its serene waterfront setting, mature landscaping, and convenient highway access to shopping and services. It's ideal for buyers seeking a tranquil waterfront lifestyle in an established neighborhood.",
    lifestyle: "Lake Shores offers a peaceful, waterfront lifestyle with established residential character and natural beauty. Residents enjoy lakeside serenity, mature trees and landscaping, convenient highway access, and proximity to shopping and services. The neighborhood provides a calm, established environment perfect for those seeking peaceful waterfront living.",
    marketSnapshot: "Whether you're buying a lakeside home or relocating to an established waterfront community, Lake Shores provides the perfect combination of lakefront peace and convenient access.",
  },
  "landstownlakes": {
    slug: "landstownlakes",
    displayName: "Landstown Lakes",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Landstown Lakes is a lake-oriented family-friendly neighborhood with attractive waterfront properties, recreational amenities, and convenient access to Landstown Commons shopping and dining. It's ideal for buyers seeking community-oriented living with lake recreation and modern shopping access.",
    lifestyle: "Landstown Lakes offers an active, family-friendly lifestyle centered around its beautiful lakes and recreational amenities. Residents enjoy lake access, parks and trails, proximity to shopping and dining at Landstown Commons, and a strong community atmosphere. The neighborhood provides excellent family amenities and recreational opportunities.",
    marketSnapshot: "Whether you're buying lakefront or relocating to a family-friendly community, Landstown Lakes provides the perfect balance of water recreation, shopping access, and community living.",
  },
  "londonbridgeproper": {
    slug: "londonbridgeproper",
    displayName: "London Bridge Proper",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "London Bridge Proper is a charming, established neighborhood near the iconic London Bridge shops and the scenic Lesner Bridge, with direct bay access and waterfront character. It's ideal for buyers seeking unique charm, waterfront proximity, and access to distinctive local dining and shopping destinations.",
    lifestyle: "London Bridge Proper offers a distinctive waterfront lifestyle with established character and charm. Residents enjoy proximity to unique shops and restaurants, scenic bay views, and the natural beauty of Lesner Bridge and surrounding waterfront areas. The neighborhood provides an authentic, character-rich community perfect for those seeking something special.",
    marketSnapshot: "Whether you're buying a charming waterfront home or relocating to an established community with character, London Bridge Proper provides the perfect combination of scenic beauty and local distinction.",
  },
  "lynnwood": {
    slug: "lynnwood",
    displayName: "Lynnwood",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Lynnwood is a quiet, well-established residential area known for its mature landscaping, established homes, and convenient highway access to military bases and shopping. It's ideal for buyers seeking a peaceful neighborhood with established character and excellent transportation connections.",
    lifestyle: "Lynnwood offers a serene, established residential environment. Residents enjoy mature trees and landscaping, quiet streets, and convenient highway access to major employment centers and shopping areas. The neighborhood provides a comfortable, stable community atmosphere perfect for families who value peace and convenience.",
    marketSnapshot: "Whether you're buying in a stable community or relocating to a peaceful neighborhood, Lynnwood provides the perfect balance of tranquility and accessibility.",
  },
  "pembroke": {
    slug: "pembroke",
    displayName: "Pembroke",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Pembroke is a centrally-located Virginia Beach neighborhood near Town Center, featuring an urban-suburban mix of housing and vibrant walkable streets. It's ideal for buyers seeking an active lifestyle with walking distance access to shops, dining, and entertainment options.",
    lifestyle: "Pembroke offers a dynamic, connected lifestyle with modern amenities at your doorstep. Residents enjoy proximity to Virginia Beach's premier shopping and dining destinations, excellent pedestrian accessibility, and the energy of Town Center just nearby. The neighborhood combines suburban comfort with urban convenience, making it perfect for professionals and families who want everything accessible.",
    marketSnapshot: "Whether you're buying your next home or relocating to an active community, Pembroke provides the perfect combination of accessibility, lifestyle, and modern Virginia Beach living.",
  },
  "pungo": {
    slug: "pungo",
    displayName: "Pungo",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Pungo is a rural-suburban neighborhood known for its spacious properties, peaceful setting, and convenient access to beaches and shopping. It's ideal for buyers seeking a quieter lifestyle with room to spread out while remaining close to essential amenities and coastal attractions.",
    lifestyle: "Pungo offers a relaxed, family-oriented lifestyle. Residents enjoy peaceful surroundings, larger lot sizes, and the flexibility to build or customize their homes. The area provides excellent access to shopping centers, dining options, and nearby beaches, making it perfect for families and retirees who value space and serenity.",
    marketSnapshot: "Whether you're buying your family home or relocating to Virginia Beach, Pungo provides the perfect balance of peaceful country living and convenient suburban access.",
  },
  "riverwalkatbroad": {
    slug: "riverwalkatbroad",
    displayName: "Riverwalk at Broad Bay",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: false,
  },
  "thoroughgood": {
    slug: "thoroughgood",
    displayName: "Thoroughgood",
    citySlug: "virginia-beach",
    parentCityName: "Virginia Beach",
    hasFullContent: true,
    intro: "Thoroughgood is a family-friendly Virginia Beach neighborhood known for its tree-lined streets, proximity to highly-rated schools, parks, shopping, and beautiful beaches. It's ideal for buyers seeking a well-established residential community with excellent schools and family amenities.",
    lifestyle: "Thoroughgood offers a warm, family-oriented lifestyle with tree-lined streets and established residential character. Residents enjoy proximity to top-rated schools, beautiful parks, convenient shopping, and easy beach access. The neighborhood provides excellent schools, recreational facilities, and the perfect environment for families seeking community and convenience.",
    marketSnapshot: "Whether you're buying your family home or relocating to a school-friendly community, Thoroughgood provides the perfect combination of excellent schools, parks, and suburban family living.",
  },
  "tabb": {
    slug: "tabb",
    displayName: "Tabb",
    citySlug: "york-county",
    parentCityName: "York County",
    hasFullContent: false,
  },
  "villageofkiln": {
    slug: "villageofkiln",
    displayName: "Village of Kiln",
    citySlug: "york-county",
    parentCityName: "York County",
    hasFullContent: false,
  },
  "yorktowncolonialheights": {
    slug: "yorktowncolonialheights",
    displayName: "Yorktown Colonial Heights",
    citySlug: "york-county",
    parentCityName: "York County",
    hasFullContent: false,
  },
};

export const NEIGHBORHOOD_SLUGS = Object.keys(NEIGHBORHOODS);

export function getNeighborhood(slug: string): NeighborhoodData | undefined {
  return NEIGHBORHOODS[slug.toLowerCase()];
}

// Return all neighborhoods belonging to a given city slug.
export function neighborhoodsByCity(citySlug: string): NeighborhoodData[] {
  return Object.values(NEIGHBORHOODS).filter((n) => n.citySlug === citySlug);
}

// Substring used to match REIN's subdivision column. Returns lowercased
// pattern that should be wrapped in % on either side for ILIKE matching.
export function subdivisionMatchPattern(n: NeighborhoodData): string {
  return (n.subdivisionPattern || n.displayName).toLowerCase();
}

// Best-effort: given a REIN subdivision string, find the neighborhood it
// belongs to (if any). Used by the listing detail page to link back to the
// neighborhood when a buyer is on a property page.
export function neighborhoodForSubdivision(
  subdivision: string | null | undefined,
): NeighborhoodData | undefined {
  if (!subdivision) return undefined;
  const sub = subdivision.toLowerCase();
  for (const n of Object.values(NEIGHBORHOODS)) {
    const pat = subdivisionMatchPattern(n);
    if (pat && sub.includes(pat)) return n;
  }
  return undefined;
}
