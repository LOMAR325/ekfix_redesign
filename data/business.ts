import type { Business } from "./types";

// Single source of truth for NAP and business-wide constants.
// Do NOT hardcode any of these values in app/ or components/.
export const business: Business = {
  name: "EK Global",
  phone: "(980) 371-4319",
  phoneHref: "tel:+19803714319",
  phoneE164: "+1-980-371-4319",
  hours: "8AM – 8PM daily",
  hoursNote: "Weekends included",
  openingHours: {
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "20:00",
  },
  address: {
    locality: "Charlotte",
    region: "NC",
    country: "US",
  },
  // Live domain (R27i) — every absolute URL and JSON-LD @id is built from it (lib/seo.absoluteUrl).
  siteUrl: "https://ekfix.us",
  social: {
    instagram: "https://www.instagram.com/ekglobal_official",
    facebook: "https://www.facebook.com/profile.php?id=61572447657230",
    tiktok: "https://www.tiktok.com/@constantin_ekfix",
    // the Google Business Profile — the owner's review link (2026-09-30)
    google: "https://g.page/r/CQzbpOh98VJ2EAE",
  },
  // Place ID resolved from the owner's g.page review link (search.google.com/local/writereview?placeid=…)
  google: {
    placeId: "ChIJ8zG7gctrMWQRDNuk6H3xUnY",
    writeReviewUrl: "https://g.page/r/CQzbpOh98VJ2EAE/review",
  },
  gaId: "G-LFM6MSKBQ7",
  // GBP allows <= 20 service zones. Trimmed from the 26 cities in the old index.html JSON-LD,
  // ordered by priority (5 full-page towns first, then proximity to Ballantyne / call volume).
  // The full list — including the 6 dropped here — stays on /towns as alsoServedNC/alsoServedSC.
  areaServed: [
    "Charlotte, NC",
    "Matthews, NC",
    "Mint Hill, NC",
    "Pineville, NC",
    "Indian Trail, NC",
    "Stallings, NC",
    "Waxhaw, NC",
    "Weddington, NC",
    "Marvin, NC",
    "Wesley Chapel, NC",
    "Monroe, NC",
    "Harrisburg, NC",
    "Fort Mill, SC",
    "Rock Hill, SC",
    "Tega Cay, SC",
    "Indian Land, SC",
    "Lake Wylie, SC",
    "Belmont, NC",
    "Newell, NC",
    "Catawba, SC",
  ],
};
