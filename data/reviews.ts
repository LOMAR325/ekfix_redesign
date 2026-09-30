import type { Review } from "./types";

// The site's own reviews. Empty on purpose (owner, 2026-09-30): only real reviews from Google are
// shown — lib/google-reviews with GOOGLE_PLACES_API_KEY. The 6 quotes carried over from the old
// static site were removed: nobody could confirm who wrote them. Add a review here only with the
// owner's confirmation that it is real (`text` verbatim).
export const reviews: Review[] = [];

/** Look up reviews by author (used by town pages via Town.reviewAuthors). */
export function reviewsByAuthors(authors: string[]): Review[] {
  return authors
    .map((a) => reviews.find((r) => r.author === a))
    .filter((r): r is Review => r !== undefined);
}

/**
 * /reviews copy (redesigned 2026-09-30: the page is built around the Google Business Profile; no
 * count or rating is shown unless it comes live from Google). Takes the business name as an argument.
 */
export function reviewsPageCopy(businessName: string) {
  return {
    meta: {
      title: `Customer Reviews — Appliance Repair in Charlotte, NC | ${businessName}`,
      description: `What customers say about ${businessName} appliance repair in Charlotte, NC — the reviews on its Google Business Profile, and where to leave one.`,
    },
    breadcrumb: { home: "Home", self: "Reviews" },
    hero: {
      h1: "Reviews,<br><span>straight from Google.</span>",
      /** Google reviews live (lib/google-reviews) */
      googleLede: `The latest reviews from the ${businessName} Google Business Profile, refreshed daily. Every review — and the full count — is on Google.`,
      /** the site's own selection — no count or rating is shown, the full list is on Google */
      siteLede: `${businessName}'s reviews live on its Google Business Profile — read them all there, or leave one after a repair.`,
      readAll: "Read All Reviews on Google",
      leave: "Leave a Review",
    },
    list: {
      googleEyebrow: "Latest on Google",
      siteEyebrow: "A few of them",
      h2: "What customers say.",
    },
    leave: {
      eyebrow: "After a repair",
      h2: "Had a repair done?<br>Leave a review.",
      body: "A short review on Google helps the next neighbor, property manager or restaurant owner decide. It takes a minute.",
      button: "Leave a Review on Google →",
    },
    cta: {
      h2: "Need a repair?<br>Book it in a minute.",
      body: "Same-day service across Charlotte and the surrounding towns, with a warranty on every repair.",
    },
  };
}
