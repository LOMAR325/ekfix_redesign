import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { ChipRow } from "@/components/ui/chip-row";
import { GoogleReviewLinks } from "@/components/ui/google-review-links";
import { residentialHome } from "@/data/residential";
import type { ReviewsData } from "@/lib/google-reviews";

// `#reviews` — Google reviews when they are live (lib/google-reviews), else the homeowners' reviews
// of the site (every one not marked `segment: "commercial"`); the `.rating-badge`, /reviews, and
// the links to the Google Business Profile.
export function ReviewsSection({ data }: { data: ReviewsData }) {
  const copy = residentialHome.reviews;
  const reviews = data.source === "google" ? data.reviews : data.reviews.filter((r) => r.segment !== "commercial");
  return (
    <section id="reviews" className="section section-light">
      <SectionHead tone="light" eyebrow={copy.eyebrow} h2={copy.h2} ratingBadge={data} />
      <ReviewsGrid reviews={reviews} />
      <ChipRow items={[{ label: copy.allReviews, href: "/reviews" }]} style={{ marginTop: 24 }} />
      <GoogleReviewLinks data={data} style={{ marginTop: 12 }} />
    </section>
  );
}
