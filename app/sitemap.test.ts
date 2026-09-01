import { describe, expect, it } from "vitest";
import { services } from "@/data/services";
import { towns } from "@/data/towns";
import sitemap from "@/app/sitemap";

// Seam 2 (spec.md §"Швы для тестов" #2): the sitemap must equal exactly
// {static routes} ∪ {12 service routes} ∪ {5 isFullPage town routes} — nothing dropped,
// nothing added. Expected values are read from data/*, never from the sitemap module.

const STATIC_ROUTES = ["/", "/about", "/brands", "/for-business", "/towns"];

const paths = (): string[] =>
  sitemap().map((entry) => new URL(entry.url).pathname);

describe("app/sitemap.ts", () => {
  it("covers exactly the routes that actually exist", () => {
    const expected = new Set([
      ...STATIC_ROUTES,
      ...services.map((s) => `/appliance-repair/${s.slug}`),
      ...towns.filter((t) => t.isFullPage).map((t) => `/towns/${t.slug}`),
    ]);
    expect(new Set(paths())).toEqual(expected);
  });

  it("has one entry per route (no duplicates)", () => {
    expect(paths().length).toBe(new Set(paths()).size);
  });

  it("emits clean URLs — no legacy .html", () => {
    expect(paths().some((p) => p.includes(".html"))).toBe(false);
  });

  it("never lists /api", () => {
    expect(paths().some((p) => p.includes("/api"))).toBe(false);
  });

  it("never lists a town that is not a full page", () => {
    const nonFullSlugs = towns
      .filter((t) => !t.isFullPage)
      .map((t) => t.slug);
    const townPaths = paths().filter((p) => p.startsWith("/towns/"));
    expect(
      townPaths.some((p) =>
        nonFullSlugs.some((slug) => p === `/towns/${slug}`),
      ),
    ).toBe(false);
  });

  it("builds every URL as an absolute https URL", () => {
    for (const entry of sitemap()) {
      expect(entry.url).toMatch(/^https:\/\//);
    }
  });
});
