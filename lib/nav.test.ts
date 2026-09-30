import { describe, expect, it } from "vitest";
import type { GuideArticle, Publishable } from "@/data/types";
import { towns } from "@/data/towns";
import { commercialPages } from "@/data/commercial";
import { articles } from "@/data/guides";
import { cases } from "@/data/cases";
import { commercialNav, residentialNav, sharedNav, type NavEntry } from "@/lib/nav";

// Seam 5 (ADR 0021, 0022): the three headers' menus in the brief's order, no draft ever reaches a
// dropdown, and "Guides" exists only with a published article. Every assertion sets its own
// statuses (scenario) and restores them. Expected labels and paths are literals from the brief.

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
const commercial = (slug: string) => commercialPages.find((p) => p.slug === slug)!;
const townPage = (slug: string) => towns.find((t) => t.slug === slug)!.page!;
const article = (): GuideArticle => articles[0]!;
const top = (nav: NavEntry[]) => nav.map((e) => ("children" in e ? `${e.label} ⌄` : `${e.label} ${e.href}`));
const hrefs = (nav: NavEntry[], label: string) => {
  const g = nav.find((e) => e.label === label);
  if (!g || !("children" in g)) throw new Error(`no group ${label}`);
  return g.children.map((c) => c.href);
};

describe("commercialNav", () => {
  it("Equipment ⌄ · Industries ⌄ · Service Area · About · Reviews", () => {
    expect(top(commercialNav())).toEqual([
      "Equipment ⌄",
      "Industries ⌄",
      "Service Area /commercial-appliance-repair#service-area",
      "About /about",
      "Reviews /reviews",
    ]);
  });

  it("the groups list published pages only; Hotels & Laundry is the home's #hotels anchor", () => {
    scenario([commercial("commercial-dishwasher-repair"), commercial("restaurant-appliance-repair")], () => {
      const nav = commercialNav();
      expect(hrefs(nav, "Equipment")).toEqual(["/commercial-appliance-repair/commercial-dishwasher-repair"]);
      expect(hrefs(nav, "Industries")).toEqual([
        "/commercial-appliance-repair/restaurant-appliance-repair",
        "/commercial-appliance-repair#hotels",
      ]);
    });
    scenario([], () => {
      expect(hrefs(commercialNav(), "Equipment")).toEqual([]);
      expect(hrefs(commercialNav(), "Industries")).toEqual(["/commercial-appliance-repair#hotels"]);
    });
  });
});

describe("residentialNav", () => {
  it("We Repair ⌄ · Service Area ⌄ · Brands · About · Reviews; We Repair = the 12 services", () => {
    scenario(cityPages(), () => {
      const nav = residentialNav();
      expect(top(nav)).toEqual(["We Repair ⌄", "Service Area ⌄", "Brands /brands", "About /about", "Reviews /reviews"]);
      expect(hrefs(nav, "We Repair")).toEqual([
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

  it("Service Area: published towns and areas only, then All Service Towns", () => {
    scenario(cityPages(), () => {
      expect(hrefs(residentialNav(), "Service Area")).toEqual([
        "/towns/charlotte",
        "/towns/rock-hill",
        "/towns/fort-mill",
        "/towns/matthews",
        "/towns/indian-trail",
        "/towns",
      ]);
    });
    scenario([...cityPages(), townPage("ballantyne")], () => {
      expect(hrefs(residentialNav(), "Service Area")).toEqual([
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

  it("Guides appears after Brands with the first published article — in both menus that have it", () => {
    scenario([...cityPages(), article()], () => {
      expect(top(residentialNav())).toEqual([
        "We Repair ⌄",
        "Service Area ⌄",
        "Brands /brands",
        "Guides /appliance-repair-guide",
        "About /about",
        "Reviews /reviews",
      ]);
      expect(top(sharedNav())).toContain("Guides /appliance-repair-guide");
    });
  });
});

describe("sharedNav", () => {
  it("links to both branches first", () => {
    scenario(cityPages(), () => {
      expect(top(sharedNav())).toEqual([
        "For Business /commercial-appliance-repair",
        "For Homes /appliance-repair",
        "Brands /brands",
        "About /about",
        "Reviews /reviews",
      ]);
    });
  });
});
