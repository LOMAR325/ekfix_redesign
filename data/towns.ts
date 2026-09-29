import type { Town, TownPage } from "./types";
import { owner } from "./people";
import { business } from "./business";
import { services } from "./services";
import { brandNote, commercialBrands, residentialBrands } from "./brands";
import { isPublished, routable } from "../lib/publish";

// Service-area towns and areas. A town/area has a route only if it carries `page`, and in
// production only if `page.status === "published"` (lib/publish). The 5 city pages carry
// content verbatim from towns/*.html (incl. the per-page <title>/<meta>); the two areas
// (spec §3: south-charlotte → charlotte, ballantyne → south-charlotte) are built only from
// facts already published on the site. The rest are name/state-only records used for the
// text lists on /towns (alsoServedNC / alsoServedSC below). hasMap is true only for Charlotte.

/** The service list as prose — "refrigerators, washers, …, and garbage disposals" (data/services). */
const appliancesInProse = ((): string => {
  const names = services.map((s) => `${s.name.toLowerCase()}s`);
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
})();

const brandNames = (list: readonly { name: string }[]): string => list.map((b) => b.name).join(", ");

/** Text of a block that waits for an owner fact. Never rendered: such a block is a draft. */
const todo = (what: string): string => `[TODO: confirm with the owner — ${what}]`;

// Ballantyne (spec stories 55–59, R59–R65). Published facts only: the owner lives and works
// here (/about, the Charlotte page) and the built-in / panel-ready observation for newer
// construction (the Charlotte page). No ZIP (fact 3 — "28277" is not named anywhere), no
// communities (fact 4), no businesses served (fact 5): those blocks and FAQ items are drafts.
// Page status is decided by the template test (spec §10): npm run check:similarity -- --group areas.
const ballantynePage: TownPage = {
  status: "published",
  seo: {
    title: `Appliance Repair in Ballantyne, NC | Home & Commercial | ${business.name}`,
    description: `Commercial and in-home appliance repair in Ballantyne, NC — the owner of ${business.name} lives in the area. Built-in Sub-Zero, Thermador, Bosch & KitchenAid; $75 diagnostic waived with the repair.`,
  },
  hero: {
    lede: `${business.name} provides commercial and in-home appliance repair throughout Ballantyne and South Charlotte: ${appliancesInProse}.`,
  },
  prose: [
    `${owner.name}, the owner and lead technician, lives in the Ballantyne area with his family and works out of it. Calls from Ballantyne reach him directly — the person on the phone is the technician who shows up at the door, and the same person who comes back if something isn't right.`,
    "Ballantyne's newer construction is heavier on <strong>built-in and panel-ready units from Sub-Zero, Thermador, Bosch, and KitchenAid</strong>. They need different tools and an entirely different diagnostic approach.",
  ],
  // "Appliances we repair in Ballantyne" — only appliance kinds with published specifics (story 57).
  applianceNotes: [
    {
      status: "published",
      serviceSlug: "refrigerator",
      heading: "Built-in refrigerators",
      body: "Sub-Zero and Thermador built-ins belong to the newer Ballantyne kitchen. The unit stays where it is: it is repaired on-site, in the kitchen, with original manufacturer-approved parts — whether the fault is cooling, a leak, the ice maker, or a worn door seal.",
    },
    {
      status: "published",
      serviceSlug: "dishwasher",
      heading: "Panel-ready dishwashers",
      body: "Bosch and KitchenAid panel-ready dishwashers sit behind a cabinet-matched front. Drain and leak faults, a unit that won't start, and brand-specific error codes are diagnosed on-site, the code read from the manufacturer's tables rather than guessed.",
    },
  ],
  zips: { status: "draft", items: [] }, // fact 3
  communities: { status: "draft", items: [] }, // fact 4
  // Brief 3.3, the eight questions verbatim; answers only from published facts (story 59).
  faqs: [
    {
      status: "published",
      q: "Who repairs appliances in Ballantyne, NC?",
      a: `${business.name}, a family business based in Ballantyne. ${owner.name}, the owner and lead technician, lives in the area and takes the repair calls here himself.`,
    },
    {
      status: "draft", // fact 3
      q: "Does EK Global serve the 28277 ZIP code?",
      a: todo("ZIP codes served in Ballantyne / South Charlotte (fact 3)"),
    },
    {
      status: "published",
      q: "Does EK Global offer same-day appliance repair in Ballantyne?",
      a: "Yes. Same-day slots are available, and most repairs are finished in one visit. When no same-day slot is open, a technician is usually out within 24–48 hours.",
    },
    {
      status: "published",
      q: "How much is an appliance diagnostic in Ballantyne?",
      a: `A flat $75 — the same diagnostic fee as everywhere else ${business.name} works. It covers finding the fault and a plain-language explanation of what is wrong.`,
    },
    {
      status: "published",
      q: "Does the diagnostic fee apply toward the repair?",
      a: "Yes. The $75 is waived when you go ahead with the repair. The repair price depends on the part and the brand, and it is quoted before any work begins.",
    },
    {
      status: "published",
      q: "What appliance brands does EK Global repair?",
      a: `Residential and premium kitchen brands — ${brandNames(residentialBrands)} — and commercial equipment from ${brandNames(commercialBrands)}.`,
    },
    {
      status: "published",
      q: "Does EK Global repair Sub-Zero / Thermador / Bosch / Miele appliances?",
      a: `Sub-Zero, Thermador, and Bosch — yes, all three are on the brand list. Miele is named among the additional brands serviced (${brandNote.brandsPage.text}); call with the model to confirm.`,
    },
    {
      status: "draft", // fact 5
      q: "Does EK Global repair commercial appliances in South Charlotte?",
      a: todo("which businesses are served in South Charlotte (fact 5)"),
    },
  ],
};

// South Charlotte (story 54, R58). The only published fact about it is that Ballantyne is part
// of it; ZIP (fact 3), communities (fact 4) and who is served (fact 5) are drafts, and so is
// the page — without them it has nothing of its own to say.
const southCharlottePage: TownPage = {
  status: "draft",
  seo: {
    title: `Appliance Repair in South Charlotte, NC | ${business.name}`,
    description: "Appliance repair across South Charlotte, NC — the southern part of the city, Ballantyne included. Same-day slots; $75 diagnostic waived with the repair.",
  },
  hero: {
    lede: "The southern part of Charlotte, Ballantyne included — same-day slots, most repairs finished in one visit.",
  },
  prose: [],
  coverage: { status: "published", body: "Ballantyne is part of South Charlotte." },
  zips: { status: "draft", items: [] }, // fact 3
  communities: { status: "draft", items: [] }, // fact 4
  whoWeServe: {
    status: "draft", // fact 5 — businesses first, then homes
    business: todo("which businesses are served in South Charlotte (fact 5)"),
    homes: todo("which homes are served in South Charlotte (fact 5)"),
  },
};

// Charlotte speaks for the whole city (story 60, R66). While Ballantyne's page is published,
// the Ballantyne specifics (the owner living there, the built-in brand observation) live there
// and Charlotte links to it through its "Ballantyne" district chip; while it is a draft,
// Charlotte keeps the original text verbatim — no published fact is lost either way.
const ballantyneLive = isPublished(ballantynePage);

const pageTowns: Town[] = [
  {
    slug: "charlotte",
    name: "Charlotte",
    state: "NC",
    kind: "city",
    page: {
      status: "published",
      seo: {
        title: "Appliance Repair in Charlotte, NC | Same-Day | EK Global",
        description: ballantyneLive
          ? "Same-day appliance repair across Charlotte, NC — Uptown, Dilworth, SouthPark, South End, Myers Park & NoDa. EPA 608 & OSHA certified, warranty on every repair."
          : "Same-day appliance repair in Charlotte, NC — Ballantyne, Dilworth, SouthPark, South End, Myers Park & NoDa. EPA 608 & OSHA certified, warranty on every repair.",
      },
      hasMap: true,
      hero: {
        lede: ballantyneLive
          ? `${owner.name} works across Charlotte daily — from historic bungalows in Dilworth to new builds in SouthPark and South End. Same-day slots, most repairs finished in one visit.`
          : `${owner.name} lives in the Ballantyne area and works across Charlotte daily — from historic bungalows in Dilworth to new builds in SouthPark and South End. Same-day slots, most repairs finished in one visit.`,
      },
      prose: [
        ballantyneLive
          ? `EK Global is based right here in Charlotte — ${owner.name} personally handles appliance calls across the metro, not a rotating cast of subcontractors. That matters more than it sounds: a technician who works this market every week knows that <strong>older homes around Dilworth and Plaza Midwood</strong> often carry appliances 10–15+ years old with parts that need sourcing ahead of the visit, while newer construction near <strong>SouthPark and South End</strong> is heavier on built-in and panel-ready units — which need different tools and a different diagnostic approach entirely.`
          : `EK Global is based right here in Charlotte — ${owner.name} lives in the Ballantyne area and personally handles appliance calls across the metro, not a rotating cast of subcontractors. That matters more than it sounds: a technician who works this market every week knows that <strong>older homes around Dilworth and Plaza Midwood</strong> often carry appliances 10–15+ years old with parts that need sourcing ahead of the visit, while newer construction near <strong>SouthPark, Ballantyne, and South End</strong> is heavier on built-in and panel-ready units from Sub-Zero, Thermador, Bosch, and KitchenAid — which need different tools and a different diagnostic approach entirely.`,
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
      // "What we repair" — 11 chips, only Refrigerator deep-links; the rest point at the
      // home #repair grid, and Stove / Range is a single chip. Other cities list all 12 services.
      repairChips: [
        { label: "Refrigerator", href: "/appliance-repair/refrigerator" },
        { label: "Washer", href: "/#repair" },
        { label: "Dryer", href: "/#repair" },
        { label: "Dishwasher", href: "/#repair" },
        { label: "Stove / Range", href: "/#repair" },
        { label: "Cooktop", href: "/#repair" },
        { label: "Microwave", href: "/#repair" },
        { label: "Freezer", href: "/#repair" },
        { label: "Ice Maker", href: "/#repair" },
        { label: "Wine Cooler", href: "/#repair" },
        { label: "Garbage Disposal", href: "/#repair" },
      ],
    },
  },
  // Areas inside Charlotte (spec §3), listed right under it so the /towns grid and the menu
  // show them there: same /towns/[slug] route, parent chain ballantyne → south-charlotte → charlotte.
  {
    slug: "south-charlotte",
    name: "South Charlotte",
    state: "NC",
    kind: "area",
    parent: "charlotte",
    page: southCharlottePage,
  },
  {
    slug: "ballantyne",
    name: "Ballantyne",
    state: "NC",
    kind: "area",
    parent: "south-charlotte",
    page: ballantynePage,
  },
  {
    slug: "rock-hill",
    name: "Rock Hill",
    state: "SC",
    kind: "city",
    page: {
      status: "published",
      seo: {
        title: "Appliance Repair in Rock Hill, SC | Same-Day | EK Global",
        description:
          "Same-day appliance repair in Rock Hill, SC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
      },
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
  },
  {
    slug: "fort-mill",
    name: "Fort Mill",
    state: "SC",
    kind: "city",
    page: {
      status: "published",
      seo: {
        title: "Appliance Repair in Fort Mill, SC | Same-Day | EK Global",
        description:
          "Same-day appliance repair in Fort Mill, SC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
      },
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
  },
  {
    slug: "matthews",
    name: "Matthews",
    state: "NC",
    kind: "city",
    page: {
      status: "published",
      seo: {
        title: "Appliance Repair in Matthews, NC | Same-Day | EK Global",
        description:
          "Same-day appliance repair in Matthews, NC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
      },
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
  },
  {
    slug: "indian-trail",
    name: "Indian Trail",
    state: "NC",
    kind: "city",
    page: {
      status: "published",
      seo: {
        title: "Appliance Repair in Indian Trail, NC | Same-Day | EK Global",
        description:
          "Same-day appliance repair in Indian Trail, NC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
      },
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
  },
];

// Towns without a page — name/state-only Town records, kept in the SAME array so
// data/towns stays the single source; the alsoServed* exports below are derived, not a
// second copy. `slug` is set for consistency only — without `page` there is no route.
// Source: the "We also cover" (NC) and "Just across the state line" (SC) lists on towns/index.html.
const noPageTowns: Town[] = [
  // North Carolina
  ...(["Stallings", "Newell", "Harrisburg", "Allen", "Mint Hill", "Wesley Chapel", "Monroe", "Unionville", "Mineral Springs", "Pineville", "Waxhaw", "Belmont", "Marvin", "Weddington"] as const).map(
    (name): Town => ({ slug: name.toLowerCase().replace(/\s+/g, "-"), name, state: "NC", kind: "city" }),
  ),
  // South Carolina
  ...(["Catawba", "Indian Hook", "Indian Land", "Lake Wylie", "Lesslie", "Spring Valley", "Tega Cay"] as const).map(
    (name): Town => ({ slug: name.toLowerCase().replace(/\s+/g, "-"), name, state: "SC", kind: "city" }),
  ),
];

export const towns: Town[] = [...pageTowns, ...noPageTowns];

const hasRoutablePage = (t: Town): boolean => t.page !== undefined && routable(t.page);

/** The one predicate "this town/area has a published page" — lib/routes and lib/links use it too. */
export const hasPublishedPage = (t: Town): boolean => t.page !== undefined && isPublished(t.page);

/** Towns/areas with a published page, read at call time — the /towns grid, the nav. Never drafts. */
export const townsWithPublishedPage = (): Town[] => towns.filter(hasPublishedPage);
/** generateStaticParams for /towns/[slug]: published pages (+ drafts in `next dev`). */
export const townSlugs: string[] = towns.filter(hasRoutablePage).map((t) => t.slug);
/** A town only if it has a page that may be routed (published, or a draft in `next dev`). */
export const getTown = (slug: string): Town | undefined =>
  towns.find((t) => t.slug === slug && hasRoutablePage(t));

const bySlug = (slug: string | undefined): Town | undefined =>
  slug ? towns.find((t) => t.slug === slug) : undefined;

/** Every level above a town/area, root first (any status). */
function ancestorsOf(town: Town): Town[] {
  const chain: Town[] = [];
  for (let p = bySlug(town.parent); p; p = bySlug(p.parent)) chain.unshift(p);
  return chain;
}

/**
 * The published levels above a town/area, root first — a draft level is skipped (story 61):
 * ballantyne → [charlotte, south-charlotte], or [charlotte] while South Charlotte is a draft.
 * Drives the breadcrumbs (visual + JSON-LD) of /towns/[slug].
 */
export const publishedAncestors = (town: Town): Town[] => ancestorsOf(town).filter(hasPublishedPage);

/** Published areas below a town/area, broadest first: charlotte → [south-charlotte, ballantyne]. */
export const publishedDescendants = (town: Town): Town[] =>
  towns
    .filter((t) => hasPublishedPage(t) && ancestorsOf(t).includes(town))
    .sort((a, b) => ancestorsOf(a).length - ancestorsOf(b).length);

/** "Also serving" text lists on towns/index.html — derived from the cities without a page. */
export const alsoServedNC: string[] = towns
  .filter((t) => t.kind === "city" && !t.page && t.state === "NC")
  .map((t) => t.name);
export const alsoServedSC: string[] = towns
  .filter((t) => t.kind === "city" && !t.page && t.state === "SC")
  .map((t) => t.name);

// towns/index.html hero + section copy (1:1).
export const townsIndex = {
  title: "Service Area | Charlotte, NC & Surrounding Towns | EK Global",
  metaDescription:
    "EK Global covers Charlotte, NC plus about 25 surrounding towns across North and South Carolina — same-day appliance repair, $75 diagnostic waived with repair.",
  heroH1: "Charlotte, NC<br><span>&amp; the towns around it.</span>",
  heroLede:
    `${owner.name} covers Charlotte and roughly 25 surrounding towns across North and South Carolina. If you're not sure whether you're in range, just call — chances are we cover you.`,
  activeHead: {
    eyebrow: "Full local pages",
    h2: "Where we're<br>most active.",
    lede: "These towns get the most call volume, so we've written up what's actually different about each one.",
  },
  cardTag: "Full local page",
  /** Card tag of an area page, listed right under its city. */
  areaCardTag: (city: string) => `Part of ${city}`,
  alsoServingNCEyebrow: "Also serving — North Carolina",
  alsoServingNCLabel: "We also cover:",
  alsoServingSCEyebrow: "Also serving — South Carolina",
  alsoServingSCLabel: "Just across the state line:",
  alsoServingTail: ", and the towns between them.",
  cta: { h2: "Not sure if you're<br>in range?", body: "Just call — we'll tell you straight away." },
} as const;

// Section copy of the /towns/[slug] template. City pages keep the towns/*.html wording 1:1;
// area-only headings add no first-person text (spec §13) — except the block name
// "Appliances we repair in …", which is the brief's own (3.2).
export const townPageCopy = {
  h1: (place: string) => `Appliance repair<br><span>in ${place}.</span>`,
  charlottePhoto: { src: "/images/charlotte.webp", alt: "Charlotte, NC skyline" },
  townPhoto: "/images/town.webp",
  cityProseHeading: "Local, not a dispatch center",
  cityLineupEyebrow: (name: string) => `What we repair in ${name}`,
  areaLineupEyebrow: "All services",
  lineupH2: "The full lineup.",
  charlotteReviewsEyebrow: "Charlotte customers",
  reviewsEyebrow: "Local customers",
  reviewsH2: "What they say.",
  mapEyebrow: "Find us",
  mapTitle: (place: string) => `${place} map`,
  nearbyProseHeading: "Also serving nearby",
  nearbyEyebrow: "Nearby",
  nearbyH2: "Also serving.",
  notesEyebrow: (name: string) => `Appliances we repair in ${name}`,
  faqEyebrow: "FAQ",
  faqH2: (name: string) => `Asked about ${name}.`,
  relatedEyebrow: "Related areas",
  relatedH2: "Around here.",
  ctaH2: (name: string) => `Same-day repair,<br>right here in ${name}.`,
  ctaBody: "$75 diagnostic, waived if you book the repair.",
} as const;

/** Headings of one area page (local type: data/types is read-only for this module). */
export type AreaCopy = { proseHeading: string; notesH2?: string };
export const areaCopy: Record<string, AreaCopy> = {
  "south-charlotte": { proseHeading: "The south side of the city" },
  ballantyne: { proseHeading: "The owner's own neighborhood", notesH2: "Built-in and panel-ready." },
};
