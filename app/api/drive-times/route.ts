import { NextRequest, NextResponse } from "next/server";
import { getNearestBases } from "../../lib/military-bases";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface DirectionsResult {
  baseName: string;
  shortName: string;
  branch: string;
  driveMiles: number;
  driveMinutes: number;
  straightLineMiles: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const count = parseInt(searchParams.get("count") || "5", 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Missing or invalid lat/lng parameters" },
      { status: 400 }
    );
  }

  if (!MAPBOX_TOKEN) {
    return NextResponse.json(
      { error: "Mapbox token not configured" },
      { status: 500 }
    );
  }

  // Get nearest bases by straight-line distance
  const nearestBases = getNearestBases(lat, lng, count);

  // Fetch driving directions from Mapbox for each base
  const results: DirectionsResult[] = await Promise.all(
    nearestBases.map(async (base) => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng},${lat};${base.lng},${base.lat}?overview=false&access_token=${MAPBOX_TOKEN}`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          return {
            baseName: base.name,
            shortName: base.shortName,
            branch: base.branch,
            driveMiles: Math.round(route.distance * 0.000621371 * 10) / 10,
            driveMinutes: Math.round(route.duration / 60),
            straightLineMiles:
              Math.round(
                haversineDistance(lat, lng, base.lat, base.lng) * 10
              ) / 10,
          };
        }

        // Fallback if no route found
        return {
          baseName: base.name,
          shortName: base.shortName,
          branch: base.branch,
          driveMiles: 0,
          driveMinutes: 0,
          straightLineMiles:
            Math.round(
              haversineDistance(lat, lng, base.lat, base.lng) * 10
            ) / 10,
        };
      } catch {
        return {
          baseName: base.name,
          shortName: base.shortName,
          branch: base.branch,
          driveMiles: 0,
          driveMinutes: 0,
          straightLineMiles:
            Math.round(
              haversineDistance(lat, lng, base.lat, base.lng) * 10
            ) / 10,
        };
      }
    })
  );

  // Sort by drive time (shortest first)
  results.sort((a, b) => {
    if (a.driveMinutes === 0 && b.driveMinutes === 0) return 0;
    if (a.driveMinutes === 0) return 1;
    if (b.driveMinutes === 0) return -1;
    return a.driveMinutes - b.driveMinutes;
  });

  return NextResponse.json({
    origin: { lat, lng },
    bases: results,
  });
}

// Duplicate haversine here so the API route is self-contained at runtime
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
