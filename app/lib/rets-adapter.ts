// app/lib/rets-adapter.ts
// Isolation layer between REIN RETS/RESO feed and internal Listing shape.
// When the real feed is wired up, only this file's loadRetsListings() body changes.

import type { Listing } from './listings'
import mockFeed from './mock-rets-feed.json'

// Minimal RESO record shape we care about. Extra fields are ignored.
interface RESORecord {
  ListingKey: string
  ListingId?: string
  StandardStatus?: string
  ListPrice?: number
  UnparsedAddress?: string
  StreetNumber?: string
  StreetName?: string
  City?: string
  StateOrProvince?: string
  PostalCode?: string
  CountyOrParish?: string
  SubdivisionName?: string
  Latitude?: number
  Longitude?: number
  BedroomsTotal?: number
  BathroomsFull?: number
  BathroomsHalf?: number
  BathroomsTotalInteger?: number
  LivingArea?: number
  LotSizeSquareFeet?: number
  LotSizeAcres?: number
  YearBuilt?: number
  PropertyType?: string
  PropertySubType?: string
  ArchitecturalStyle?: string | string[]
  StoriesTotal?: number
  GarageSpaces?: number
  PoolPrivateYN?: boolean
  PoolFeatures?: string | string[]
  WaterfrontYN?: boolean
  WaterfrontFeatures?: string | string[]
  PublicRemarks?: string
  Media?: Array<{ Order?: number; MediaURL: string }>
  DaysOnMarket?: number
  ListingContractDate?: string
  ListAgentFullName?: string
  ListOfficeName?: string
  ElementarySchool?: string
  MiddleOrJuniorSchool?: string
  HighSchool?: string
  AssociationFee?: number
  AssociationFeeFrequency?: string
  TaxAnnualAmount?: number
  TaxYear?: number
  Heating?: string | string[]
  Cooling?: string | string[]
  Flooring?: string | string[]
  InteriorFeatures?: string | string[]
  ExteriorFeatures?: string | string[]
  Appliances?: string | string[]
  ParkingFeatures?: string | string[]
  FireplacesTotal?: number
  Fencing?: string | string[]
  WaterSource?: string | string[]
  Sewer?: string | string[]
  Roof?: string | string[]
  ConstructionMaterials?: string | string[]
  Foundation?: string | string[]
  LaundryFeatures?: string | string[]
  ModificationTimestamp?: string
  Directions?: string
  VirtualTourURLUnbranded?: string
}

interface RESOEnvelope {
  '@odata.context'?: string
  '@odata.count'?: number
  value: RESORecord[]
}

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  return v.split(/[,;]+/).map((s) => s.trim()).filter(Boolean)
}

function joinStr(v: string | string[] | undefined): string {
  if (!v) return ''
  return Array.isArray(v) ? v.join(', ') : v
}

function numericId(key: string, fallback: number): number {
  // "REIN-10626717" -> 10626717
  const m = /(\d+)/.exec(key || '')
  return m ? parseInt(m[1], 10) : fallback
}

/**
 * Transform a single RESO/RETS record into the internal Listing shape.
 */
export function retsRecordToListing(r: RESORecord, idx: number): Listing {
  const photos = (r.Media || [])
    .slice()
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .map((m) => m.MediaURL)
    .filter(Boolean)
  const firstPhoto = photos[0] || ''

  const hoaFreqRaw = (r.AssociationFeeFrequency || 'Monthly').toLowerCase()
  const hoaFrequency = hoaFreqRaw.includes('month')
    ? 'mo'
    : hoaFreqRaw.includes('year') || hoaFreqRaw.includes('annual')
    ? 'yr'
    : hoaFreqRaw.includes('quarter')
    ? 'qtr'
    : 'mo'

  const poolStr = r.PoolPrivateYN
    ? joinStr(r.PoolFeatures) || 'Yes'
    : joinStr(r.PoolFeatures) || 'None'

  return {
    id: numericId(r.ListingKey || r.ListingId || '', idx + 1),
    lat: r.Latitude ?? 0,
    lng: r.Longitude ?? 0,
    price: r.ListPrice ?? 0,
    beds: r.BedroomsTotal ?? 0,
    baths: r.BathroomsFull ?? 0,
    halfBaths: r.BathroomsHalf ?? 0,
    sqft: r.LivingArea ?? 0,
    address: r.UnparsedAddress || [r.StreetNumber, r.StreetName].filter(Boolean).join(' '),
    city: r.City || '',
    state: r.StateOrProvince || 'VA',
    zip: r.PostalCode || '',
    neighborhood: r.SubdivisionName || '',
    photos,
    img: firstPhoto,
    status: r.StandardStatus || 'Active',
    propertyType: r.PropertyType || 'Residential',
    type: r.PropertySubType || r.PropertyType || 'Single Family',
    yearBuilt: r.YearBuilt ?? 0,
    lotSqft: r.LotSizeSquareFeet ?? 0,
    lotSize: r.LotSizeAcres
      ? `${r.LotSizeAcres} ac`
      : r.LotSizeSquareFeet
      ? `${r.LotSizeSquareFeet} sqft`
      : '',
    garage: r.GarageSpaces ?? 0,
    description: r.PublicRemarks || '',
    mlsNumber: r.ListingId || r.ListingKey || '',
    style: joinStr(r.ArchitecturalStyle),
    stories: r.StoriesTotal ?? 0,
    foundation: joinStr(r.Foundation),
    exteriorFeatures: toArr(r.ExteriorFeatures),
    interiorFeatures: toArr(r.InteriorFeatures),
    heating: joinStr(r.Heating),
    cooling: joinStr(r.Cooling),
    waterSource: joinStr(r.WaterSource),
    sewer: joinStr(r.Sewer),
    flooring: toArr(r.Flooring),
    roof: joinStr(r.Roof),
    construction: toArr(r.ConstructionMaterials),
    parkingFeatures: toArr(r.ParkingFeatures),
    appliancesIncluded: toArr(r.Appliances),
    laundry: joinStr(r.LaundryFeatures),
    fireplaces: r.FireplacesTotal ?? 0,
    pool: poolStr,
    fencing: joinStr(r.Fencing),
    waterfront: r.WaterfrontYN ?? false,
    waterfrontDescription: joinStr(r.WaterfrontFeatures),
    taxAmount: r.TaxAnnualAmount ?? 0,
    taxYear: r.TaxYear ?? 0,
    hoaFee: r.AssociationFee ?? 0,
    hoaFrequency,
    elementarySchool: r.ElementarySchool || '',
    middleSchool: r.MiddleOrJuniorSchool || '',
    highSchool: r.HighSchool || '',
    listingAgent: r.ListAgentFullName || '',
    listingOffice: r.ListOfficeName || '',
    daysOnMarket: r.DaysOnMarket ?? 0,
    listDate: r.ListingContractDate || '',
    subdivision: r.SubdivisionName || '',
    county: r.CountyOrParish || '',
    directions: r.Directions || '',
    virtualTour: r.VirtualTourURLUnbranded || '',
    remarks: r.PublicRemarks || '',
  }
}

/**
 * Load all listings from the mock RETS feed and transform to internal shape.
 * Swap this function's body to hit the real REIN feed later.
 */
export function loadRetsListings(): Listing[] {
  const envelope = mockFeed as unknown as RESOEnvelope
  const records = envelope.value || []
  return records.map((r, i) => retsRecordToListing(r, i)).filter((l) => l.lat && l.lng)
}
