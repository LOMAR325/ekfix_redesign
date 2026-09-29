import { business } from "./business";

// The owner — the single source of his name for every text, alt, <title>/description
// and the JSON-LD Person node (spec story 9 / R11). Published facts only: first name
// (brief fact 1 — "Constantin", as in the reviews and TikTok), role, "10+ yrs", the two
// certifications and "Ballantyne" all already appear on the site. There is deliberately
// NO surname field (R13) — the brief says not to publish it.
//
// Photo file names still carry the old spelling; renaming them is R88 (out of scope).

export type OwnerPhoto = { src: string; alt: string };

export type OwnerCredential = {
  /** full name, used by the JSON-LD `hasCredential` */
  name: string;
  /** the short form printed on the site, e.g. "EPA Universal" */
  short: string;
};

export type Owner = {
  name: string;
  role: string;
  /** as printed on the site, e.g. "10+" */
  yearsExperience: string;
  credentials: readonly OwnerCredential[];
  basedIn: string;
  /**
   * Appliance categories the owner is shown working on in the /about copy — the JSON-LD
   * Person `knowsAbout`. Keep in sync with what /about actually shows (R23).
   */
  knowsAbout: readonly string[];
  photos: {
    /** /about portrait — also the Person `image` */
    portrait: OwnerPhoto;
    /** home hero background */
    hero: OwnerPhoto;
    restaurantKitchen: OwnerPhoto;
    rooftopLaundry: OwnerPhoto;
  };
};

const name = "Constantin";

export const owner: Owner = {
  name,
  role: "Owner & Lead Technician",
  yearsExperience: "10+",
  credentials: [
    { name: "EPA Section 608 Universal", short: "EPA Universal" },
    // No course name — only "OSHA" is published.
    { name: "OSHA", short: "OSHA" },
  ],
  basedIn: "Ballantyne",
  knowsAbout: [
    "Refrigerators",
    "Dishwashers",
    "Walk-in freezers",
    "Commercial kitchen equipment",
    "Commercial laundry equipment",
  ],
  photos: {
    portrait: {
      src: "/images/konstantin_thermador.webp",
      alt: `${name}, ${business.name} owner and lead technician`,
    },
    hero: {
      src: "/images/hero-technician.webp",
      alt: `${name}, ${business.name} owner and lead technician, next to a washer he's repairing`,
    },
    restaurantKitchen: {
      src: "/images/kostia_reast.webp",
      alt: `${name} repairing commercial kitchen equipment`,
    },
    rooftopLaundry: {
      src: "/images/kostia-laundry.webp",
      alt: `${name} repairing commercial laundry equipment on a rooftop unit`,
    },
  },
};
