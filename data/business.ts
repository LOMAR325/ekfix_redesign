import type { Business } from "./types";

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
  // TODO: финализирует таск 02 — полный список зон (<= 20), синхронно с sitemap
  areaServed: [],
  // TODO: финализирует таск 02 — считается из data/reviews.ts
  rating: null,
};
