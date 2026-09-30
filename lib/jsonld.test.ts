import { describe, expect, it } from "vitest";
import { business } from "@/data/business";
import type { GuideArticle } from "@/data/types";
import {
  articleNode,
  breadcrumbNode,
  businessNode,
  faqNode,
  graph,
  ids,
  ownerNode,
  serviceNode,
  websiteNode,
} from "@/lib/jsonld";

// Seam 3 (spec "Границы и швы" #3, stories 16–22): one JSON-LD graph per page with stable
// @ids built from data/business.siteUrl; every reference points at the business, website
// or owner node; markup carries only what the page shows. Expected values are literals
// (from the spec), never re-derived the way the builders derive them.

const BUSINESS_ID = "https://ekfix.us/#business";
const WEBSITE_ID = "https://ekfix.us/#website";
const OWNER_ID = "https://ekfix.us/about#owner";

describe("ids", () => {
  it("are stable fragments of the live domain", () => {
    expect(ids).toEqual({
      business: BUSINESS_ID,
      website: WEBSITE_ID,
      owner: OWNER_ID,
    });
  });
});

describe("graph()", () => {
  it("wraps nodes in a single @context + @graph", () => {
    const g = graph(businessNode(), websiteNode());
    expect(g["@context"]).toBe("https://schema.org");
    expect(g["@graph"]).toHaveLength(2);
    expect(g["@graph"].every((n) => !("@context" in n))).toBe(true);
  });
});

describe("businessNode()", () => {
  it("carries the one business @id and the bare name", () => {
    const node = businessNode();
    expect(node["@id"]).toBe(BUSINESS_ID);
    expect(node["@type"]).toBe("HomeAndConstructionBusiness");
    expect(node.name).toBe("EK Global");
  });

  it("carries the base fields visible in the header/footer of every page", () => {
    const node = businessNode();
    expect(node.telephone).toBe("+1-980-371-4319");
    expect(node.url).toBe("https://ekfix.us/");
    expect(node.logo).toBe("https://ekfix.us/icon.svg");
    expect(node.address).toMatchObject({ addressLocality: "Charlotte", addressRegion: "NC" });
    expect(node.sameAs).toEqual([
      "https://www.instagram.com/ekglobal_official",
      "https://www.facebook.com/profile.php?id=61572447657230",
      "https://www.tiktok.com/@constantin_ekfix",
      "https://g.page/r/CQzbpOh98VJ2EAE",
    ]);
  });

  it("without options has no image, areaServed, aggregateRating, knowsAbout or priceRange", () => {
    const node = businessNode();
    for (const key of ["image", "areaServed", "aggregateRating", "knowsAbout", "priceRange"]) {
      expect(node).not.toHaveProperty(key);
    }
  });

  it("never has priceRange, whatever the options", () => {
    const node = businessNode({
      areaServed: business.areaServed,
      knowsAbout: true,
    });
    expect(node).not.toHaveProperty("priceRange");
  });

  it("lists exactly the areas it is given", () => {
    const node = businessNode({ areaServed: ["Rock Hill, SC"] });
    expect(node.areaServed).toEqual([{ "@type": "City", name: "Rock Hill, SC" }]);
    const all = businessNode({ areaServed: business.areaServed }).areaServed as unknown[];
    expect(all).toHaveLength(20);
    expect(all[0]).toEqual({ "@type": "City", name: "Charlotte, NC" });
  });

  it("omits areaServed for an empty list", () => {
    expect(businessNode({ areaServed: [] })).not.toHaveProperty("areaServed");
  });

  it("marks a district (kind 'area') as a Place and a city as a City", () => {
    const node = businessNode({
      areaServed: [
        { name: "Ballantyne", kind: "area" },
        { name: "Matthews, NC", kind: "city" },
      ],
    });
    expect(node.areaServed).toEqual([
      { "@type": "Place", name: "Ballantyne" },
      { "@type": "City", name: "Matthews, NC" },
    ]);
  });

  it("keeps a place's name as the page shows it and carries its state as the containing place", () => {
    const node = businessNode({
      areaServed: [{ name: "Mint Hill", kind: "city", containedIn: "North Carolina" }],
    });
    expect(node.areaServed).toEqual([
      {
        "@type": "City",
        name: "Mint Hill",
        containedInPlace: { "@type": "State", name: "North Carolina" },
      },
    ]);
  });

  it("shows the hero photo only when asked", () => {
    expect(businessNode({ image: true }).image).toBe(
      "https://ekfix.us/images/ek-global-technician-washer-repair-charlotte.webp",
    );
  });

  it("never carries an aggregateRating (the reviews are Google's, ADR 0024)", () => {
    expect(businessNode({ image: true, knowsAbout: true })).not.toHaveProperty("aggregateRating");
  });

  it("advertises the four commercial services only when asked", () => {
    const knowsAbout = businessNode({ knowsAbout: true }).knowsAbout as string[];
    expect(knowsAbout).toHaveLength(4);
    expect(knowsAbout[0]).toBe("Commercial Appliance Repair");
  });
});

describe("websiteNode()", () => {
  it("is published by the business", () => {
    const node = websiteNode();
    expect(node["@id"]).toBe(WEBSITE_ID);
    expect(node["@type"]).toBe("WebSite");
    expect(node.url).toBe("https://ekfix.us/");
    expect(node.publisher).toEqual({ "@id": BUSINESS_ID });
  });
});

describe("ownerNode()", () => {
  it("is Constantin, first name only, working for the business", () => {
    const node = ownerNode();
    expect(node["@id"]).toBe(OWNER_ID);
    expect(node["@type"]).toBe("Person");
    expect(node.name).toBe("Constantin");
    expect(node.jobTitle).toBe("Owner & Lead Technician");
    expect(node.worksFor).toEqual({ "@id": BUSINESS_ID });
    for (const key of ["familyName", "givenName", "additionalName", "alternateName"]) {
      expect(node).not.toHaveProperty(key);
    }
  });

  it("holds exactly the two published credentials", () => {
    const creds = ownerNode().hasCredential as { name: string }[];
    expect(creds.map((c) => c.name)).toEqual(["EPA Section 608 Universal", "OSHA"]);
  });
});

describe("serviceNode()", () => {
  it("has a per-page @id, the business as provider and the given areas", () => {
    const node = serviceNode({
      url: "/appliance-repair/dryer",
      name: "Dryer Repair",
      areaServed: ["Charlotte, NC"],
    });
    expect(node["@type"]).toBe("Service");
    expect(node["@id"]).toBe("https://ekfix.us/appliance-repair/dryer#service");
    expect(node.provider).toEqual({ "@id": BUSINESS_ID });
    expect(node.name).toBe("Dryer Repair");
    expect(node.areaServed).toEqual([{ "@type": "City", name: "Charlotte, NC" }]);
  });
});

describe("faqNode() / breadcrumbNode()", () => {
  it("give the FAQ a per-page @id", () => {
    const node = faqNode("/for-business", [{ q: "Q?", a: "A." }])!;
    expect(node["@type"]).toBe("FAQPage");
    expect(node["@id"]).toBe("https://ekfix.us/for-business#faq");
    expect(node.mainEntity).toEqual([
      { "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
  });

  it("drop draft FAQ items, and give no node when none is published", () => {
    const node = faqNode("/x", [
      { q: "Live?", a: "Yes.", status: "published" },
      { q: "Draft?", a: "No.", status: "draft" },
    ]);
    expect((node?.mainEntity as { name: string }[]).map((q) => q.name)).toEqual(["Live?"]);
    expect(faqNode("/x", [{ q: "Draft?", a: "No.", status: "draft" }])).toBeNull();
  });

  it("give the breadcrumb a per-page @id and absolute items", () => {
    const node = breadcrumbNode("/about", [
      { name: "Home", url: "/" },
      { name: "Our Story", url: "/about" },
    ]);
    expect(node["@type"]).toBe("BreadcrumbList");
    expect(node["@id"]).toBe("https://ekfix.us/about#breadcrumb");
    expect(node.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ekfix.us/" },
      { "@type": "ListItem", position: 2, name: "Our Story", item: "https://ekfix.us/about" },
    ]);
  });
});

describe("articleNode()", () => {
  const article: GuideArticle = {
    status: "published",
    slug: "fridge-not-cooling",
    category: "refrigerator",
    title: "Fridge not cooling",
    metaDescription: "Why a fridge stops cooling.",
    symptoms: [],
    diagnosis: [],
    causes: [],
    repairSteps: [],
    whenToCallPro: "",
    serviceSlug: "refrigerator",
    reviewedByOwner: true,
    author: "owner",
    datePublished: "2026-09-28",
    sources: [],
  };

  it("throws for an article the owner has not reviewed", () => {
    expect(() =>
      articleNode({ ...article, reviewedByOwner: false, author: undefined }),
    ).toThrow(/reviewedByOwner/);
  });

  it("throws for a draft article, even one the owner reviewed", () => {
    expect(() => articleNode({ ...article, status: "draft" })).toThrow(/draft/);
  });

  it("credits the owner as author and the business as publisher", () => {
    const node = articleNode(article);
    expect(node["@type"]).toBe("Article");
    expect(node["@id"]).toBe("https://ekfix.us/appliance-repair-guide/fridge-not-cooling#article");
    expect(node.author).toEqual({ "@id": OWNER_ID });
    expect(node.publisher).toEqual({ "@id": BUSINESS_ID });
    expect(node.headline).toBe("Fridge not cooling");
  });
});

describe("references", () => {
  it("every bare @id reference points at the business, website or owner", () => {
    const refs: string[] = [];
    const walk = (v: unknown): void => {
      if (Array.isArray(v)) return v.forEach(walk);
      if (v === null || typeof v !== "object") return;
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === "@id") refs.push((v as { "@id": string })["@id"]);
      Object.values(v).forEach(walk);
    };
    walk(
      graph(
        businessNode({ areaServed: business.areaServed, knowsAbout: true }),
        websiteNode(),
        ownerNode(),
        serviceNode({ url: "/appliance-repair/washer", name: "Washer Repair", areaServed: [] }),
        faqNode("/", [{ q: "Q?", a: "A." }]),
        breadcrumbNode("/", [{ name: "Home", url: "/" }]),
      ),
    );
    expect(refs.length).toBeGreaterThanOrEqual(3);
    expect(refs.every((id) => [BUSINESS_ID, WEBSITE_ID, OWNER_ID].includes(id))).toBe(true);
  });
});
