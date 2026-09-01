// Main navigation structure — 1:1 with the current static site header.
// Derived data, not a source of truth: built from data/services + data/towns + static labels.

import { services } from "../data/services";
import { fullPageTowns } from "../data/towns";

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; wide?: boolean; children: NavLink[] };
export type NavEntry = NavLink | NavGroup;

const repairServices: NavLink[] = services.map((s) => ({
  label: `${s.name} Repair`,
  href: `/appliance-repair/${s.slug}`,
}));

const serviceArea: NavLink[] = [
  ...fullPageTowns.map((t) => ({
    label: `${t.name}, ${t.state}`,
    href: `/towns/${t.slug}`,
  })),
  { label: "All Service Towns →", href: "/towns" },
];

export const mainNav: NavEntry[] = [
  { label: "We Repair", wide: true, children: repairServices },
  { label: "Service Area", children: serviceArea },
  { label: "About Us", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "For Business", href: "/for-business" },
  { label: "Reviews", href: "/#reviews" },
];
