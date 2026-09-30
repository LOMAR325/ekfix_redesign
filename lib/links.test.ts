import { describe, expect, it } from "vitest";
import type { ChipItem } from "@/components/ui/chip-row";
import type { GuideArticle, Publishable, RepairCase } from "@/data/types";
import { towns } from "@/data/towns";
import { commercialPages } from "@/data/commercial";
import { articles } from "@/data/guides";
import { cases } from "@/data/cases";
import { commercialCategories } from "@/data/services";
import {
  areaLinksForHome,
  areaLinksForService,
  businessLinkForService,
  commercialCardHref,
  homeLinksForCommercial,
  linksForCommercial,
  serviceLinkForArticle,
  serviceLinkForCase,
} from "@/lib/links";

// Seam 5 (spec «Границы и швы» #5, story 64): cross-links are computed from data and
// never point at a draft; publishing one `status` makes the link appear. Every
// status-sensitive assertion sets its own statuses (scenario) and restores them.

const hrefs = (items: ChipItem[]) =>
  items.map((i) => (typeof i === "string" ? undefined : i.href));

const CITY_PAGES = [
  "/towns/charlotte",
  "/towns/rock-hill",
  "/towns/fort-mill",
  "/towns/matthews",
  "/towns/indian-trail",
];

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

const article = (slug: string, serviceSlug: string): GuideArticle => ({
  status: "draft",
  slug,
  category: "commercial",
  title: `Fixture ${slug}`,
  metaDescription: "",
  symptoms: [],
  diagnosis: [],
  causes: [],
  repairSteps: [],
  whenToCallPro: "",
  serviceSlug,
  reviewedByOwner: true,
  author: "owner",
  sources: [],
});

describe("areaLinksForHome", () => {
  it("areas draft: the 5 city pages, then the /towns index", () => {
    scenario(cityPages(), () => {
      expect(hrefs(areaLinksForHome())).toEqual([...CITY_PAGES, "/towns"]);
    });
  });

  it("published areas come first — South Charlotte, then Ballantyne", () => {
    scenario([...cityPages(), townPage("south-charlotte"), townPage("ballantyne")], () => {
      expect(hrefs(areaLinksForHome())).toEqual([
        "/towns/south-charlotte",
        "/towns/ballantyne",
        ...CITY_PAGES,
        "/towns",
      ]);
    });
    scenario([...cityPages(), townPage("ballantyne")], () => {
      expect(hrefs(areaLinksForHome())[0]).toBe("/towns/ballantyne");
      expect(hrefs(areaLinksForHome())).not.toContain("/towns/south-charlotte");
    });
  });

  it("a draft city page is not linked", () => {
    scenario([], () => {
      expect(hrefs(areaLinksForHome())).toEqual(["/towns"]);
    });
  });
});

describe("areaLinksForService", () => {
  it("links a service to Ballantyne and South Charlotte only once they are published", () => {
    scenario(cityPages(), () => expect(areaLinksForService("refrigerator")).toEqual([]));
    scenario([townPage("south-charlotte"), townPage("ballantyne")], () => {
      expect(hrefs(areaLinksForService("refrigerator"))).toEqual([
        "/towns/ballantyne",
        "/towns/south-charlotte",
      ]);
      expect(areaLinksForService("no-such-service")).toEqual([]);
    });
  });
});

describe("linksForCommercial", () => {
  it("links published areas and published related articles, never drafts", () => {
    const slug = "restaurant-appliance-repair";
    const draft = article("fixture-draft", slug);
    const live = article("fixture-live", slug);
    articles.push(draft, live);
    try {
      scenario([], () => expect(linksForCommercial(slug)).toEqual([]));
      scenario([townPage("south-charlotte"), live], () => {
        expect(hrefs(linksForCommercial(slug))).toEqual([
          "/towns/south-charlotte",
          "/appliance-repair-guide/fixture-live",
        ]);
      });
    } finally {
      for (const fixture of [draft, live]) articles.splice(articles.indexOf(fixture), 1);
    }
  });
});

describe("serviceLinkForArticle / serviceLinkForCase", () => {
  it("a residential service links to its /appliance-repair page", () => {
    expect(hrefs(serviceLinkForArticle(article("a", "refrigerator")))).toEqual([
      "/appliance-repair/refrigerator",
    ]);
  });

  it("a draft commercial page falls back to the hub; published — to the page itself", () => {
    const a = article("a", "commercial-dishwasher-repair");
    scenario([], () =>
      expect(hrefs(serviceLinkForArticle(a))).toEqual(["/commercial-appliance-repair"]),
    );
    scenario([commercial("commercial-dishwasher-repair")], () => {
      expect(hrefs(serviceLinkForArticle(a))).toEqual([
        "/commercial-appliance-repair/commercial-dishwasher-repair",
      ]);
    });
  });

  it("a case links to its own service", () => {
    const repairCase: RepairCase = {
      status: "published",
      slug: "x",
      title: "x",
      appliance: "Dishwasher",
      symptom: "",
      diagnosis: "",
      failedComponent: "",
      repair: "",
      parts: [],
      result: "",
      serviceSlug: "dishwasher",
    };
    expect(hrefs(serviceLinkForCase(repairCase))).toEqual(["/appliance-repair/dishwasher"]);
  });
});

describe("commercialCardHref", () => {
  it("child pages draft: the old hub anchors, on the new hub path", () => {
    scenario([], () => {
      expect(commercialCategories.map(commercialCardHref)).toEqual([
        "/commercial-appliance-repair#horeca",
        "/commercial-appliance-repair#horeca",
        "/commercial-appliance-repair#laundry",
        "/commercial-appliance-repair#horeca",
      ]);
    });
  });

  it("a published child page for the category takes over the card link", () => {
    scenario([commercial("commercial-refrigerator-repair")], () => {
      const fridge = commercialCategories.find((c) => c.label === "Commercial Refrigeration")!;
      expect(commercialCardHref(fridge)).toBe(
        "/commercial-appliance-repair/commercial-refrigerator-repair",
      );
    });
  });
});

describe("cross-branch links (brief §6)", () => {
  it("a residential service → its published commercial counterpart, one link", () => {
    const expected: Record<string, string> = {
      refrigerator: "/commercial-appliance-repair/commercial-refrigerator-repair",
      dishwasher: "/commercial-appliance-repair/commercial-dishwasher-repair",
      "ice-maker": "/commercial-appliance-repair/commercial-ice-machine-repair",
      washer: "/commercial-appliance-repair/commercial-laundry-equipment-repair",
      dryer: "/commercial-appliance-repair/commercial-laundry-equipment-repair",
      stove: "/commercial-appliance-repair/commercial-oven-range-repair",
      range: "/commercial-appliance-repair/commercial-oven-range-repair",
      cooktop: "/commercial-appliance-repair/commercial-oven-range-repair",
    };
    scenario(commercialPages, () => {
      for (const [slug, href] of Object.entries(expected)) {
        expect(businessLinkForService(slug)).toEqual({ label: "Need this for a business? →", href });
      }
      for (const slug of ["microwave", "freezer", "wine-cooler", "garbage-disposal"]) {
        expect(businessLinkForService(slug)).toBeNull();
      }
    });
  });

  it("no link while the commercial page is a draft", () => {
    scenario([], () => {
      expect(businessLinkForService("refrigerator")).toBeNull();
    });
  });

  it("a commercial equipment page → its residential services", () => {
    expect(hrefs(homeLinksForCommercial("commercial-laundry-equipment-repair"))).toEqual([
      "/appliance-repair/washer",
      "/appliance-repair/dryer",
    ]);
    expect(hrefs(homeLinksForCommercial("commercial-oven-range-repair"))).toEqual([
      "/appliance-repair/stove",
      "/appliance-repair/range",
      "/appliance-repair/cooktop",
    ]);
    expect(homeLinksForCommercial("restaurant-appliance-repair")).toEqual([]);
  });
});
