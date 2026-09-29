import { describe, expect, it } from "vitest";
import type { Town } from "./types";
import { publishedAncestors, towns } from "./towns";

// Data invariants of data/towns (spec §3, stories 59 and 61). Status-sensitive assertions
// set the statuses they need and restore them, so they don't depend on what is live today.

const town = (slug: string): Town => {
  const t = towns.find((x) => x.slug === slug);
  if (!t?.page) throw new Error(`no page for ${slug}`);
  return t;
};

function withStatus(slug: string, status: "draft" | "published", run: () => void) {
  const page = town(slug).page!;
  const before = page.status;
  page.status = status;
  try {
    run();
  } finally {
    page.status = before;
  }
}

describe("area hierarchy (story 61)", () => {
  it("Ballantyne sits under Charlotte › South Charlotte; a draft level is skipped", () => {
    withStatus("south-charlotte", "published", () => {
      expect(publishedAncestors(town("ballantyne")).map((t) => t.slug)).toEqual([
        "charlotte",
        "south-charlotte",
      ]);
    });
    withStatus("south-charlotte", "draft", () => {
      expect(publishedAncestors(town("ballantyne")).map((t) => t.slug)).toEqual(["charlotte"]);
    });
    expect(publishedAncestors(town("south-charlotte")).map((t) => t.slug)).toEqual(["charlotte"]);
    expect(publishedAncestors(town("charlotte"))).toEqual([]);
  });
});

describe("Ballantyne FAQ (story 59)", () => {
  // The eight questions of brief 3.3, verbatim.
  const BRIEF = [
    "Who repairs appliances in Ballantyne, NC?",
    "Does EK Global serve the 28277 ZIP code?",
    "Does EK Global offer same-day appliance repair in Ballantyne?",
    "How much is an appliance diagnostic in Ballantyne?",
    "Does the diagnostic fee apply toward the repair?",
    "What appliance brands does EK Global repair?",
    "Does EK Global repair Sub-Zero / Thermador / Bosch / Miele appliances?",
    "Does EK Global repair commercial appliances in South Charlotte?",
  ];

  it("asks the brief's eight questions; 28277 and commercial-in-South-Charlotte stay draft", () => {
    const faqs = town("ballantyne").page!.faqs ?? [];
    expect(faqs.map((f) => f.q)).toEqual(BRIEF);
    expect(faqs.filter((f) => f.status === "draft").map((f) => f.q)).toEqual([BRIEF[1], BRIEF[7]]);
  });

  it("no published text on any town page names a ZIP code (fact 3 not given)", () => {
    for (const t of towns) {
      if (!t.page) continue;
      const p = t.page;
      const live = [
        p.seo.title,
        p.seo.description,
        p.hero.lede,
        ...p.prose,
        ...(p.coverage?.status === "published" ? [p.coverage.body] : []),
        ...(p.applianceNotes ?? []).filter((n) => n.status === "published").flatMap((n) => [n.heading, n.body]),
        ...(p.faqs ?? []).filter((f) => f.status === "published").flatMap((f) => [f.q, f.a]),
      ].join(" ");
      expect(live, t.slug).not.toMatch(/\b28\d{3}\b/);
    }
  });
});
