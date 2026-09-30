import type { Review } from "@/data/types";
import { business } from "@/data/business";
import { aggregate, reviews as siteReviews } from "@/data/reviews";

// The reviews a page shows (owner, 2026-09-30: "real reviews from Google"). With
// GOOGLE_PLACES_API_KEY set, the Google Business Profile's rating, review count and up to 5
// reviews come from the Places API (New) — Place Details, field mask rating/userRatingCount/
// reviews — fetched at build time and refreshed once a day (`next.revalidate`, ISR). Without the
// key, or when Google fails or returns no review, the site's own reviews (data/reviews) are shown.
// Google's content is never written to the repo and never cached longer than a day.

export type RatingSummary = { value: number; count: number };
export type ReviewsData = {
  source: "google" | "site";
  rating: RatingSummary;
  reviews: Review[];
};

const REVALIDATE_SECONDS = 86_400;
const FIELDS = "rating,userRatingCount,reviews";

type PlaceReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string };
};
type PlaceDetails = { rating?: number; userRatingCount?: number; reviews?: PlaceReview[] };

export const siteReviewsData = (): ReviewsData => ({
  source: "site",
  rating: { value: aggregate.ratingValue, count: aggregate.reviewCount },
  reviews: siteReviews,
});

/** A Places API review → the site's Review; one without an author or text is dropped. */
export function fromPlaceReview(r: PlaceReview): Review | null {
  const text = (r.text?.text ?? r.originalText?.text ?? "").trim();
  const author = r.authorAttribution?.displayName?.trim();
  if (!text || !author) return null;
  return {
    author,
    detail: r.relativePublishTimeDescription ?? "",
    text,
    rating: r.rating,
    authorUrl: r.authorAttribution?.uri,
    relativeTime: r.relativePublishTimeDescription,
  };
}

export async function getReviews(): Promise<ReviewsData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return siteReviewsData();
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${business.google.placeId}?languageCode=en`,
      {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELDS },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) throw new Error(`Places API responded ${res.status}`);
    const place = (await res.json()) as PlaceDetails;
    const reviews = (place.reviews ?? []).map(fromPlaceReview).filter((r): r is Review => r !== null);
    if (reviews.length === 0 || !place.rating || !place.userRatingCount) return siteReviewsData();
    return {
      source: "google",
      rating: { value: place.rating, count: place.userRatingCount },
      reviews,
    };
  } catch (error) {
    console.warn("[reviews] Google reviews unavailable, showing the site's own", error);
    return siteReviewsData();
  }
}
