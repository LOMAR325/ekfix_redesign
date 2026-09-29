import { describe, expect, it } from "vitest";
import { services } from "./services";

// Data invariants of data/services (spec stories 19, 62, 63). Expected wording comes from
// the brief: «Refrigerator repair<br><span>in Charlotte & South Charlotte.</span>».

/** What a reader sees of a trusted HTML string: tags dropped, `&amp;` decoded. */
const visible = (html: string): string =>
  html
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

describe("service H1 names what and where (story 62)", () => {
  it.each(services.map((s) => [s.slug, s] as const))("%s", (_, s) => {
    expect(visible(s.hero.h1)).toBe(`${s.name} repair in Charlotte & South Charlotte.`);
    expect(s.hero.h1).toMatch(/<br><span>in .+\.<\/span>$/);
  });

  it.each(services.map((s) => [s.slug, s] as const))(
    "%s: <title> and description name the service and both places",
    (_, s) => {
      expect(s.title).toContain(`${s.name} Repair in Charlotte & South Charlotte`);
      expect(s.metaDescription).toContain(`${s.name.toLowerCase()} repair`);
      expect(s.metaDescription).toContain("Charlotte & South Charlotte");
    },
  );

  it("Service.areaServed is exactly the places the H1 names (story 19)", () => {
    for (const s of services) {
      expect(s.areaServed).toEqual([
        { name: "Charlotte", kind: "city" },
        { name: "South Charlotte", kind: "area" },
      ]);
    }
  });
});

describe("Ballantyne note — only with local specifics, never a template (story 63)", () => {
  const notes = services.flatMap((s) =>
    s.ballantyneNote ? [{ slug: s.slug, name: s.name, ...s.ballantyneNote }] : [],
  );
  /** Sentences of a note with its own appliance name masked — what a template would share. */
  const sentences = (n: (typeof notes)[number]): string[] =>
    visible(`${n.heading}. ${n.body}`)
      .replace(new RegExp(n.name, "gi"), "<appliance>")
      .split(/(?<=[.!?])\s+/)
      .map((x) => x.toLowerCase());

  it("is carried by the built-in / panel-ready kinds the spec expects: refrigerator, dishwasher", () => {
    expect(notes.map((n) => n.slug).sort()).toEqual(["dishwasher", "refrigerator"]);
    for (const n of notes) expect(n.status).toBe("published");
  });

  it("no two notes share a sentence once the appliance name is masked", () => {
    expect(notes.length).toBeGreaterThanOrEqual(2); // otherwise there is nothing to compare
    for (const a of notes) {
      for (const b of notes) {
        if (a.slug >= b.slug) continue;
        const shared = sentences(a).filter((x) => sentences(b).includes(x));
        expect(shared, `${a.slug} vs ${b.slug}`).toEqual([]);
      }
    }
  });

  it("is written impersonally — no new first-person copy (spec §13)", () => {
    expect(notes.length).toBeGreaterThan(0);
    for (const n of notes) {
      expect(visible(`${n.heading} ${n.body}`)).not.toMatch(/\b(we|we're|we'll|our|us|I|I'm|my)\b/i);
    }
  });
});
