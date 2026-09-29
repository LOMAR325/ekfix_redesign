import type { ChipItem } from "../components/ui/chip-row";
import type { ServedArea } from "../lib/jsonld";
import { business } from "./business";
import { owner } from "./people";
import { getTown } from "./towns";
import { commercialHubPath, publishedCommercialPages } from "./commercial";
import { familyBusinessSentence, whoWeServe, type WhoWeServeCard } from "./b2b-segments";
import { areaLinksForHome } from "../lib/links";

// Home page (/) copy and the two home-only link lists (spec §7, story 43a). The hero,
// #who-we-serve, #trust-b2b and #business-cta microcopy stays in data/b2b-segments
// (spec §7 names `homeHero` there); everything else the home page shows is here.
// Section order: hero → who-we-serve → commercial equipment → trust → home appliances →
// family (+ "Where we work") → reviews → brands → business CTA → book. The eyebrow
// numbers follow that order.

export const home = {
  seo: {
    title: `${business.name} — Same-Day Appliance Repair in Charlotte, NC`,
    description:
      "Family-owned appliance repair in Charlotte, NC and surrounding towns. EPA 608 & OSHA certified technicians, same-day service, $75 diagnostic waived with repair.",
  },
  heroTrust: [
    "Same-Day Service",
    "Warranty on All Repairs",
    "$75 Diagnostic — Waived With Repair",
  ],
  // New section (story 43): the 4 commercial categories, before the home grid.
  commercialEquipment: {
    eyebrow: "02 / Commercial equipment",
    h2: "Commercial equipment,<br>kept running.",
    lede: "Refrigeration, dish machines, on-premise laundry, and high-volume ice machines for restaurants, hotels, and managed properties.",
    tag: "Commercial · See services",
  },
  repair: {
    eyebrow: "03 / Home appliances",
    h2: "We get to<br>the core problem.",
    lede: "Diagnosed on the spot, fixed with original manufacturer-approved parts. Free estimate before any work begins.",
    tag: "Repair · Book online",
    notListed: {
      lead: "Not on the list?",
      text: "We service most major and commercial appliances —",
      link: "just call us",
    },
  },
  family: {
    eyebrow: "04 / Who we are",
    h2: "A family business,<br>not a call center.",
    paragraphs: [
      `${business.name} is run by ${owner.name} and his family, right here in Charlotte. You talk to the person who does the repair — no ticket numbers, no dispatch queue. We show up at neighborhood fairs, and we see our customers again at the grocery store. That's the reason we do every job properly the first time.`,
      familyBusinessSentence,
    ],
    stats: [
      { icon: "shield", k: "Certified", v: "EPA 608 & OSHA" },
      { icon: "medal", k: "Warranty", v: "On every repair" },
      { icon: "umbrella", k: "Insured", v: "Fully covered" },
      { icon: "tag", k: "Discounts", v: "Veterans & seniors" },
    ],
    // story 43a — the published areas and towns, then the /towns index
    whereWeWork: "Where we work",
    bookLabel: "Book a Repair",
    talkLabel: `Talk to ${owner.name}`,
    // the owner's published first-person quote — kept verbatim (spec §13)
    quote:
      "I answer the phone, I do the diagnostic, and I'm the one who comes back if something isn't right. That's the whole promise.",
    quoteCredit: "Owner · EPA 608 & OSHA certified",
    photoCaptions: {
      restaurantKitchen: "On a service call — restaurant kitchen",
      rooftopLaundry: "Commercial laundry repair",
    },
  },
  reviews: { eyebrow: "05 / Reviews", h2: "What our<br>customers say." },
  brands: {
    eyebrow: "06 / Brands",
    h2: "Brands serviced.",
    seeAll: "See all brands we service →",
  },
  book: {
    eyebrow: "07 / Book",
    h2: "Back to what<br>matters most.",
    body: "We handle the repair. You enjoy your day. Book online and save 10% — or call and talk to us directly.",
    facts: [
      { k: "$75", v: "Diagnostic fee — waived completely if you proceed with the repair." },
      { k: "10%", v: "Off when you book online instead of calling." },
      { k: "Same day", v: "Slots available daily, 8AM – 8PM, weekends included." },
    ],
  },
} as const;

export type FamilyStatIcon = (typeof home.family.stats)[number]["icon"];

/**
 * #who-we-serve cards: a business card with a `segmentId` links to that segment's
 * published industry page, otherwise to its anchor on the commercial hub.
 */
export function whoWeServeCards(): WhoWeServeCard[] {
  const industryPages = publishedCommercialPages().filter((p) => p.kind === "industry");
  return whoWeServe.map((card) => {
    const page = card.segmentId && industryPages.find((p) => p.segmentId === card.segmentId);
    return page ? { ...card, href: `${commercialHubPath}/${page.slug}` } : card;
  });
}

/**
 * "Where we work" in #family (story 43a) and the home page's `areaServed`: one list, so
 * the JSON-LD names exactly the places the page links to.
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
