import type { Review } from "@/data/types";

// `.review-card` — `.stars`, the quote, and `.who` (`<strong>` author + `<span>` detail).
// `.reviews-grid` — the wrapper used on index.html #reviews and the town pages.
export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="stars">★★★★★</div>
      <p>{review.text}</p>
      <div className="who">
        <strong>{review.author}</strong>
        <span>{review.detail}</span>
      </div>
    </div>
  );
}

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  return (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <ReviewCard key={review.author} review={review} />
      ))}
    </div>
  );
}
