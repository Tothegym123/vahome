// app/components/reviews/ReviewSchema.tsx
// =============================================================================
// JSON-LD structured data for neighborhood-level reviews + AggregateRating.
//
// Renders a Place node carrying:
//   - aggregateRating (only when there is at least one approved review)
//   - review[] array (Review nodes with reviewRating + author + datePublished)
//
// Server component — emits a single <script type="application/ld+json"> tag.
// =============================================================================

import type { ReviewRow, ReviewAggregate } from "../../lib/reviews";

const BASE = "https://vahome.com";

type Props = {
  neighborhoodSlug: string;
  neighborhoodName: string;
  cityName: string;
  reviews: ReviewRow[];
  aggregate: ReviewAggregate;
};

function reviewToJsonLd(r: ReviewRow) {
  const body = [r.title, r.pros && `Pros: ${r.pros}`, r.cons && `Cons: ${r.cons}`]
    .filter(Boolean)
    .join("\n\n");
  return {
    "@type": "Review",
    author: { "@type": "Person", name: r.reviewer_name },
    datePublished: r.created_at,
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: body || undefined,
  };
}

export default function ReviewSchema({
  neighborhoodSlug,
  neighborhoodName,
  cityName,
  reviews,
  aggregate,
}: Props) {
  if (!reviews.length) return null;

  const placeId = `${BASE}/neighborhoods/${neighborhoodSlug}/#place`;

  const place: Record<string, unknown> = {
    "@type": "Place",
    "@id": placeId,
    name: `${neighborhoodName}, ${cityName}, VA`,
    url: `${BASE}/neighborhoods/${neighborhoodSlug}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: "VA",
      addressCountry: "US",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregate.average,
      bestRating: 5,
      worstRating: 1,
      reviewCount: aggregate.count,
    },
    review: reviews.map(reviewToJsonLd),
  };

  const blob = JSON.stringify({ "@context": "https://schema.org", "@graph": [place] });

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: blob }}
    />
  );
}
