import { business } from "./business";
import { owner } from "./people";
import { services } from "./services";
import { branchPaths } from "./site";
import { commercialHubPath, publishedCommercialPages } from "./commercial";

// The entry page `/` (ADR 0022): one H1 and two panels, business first. Links are plain <a>s to
// the branches — no redirect, no JS gate. Panel links come from data: a commercial page
// appears only while it is published.

export type EntryLink = { label: string; href: string };
export type EntryPanel = {
  branch: "business" | "home";
  eyebrow: string;
  h2: string;
  text: string;
  cta: EntryLink;
  links: EntryLink[];
  photo: { src: string; alt: string };
};

/** Short panel labels of the commercial pages the business panel links to, in this order. */
const BUSINESS_LINKS: [slug: string, label: string][] = [
  ["commercial-refrigerator-repair", "Commercial refrigeration"],
  ["commercial-dishwasher-repair", "Dish machines"],
  ["commercial-ice-machine-repair", "Ice machines"],
  ["restaurant-appliance-repair", "Restaurants"],
  ["property-management-appliance-repair", "Property management"],
];
/** The residential services the home panel links to — the most requested kinds. */
const HOME_LINKS = ["refrigerator", "washer", "dryer", "dishwasher", "stove"];

export const entryPage = {
  seo: {
    title: `${business.name} — Commercial & Home Appliance Repair in Charlotte, NC`,
    description:
      "Appliance repair in Charlotte, NC for businesses — restaurants, property managers, hotels, laundry — and for homes. Choose commercial service or home appliance repair. EPA 608 & OSHA certified.",
  },
  h1: "Appliance repair in <span>Charlotte, NC</span>",
  linksLabel: "Go straight to",
};

export function entryPanels(): EntryPanel[] {
  const live = publishedCommercialPages();
  return [
    {
      branch: "business",
      eyebrow: "For business",
      h2: "Restaurants, properties,<br>hotels, laundry.",
      text: "Commercial refrigeration, dish machines, ice machines, laundry and cooking equipment — written estimates, photo reports and invoicing for the business.",
      cta: { label: "Commercial Service", href: branchPaths.business.root },
      links: BUSINESS_LINKS.flatMap(([slug, label]) =>
        live.some((p) => p.slug === slug) ? [{ label, href: `${commercialHubPath}/${slug}` }] : [],
      ),
      // generated after the owner, from docs/photos/prompts.md (2026-10-03)
      photo: {
        src: "/images/entry-business-technician.webp",
        alt: "Technician checking a commercial refrigerator with refrigerant gauges in a restaurant kitchen",
      },
    },
    {
      branch: "home",
      eyebrow: "For homes",
      h2: "Your kitchen<br>and laundry room.",
      text: "Refrigerators, washers, dryers, dishwashers, stoves and more — same-day slots and a warranty on every repair.",
      cta: { label: "Home Appliance Repair", href: branchPaths.home.root },
      links: HOME_LINKS.flatMap((slug) => {
        const s = services.find((x) => x.slug === slug);
        return s ? [{ label: s.name, href: `${branchPaths.home.root}/${s.slug}` }] : [];
      }),
      photo: owner.photos.hero,
    },
  ];
}
