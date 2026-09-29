import { describe, expect, it } from "vitest";
import type { GuideArticle, Publishable } from "@/data/types";
import { towns } from "@/data/towns";
import { commercialPages } from "@/data/commercial";
import { articles } from "@/data/guides";
import { cases } from "@/data/cases";
import { mainNav, type NavEntry } from "@/lib/nav";

// Seam 5 (spec «Границы и швы» #5, stories 48–50, 78): the menu order is the brief's,
// no draft ever reaches a dropdown, and "Guides" exists only with a published article.
// Every assertion sets its own statuses (scenario) and restores them. Expected labels and
// paths are literals from the brief / spec §8, not recomputed from data.

/** Every publishable unit in data/ is set: `live` → published, the rest → draft; then restored. */
function scenario(live: Publishable[], run: () => void) {
  const all: Publishable[] = [
    ...towns.flatMap((t) => (t.page ? [t.page] : [])),
    ...commercialPages,
    ...articles,
    ...cases,
  ];
  const before = all.map((x) => x.status);
  all.forEach((x) => (x.status = live.includes(x) ? "published" : "draft"));
  try {
    run();
  } finally {
    all.forEach((x, i) => (x.status = before[i]));
  }
}

const cityPages = (): Publishable[] =>
  towns.filter((t) => t.kind === "city" && t.page).map((t) => t.page!);
const top = (nav: NavEntry[]) => nav.map((e) => ("children" in e ? `${e.label} ⌄` : `${e.label} ${e.href}`));
const group = (nav: NavEntry[], label: string) => {
  const g = nav.find((e) => e.label === label);
  if (!g || !("children" in g)) throw new Error(`no group ${label}`);
  return g;
};

describe("mainNav — order and fixed items", () => {
  it("brief order; no Guides with zero published articles; Reviews → /reviews", () => {
    scenario(cityPages(), () => {
      expect(top(mainNav())).toEqual([
        "Commercial ⌄",
        "Home Appliances ⌄",
        "Service Area ⌄",
        "About /about",
        "Reviews /reviews",
      ]);
    });
  });

  it("group base paths; Home Appliances = hub + the 12 services", () => {
    const nav = mainNav();
    expect(group(nav, "Commercial").basePath).toBe("/commercial-appliance-repair");
    expect(group(nav, "Home Appliances").basePath).toBe("/appliance-repair");
    expect(group(nav, "Service Area").basePath).toBe("/towns");
    const home = group(nav, "Home Appliances").children.map((c) => c.href);
    expect(home).toEqual([
      "/appliance-repair",
      "/appliance-repair/refrigerator",
      "/appliance-repair/washer",
      "/appliance-repair/dryer",
      "/appliance-repair/dishwasher",
      "/appliance-repair/stove",
      "/appliance-repair/range",
      "/appliance-repair/cooktop",
      "/appliance-repair/microwave",
      "/appliance-repair/freezer",
      "/appliance-repair/ice-maker",
      "/appliance-repair/wine-cooler",
      "/appliance-repair/garbage-disposal",
    ]);
  });
});

describe("mainNav — drafts and Guides", () => {
  const commercial = (slug: string) => commercialPages.find((p) => p.slug === slug)!;
  const townPage = (slug: string) => towns.find((t) => t.slug === slug)!.page!;
  const article = (): GuideArticle => articles[0]!;

  it("everything draft: Commercial = hub only, Service Area = cities + All Service Towns", () => {
    scenario(cityPages(), () => {
      const nav = mainNav();
      expect(group(nav, "Commercial").children.map((c) => c.href)).toEqual([
        "/commercial-appliance-repair",
      ]);
      expect(group(nav, "Service Area").children.map((c) => c.href)).toEqual([
        "/towns/charlotte",
        "/towns/rock-hill",
        "/towns/fort-mill",
        "/towns/matthews",
        "/towns/indian-trail",
        "/towns",
      ]);
    });
  });

  it("one published child / area appears, the draft ones do not", () => {
    const live = [
      ...cityPages(),
      commercial("restaurant-appliance-repair"),
      townPage("ballantyne"),
    ];
    scenario(live, () => {
      const nav = mainNav();
      expect(group(nav, "Commercial").children.map((c) => c.href)).toEqual([
        "/commercial-appliance-repair",
        "/commercial-appliance-repair/restaurant-appliance-repair",
      ]);
      expect(group(nav, "Service Area").children.map((c) => c.href)).toEqual([
        "/towns/charlotte",
        "/towns/ballantyne",
        "/towns/rock-hill",
        "/towns/fort-mill",
        "/towns/matthews",
        "/towns/indian-trail",
        "/towns",
      ]);
    });
  });

  it("Guides appears after Service Area with the first published article", () => {
    scenario([...cityPages(), article()], () => {
      expect(top(mainNav())).toEqual([
        "Commercial ⌄",
        "Home Appliances ⌄",
        "Service Area ⌄",
        "Guides /appliance-repair-guide",
        "About /about",
        "Reviews /reviews",
      ]);
    });
  });
});
