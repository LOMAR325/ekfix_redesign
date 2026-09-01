// Main navigation structure — 1:1 with the current static site header.
// Derived data, not a source of truth.
//
// TODO таск 02: брать список услуг из data/services и города из data/towns
// (пока data/services / data/towns не существуют — захардкожено здесь).

export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; wide?: boolean; children: NavLink[] };
export type NavEntry = NavLink | NavGroup;

const repairServices: NavLink[] = [
  { label: "Refrigerator Repair", href: "/appliance-repair/refrigerator" },
  { label: "Washer Repair", href: "/appliance-repair/washer" },
  { label: "Dryer Repair", href: "/appliance-repair/dryer" },
  { label: "Dishwasher Repair", href: "/appliance-repair/dishwasher" },
  { label: "Stove Repair", href: "/appliance-repair/stove" },
  { label: "Range Repair", href: "/appliance-repair/range" },
  { label: "Cooktop Repair", href: "/appliance-repair/cooktop" },
  { label: "Microwave Repair", href: "/appliance-repair/microwave" },
  { label: "Freezer Repair", href: "/appliance-repair/freezer" },
  { label: "Ice Maker Repair", href: "/appliance-repair/ice-maker" },
  { label: "Wine Cooler Repair", href: "/appliance-repair/wine-cooler" },
  { label: "Garbage Disposal Repair", href: "/appliance-repair/garbage-disposal" },
];

const serviceArea: NavLink[] = [
  { label: "Charlotte, NC", href: "/towns/charlotte" },
  { label: "Rock Hill, SC", href: "/towns/rock-hill" },
  { label: "Fort Mill, SC", href: "/towns/fort-mill" },
  { label: "Matthews, NC", href: "/towns/matthews" },
  { label: "Indian Trail, NC", href: "/towns/indian-trail" },
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
