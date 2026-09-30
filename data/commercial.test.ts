import { describe, expect, it } from "vitest";
import { services } from "@/data/services";
import { commercialPages } from "@/data/commercial";

// Seam 6, data invariants. Commercial pages list no brands of their own (the owner services
// every brand; 2026-09-30) — they link to /brands instead.

describe("data/commercial brands", () => {
  it("no page carries a per-page brand list", () => {
    for (const p of commercialPages) expect(Object.keys(p.equipment)).not.toContain("brandNames");
  });
});

describe("data/commercial counterparts", () => {
  it("equipment pages carry a card image; homeCounterparts name real residential services", () => {
    const slugs = services.map((s) => s.slug);
    for (const p of commercialPages) {
      if (p.kind === "equipment") expect(p.cardImage).toMatch(/^\/images\//);
      for (const slug of p.homeCounterparts ?? []) expect(slugs).toContain(slug);
    }
  });
});
