import type { Review } from "@/data/types";
import { Stars } from "./stars";

// `.review-card` — `.stars` (decorative, see ui/stars), the quote, and `.who` (`<strong>` author
// + `<span>` detail). A Google review links the author to their Google profile (attribution the
// Places API requires) and shows its own stars and "2 weeks ago".
// `.reviews-grid` — the wrapper used on the homes, /reviews and the town pages.
export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <Stars srLabel count={review.rating ?? 5} />
      <p>{review.text}</p>
      <div className="who">
        <strong>
          {review.authorUrl ? (
            <a href={review.authorUrl} target="_blank" rel="noopener nofollow">
              {review.author}
            </a>
          ) : (
            review.author
          )}
        </strong>
        <span>{review.detail}</span>
      </div>
    </div>
  );
}

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  return (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <ReviewCard key={`${review.author}-${review.text.slice(0, 24)}`} review={review} />
      ))}
    </div>
  );
}
