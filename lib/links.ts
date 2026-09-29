import type { ChipItem } from "../components/ui/chip-row";
import type { CommercialCategory, GuideArticle, RepairCase, Town } from "../data/types";
import { services } from "../data/services";
import { hasPublishedPage, towns } from "../data/towns";
import { commercialPages, publishedCommercialPages } from "../data/commercial";
import { publishedArticles } from "../data/guides";
import { site } from "../data/site";
import { articlePath } from "./routes";

// Cross-linking computed from data (spec story 64 / R70), rendered through ChipRow.
// Every target comes from a data module's one "published" entry point (hasPublishedPage,
// publishedCommercialPages(), publishedArticles()): a draft is never a link target, not
// even in `next dev`. Reads data at call time, so publishing = one `status` edit.

const COMMERCIAL_HUB = "/commercial-appliance-repair";

const townLink = (t: Town): ChipItem => ({ label: `${t.name}, ${t.state}`, href: `/towns/${t.slug}` });

/** Depth in the area chain: south-charlotte (→ charlotte) = 1, ballantyne = 2. */
function depth(t: Town): number {
  let d = 0;
  let parent = t.parent;
  while (parent) {
    d += 1;
    parent = towns.find((x) => x.slug === parent)?.parent;
  }
  return d;
}

/** Published areas, broadest first (South Charlotte, then Ballantyne). */
const publishedAreas = (): Town[] =>
  towns.filter((t) => t.kind === "area" && hasPublishedPage(t)).sort((a, b) => depth(a) - depth(b));

/** Home: published areas, then the cities with a page, then the /towns index. */
export function areaLinksForHome(): ChipItem[] {
  return [
    ...publishedAreas().map(townLink),
    ...towns.filter((t) => t.kind === "city" && hasPublishedPage(t)).map(townLink),
    { label: site.links.allServiceTowns, href: "/towns" },
  ];
}

/** Service page → the areas, most specific first (Ballantyne, then South Charlotte). */
export function areaLinksForService(slug: string): ChipItem[] {
  if (!services.some((s) => s.slug === slug)) return [];
  return publishedAreas().reverse().map(townLink);
}

/** Commercial child page → published areas and its published related articles. */
export function linksForCommercial(slug: string): ChipItem[] {
  if (!commercialPages.some((p) => p.slug === slug)) return [];
  return [
    ...publishedAreas().map(townLink),
    ...publishedArticles()
      .filter((a) => a.serviceSlug === slug)
      .map((a) => ({ label: a.title, href: articlePath(a.slug) })),
  ];
}

/** A residential service page, a published commercial page, or the commercial hub. */
function serviceLink(slug: string): ChipItem[] {
  const service = services.find((s) => s.slug === slug);
  if (service) return [{ label: `${service.name} Repair`, href: `/appliance-repair/${slug}` }];
  if (!commercialPages.some((p) => p.slug === slug)) return [];
  const page = publishedCommercialPages().find((p) => p.slug === slug);
  return page
    ? [{ label: page.name, href: `${COMMERCIAL_HUB}/${page.slug}` }]
    : [{ label: site.links.commercialHub, href: COMMERCIAL_HUB }];
}

export const serviceLinkForArticle = (a: GuideArticle): ChipItem[] => serviceLink(a.serviceSlug);
export const serviceLinkForCase = (c: RepairCase): ChipItem[] => serviceLink(c.serviceSlug);

/**
 * Home commercial card → the published child page for that category (matched by the
 * form preset), otherwise the category's old hub anchor on the new hub path.
 */
export function commercialCardHref(category: CommercialCategory): string {
  const child = publishedCommercialPages().find(
    (p) => p.applianceFormLabel === category.formLabel,
  );
  if (child) return `${COMMERCIAL_HUB}/${child.slug}`;
  const anchor = category.href.split("#")[1];
  return anchor ? `${COMMERCIAL_HUB}#${anchor}` : COMMERCIAL_HUB;
}
