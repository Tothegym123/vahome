import { NextRequest, NextResponse } from "next/server";
import { getNearestBases } from "../../lib/military-bases";

// Google Maps Distance Matrix API replaces previous Mapbox Directions API
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const count = parseInt(searchParams.get("count") || "5", 10);

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  const propertyLat = parseFloat(lat);
  const propertyLng = parseFloat(lng);

  // Get nearest military bases by straight-line distance
  const nearestBases = getNearestBases(propertyLat, propertyLng, count);

  if (!GOOGLE_MAPS_KEY) {
    // Fallback: return straight-line estimates if no API key
    const result = nearestBases.map((base) => ({
      baseName: base.name,
      shortName: base.shortName,
      branch: base.branch,
      driveMiles: Math.round(base.distanceMiles * 1.3 * 10) / 10, // rough road factor
      driveMinutes: Math.round(base.distanceMiles * 1.3 * 1.5), // ~40mph avg
      straightLineMiles: Math.round(base.distanceMiles * 10) / 10,
    }));
    return NextResponse.json({ bases: result });
  }

  try {
    // Build destinations string for Distance Matrix API
    const destinations = nearestBases
      .map((base) => `${base.lat},${base.lng}`)
      .join("|");

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${propertyLat},${propertyLng}&destinations=${destinations}&units=imperial&key=${GOOGLE_MAPS_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Maps API error: ${data.status}`);
    }

    const elements = data.rows[0]?.elements || [];

    const result = nearestBases.map((base, index) => {
      const element = elements[index];

      if (element && element.status === "OK") {
        // Distance Matrix returns distance in meters and duration in seconds
        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;

        return {
          baseName: base.name,
          shortName: base.shortName,
          branch: base.branch,
          driveMiles: Math.round((distanceMeters / 1609.344) * 10) / 10,
          driveMinutes: Math.round(durationSeconds / 60),
          straightLineMiles: Math.round(base.distanceMiles * 10) / 10,
        };
      } else {
        // Fallback to straight-line estimate
        return {
          baseName: base.name,
          shortName: base.shortName,
          branch: base.branch,
          driveMiles: Math.round(base.distanceMiles * 1.3 * 10) / 10,
          driveMinutes: Math.round(base.distanceMiles * 1.3 * 1.5),
          straightLineMiles: Math.round(base.distanceMiles * 10) / 10,
        };
      }
    });

    return NextResponse.json({ bases: result });
  } catch (error) {
    // On API failure, return straight-line estimates
    const result = nearestBases.map((base) => ({
      baseName: base.name,
      shortName: base.shortName,
      branch: base.branch,
      driveMiles: Math.round(base.distanceMiles * 1.3 * 10) / 10,
      driveMinutes: Math.round(base.distanceMiles * 1.3 * 1.5),
      straightLineMiles: Math.round(base.distanceMiles * 10) / 10,
    }));
    return NextResponse.json({ bases: result });
  }
}
