import { describe, expect, it } from "vitest";
import { businessEquipmentOptions, businessTypeOptions } from "@/data/forms";
import { services } from "@/data/services";
import { commercialPages } from "@/data/commercial";
import { brands } from "@/data/brands";
import { laundryObjectTypes } from "@/data/b2b-segments";

// Seam 6, data invariant (spec §6 / story 33, R36): a commercial page names only brands
// the site already publishes — the commercial tier of data/brands or the commercial
// laundry chips on the hub. Every page names at least one, so the equipment block is
// never an empty promise.

const siteCommercialBrands = new Set<string>([
  ...brands.filter((b) => b.tier === "commercial").map((b) => b.name),
  ...laundryObjectTypes.brandChips,
]);

describe("data/commercial brandNames", () => {
  it.each(commercialPages.map((p) => [p.slug, p.equipment.brandNames] as const))(
    "%s names only the site's commercial brands",
    (_slug, brandNames) => {
      expect(brandNames.length).toBeGreaterThan(0);
      for (const name of brandNames) expect(siteCommercialBrands).toContain(name);
    },
  );
});

describe("data/commercial form presets and counterparts (ADR 0023)", () => {
  it("equipment presets are business-form options; industry pages preset a business type", () => {
    for (const p of commercialPages) {
      if (p.kind === "equipment") {
        expect(businessEquipmentOptions).toContain(p.applianceFormLabel);
        expect(p.cardImage).toMatch(/^\/images\//);
      } else {
        expect(businessTypeOptions as readonly string[]).toContain(p.businessType);
      }
    }
  });

  it("homeCounterparts name real residential services", () => {
    const slugs = services.map((s) => s.slug);
    for (const p of commercialPages) for (const slug of p.homeCounterparts ?? []) expect(slugs).toContain(slug);
  });
});
