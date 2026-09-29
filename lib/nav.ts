// Main navigation (spec §8, stories 48–50, 78): Commercial ⌄ · Home Appliances ⌄ ·
// Service Area ⌄ · Guides (only with a published article) · About · Reviews.
// Derived data, not a source of truth: built at call time from each data module's one
// "published" entry point, so a draft never reaches the menu and publishing one `status`
// adds its item. Labels come from data/site.

import { applianceRepairHub, services } from "../data/services";
import { townsWithPublishedPage } from "../data/towns";
import { commercialHubPath, publishedCommercialPages } from "../data/commercial";
import { publishedArticles } from "../data/guides";
import { site } from "../data/site";

const GUIDE_HUB = "/appliance-repair-guide"; // the hub has a route only with a published article

export type NavLink = { label: string; href: string };
export type NavGroup = {
  label: string;
  wide?: boolean;
  // Route prefix this group owns — drives .nav-trigger.active in Header.
  basePath: string;
  children: NavLink[];
};
export type NavEntry = NavLink | NavGroup;

export function mainNav(): NavEntry[] {
  return [
    {
      label: site.nav.commercial,
      basePath: commercialHubPath,
      children: [
        { label: site.links.commercialHub, href: commercialHubPath },
        ...publishedCommercialPages().map((p) => ({
          label: p.name,
          href: `${commercialHubPath}/${p.slug}`,
        })),
      ],
    },
    {
      label: site.nav.homeAppliances,
      wide: true,
      basePath: applianceRepairHub.path,
      children: [
        { label: applianceRepairHub.name, href: applianceRepairHub.path },
        ...services.map((s) => ({
          label: `${s.name} Repair`,
          href: `${applianceRepairHub.path}/${s.slug}`,
        })),
      ],
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
    ...(publishedArticles().length > 0 ? [{ label: site.nav.guides, href: GUIDE_HUB }] : []),
    { label: site.nav.about, href: "/about" },
    { label: site.nav.reviews, href: "/reviews" },
  ];
}
