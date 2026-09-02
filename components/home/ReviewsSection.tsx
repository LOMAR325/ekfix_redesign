import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { reviews } from "@/data/reviews";

// `#reviews` — ported 1:1 from index.html. The 6 reviews come from data/reviews in
// the same order they appear today (Tony Z. — the restaurant dishwasher review —
// first). The right-hand `.rating-badge` is rendered by SectionHead from
// data/business.rating (real reviews, not the "5.0 on Google" badge text).
export function ReviewsSection() {
  return (
    <section id="reviews" className="section section-light">
      <SectionHead
        tone="light"
        eyebrow="04 / Reviews"
        h2="What our<br>customers say."
        ratingBadge
      />
      <ReviewsGrid reviews={reviews} />
    </section>
  );
}
