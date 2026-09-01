import type { Business } from "./types";
import { aggregate } from "./reviews";

// Single source of truth for NAP and business-wide constants.
// Do NOT hardcode any of these values in app/ or components/.
export const business: Business = {
  name: "EK Global",
  legalName: "EK Global",
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
  // TODO: подтвердить финальный публичный домен у владельца
  siteUrl: "https://ekfix.us",
  social: {
    instagram: "https://www.instagram.com/ekglobal_official",
    facebook: "https://www.facebook.com/profile.php?id=61572447657230",
    tiktok: "https://www.tiktok.com/@constantin_ekfix",
  },
  gaId: "G-LFM6MSKBQ7",
  // TODO: имя утверждает владелец
  maintenancePlanName: "EK Maintenance Plan",
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
  // Derived from data/reviews.ts aggregate (real reviews), not the "5.0 on Google" badge.
  rating: { value: aggregate.ratingValue, count: aggregate.reviewCount },
};
