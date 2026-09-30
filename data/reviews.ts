import type { Review } from "./types";

// The 6 reviews shown in index.html #reviews, verbatim.
// `author` + `detail` = the <strong> / <span> pair under each quote; `text` = the quote.
// `segment` / `area` are set only where the review itself says so (spec story 77):
// Tony Z. → commercial ("Restaurant"); no review names an area yet.
// TODO: подтвердить у владельца, что все 6 отзывов — настоящие
export const reviews: Review[] = [
  {
    author: "Tony Z.",
    detail: "Dishwasher — Restaurant",
    text: "Constantin did a phenomenal job — came out same day to diagnose, ordered the part, and got our restaurant dishwasher running again. Great price, very friendly.",
    appliance: "Dishwasher",
    segment: "commercial", // detail says "Restaurant"
  },
  {
    author: "Ally T.",
    detail: "Dryer fixed in under 6 hours",
    text: "EK Global fixed my dryer in less than 6 hours from my first call. Great communication, and the technician was polite and clearly very knowledgeable.",
    appliance: "Dryer",
  },
  {
    author: "Mike G.",
    detail: "Freezer — Outstanding service",
    text: "Thank you for the excellent work on our freezer. I appreciate the time spent explaining what caused the issue and what to watch for. Highly recommend.",
    appliance: "Freezer",
  },
  {
    author: "Leslie D.",
    detail: "Emergency freezer — 1 hour",
    text: "Had a freezer emergency — EK Global responded immediately and resolved it within an hour of my first call. Highly recommend for urgent repairs.",
    appliance: "Freezer",
  },
  {
    author: "Erin B.",
    detail: "Dishwasher — quick & affordable",
    text: "Prompt, communicated well, finished in about 1.5 hours with an accurate estimate upfront. Very reasonable cost. Will definitely use again.",
    appliance: "Dishwasher",
  },
  {
    author: "Michael S.",
    detail: "Thermador refrigerator",
    text: "Absolutely wonderful. Came right out, diagnosed the issue with my Thermador, and ordered the part immediately. Super friendly and professional.",
    appliance: "Refrigerator",
  },
];

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
      siteLede: `${businessName}'s reviews live on its Google Business Profile — read them all there. A few customer reviews are below.`,
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
