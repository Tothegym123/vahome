// Hampton Roads military installations
// All in Norfolk/Portsmouth, VA MHA (code VA058) for BAH purposes.
// Coordinates verified via official base PCS guides and Google Maps; rounded to 4 decimals.

export type DutyStation = {
  id: string
  name: string
  shortName: string
  branch: 'Navy' | 'Air Force' | 'Army' | 'Marines' | 'Coast Guard' | 'Joint'
  lat: number
  lng: number
  mhaCode: string
}

export const DUTY_STATIONS: DutyStation[] = [
  {
    id: 'naval-station-norfolk',
    name: 'Naval Station Norfolk',
    shortName: 'NS Norfolk',
    branch: 'Navy',
    lat: 36.9476,
    lng: -76.3309,
    mhaCode: 'VA058',
  },
  {
    id: 'joint-base-langley-eustis',
    name: 'Joint Base Langley-Eustis',
    shortName: 'JBLE',
    branch: 'Joint',
    // Coordinates split between Langley (37.0851, -76.3608) and Fort Eustis (37.1374, -76.5944).
    // Using midpoint between the two installations for "near JBLE" search behavior.
    lat: 37.1112,
    lng: -76.4776,
    mhaCode: 'VA058',
  },
  {
    id: 'naval-air-station-oceana',
    name: 'Naval Air Station Oceana',
    shortName: 'NAS Oceana',
    branch: 'Navy',
    lat: 36.8208,
    lng: -76.0331,
    mhaCode: 'VA058',
  },
  {
    id: 'naval-medical-center-portsmouth',
    name: 'Naval Medical Center Portsmouth',
    shortName: 'NMC Portsmouth',
    branch: 'Navy',
    lat: 36.8350,
    lng: -76.3025,
    mhaCode: 'VA058',
  },
  {
    id: 'coast-guard-base-portsmouth',
    name: 'Coast Guard Base Portsmouth',
    shortName: 'CGB Portsmouth',
    branch: 'Coast Guard',
    lat: 36.8211,
    lng: -76.2967,
    mhaCode: 'VA058',
  },
  {
    id: 'naval-support-activity-hampton-roads',
    name: 'Naval Support Activity Hampton Roads',
    shortName: 'NSA Hampton Roads',
    branch: 'Navy',
    lat: 36.9445,
    lng: -76.3220,
    mhaCode: 'VA058',
  },
  {
    id: 'naval-amphibious-base-little-creek',
    name: 'NAB Little Creek',
    shortName: 'NAB Little Creek',
    branch: 'Navy',
    lat: 36.9226,
    lng: -76.1697,
    mhaCode: 'VA058',
  },
]

export function getDutyStation(id: string): DutyStation | undefined {
  return DUTY_STATIONS.find((s) => s.id === id)
}

// Haversine distance between two lat/lng points in miles
export function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8 // Earth radius in miles
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Approximate drive time (in minutes) from straight-line distance.
// Hampton Roads metro: ~30 mph average door-to-door including arterial + interstate.
// Multiply straight-line by 1.3 for typical road-network detour, then divide by 30 mph.
export function approxDriveMinutes(straightLineMiles: number): number {
  return Math.round((straightLineMiles * 1.3) / (30 / 60))
}
