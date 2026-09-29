import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { homeReviews } from "@/data/reviews";
import { home } from "@/data/home";

// `#reviews` — the 6 reviews, business reviews first (data/reviews.homeReviews sorts
// `segment: "commercial"` ahead of the rest — story 45). The right-hand `.rating-badge`
// is rendered by SectionHead from data/business.rating (real reviews); "count" labels it with
// the review count — the page's AggregateRating states both numbers (story 82).
export function ReviewsSection() {
  return (
    <section id="reviews" className="section section-light">
      <SectionHead tone="light" eyebrow={home.reviews.eyebrow} h2={home.reviews.h2} ratingBadge="count" />
      <ReviewsGrid reviews={homeReviews()} />
    </section>
  );
}
