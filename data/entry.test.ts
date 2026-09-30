import { describe, expect, it } from "vitest";
import type { Publishable } from "@/data/types";
import { commercialPages } from "@/data/commercial";
import { entryPanels } from "@/data/entry";

// The entry page `/` (ADR 0022): business first, each panel leads to its branch root, and a
// panel link never points at a draft commercial page.

function withLive(live: Publishable[], run: () => void) {
  const saved = commercialPages.map((x) => x.status);
  commercialPages.forEach((x) => (x.status = live.includes(x) ? "published" : "draft"));
  try {
    run();
  } finally {
    commercialPages.forEach((x, i) => (x.status = saved[i]));
  }
}

describe("entry panels", () => {
  it("business first, then homes; each CTA is its branch root; 3–5 links each", () => {
    withLive(commercialPages, () => {
      const [business, home] = entryPanels();
      expect([business.branch, home.branch]).toEqual(["business", "home"]);
      expect(business.cta.href).toBe("/commercial-appliance-repair");
      expect(home.cta.href).toBe("/appliance-repair");
      for (const panel of [business, home]) {
        expect(panel.links.length).toBeGreaterThanOrEqual(3);
        expect(panel.links.length).toBeLessThanOrEqual(5);
      }
      expect(home.links.map((l) => l.href)).toEqual([
        "/appliance-repair/refrigerator",
        "/appliance-repair/washer",
        "/appliance-repair/dryer",
        "/appliance-repair/dishwasher",
        "/appliance-repair/stove",
      ]);
    });
  });

  it("a draft commercial page is not linked", () => {
    const live = commercialPages.filter((p) => p.slug !== "commercial-dishwasher-repair");
    withLive(live, () => {
      const hrefs = entryPanels()[0].links.map((l) => l.href);
      expect(hrefs).not.toContain("/commercial-appliance-repair/commercial-dishwasher-repair");
      expect(hrefs).toContain("/commercial-appliance-repair/commercial-refrigerator-repair");
    });
  });
});
