// Military bases in the Hampton Roads / Tidewater Virginia area
// Used for drive time calculations on listing detail pages

export interface MilitaryBase {
  name: string;
  branch: string;
  lat: number;
  lng: number;
  shortName: string;
}

export const militaryBases: MilitaryBase[] = [
  {
    name: "Naval Station Norfolk",
    shortName: "NS Norfolk",
    branch: "Navy",
    lat: 36.9466,
    lng: -76.3036,
  },
  {
    name: "NAS Oceana",
    shortName: "NAS Oceana",
    branch: "Navy",
    lat: 36.8207,
    lng: -76.0331,
  },
  {
    name: "Dam Neck Annex",
    shortName: "Dam Neck",
    branch: "Navy",
    lat: 36.7920,
    lng: -75.9710,
  },
  {
    name: "JEB Little Creek-Fort Story",
    shortName: "Little Creek",
    branch: "Navy",
    lat: 36.9178,
    lng: -76.1601,
  },
  {
    name: "Naval Medical Center Portsmouth",
    shortName: "NMCP",
    branch: "Navy",
    lat: 36.8446,
    lng: -76.3039,
  },
  {
    name: "Norfolk Naval Shipyard",
    shortName: "NNSY",
    branch: "Navy",
    lat: 36.8271,
    lng: -76.2946,
  },
  {
    name: "NSA Hampton Roads",
    shortName: "NSA HR",
    branch: "Navy",
    lat: 36.9480,
    lng: -76.3350,
  },
  {
    name: "Naval Weapons Station Yorktown",
    shortName: "NWS Yorktown",
    branch: "Navy",
    lat: 37.2317,
    lng: -76.5636,
  },
  {
    name: "NSA Northwest Annex",
    shortName: "NW Annex",
    branch: "Navy",
    lat: 36.9129,
    lng: -76.3759,
  },
  {
    name: "Joint Base Langley-Eustis (Langley AFB)",
    shortName: "JBLE Langley",
    branch: "Air Force",
    lat: 37.0832,
    lng: -76.3605,
  },
  {
    name: "Joint Base Langley-Eustis (Fort Eustis)",
    shortName: "JBLE Ft Eustis",
    branch: "Army",
    lat: 37.1518,
    lng: -76.5879,
  },
  {
    name: "Joint Staff J7 Suffolk",
    shortName: "J7 Suffolk",
    branch: "Joint",
    lat: 36.7282,
    lng: -76.5836,
  },
  {
    name: "Camp Peary",
    shortName: "Camp Peary",
    branch: "DoD",
    lat: 37.2905,
    lng: -76.6158,
  },
  {
    name: "USCG Base Portsmouth",
    shortName: "USCG Portsmouth",
    branch: "Coast Guard",
    lat: 36.8354,
    lng: -76.2932,
  },
  {
    name: "USCG Finance Center Chesapeake",
    shortName: "USCG Finance Ctr",
    branch: "Coast Guard",
    lat: 36.7570,
    lng: -76.2287,
  },
  {
    name: "MARFORCOM Norfolk",
    shortName: "MARFORCOM",
    branch: "Marines",
    lat: 36.9460,
    lng: -76.3130,
  },
];

// Get the 5 nearest bases to a given lat/lng using straight-line distance
export function getNearestBases(
  lat: number,
  lng: number,
  count: number = 5
): (MilitaryBase & { distance: number })[] {
  return [...militaryBases]
    .map((base) => ({
      ...base,
      distance: haversineDistance(lat, lng, base.lat, base.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

// Haversine formula for straight-line distance in miles
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
