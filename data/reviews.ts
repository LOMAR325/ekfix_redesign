import type { Review } from "./types";

// Real Google reviews of the EK Global LLC Business Profile, read from Google Maps on 2026-09-30 at the
// owner's request ("take 8 of the best from my link"): Google showed 5 without signing in; the one
// about AC repair is left out (not a service on this site). `text` verbatim as on Google (a quote cut
// by Google ends in "…"); the author's family name is shortened to an initial. The 6 quotes carried
// over from the old static site were removed — nobody could confirm who wrote them.
// With GOOGLE_PLACES_API_KEY, lib/google-reviews replaces these with live ones.
export const reviews: Review[] = [
  {
    author: "Jimmy W.",
    detail: "Google review",
    text: "Constantin was fantastic! He was able to diagnose the problem over the phone to save a return trip. He was very flexible working with us on scheduling as our past few weeks have been busy with three kids and different spring breaks. So glad to have found someone who cares about longevity of appliances rather than just replacing them. We highly recommend Constantin for any appliance issues you may have come up.",
    rating: 5,
  },
  {
    author: "Jan L.",
    detail: "Dishwasher · Google review",
    text: "Constantin is amazing—jack of all trades! He can repair all appliances (any brand) and offers handyman services as well. He replaced my Bosch dishwasher panel in no time. He was very responsive, showed up exactly when he said he would and …",
    appliance: "Dishwasher",
    rating: 5,
  },
  {
    author: "Vladimir B.",
    detail: "Washer · Google review",
    text: "Konstantin fixed my washer and I’m very satisfied with his work. It had a drainage issue before, but now everything works perfectly. Highly recommend him to everyone!",
    appliance: "Washer",
    rating: 5,
  },
  {
    author: "Raksha S.",
    detail: "Refrigerator · Google review",
    text: "Constantin was very efficient and swiftly addressed my refrigerator issue. Would not hesitate to reach out for other appliance issues in the future. Highly recommend!",
    appliance: "Refrigerator",
    rating: 5,
  },
];

/**
 * The profile's rating and review count as Google showed them on 2026-09-30 — a snapshot, shown
 * until GOOGLE_PLACES_API_KEY makes them live (lib/google-reviews). Update both when refreshing.
 */
export const googleSnapshot = { value: 5.0, count: 98, asOf: "2026-09-30" } as const;

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
      siteLede: `${businessName}'s reviews live on its Google Business Profile. A few of them are below — read them all on Google, or leave one after a repair.`,
      readAll: "Read All Reviews on Google",
      leave: "Leave a Review",
    },
    list: {
      googleEyebrow: "Latest on Google",
      siteEyebrow: "A few from Google",
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
