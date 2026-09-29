import { describe, expect, it } from "vitest";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination";
import { commercialPages } from "@/data/commercial";
import { publishedPaths } from "@/lib/routes";
import { redirectRules } from "@/lib/redirects";

// Seam 4 (spec «Границы и швы» #4, stories 23–24, 29, 84): every old URL lands on a live
// page in one hop — never a draft, never a chain, never "/" for a non-root path.
// Rules are resolved with Next's own matcher (case-insensitive by default, like the server).
// Fixtures are literals from outside the code: the 43 paths of the old ekfix.us sitemap
// (.autopilot/…/old-ekfix-urls.txt) and the 22 *.html files of the deleted static site.

const OLD_EKFIX = [
  "/",
  "/appliance-repair/stove",
  "/appliance-repair/wine-cooler",
  "/appliance-repair/refrigerator",
  "/appliance-repair/washer",
  "/appliance-repair/range",
  "/appliance-repair/garbage_disposal",
  "/appliance-repair/cooktop",
  "/appliance-repair/freezer",
  "/appliance-repair/ice_maker",
  "/appliance-repair/dryer",
  "/appliance-repair/microwave",
  "/appliance-repair/dishwasher",
  "/towns/charlotte",
  "/towns/stallings",
  "/towns/newell",
  "/towns/harrisburg",
  "/towns/allen",
  "/towns/mint_hill",
  "/towns/indian_trail",
  "/towns/wesley_chapel",
  "/towns/monroe",
  "/towns/unionville",
  "/towns/mineral_springs",
  "/towns/pineville",
  "/towns/waxhaw",
  "/towns/belmont",
  "/towns/matthews",
  "/towns/marvin",
  "/towns/weddington",
  "/towns/indian_hook",
  "/towns/indian_land",
  "/towns/catawba",
  "/towns/fort_mill",
  "/towns/Lesslie",
  "/towns/lake_wylie",
  "/towns/spring_valley",
  "/towns/rock_hill",
  "/towns/tega_cay",
  "/brands",
  "/property_management",
  "/property_management_cafe",
  "/laundry_equipment_repair",
];

const OLD_HTML = [
  "/index.html",
  "/about.html",
  "/brands.html",
  "/for-business.html",
  ...["cooktop", "dishwasher", "dryer", "freezer", "garbage-disposal", "ice-maker", "microwave",
    "range", "refrigerator", "stove", "washer", "wine-cooler"].map((s) => `/appliance-repair/${s}.html`),
  "/towns/index.html",
  ...["charlotte", "fort-mill", "indian-trail", "matthews", "rock-hill"].map((s) => `/towns/${s}.html`),
];

const RETIRED = ["/for-business"];

/** First matching rule → its destination (with #hash), as Next resolves it; null = no rule. */
function resolve(path: string): string | null {
  for (const rule of redirectRules()) {
    const params = getPathMatch(rule.source, { strict: true, removeUnnamedParams: true })(path);
    if (!params) continue;
    const { parsedDestination } = prepareDestination({
      appendParamsToQuery: false,
      destination: rule.destination,
      params,
      query: {},
    });
    return `${parsedDestination.pathname}${parsedDestination.hash ?? ""}`;
  }
  return null;
}

const withoutHash = (p: string) => p.split("#")[0]!;

/** Commercial pages: `live` slugs → published, the rest → draft; then restored. */
function commercialScenario(live: string[], run: () => void) {
  const before = commercialPages.map((p) => p.status);
  commercialPages.forEach((p) => (p.status = live.includes(p.slug) ? "published" : "draft"));
  try {
    run();
  } finally {
    commercialPages.forEach((p, i) => (p.status = before[i]!));
  }
}

describe("redirectRules — every old URL reaches a live page in one hop", () => {
  it.each([...OLD_EKFIX, ...OLD_HTML, ...RETIRED])("%s", (path) => {
    const live = publishedPaths();
    const dest = resolve(path);
    if (dest === null) {
      expect(live).toContain(path);
      return;
    }
    expect(live).toContain(withoutHash(dest));
    expect(resolve(withoutHash(dest)), "chain").toBeNull();
    if (path !== "/index.html") expect(withoutHash(dest)).not.toBe("/");
  });

  it("every rule is a 308 and no literal destination is another rule's source", () => {
    for (const rule of redirectRules()) {
      expect(rule.permanent).toBe(true);
      if (!rule.destination.includes(":")) expect(resolve(withoutHash(rule.destination))).toBeNull();
    }
  });
});

describe("redirectRules — story 23 table", () => {
  it("matching paths get no rule", () => {
    for (const p of ["/", "/brands", "/towns/charlotte", "/towns/matthews", "/appliance-repair/stove",
      "/appliance-repair/wine-cooler", "/appliance-repair/dishwasher"]) {
      expect(resolve(p), p).toBeNull();
    }
  });

  it("underscored slugs → the hyphenated live page", () => {
    expect(resolve("/appliance-repair/garbage_disposal")).toBe("/appliance-repair/garbage-disposal");
    expect(resolve("/appliance-repair/ice_maker")).toBe("/appliance-repair/ice-maker");
    expect(resolve("/towns/rock_hill")).toBe("/towns/rock-hill");
    expect(resolve("/towns/fort_mill")).toBe("/towns/fort-mill");
    expect(resolve("/towns/indian_trail")).toBe("/towns/indian-trail");
  });

  it("the 21 towns without a page → /towns, in any letter case", () => {
    const noPage = OLD_EKFIX.filter((p) => p.startsWith("/towns/")).filter(
      (p) => !["charlotte", "matthews", "rock_hill", "fort_mill", "indian_trail"].includes(p.slice(7)),
    );
    expect(noPage).toHaveLength(21);
    for (const p of noPage) expect(resolve(p), p).toBe("/towns");
    expect(resolve("/towns/lesslie")).toBe("/towns");
  });

  it("/for-business and /for-business.html → the commercial hub directly", () => {
    expect(resolve("/for-business")).toBe("/commercial-appliance-repair");
    expect(resolve("/for-business.html")).toBe("/commercial-appliance-repair");
  });

  it("commercial paths → the published child page", () => {
    commercialScenario(
      ["property-management-appliance-repair", "restaurant-appliance-repair", "commercial-laundry-equipment-repair"],
      () => {
        expect(resolve("/property_management")).toBe(
          "/commercial-appliance-repair/property-management-appliance-repair",
        );
        expect(resolve("/property_management_cafe")).toBe(
          "/commercial-appliance-repair/restaurant-appliance-repair",
        );
        expect(resolve("/laundry_equipment_repair")).toBe(
          "/commercial-appliance-repair/commercial-laundry-equipment-repair",
        );
      },
    );
  });

  it("commercial paths → the hub anchor while the child page is a draft", () => {
    commercialScenario([], () => {
      expect(resolve("/property_management")).toBe("/commercial-appliance-repair#property-management");
      expect(resolve("/property_management_cafe")).toBe("/commercial-appliance-repair#horeca");
      expect(resolve("/laundry_equipment_repair")).toBe("/commercial-appliance-repair#laundry");
    });
  });
});
