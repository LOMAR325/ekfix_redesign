import { describe, expect, it } from "vitest";
import type { Publishable } from "@/data/types";
import { commercialPages } from "@/data/commercial";
import { towns } from "@/data/towns";
import { homeWhereWeWork, whoWeServeCards } from "@/data/home";

// Seam 5 (spec «Границы и швы» #5): home links never point at a draft; publishing one
// `status` switches the link. Each test sets the statuses it depends on and restores them.

/** `live` → published, every other unit in `all` → draft; restored afterwards. */
function withLive(all: Publishable[], live: Publishable[], run: () => void) {
  const saved = all.map((x) => x.status);
  all.forEach((x) => (x.status = live.includes(x) ? "published" : "draft"));
  try {
    run();
  } finally {
    all.forEach((x, i) => (x.status = saved[i]));
  }
}

const page = (slug: string) => commercialPages.find((p) => p.slug === slug)!;
const hrefOf = (title: string) => whoWeServeCards().find((c) => c.title === title)!.href;

describe("home #who-we-serve", () => {
  it("business cards link to the published industry page, else to the hub anchor", () => {
    withLive(commercialPages, [page("restaurant-appliance-repair")], () => {
      expect(hrefOf("Restaurants & Commercial Kitchens")).toBe(
        "/commercial-appliance-repair/restaurant-appliance-repair",
      );
      expect(hrefOf("Property Management & Multifamily")).toBe(
        "/commercial-appliance-repair#property-management",
      );
      expect(hrefOf("Hotels & Multifamily Laundry")).toBe("/commercial-appliance-repair#laundry");
      expect(hrefOf("Homeowners")).toBe("/appliance-repair");
    });
    withLive(commercialPages, [page("property-management-appliance-repair")], () => {
      expect(hrefOf("Property Management & Multifamily")).toBe(
        "/commercial-appliance-repair/property-management-appliance-repair",
      );
      expect(hrefOf("Restaurants & Commercial Kitchens")).toBe("/commercial-appliance-repair#horeca");
    });
  });
});

const townPages = towns.filter((t) => t.page).map((t) => t.page!);
const townPage = (slug: string) => towns.find((t) => t.slug === slug)!.page!;
const cityPages = towns.filter((t) => t.kind === "city" && t.page).map((t) => t.page!);

describe("home \"Where we work\" and areaServed", () => {
  it("areaServed is exactly the town chips of the block; a draft area is in neither", () => {
    withLive(townPages, [...cityPages, townPage("ballantyne")], () => {
      const { chips, areaServed } = homeWhereWeWork();
      const townChips = chips.flatMap((c) =>
        typeof c !== "string" && c.href?.startsWith("/towns/") ? [c.label] : [],
      );
      expect(areaServed).toEqual([
        { name: "Ballantyne, NC", kind: "area" },
        ...townChips.slice(1).map((name) => ({ name, kind: "city" })),
      ]);
      expect(townChips).toHaveLength(6); // Ballantyne + the 5 cities with a page
      expect(townChips).not.toContain("South Charlotte, NC");
      expect(chips.at(-1)).toMatchObject({ href: "/towns" });
    });
    withLive(townPages, [...cityPages, townPage("south-charlotte"), townPage("ballantyne")], () => {
      expect(homeWhereWeWork().areaServed.slice(0, 3)).toEqual([
        { name: "South Charlotte, NC", kind: "area" },
        { name: "Ballantyne, NC", kind: "area" },
        { name: "Charlotte, NC", kind: "city" },
      ]);
    });
  });
});
