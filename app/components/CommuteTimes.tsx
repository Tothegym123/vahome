"use client";

import { useState, useEffect } from "react";

interface DriveTimeResult {
  baseName: string;
  shortName: string;
  branch: string;
  driveMiles: number;
  driveMinutes: number;
  straightLineMiles: number;
}

interface CommuteTimesProps {
  lat: number;
  lng: number;
}

const branchColors: Record<string, string> = {
  Navy: "bg-blue-100 text-blue-800",
  "Air Force": "bg-sky-100 text-sky-800",
  Army: "bg-green-100 text-green-800",
  Marines: "bg-red-100 text-red-800",
  "Coast Guard": "bg-orange-100 text-orange-800",
  Joint: "bg-purple-100 text-purple-800",
  DoD: "bg-gray-100 text-gray-800",
};

const branchIcons: Record<string, string> = {
  Navy: "\u2693",
  "Air Force": "\u2708\uFE0F",
  Army: "\u2B50",
  Marines: "\uD83E\uDE96",
  "Coast Guard": "\u26F5",
  Joint: "\uD83C\uDFDB\uFE0F",
  DoD: "\uD83D\uDEE1\uFE0F",
};

export default function CommuteTimes({ lat, lng }: CommuteTimesProps) {
  const [results, setResults] = useState<DriveTimeResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchDriveTimes() {
      try {
        setLoading(true);
        setError(null);
        const resp = await fetch(
          \`/api/drive-times?lat=\${lat}&lng=\${lng}&count=10\`
        );
        if (!resp.ok) throw new Error("Failed to fetch drive times");
        const data = await resp.json();
        setResults(data.bases || []);
      } catch (err) {
        setError("Unable to load commute times");
        console.error("Drive time fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (lat && lng) {
      fetchDriveTimes();
    }
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || results.length === 0) {
    return null;
  }

  const displayedResults = showAll ? results : results.slice(0, 5);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{"\uD83C\uDFDB\uFE0F"}</span>
        <h3 className="text-lg font-semibold text-gray-900">
          Military Base Commute Times
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        Estimated drive times from this property
      </p>

      <div className="space-y-2">
        {displayedResults.map((base, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-xl flex-shrink-0">
                {branchIcons[base.branch] || "\uD83C\uDFDB\uFE0F"}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">
                  {base.shortName}
                </div>
                <span
                  className={\`inline-block text-xs px-2 py-0.5 rounded-full mt-0.5 \${
                    branchColors[base.branch] || "bg-gray-100 text-gray-800"
                  }\`}
                >
                  {base.branch}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0 ml-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">
                  {base.driveMinutes > 0
                    ? \`\${base.driveMinutes} min\`
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  {base.driveMiles > 0
                    ? \`\${base.driveMiles} mi\`
                    : \`~\${base.straightLineMiles} mi\`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAll
            ? "Show fewer bases"
            : \`Show all \${results.length} nearby bases\`}
        </button>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Drive times are estimates based on typical traffic conditions via Mapbox
        Directions API.
      </p>
    </div>
  );
}
