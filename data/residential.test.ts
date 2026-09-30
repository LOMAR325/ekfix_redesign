import { describe, expect, it } from "vitest";
import type { Publishable } from "@/data/types";
import { towns } from "@/data/towns";
import { homeWhereWeWork } from "@/data/residential";

// Seam 5 (ADR 0022): the residential home's #areas links never point at a draft, and its
// JSON-LD areaServed names exactly those places. Each test sets its statuses and restores them.

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

const townPages = towns.filter((t) => t.page).map((t) => t.page!);
const townPage = (slug: string) => towns.find((t) => t.slug === slug)!.page!;
const cityPages = towns.filter((t) => t.kind === "city" && t.page).map((t) => t.page!);

describe("residential #areas and areaServed", () => {
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
