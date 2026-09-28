import { describe, expect, it } from "vitest";
import type { GuideArticle, Publishable, RepairCase } from "@/data/types";
import { services } from "@/data/services";
import { towns } from "@/data/towns";
import { commercialPages } from "@/data/commercial";
import { articles } from "@/data/guides";
import { cases } from "@/data/cases";
import { publishedPaths } from "@/lib/routes";
import sitemap from "@/app/sitemap";

// Seam 2 (spec «Границы и швы» #2, story 79): the sitemap is exactly publishedPaths(),
// no draft ever gets in, and flipping one `status` in data/ adds/removes the path.
// Every status-sensitive assertion sets its own statuses (scenario) and restores them,
// so the suite stays green whatever `status` values data/ currently carries.
// Expected paths are literals from the spec (§5) and the brief, not recomputed.

const STATIC_PATHS = [
  "/",
  "/about",
  "/brands",
  "/towns",
  "/reviews",
  "/appliance-repair",
  "/commercial-appliance-repair",
];
const CITY_PAGES = [
  "/towns/charlotte",
  "/towns/rock-hill",
  "/towns/fort-mill",
  "/towns/matthews",
  "/towns/indian-trail",
];
const DRAFTABLE_PATHS = [
  "/towns/south-charlotte",
  "/towns/ballantyne",
  "/commercial-appliance-repair/commercial-refrigerator-repair",
  "/commercial-appliance-repair/commercial-dishwasher-repair",
  "/commercial-appliance-repair/commercial-ice-machine-repair",
  "/commercial-appliance-repair/commercial-laundry-equipment-repair",
  "/commercial-appliance-repair/commercial-oven-range-repair",
  "/commercial-appliance-repair/restaurant-appliance-repair",
  "/commercial-appliance-repair/property-management-appliance-repair",
  "/appliance-repair-guide",
];

const sitemapPaths = (): string[] => sitemap().map((e) => new URL(e.url).pathname);

const townPage = (slug: string) => towns.find((t) => t.slug === slug)!.page!;
const cityPages = (): Publishable[] =>
  towns.filter((t) => t.kind === "city" && t.page).map((t) => t.page!);
const commercial = (slug: string) => commercialPages.find((p) => p.slug === slug)!;

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

/** A fixture pushed into a data array for `run`, then removed (only it). */
function withPushed<T>(list: T[], item: T, run: () => void) {
  list.push(item);
  try {
    run();
  } finally {
    list.splice(list.indexOf(item), 1);
  }
}

const fixtureArticle = (): GuideArticle => ({
  status: "draft",
  slug: "fixture-article",
  category: "refrigerator",
  title: "Fixture",
  metaDescription: "",
  symptoms: [],
  diagnosis: [],
  causes: [],
  repairSteps: [],
  whenToCallPro: "",
  serviceSlug: "refrigerator",
  reviewedByOwner: true,
  author: "owner",
  sources: [],
});

const fixtureCase = (): RepairCase => ({
  status: "draft",
  slug: "fixture-case",
  title: "Fixture",
  appliance: "Refrigerator",
  symptom: "",
  diagnosis: "",
  failedComponent: "",
  repair: "",
  parts: [],
  result: "",
  serviceSlug: "refrigerator",
});

describe("app/sitemap.ts = lib/routes.publishedPaths()", () => {
  it("lists exactly publishedPaths(), in the same order", () => {
    scenario([...cityPages(), townPage("ballantyne"), commercial("restaurant-appliance-repair")], () => {
      expect(sitemapPaths()).toEqual(publishedPaths());
    });
  });

  it("with the 5 city pages published: static pages + 12 services + those 5, nothing else", () => {
    scenario(cityPages(), () => {
      expect(new Set(publishedPaths())).toEqual(
        new Set([
          ...STATIC_PATHS,
          ...services.map((s) => `/appliance-repair/${s.slug}`),
          ...CITY_PAGES,
        ]),
      );
    });
    expect(services).toHaveLength(12);
  });

  it("with everything draft: no town, commercial, guide or case path; never /for-business", () => {
    scenario([], () => {
      const paths = publishedPaths();
      for (const p of [...CITY_PAGES, ...DRAFTABLE_PATHS, "/towns/mint-hill", "/for-business"]) {
        expect(paths).not.toContain(p);
      }
      expect(paths.some((p) => p.startsWith("/repair-cases"))).toBe(false);
    });
  });

  it("publishing an area page adds its path; draft removes it", () => {
    scenario(cityPages(), () => {
      expect(publishedPaths()).not.toContain("/towns/ballantyne");
    });
    scenario([...cityPages(), townPage("ballantyne")], () => {
      expect(publishedPaths()).toContain("/towns/ballantyne");
      expect(sitemapPaths()).toContain("/towns/ballantyne");
    });
  });

  it("publishing a commercial child page adds its path; draft removes it", () => {
    const path = "/commercial-appliance-repair/restaurant-appliance-repair";
    scenario([], () => expect(publishedPaths()).not.toContain(path));
    scenario([commercial("restaurant-appliance-repair")], () =>
      expect(publishedPaths()).toContain(path),
    );
  });

  it("the guide hub exists only with a published article", () => {
    const article = fixtureArticle();
    withPushed(articles, article, () => {
      scenario([], () => {
        expect(publishedPaths()).not.toContain("/appliance-repair-guide");
        expect(publishedPaths()).not.toContain("/appliance-repair-guide/fixture-article");
      });
      scenario([article], () => {
        expect(publishedPaths()).toContain("/appliance-repair-guide");
        expect(publishedPaths()).toContain("/appliance-repair-guide/fixture-article");
      });
    });
  });

  it("a repair case gets a path only when published", () => {
    const repairCase = fixtureCase();
    withPushed(cases, repairCase, () => {
      scenario([], () => expect(publishedPaths()).not.toContain("/repair-cases/fixture-case"));
      scenario([repairCase], () =>
        expect(publishedPaths()).toContain("/repair-cases/fixture-case"),
      );
    });
  });

  it("keeps the priority/changeFrequency rules", () => {
    scenario(cityPages(), () => {
      const byPath = new Map(sitemap().map((e) => [new URL(e.url).pathname, e]));
      const rule = (p: string) => [byPath.get(p)?.priority, byPath.get(p)?.changeFrequency];
      expect(rule("/")).toEqual([1.0, "weekly"]);
      expect(rule("/about")).toEqual([0.7, "yearly"]);
      expect(rule("/commercial-appliance-repair")).toEqual([0.7, "monthly"]);
      expect(rule("/appliance-repair/refrigerator")).toEqual([0.9, "monthly"]);
      expect(rule("/towns/charlotte")).toEqual([0.9, "monthly"]);
    });
  });

  it("has no duplicates, no .html, no /api, and absolute https URLs", () => {
    scenario(cityPages(), () => {
      const paths = sitemapPaths();
      expect(paths.length).toBe(new Set(paths).size);
      expect(paths.some((p) => p.includes(".html") || p.startsWith("/api"))).toBe(false);
      for (const e of sitemap()) expect(e.url).toMatch(/^https:\/\//);
    });
  });
});
