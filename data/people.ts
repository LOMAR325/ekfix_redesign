import { business } from "./business";
import type { Publishable } from "./types";
import { routable } from "../lib/publish";

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
   * The JSON-LD Person `knowsAbout` = the appliance chips /about shows ("What he works on"):
   * the residential service names, then the commercial categories (R23, story 18).
   */
  knowsAbout: readonly string[];
  /** portrait/hero/… — the owner's own photos; every one shows him at work */
  photos: Record<
    | "portrait"
    | "hero"
    | "restaurantKitchen"
    | "rooftopLaundry"
    | "rooftopRefrigeration"
    | "washerExtractor"
    | "washerExtractorPortrait"
    | "dryCleaner"
    | "commercialRooftop"
    | "homeKitchen"
    | "homeLaundry"
    | "controlBoards",
    OwnerPhoto
  >;
};

const name = "Constantin";

// "What he works on" on /about — data/services `services[].name` and `commercialCategories[].label`,
// verbatim and in that order. Spelled out here instead of imported: data/services may import
// this module (owner name in its copy), and an import cycle breaks at module evaluation.
// data/people.test.ts pins both lists to data/services.
const residentialAppliances = [
  "Refrigerator",
  "Washer",
  "Dryer",
  "Dishwasher",
  "Stove",
  "Range",
  "Cooktop",
  "Microwave",
  "Freezer",
  "Ice Maker",
  "Wine Cooler",
  "Garbage Disposal",
] as const;
const commercialEquipment = [
  "Commercial Refrigeration",
  "Commercial Dishwasher/Warewasher",
  "Commercial Laundry Equipment",
  "Ice Machine (high-volume)",
] as const;

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
  knowsAbout: [...residentialAppliances, ...commercialEquipment],
  photos: {
    portrait: {
      src: "/images/ek-global-owner-thermador-refrigerator-charlotte.webp",
      alt: `${name}, ${business.name} owner and lead technician`,
    },
    hero: {
      src: "/images/ek-global-technician-washer-repair-charlotte.webp",
      alt: `${name}, ${business.name} owner and lead technician, next to a washer he's repairing`,
    },
    restaurantKitchen: {
      src: "/images/ek-global-technician-restaurant-kitchen-charlotte.webp",
      alt: `${name} repairing commercial kitchen equipment`,
    },
    // On-the-job photos from the owner (2026-10-03), as shot — natural, not staged.
    rooftopRefrigeration: {
      src: "/images/ek-global-technician-rooftop-refrigeration-charlotte.webp",
      alt: `${name} servicing a rooftop refrigeration unit, refrigerant tank beside him`,
    },
    washerExtractor: {
      src: "/images/ek-global-technician-commercial-washer-extractor.webp",
      alt: `${name} at a commercial washer-extractor`,
    },
    washerExtractorPortrait: {
      src: "/images/ek-global-technician-commercial-washer-portrait.webp",
      alt: `${name} with a pipe wrench in front of a commercial washer`,
    },
    dryCleaner: {
      src: "/images/ek-global-technician-dry-cleaner-laundry.webp",
      alt: `${name} on a service call in a dry cleaner's pressing room`,
    },
    commercialRooftop: {
      src: "/images/ek-global-technician-commercial-rooftop.webp",
      alt: `${name} on a commercial roof among rooftop units`,
    },
    homeKitchen: {
      src: "/images/ek-global-technician-home-kitchen-call.webp",
      alt: `${name} on a home service call, pipe wrench in hand, on the kitchen floor`,
    },
    homeLaundry: {
      src: "/images/ek-global-technician-home-laundry-hookup.webp",
      alt: `${name} hooking up a washer in a home laundry room`,
    },
    controlBoards: {
      src: "/images/ek-global-technician-control-boards-home.webp",
      alt: `${name} holding two appliance control boards`,
    },
    rooftopLaundry: {
      src: "/images/ek-global-technician-commercial-laundry-charlotte.webp",
      alt: `${name} repairing commercial laundry equipment on a rooftop unit`,
    },
  },
};

// ---------------------------------------------------------------------------------------
// /about copy (spec §2, stories 66–67). Every block carries a `status`: published blocks
// hold only what the site already published (10+ yrs, EPA Universal, OSHA, Ballantyne,
// family business, home and commercial work, the four owner photos); the blocks that need
// facts the owner has not given yet (brands — brief fact 9; training and company history —
// brief fact 8) are drafts and never reach a production build.

/** A block of /about prose: heading + paragraphs (trusted HTML strings allowed). */
export type AboutTextBlock = Publishable & { id: string; heading: string; paragraphs: string[] };

/** A photo on /about: one of `owner.photos` (the alt names Constantin) plus its caption. */
export type AboutPhoto = OwnerPhoto & { caption: string; objectPosition?: string };

type AboutSection = Publishable & { eyebrow: string; h2: string };
type ChipGroup = { heading: string; items: readonly string[] };

export type AboutPage = {
  meta: { title: string; description: string };
  breadcrumb: { home: string; self: string };
  hero: { h1: string; lede: string };
  meet: Publishable & { heading: string; paragraphs: string[]; stats: { k: string; v: string }[] };
  appliances: AboutSection & { lede: string; residential: ChipGroup; commercial: ChipGroup };
  approach: AboutSection & { items: { num: string; title: string; body: string }[] };
  onTheJob: AboutSection & { photos: AboutPhoto[] };
  pending: { eyebrow: string; h2: string; blocks: AboutTextBlock[] };
  cta: { h2: string; body: string };
};

const [epa, osha] = owner.credentials;

export const aboutPage: AboutPage = {
  meta: {
    title: `Our Story — Meet ${name}, ${owner.role} | ${business.name}`,
    description: `${name}, ${owner.role} of ${business.name}: ${owner.yearsExperience} years of home and commercial appliance repair, ${epa.short} & ${osha.short} certified, based in ${owner.basedIn}. A family business.`,
  },
  breadcrumb: { home: "Home", self: "Our Story" },
  hero: {
    h1: "A family business,<br><span>not a franchise.</span>",
    lede: `${business.name} is run by ${name} — the person who answers the phone, does the diagnostic, and comes back if something isn't right. No call center, no subcontractors, no ticket numbers.`,
  },
  meet: {
    status: "published",
    heading: `Meet ${name}`,
    paragraphs: [
      `${name} is the ${owner.role} of ${business.name}. He has spent more than 10 years repairing home and commercial appliances around Charlotte, and he holds two certifications — ${epa.name} and ${osha.name} — which cover everything from a leaking dishwasher to a commercial walk-in compressor.`,
      `He lives in the ${owner.basedIn} area with his family, and ${business.name} is genuinely a family operation — not a lead-generation site that dispatches whoever's available. When you call, you're talking to the technician who shows up at your door, and the same person who comes back if something isn't right.`,
      "That's the whole pitch: real diagnostics, original parts, honest pricing, and a warranty on every job — from a homeowner's refrigerator to a restaurant's walk-in freezer.",
    ],
    stats: [
      { k: `${owner.yearsExperience} yrs`, v: "Hands-on repair experience" },
      { k: epa.short, v: "Certified technician" },
      { k: osha.short, v: "Certified & fully insured" },
    ],
  },
  appliances: {
    status: "published",
    eyebrow: "Home & commercial",
    h2: "What he<br>works on.",
    lede: "From a homeowner's kitchen to a restaurant walk-in — same technician, same standard.",
    residential: { heading: "Home appliances", items: residentialAppliances },
    commercial: { heading: "Commercial equipment", items: commercialEquipment },
  },
  approach: {
    status: "published",
    eyebrow: "Why it matters",
    h2: "What that means<br>for your repair.",
    items: [
      {
        num: "01",
        title: "One technician, start to finish",
        body: "The person who diagnoses your appliance is the same person who repairs it and the same person you'd call back if anything felt off. No hand-offs.",
      },
      {
        num: "02",
        title: "Certified, not just experienced",
        body: "EPA Universal and OSHA certification means proper refrigerant handling and safety practices on every job — residential and commercial.",
      },
      {
        num: "03",
        title: "Local, and it shows",
        body: `Based in ${owner.basedIn}, working across Charlotte and the surrounding NC/SC towns. ${business.name} shows up at neighborhood events — it's not a call center in another state.`,
      },
    ],
  },
  onTheJob: {
    status: "published",
    eyebrow: "On the job",
    h2: "Homes, restaurants,<br>and everything between.",
    photos: [
      { ...owner.photos.hero, caption: "Residential — washer repair", objectPosition: "72% 30%" },
      { ...owner.photos.restaurantKitchen, caption: "Restaurant kitchen — commercial dishwasher" },
      { ...owner.photos.dryCleaner, caption: "Dry cleaner — pressing room" },
      { ...owner.photos.commercialRooftop, caption: "Commercial roof — rooftop units" },
      { ...owner.photos.homeLaundry, caption: "Home laundry room — washer hookup" },
      { ...owner.photos.controlBoards, caption: "Appliance control boards", objectPosition: "50% 35%" },
    ],
  },
  /** Blocks waiting for owner facts — `status: "draft"`, shown only in `next dev`. */
  pending: {
    eyebrow: "Pending owner confirmation",
    h2: `More about ${name}.`,
    blocks: [
      {
        id: "brands",
        status: "draft",
        heading: "Brands he knows best",
        paragraphs: [
          `[TODO: confirm with owner — the appliance brands ${name} has the most hands-on experience with (brief fact 9).]`,
        ],
      },
      {
        id: "training",
        status: "draft",
        heading: "Training",
        paragraphs: [
          `[TODO: confirm with owner — training and courses beyond the ${epa.short} and ${osha.short} certifications (brief fact 8).]`,
        ],
      },
      {
        id: "company-history",
        status: "draft",
        heading: "Company history",
        paragraphs: [
          `[TODO: confirm with owner — when and how ${business.name} started (brief fact 8).]`,
        ],
      },
    ],
  },
  cta: {
    h2: "Talk to the person<br>doing the repair.",
    body: `No dispatch queue. Call ${name} directly, or book online in under a minute.`,
  },
};

/**
 * The pending /about blocks that may render: published ones, plus drafts while previewed in
 * `next dev` (lib/publish.routable). A production build gets none of the drafts.
 */
export function aboutPendingBlocks(): AboutTextBlock[] {
  return aboutPage.pending.blocks.filter(routable);
}
