import type { CommercialPage } from "./types";
import { commercialCategories } from "./services";
import { published, routable } from "../lib/publish";

// Commercial child pages /commercial-appliance-repair/[slug] (spec §6). The 7 slugs are
// exactly the brief's list (2.2). Skeleton only: every page is a draft with empty content
// until the equipment facts are confirmed (content: ticket 03). A draft has no production
// route, no sitemap entry, no nav item and no inbound links (lib/publish).
// contactAs (story 52): industry pages preset their segment's option; equipment pages
// have no single industry, so they preset "Other Business".

/** Appliance preset for the form — reuses the existing commercialCategories.formLabel. */
function categoryFormLabel(label: string): string {
  const category = commercialCategories.find((c) => c.label === label);
  if (!category) throw new Error(`data/commercial: unknown commercial category "${label}"`);
  return category.formLabel;
}

/** A draft with empty content — ticket 03 fills it and flips `status`. */
const draftPage = (
  page: Pick<CommercialPage, "slug" | "name" | "kind" | "contactAs"> &
    Partial<Pick<CommercialPage, "segmentId" | "applianceFormLabel">>,
): CommercialPage => ({
  status: "draft",
  seo: { title: "", description: "" },
  hero: { h1: "", lede: "" },
  equipment: { types: [], brandNames: [] },
  failures: [],
  faqs: [],
  reviewAuthors: [],
  ...page,
});

export const commercialPages: CommercialPage[] = [
  draftPage({
    slug: "commercial-refrigerator-repair",
    name: "Commercial Refrigerator Repair",
    kind: "equipment",
    contactAs: "Other Business",
    applianceFormLabel: categoryFormLabel("Commercial Refrigeration"),
  }),
  draftPage({
    slug: "commercial-dishwasher-repair",
    name: "Commercial Dishwasher Repair",
    kind: "equipment",
    contactAs: "Other Business",
    applianceFormLabel: categoryFormLabel("Commercial Dishwasher/Warewasher"),
  }),
  draftPage({
    slug: "commercial-ice-machine-repair",
    name: "Commercial Ice Machine Repair",
    kind: "equipment",
    contactAs: "Other Business",
    applianceFormLabel: categoryFormLabel("Ice Machine (high-volume)"),
  }),
  draftPage({
    slug: "commercial-laundry-equipment-repair",
    name: "Commercial Laundry Equipment Repair",
    kind: "equipment",
    contactAs: "Other Business",
    applianceFormLabel: categoryFormLabel("Commercial Laundry Equipment"),
  }),
  draftPage({
    slug: "commercial-oven-range-repair",
    name: "Commercial Oven & Range Repair",
    kind: "equipment",
    contactAs: "Other Business",
    // no commercialCategories entry for ovens/ranges — no appliance preset yet
  }),
  draftPage({
    slug: "restaurant-appliance-repair",
    name: "Restaurant Appliance Repair",
    kind: "industry",
    segmentId: "horeca",
    contactAs: "Restaurant or Café",
  }),
  draftPage({
    slug: "property-management-appliance-repair",
    name: "Property Management Appliance Repair",
    kind: "industry",
    segmentId: "property-management",
    contactAs: "Property Manager",
  }),
];

/** Published child pages — sitemap, links, nav. Never drafts. */
export const publishedCommercialPages = (): CommercialPage[] => published(commercialPages);
/** generateStaticParams for /commercial-appliance-repair/[slug] (drafts only in `next dev`). */
export const commercialSlugs = (): string[] =>
  commercialPages.filter(routable).map((p) => p.slug);
/** A child page only if it may be routed (published, or a draft in `next dev`). */
export const getCommercialPage = (slug: string): CommercialPage | undefined =>
  commercialPages.find((p) => p.slug === slug && routable(p));
