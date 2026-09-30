import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { ChipRow } from "@/components/ui/chip-row";
import { reviews } from "@/data/reviews";
import { residentialHome } from "@/data/residential";

// `#reviews` — the homeowners' reviews (every review not marked `segment: "commercial"`), the
// `.rating-badge` with the rating and the review count, and a link to /reviews.
export function ReviewsSection() {
  const copy = residentialHome.reviews;
  return (
    <section id="reviews" className="section section-light">
      <SectionHead tone="light" eyebrow={copy.eyebrow} h2={copy.h2} ratingBadge />
      <ReviewsGrid reviews={reviews.filter((r) => r.segment !== "commercial")} />
      <ChipRow items={[{ label: copy.allReviews, href: "/reviews" }]} style={{ marginTop: 24 }} />
    </section>
  );
}
