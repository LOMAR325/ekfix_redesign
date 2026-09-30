// The menus of the three headers (ADR 0022; ADR 0021 for the residential groups):
//   commercial  — Equipment ⌄ · Industries ⌄ · Service Area · About · Reviews
//   residential — We Repair ⌄ · Service Area ⌄ · Brands · Guides (only with a published article) · About · Reviews
//   shared      — For Business · For Homes · Brands · Guides? · About · Reviews
// Derived data, not a source of truth: built at call time from each data module's one
// "published" entry point, so a draft never reaches a menu and publishing one `status`
// adds its item. Labels come from data/site.

import { services } from "../data/services";
import { townsWithPublishedPage } from "../data/towns";
import { commercialHubPath, publishedCommercialPages } from "../data/commercial";
import { publishedArticles } from "../data/guides";
import { branchPaths, site, type SiteVariant } from "../data/site";

const GUIDE_HUB = "/appliance-repair-guide"; // the hub has a route only with a published article

export type NavLink = { label: string; href: string };
export type NavGroup = {
  label: string;
  wide?: boolean;
  // Route prefix this group owns — drives .nav-trigger.active in the header. Without it the
  // group is active only on one of its own pages (the two commercial groups share a prefix).
  basePath?: string;
  children: NavLink[];
};
export type NavEntry = NavLink | NavGroup;

const guides = (): NavLink[] =>
  publishedArticles().length > 0 ? [{ label: site.nav.guides, href: GUIDE_HUB }] : [];
const about: NavLink = { label: site.nav.about, href: "/about" };
const reviews: NavLink = { label: site.nav.reviews, href: "/reviews" };

export function commercialNav(): NavEntry[] {
  const pages = publishedCommercialPages();
  const childLink = (p: { name: string; slug: string }): NavLink => ({
    label: p.name,
    href: `${commercialHubPath}/${p.slug}`,
  });
  return [
    {
      label: site.nav.equipment,
      children: pages.filter((p) => p.kind === "equipment").map(childLink),
    },
    {
      label: site.nav.industries,
      children: [
        ...pages.filter((p) => p.kind === "industry").map(childLink),
        { label: site.nav.hotelsLaundry, href: `${commercialHubPath}#hotels` },
      ],
    },
    { label: site.nav.serviceArea, href: branchPaths.business.serviceArea },
    about,
    reviews,
  ];
}

export function residentialNav(): NavEntry[] {
  const root = branchPaths.home.root;
  return [
    {
      label: site.nav.weRepair,
      wide: true,
      basePath: root,
      children: services.map((s) => ({ label: `${s.name} Repair`, href: `${root}/${s.slug}` })),
    },
    {
      label: site.nav.serviceArea,
      basePath: "/towns",
      // data order: Charlotte, its published areas right under it, then the other cities.
      children: [
        ...townsWithPublishedPage().map((t) => ({
          label: `${t.name}, ${t.state}`,
          href: `/towns/${t.slug}`,
        })),
        { label: site.links.allServiceTowns, href: "/towns" },
      ],
    },
    { label: site.nav.brands, href: "/brands" },
    ...guides(),
    about,
    reviews,
  ];
}

export function sharedNav(): NavEntry[] {
  return [
    { label: site.nav.forBusiness, href: branchPaths.business.root },
    { label: site.nav.forHomes, href: branchPaths.home.root },
    { label: site.nav.brands, href: "/brands" },
    ...guides(),
    about,
    reviews,
  ];
}

export function navFor(variant: SiteVariant): NavEntry[] {
  if (variant === "commercial") return commercialNav();
  if (variant === "residential") return residentialNav();
  return sharedNav();
}
