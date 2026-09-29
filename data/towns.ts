import type { Town } from "./types";
import { owner } from "./people";
import { isPublished, routable } from "../lib/publish";

// Service-area towns and areas. A town/area has a route only if it carries `page`, and in
// production only if `page.status === "published"` (lib/publish). The 5 city pages carry
// content verbatim from towns/*.html (incl. the per-page <title>/<meta>). The rest are
// name/state-only records used for the text lists on /towns (alsoServedNC / alsoServedSC
// below). hasMap is true only for Charlotte.
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
        description:
          "Same-day appliance repair in Charlotte, NC — Ballantyne, Dilworth, SouthPark, South End, Myers Park & NoDa. EPA 608 & OSHA certified, warranty on every repair.",
      },
      hasMap: true,
      hero: {
        lede: `${owner.name} lives in the Ballantyne area and works across Charlotte daily — from historic bungalows in Dilworth to new builds in SouthPark and South End. Same-day slots, most repairs finished in one visit.`,
      },
      prose: [
        `EK Global is based right here in Charlotte — ${owner.name} lives in the Ballantyne area and personally handles appliance calls across the metro, not a rotating cast of subcontractors. That matters more than it sounds: a technician who works this market every week knows that <strong>older homes around Dilworth and Plaza Midwood</strong> often carry appliances 10–15+ years old with parts that need sourcing ahead of the visit, while newer construction near <strong>SouthPark, Ballantyne, and South End</strong> is heavier on built-in and panel-ready units from Sub-Zero, Thermador, Bosch, and KitchenAid — which need different tools and a different diagnostic approach entirely.`,
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
  // Areas inside Charlotte (spec §3): same /towns/[slug] route, parent chain
  // ballantyne → south-charlotte → charlotte. Drafts until the facts for their content
  // are confirmed (content: ticket 05) — no production route, sitemap, nav or links.
  {
    slug: "south-charlotte",
    name: "South Charlotte",
    state: "NC",
    kind: "area",
    parent: "charlotte",
    page: {
      status: "draft",
      seo: { title: "Appliance Repair in South Charlotte, NC | EK Global", description: "" },
      hero: { lede: "" },
      prose: [],
    },
  },
  {
    slug: "ballantyne",
    name: "Ballantyne",
    state: "NC",
    kind: "area",
    parent: "south-charlotte",
    page: {
      status: "draft",
      seo: { title: "Appliance Repair in Ballantyne, NC | EK Global", description: "" },
      hero: { lede: "" },
      prose: [],
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
  activeHead: { h2: "Where we're<br>most active.", lede: "These towns get the most call volume, so we've written up what's actually different about each one." },
  alsoServingNCLabel: "We also cover:",
  alsoServingSCLabel: "Just across the state line:",
} as const;
