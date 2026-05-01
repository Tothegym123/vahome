// Transform a REIN record (from RESO JSON or RETS COMPACT-DECODED)
// into a row that matches the public.listings schema.
//
// IMPORTANT: REIN field names are PLACEHOLDERS based on common REIN/Trestle
// conventions. Once REIN's data dictionary arrives, update field names below.
// The mapping is intentionally permissive: tries multiple common names per field.

import crypto from 'node:crypto';

function addressHash(addr) {
  if (!addr) return null;
  const normalized = String(addr).toLowerCase().replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

const pick = (rec, ...names) => {
  for (const n of names) {
    if (rec[n] !== undefined && rec[n] !== '' && rec[n] !== null) return rec[n];
  }
  return null;
};

const num = v => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

const bool = v => {
  if (v === null || v === undefined || v === '') return null;
  if (v === true || v === 1) return true;
  if (v === false || v === 0) return false;
  const s = String(v).toLowerCase().trim();
  if (['yes', 'y', 'true', '1'].includes(s)) return true;
  if (['no', 'n', 'false', '0'].includes(s)) return false;
  return null;
};

const dateOrNull = v => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

// Parse REIN's WaterfrontFeatures / Waterfront text into booleans
function parseWaterfront(rec) {
  const wfStr = String(
    pick(rec, 'WaterfrontFeatures', 'WaterfrontYN', 'Waterfront', 'WaterFrontFeature') || ''
  ).toLowerCase();
  const waterfront = /waterfront|water\s*front|water\s*access|river|bay|ocean|lake|marsh|sound|inlet|creek|canal|deep\s*water/i.test(wfStr) || bool(pick(rec, 'WaterfrontYN', 'Waterfront')) === true;
  const deepWater = /deep\s*water|navigable|boat\s*lift|dock|deep-water/i.test(wfStr);
  return { waterfront, deepWater };
}

// REIN's WebExclude / IDX exclusion flag — names vary
function isWebExcluded(rec) {
  const v = pick(rec, 'WebExclude', 'IDXExclusion', 'IDXOptOut', 'InternetEntireListingDisplayYN', 'PublicRemarksDisplayYN');
  // For positive-flag fields (IDXExclusion=Y means exclude), interpret directly
  if (v === null) return false;
  // InternetEntireListingDisplayYN=N means excluded
  const fieldName = ['WebExclude','IDXExclusion','IDXOptOut','PublicRemarksDisplayYN'].find(k => rec[k] !== undefined && rec[k] !== '');
  const internetField = rec.InternetEntireListingDisplayYN ?? rec.InternetEntireListingDisplay;
  if (internetField !== undefined && internetField !== '') {
    return bool(internetField) === false;
  }
  return bool(v) === true;
}

export function transformRecord(rec) {
  const mlsNumber = String(pick(rec, 'ListingId', 'ListingKey', 'MLSNumber', 'MlsNumber', 'L_ListingID') || '').trim();
  if (!mlsNumber) return null;

  const { waterfront, deepWater } = parseWaterfront(rec);

  return {
    mls_number: mlsNumber,
    matrix_unique_id: pick(rec, 'Matrix_Unique_ID', 'MatrixUniqueID', 'ListingKey'),
    address: pick(rec, 'UnparsedAddress', 'AddressLine', 'AddressWebsite', 'StreetAddress', 'Address', 'L_Address'),
    street_number: pick(rec, 'StreetNumber', 'AddressStreetNumWebsite'),
    street_name: pick(rec, 'StreetName', 'AddressStreetNameWebsite'),
    unit: pick(rec, 'UnitNumber', 'Unit'),
    city: pick(rec, 'City', 'L_City'),
    state: pick(rec, 'StateOrProvince', 'State') || 'VA',
    zip: pick(rec, 'PostalCode', 'Zip', 'ZipCode'),
    county: pick(rec, 'CountyOrParish', 'County'),
    subdivision: pick(rec, 'SubdivisionName', 'Subdivision'),
    neighborhood: pick(rec, 'NeighborhoodName', 'MLSAreaMajor', 'Neighborhood'),

    price: num(pick(rec, 'CurrentPrice', 'ListPrice', 'L_AskingPrice')) ?? 0,
    original_price: num(pick(rec, 'OriginalListPrice')),
    beds: num(pick(rec, 'BedsTotal', 'BedroomsTotal', 'Beds', 'Bedrooms')),
    baths: num(pick(rec, 'BathsTotal', 'BathroomsTotalInteger', 'BathroomsTotalDecimal', 'BathroomsTotal', 'Baths')),
    half_baths: num(pick(rec, 'BathsHalf', 'BathroomsHalf', 'HalfBaths')),
    sqft: num(pick(rec, 'SqFtTotal', 'LivingArea', 'BuildingAreaTotal', 'Sqft')),
    lot_size: pick(rec, 'AcresApprox', 'LotSizeArea', 'LotSize', 'LotSizeAcres', 'LotSizeDimensions'),
    year_built: num(pick(rec, 'YearBuiltApprox', 'YearBuilt')),
    stories: num(pick(rec, 'StoriesNumber', 'StoriesTotal', 'Stories')),
    garage: pick(rec, 'GarageSpaces', 'GarageSquareFeet', 'Garage'),

    property_type: pick(rec, 'PropertyType', 'PropertyTypeCrossProp', 'PropertySubType', 'L_PropertyType'),
    property_subtype: pick(rec, 'PropertySubType'),
    status: pick(rec, 'PublicStatus', 'StandardStatus', 'MlsStatus', 'Status', 'L_Status') || 'Active',

    description: pick(rec, 'PublicRemarks', 'Remarks', 'Description', 'L_Remarks'),
    private_remarks: pick(rec, 'PrivateRemarks'),

    latitude: num(pick(rec, 'Latitude')),
    longitude: num(pick(rec, 'Longitude')),
    coordinate_source: (num(pick(rec, 'Latitude')) !== null && num(pick(rec, 'Longitude')) !== null) ? 'rein' : null,
    geocode_status: (num(pick(rec, 'Latitude')) !== null && num(pick(rec, 'Longitude')) !== null) ? 'rein_provided' : null,
    geocoded_at: (num(pick(rec, 'Latitude')) !== null && num(pick(rec, 'Longitude')) !== null) ? new Date().toISOString() : null,
    address_hash: addressHash([
      pick(rec, 'UnparsedAddress', 'AddressLine', 'AddressWebsite', 'StreetAddress', 'Address', 'L_Address'),
      pick(rec, 'City', 'L_City'),
      pick(rec, 'StateOrProvince', 'State') || 'VA',
      pick(rec, 'PostalCode', 'Zip', 'ZipCode'),
    ].filter(Boolean).join(', ')),

    waterfront,
    deep_water_access: deepWater,
    pool: bool(pick(rec, 'PoolPrivateYN', 'Pool')),
    fireplace: bool(pick(rec, 'FireplaceYN', 'Fireplace')),
    fireplaces: num(pick(rec, 'FireplacesTotal')),

    // Interior
    flooring: pick(rec, 'Flooring'),
    appliances: pick(rec, 'Appliances'),
    interior_features: pick(rec, 'InteriorFeatures'),
    cooling: pick(rec, 'Cooling'),
    heating: pick(rec, 'Heating'),

    // Exterior
    exterior_features: pick(rec, 'ExteriorFeatures'),
    construction: pick(rec, 'ConstructionMaterials', 'Construction'),
    roof: pick(rec, 'Roof'),
    fencing: pick(rec, 'Fencing'),
    parking: pick(rec, 'ParkingFeatures', 'Parking'),

    // Utilities
    water_source: pick(rec, 'WaterSource'),
    sewer: pick(rec, 'Sewer'),
    utilities: pick(rec, 'Utilities'),

    // HOA / financial
    hoa_fee: num(pick(rec, 'AssociationFee', 'HOAFee')),
    hoa_frequency: pick(rec, 'AssociationFeeFrequency'),
    annual_taxes: num(pick(rec, 'TaxAnnualAmount', 'TaxAmount')),
    tax_year: num(pick(rec, 'TaxYear')),

    // Schools
    elementary_school: pick(rec, 'ElementarySchool'),
    middle_school: pick(rec, 'MiddleOrJuniorSchool', 'MiddleSchool'),
    high_school: pick(rec, 'HighSchool'),
    school_district: pick(rec, 'SchoolDistrict'),

    // Listing meta
    list_date: dateOrNull(pick(rec, 'ListingContractDate', 'ListDate', 'OnMarketDate')),
    days_on_market: num(pick(rec, 'DaysOnMarket', 'DOM')),
    list_agent_name: pick(rec, 'ListAgentFullName', 'ListAgentName'),
    list_agent_mls_id: pick(rec, 'ListAgentMlsId'),
    list_office_name: pick(rec, 'ListOfficeName'),
    list_office_mls_id: pick(rec, 'ListOfficeMlsId'),
    co_list_agent_name: pick(rec, 'CoListAgentFullName'),
    buyer_agent_compensation: pick(rec, 'BuyerAgentCompensation'),

    // Compliance
    excluded: isWebExcluded(rec),

    // Timestamps
    modification_timestamp: dateOrNull(pick(rec, 'MatrixModifiedDT', 'ModificationTimestamp', 'ModificationTime', 'ListingModificationTimestamp')),
    status_change_timestamp: dateOrNull(pick(rec, 'StatusChangeTimestamp')),
    close_date: dateOrNull(pick(rec, 'CloseDate')),
    close_price: num(pick(rec, 'ClosePrice')),

    // Forensic
    raw_payload: rec,
  };
}

// Build listing_history rows when price or status changed since last seen
export function maybeBuildHistoryRow(prev, next) {
  if (!prev) return null; // first insert — no history
  const events = [];
  if (prev.price !== next.price && next.price) {
    events.push({
      mls_number: next.mls_number,
      event_type: 'price_change',
      old_value: String(prev.price),
      new_value: String(next.price),
      event_at: new Date().toISOString(),
    });
  }
  if (prev.status !== next.status && next.status) {
    events.push({
      mls_number: next.mls_number,
      event_type: 'status_change',
      old_value: prev.status,
      new_value: next.status,
      event_at: new Date().toISOString(),
    });
  }
  return events;
}

// Extract open houses from RESO records (RETS would need a separate query)
export function extractOpenHouses(rec) {
  const list = pick(rec, 'OpenHouses', 'OpenHouse');
  if (!Array.isArray(list)) return [];
  return list.map(oh => ({
    mls_number: String(pick(rec, 'ListingId', 'ListingKey', 'MLSNumber') || ''),
    open_house_id: pick(oh, 'OpenHouseKey', 'OpenHouseId'),
    starts_at: dateOrNull(pick(oh, 'OpenHouseStartTime', 'StartTime')),
    ends_at: dateOrNull(pick(oh, 'OpenHouseEndTime', 'EndTime')),
    type: pick(oh, 'OpenHouseType', 'Type'),
    remarks: pick(oh, 'OpenHouseRemarks', 'Remarks'),
  })).filter(o => o.mls_number && o.starts_at);
}
