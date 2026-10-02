import type { ChipItem } from "../components/ui/chip-row";
import type { ServedArea } from "../lib/jsonld";
import { business } from "./business";
import { owner } from "./people";
import { getTown } from "./towns";
import { branchPaths } from "./site";
import { areaLinksForHome } from "../lib/links";

// The residential home /appliance-repair (ADR 0022): the household half of the former `/`
// plus the former residential hub. Copy ported from the former home page is kept verbatim
// (first person included); new copy is impersonal and built from facts already on the site.
// Sections: hero → #repair → #family → #pricing → #reviews → #brands → #areas → [#guides] →
// #faq → #book.

export const residentialHome = {
  seo: {
    title: `Home Appliance Repair in Charlotte, NC | Same-Day | ${business.name}`,
    description:
      "Same-day home appliance repair in Charlotte, NC and the surrounding towns: refrigerators, washers, dryers, dishwashers, stoves and more. Family-owned, EPA 608 & OSHA certified, $75 diagnostic waived with the repair.",
  },
  hero: {
    eyebrow: "We fix it. You enjoy it.",
    h1: "Home appliance repair<br><span>in Charlotte.</span>",
    lede: "For homeowners across Charlotte and the towns around it — diagnosed on the spot, fixed with manufacturer-approved parts, most jobs finished in one visit.",
    bookLabel: "Book a Repair",
    callLabel: `Call ${business.phone}`,
    trust: ["Same-Day Service", "Warranty on All Repairs", "$75 Diagnostic — Waived With Repair"],
  },
  repair: {
    eyebrow: "Home appliances",
    h2: "We get to<br>the core problem.",
    lede: "Diagnosed on the spot, fixed with original manufacturer-approved parts. Free estimate before any work begins.",
    tag: "Repair · Faults & FAQ",
    notListed: {
      lead: "Not on the list?",
      text: "We service most major appliances —",
      link: "just call us",
    },
  },
  family: {
    eyebrow: "Who we are",
    h2: "A family business,<br>not a call center.",
    paragraphs: [
      `${business.name} is run by ${owner.name} and his family, right here in Charlotte. You talk to the person who does the repair — no ticket numbers, no dispatch queue. We show up at neighborhood fairs, and we see our customers again at the grocery store. That's the reason we do every job properly the first time.`,
    ],
    stats: [
      { icon: "shield", k: "Certified", v: "EPA 608 & OSHA" },
      { icon: "medal", k: "Warranty", v: "On every repair" },
      { icon: "umbrella", k: "Insured", v: "Fully covered" },
      { icon: "tag", k: "Discounts", v: "Veterans & seniors" },
    ],
    bookLabel: "Book a Repair",
    talkLabel: `Talk to ${owner.name}`,
    // the owner's published first-person quote — kept verbatim
    quote:
      "I answer the phone, I do the diagnostic, and I'm the one who comes back if something isn't right. That's the whole promise.",
    quoteCredit: "Owner · EPA 608 & OSHA certified",
  },
  pricing: {
    eyebrow: "Pricing",
    h2: "What a repair<br>costs to start.",
    items: [
      {
        num: "$75",
        title: "Diagnostic",
        body: "Finding the fault and a plain-language explanation of what is wrong. Waived completely when the repair goes ahead.",
      },
      {
        num: "10%",
        title: "Off online bookings",
        body: "Booking online instead of calling takes 10% off. Veterans, seniors, and families with kids get a discount too.",
      },
      {
        num: "Quote",
        title: "Before any work",
        body: "The repair price depends on the part and the brand, and it is quoted before any work begins.",
      },
    ],
  },
  reviews: {
    eyebrow: "Reviews",
    h2: "What homeowners<br>say.",
    allReviews: "All reviews →",
    /** while no Google reviews are live (lib/google-reviews) */
    onGoogle: "The reviews are on Google — read them there, or leave one after a repair.",
  },
  brands: {
    eyebrow: "Brands",
    h2: "Everyday to<br>high-end.",
    lede: "Residential and premium kitchen brands — from Whirlpool and GE to Sub-Zero and Thermador.",
    seeAll: "See all brands we service →",
  },
  areas: {
    eyebrow: "Where we work",
    h2: "Charlotte, Ballantyne,<br>and nearby towns.",
  },
  guides: { eyebrow: "Guides", h2: "Repair guides." },
  faq: {
    eyebrow: "FAQ",
    h2: "Home repair,<br>answered.",
    items: [
      {
        q: "How soon can a technician come out?",
        a: "Same-day slots are available daily, 8AM – 8PM, weekends included. When no same-day slot is open, a technician is usually out within 24–48 hours, and most repairs are finished in one visit.",
      },
      {
        q: "How much is the diagnostic?",
        a: "A flat $75. It covers finding the fault and a plain-language explanation of what is wrong, and it is waived when the repair goes ahead.",
      },
      {
        q: "Is the repair price known before the work?",
        a: "Yes. The price depends on the part and the brand, and it is quoted before any work begins.",
      },
      {
        q: "What warranty comes with a repair?",
        a: "Every repair carries a warranty on both the part and the labor. If the same issue comes back, the technician comes back.",
      },
      {
        q: "Is there a discount for booking online?",
        a: "Yes — 10% off when the repair is booked online instead of by phone. Veterans, seniors, and families with kids get a discount as well.",
      },
    ],
  },
  book: {
    eyebrow: "Book",
    h2: "Back to what<br>matters most.",
    body: "We handle the repair. You enjoy your day. Book online and save 10% — or call and talk to us directly.",
    facts: [
      { k: "$75", v: "Diagnostic fee — waived completely if you proceed with the repair." },
      { k: "10%", v: "Off when you book online instead of calling." },
      { k: "Same day", v: "Slots available daily, 8AM – 8PM, weekends included." },
    ],
  },
  path: branchPaths.home.root,
} as const;

export type FamilyStatIcon = (typeof residentialHome.family.stats)[number]["icon"];

/**
 * "Where we work" (#areas) and the residential home's `areaServed`: one list, so the JSON-LD
 * names exactly the places the page links to.
 */
export function homeWhereWeWork(): { chips: ChipItem[]; areaServed: ServedArea[] } {
  const chips = areaLinksForHome();
  const areaServed = chips.flatMap((chip): ServedArea[] => {
    if (typeof chip === "string" || !chip.href?.startsWith("/towns/")) return [];
    const town = getTown(chip.href.slice("/towns/".length));
    return town ? [{ name: chip.label, kind: town.kind }] : [];
  });
  return { chips, areaServed };
}
