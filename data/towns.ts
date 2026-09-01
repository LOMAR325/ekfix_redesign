import type { Town } from "./types";

// Service-area towns. 5 have full pages (isFullPage) with unique content carried over
// verbatim from towns/*.html. The rest are name/state-only records used for the text
// lists on /towns (see alsoServedNC / alsoServedSC below). hasMap is true only for Charlotte.
const fullTowns: Town[] = [
  {
    slug: "charlotte",
    name: "Charlotte",
    state: "NC",
    isFullPage: true,
    hasMap: true,
    hero: {
      lede: "Konstantin lives in the Ballantyne area and works across Charlotte daily — from historic bungalows in Dilworth to new builds in SouthPark and South End. Same-day slots, most repairs finished in one visit.",
    },
    prose: [
      "EK Global is based right here in Charlotte — Konstantin lives in the Ballantyne area and personally handles appliance calls across the metro, not a rotating cast of subcontractors. That matters more than it sounds: a technician who works this market every week knows that <strong>older homes around Dilworth and Plaza Midwood</strong> often carry appliances 10–15+ years old with parts that need sourcing ahead of the visit, while newer construction near <strong>SouthPark, Ballantyne, and South End</strong> is heavier on built-in and panel-ready units from Sub-Zero, Thermador, Bosch, and KitchenAid — which need different tools and a different diagnostic approach entirely.",
      "Whichever side of town you're on, the visit works the same way: a flat $75 diagnostic (waived if you go ahead with the repair), a clear explanation of what's actually wrong, and — in most cases — the repair finished the same day, using original manufacturer-approved parts.",
    ],
    districts: [
      "Uptown / Center City",
      "Dilworth",
      "Myers Park",
      "SouthPark",
      "South End",
      "Ballantyne",
      "NoDa",
      "Plaza Midwood",
    ],
    reviewAuthors: ["Tony Z.", "Ally T.", "Michael S."],
    nearbyProse:
      "Beyond Charlotte proper, we regularly cover Matthews, Mint Hill, Pineville, Indian Trail, Waxhaw, Belmont, Monroe, Fort Mill, Rock Hill, and the smaller towns between them. If you're not sure whether you're in range, just call.",
  },
  {
    slug: "rock-hill",
    name: "Rock Hill",
    state: "SC",
    isFullPage: true,
    hero: {
      lede: "From Old Town's historic homes to the newer neighborhoods around Riverwalk and Manchester Meadows — same-day slots, most repairs finished in one visit.",
    },
    prose: [
      "EK Global covers Rock Hill regularly — it's one of the largest markets south of Charlotte, and the housing stock here is genuinely mixed: <strong>Old Town and the streets around White Street</strong> carry older homes with appliances that have usually been through a few owners, while <strong>Riverwalk, Manchester Meadows, and the newer development near India Hook Road</strong> lean toward builder-grade and mid-range kitchen packages installed in the last decade.",
      "Either way, the visit works the same: a flat $75 diagnostic (waived if you go ahead with the repair), a plain-language explanation of what's actually wrong, and — in most cases — the repair finished the same day with original manufacturer-approved parts.",
    ],
    districts: [
      "Old Town",
      "Riverwalk",
      "Manchester Meadows",
      "India Hook Rd",
      "Cherry Park",
      "Winthrop area",
    ],
    reviewAuthors: ["Ally T.", "Erin B.", "Michael S."],
    nearby: ["Fort Mill, SC", "Tega Cay, SC", "Indian Land, SC", "Lake Wylie, SC", "Charlotte, NC"],
  },
  {
    slug: "fort-mill",
    name: "Fort Mill",
    state: "SC",
    isFullPage: true,
    hero: {
      lede: "From Baxter Village's newer builds to the older streets around Downtown Main Street — same-day slots, most repairs finished in one visit.",
    },
    prose: [
      "Fort Mill has grown fast, and it shows in the appliances we work on. <strong>Baxter Village and the newer subdivisions</strong> are full of builder-installed and mid-to-premium kitchen packages — think Bosch, KitchenAid, and Samsung — usually still within their expected service life but occasionally hit with an install-related issue. <strong>Downtown Fort Mill and the older streets near Main Street</strong> have a smaller number of longer-owned homes where a unit is more likely due for an honest repair-vs-replace conversation.",
      "Whichever side of town, the process is the same: a flat $75 diagnostic (waived if you move forward with the repair), a clear explanation of the issue, and — in most cases — same-day completion with original parts.",
    ],
    districts: [
      "Baxter Village",
      "Downtown / Main Street",
      "Kingsley",
      "Springfield",
      "Anne Springs Close Greenway",
    ],
    reviewAuthors: ["Ally T.", "Erin B.", "Michael S."],
    nearby: ["Rock Hill, SC", "Tega Cay, SC", "Indian Land, SC", "Charlotte, NC", "Pineville, NC"],
  },
  {
    slug: "matthews",
    name: "Matthews",
    state: "NC",
    isFullPage: true,
    hero: {
      lede: "From historic Downtown Matthews to the newer neighborhoods off I-485 — same-day slots, most repairs finished in one visit.",
    },
    prose: [
      "Matthews is one of the more established towns in our service area, and the mix reflects that: <strong>Downtown Matthews and the streets around the historic core</strong> have older homes where appliances have often been replaced piecemeal over the years, while the newer construction closer to <strong>I-485 and Matthews-Mint Hill Road</strong> tends to run higher-end built-in packages needing more specialized parts.",
      "Either way, the visit works the same: a flat $75 diagnostic (waived if you go ahead with the repair), a clear explanation of what's wrong, and — in most cases — the job finished the same day with original manufacturer-approved parts.",
    ],
    districts: [
      "Downtown Matthews",
      "Matthews-Mint Hill Rd",
      "I-485 corridor",
      "Sardis Rd",
      "Crestdale",
    ],
    reviewAuthors: ["Ally T.", "Erin B.", "Michael S."],
    nearby: ["Mint Hill, NC", "Charlotte, NC", "Indian Trail, NC", "Weddington, NC", "Waxhaw, NC"],
  },
  {
    slug: "indian-trail",
    name: "Indian Trail",
    state: "NC",
    isFullPage: true,
    hero: {
      lede: "One of the fastest-growing towns in our service area — same-day slots, most repairs finished in one visit.",
    },
    prose: [
      "Indian Trail has grown rapidly along the Independence Blvd / Hwy 74 corridor, and most of the calls we get here are from newer subdivisions with builder-grade appliances still within their expected lifespan — usually a specific component failure rather than a unit ready for replacement. There's also an older, more established pocket of the town where appliances tend to be a bit further into their service life.",
      "Either way, the visit works the same: a flat $75 diagnostic (waived if you go ahead with the repair), a clear explanation of what's actually wrong, and — in most cases — the repair finished the same day with original manufacturer-approved parts.",
    ],
    districts: [
      "Hwy 74 corridor",
      "Sun Valley area",
      "Downtown Indian Trail",
      "Wesley Chapel line",
      "Near Monroe",
    ],
    reviewAuthors: ["Ally T.", "Erin B.", "Michael S."],
    nearby: ["Monroe, NC", "Wesley Chapel, NC", "Matthews, NC", "Charlotte, NC", "Unionville, NC"],
  },
];

// Non-full towns — carried as name/state-only Town records (spec §"Слой данных":
// "Не-полные — только name/state для текстовых списков"). Kept in the SAME array so
// data/towns stays the single source; the alsoServed* exports below are derived, not a
// second copy. `slug` is set for consistency only — /towns/[slug] notFound()s anything
// that is not in `fullPageTowns`, and generateStaticParams uses fullPageTowns.
// Source: the "We also cover" (NC) and "Just across the state line" (SC) lists on towns/index.html.
const nonFullTowns: Town[] = [
  // North Carolina
  ...(["Stallings", "Newell", "Harrisburg", "Allen", "Mint Hill", "Wesley Chapel", "Monroe", "Unionville", "Mineral Springs", "Pineville", "Waxhaw", "Belmont", "Marvin", "Weddington"] as const).map(
    (name): Town => ({ slug: name.toLowerCase().replace(/\s+/g, "-"), name, state: "NC", isFullPage: false }),
  ),
  // South Carolina
  ...(["Catawba", "Indian Hook", "Indian Land", "Lake Wylie", "Lesslie", "Spring Valley", "Tega Cay"] as const).map(
    (name): Town => ({ slug: name.toLowerCase().replace(/\s+/g, "-"), name, state: "SC", isFullPage: false }),
  ),
];

export const towns: Town[] = [...fullTowns, ...nonFullTowns];

export const fullPageTowns: Town[] = towns.filter((t) => t.isFullPage);
export const townSlugs: string[] = fullPageTowns.map((t) => t.slug);
export const getTown = (slug: string): Town | undefined =>
  fullPageTowns.find((t) => t.slug === slug);

/** "Also serving" text lists on towns/index.html — derived from the non-full town records. */
export const alsoServedNC: string[] = towns
  .filter((t) => !t.isFullPage && t.state === "NC")
  .map((t) => t.name);
export const alsoServedSC: string[] = towns
  .filter((t) => !t.isFullPage && t.state === "SC")
  .map((t) => t.name);

// towns/index.html hero + section copy (1:1).
export const townsIndex = {
  title: "Service Area | Charlotte, NC & Surrounding Towns | EK Global",
  metaDescription:
    "EK Global covers Charlotte, NC plus about 25 surrounding towns across North and South Carolina — same-day appliance repair, $75 diagnostic waived with repair.",
  heroH1: "Charlotte, NC<br><span>&amp; the towns around it.</span>",
  heroLede:
    "Konstantin covers Charlotte and roughly 25 surrounding towns across North and South Carolina. If you're not sure whether you're in range, just call — chances are we cover you.",
  activeHead: { h2: "Where we're<br>most active.", lede: "These towns get the most call volume, so we've written up what's actually different about each one." },
  alsoServingNCLabel: "We also cover:",
  alsoServingSCLabel: "Just across the state line:",
} as const;
