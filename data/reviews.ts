import type { Review } from "./types";

// The 6 reviews shown in index.html #reviews, verbatim.
// `author` + `detail` = the <strong> / <span> pair under each quote; `text` = the quote.
// TODO: подтвердить у владельца, что все 6 отзывов — настоящие
export const reviews: Review[] = [
  {
    author: "Tony Z.",
    detail: "Dishwasher — Restaurant",
    text: "Constantin did a phenomenal job — came out same day to diagnose, ordered the part, and got our restaurant dishwasher running again. Great price, very friendly.",
    appliance: "Dishwasher",
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

// AggregateRating source — derived from the reviews above, NOT from the "5.0 on Google" badge.
export const aggregate = {
  ratingValue: 5.0,
  reviewCount: reviews.length, // 6
} as const;

/** Look up reviews by author (used by town pages via Town.reviewAuthors). */
export function reviewsByAuthors(authors: string[]): Review[] {
  return authors
    .map((a) => reviews.find((r) => r.author === a))
    .filter((r): r is Review => r !== undefined);
}
