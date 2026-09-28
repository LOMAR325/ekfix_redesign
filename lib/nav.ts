// Main navigation structure — 1:1 with the current static site header.
// Derived data, not a source of truth: built from data/services + data/towns + static labels.

import { services } from "../data/services";
import { townsWithPublishedPage } from "../data/towns";
import { site } from "../data/site";

export type NavLink = { label: string; href: string };
export type NavGroup = {
  label: string;
  wide?: boolean;
  // Route prefix this group owns — drives .nav-trigger.active in Header.
  basePath: string;
  children: NavLink[];
};
export type NavEntry = NavLink | NavGroup;

const repairServices: NavLink[] = services.map((s) => ({
  label: `${s.name} Repair`,
  href: `/appliance-repair/${s.slug}`,
}));

const serviceArea: NavLink[] = [
  ...townsWithPublishedPage().map((t) => ({
    label: `${t.name}, ${t.state}`,
    href: `/towns/${t.slug}`,
  })),
  { label: site.links.allServiceTowns, href: "/towns" },
];

export const mainNav: NavEntry[] = [
  {
    label: "We Repair",
    wide: true,
    basePath: "/appliance-repair",
    children: repairServices,
  },
  { label: "Service Area", basePath: "/towns", children: serviceArea },
  { label: "About Us", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "For Business", href: "/for-business" },
  { label: "Reviews", href: "/#reviews" },
];
