import { describe, expect, it } from "vitest";
import { articles, guideCategories } from "./guides";
import type { GuideArticle } from "./types";
import { articleNode } from "../lib/jsonld";
import { serviceLinkForArticle } from "../lib/links";

// Data invariants for the knowledge centre (stories 69–74, seam 6). Each invariant is a
// check over the live `articles` list; every test also pushes a violating fixture into that
// list (and removes it) to prove the check catches it — the real list has no published
// article yet, so without the fixture the invariant could never go red.

function withPushed<T>(list: T[], item: T, run: () => void) {
  list.push(item);
  try {
    run();
  } finally {
    list.splice(list.indexOf(item), 1);
  }
}

const fixture = (over: Partial<GuideArticle> = {}): GuideArticle => ({
  status: "draft",
  slug: "fixture-article",
  category: "refrigerator",
  title: "Fixture article",
  metaDescription: "Fixture.",
  symptoms: ["Symptom"],
  diagnosis: ["Diagnosis."],
  causes: [{ cause: "Cause", detail: "Detail." }],
  repairSteps: ["Step — detail."],
  whenToCallPro: "Call.",
  serviceSlug: "refrigerator",
  reviewedByOwner: false,
  sources: [{ claim: "Claim.", url: "https://example.com/", title: "Source" }],
  ...over,
});

/** Appliance error codes as they appear in titles/text: E15, E:15, OE1, 5E, dE … */
const ERROR_CODE = /\b(?:[A-Z]{1,2}:?\d{1,3}|\d{1,2}[A-Z]{1,2})\b/g;

const textOf = (a: GuideArticle): string =>
  [
    a.title,
    a.metaDescription,
    a.model ?? "",
    ...a.symptoms,
    ...a.diagnosis,
    ...a.causes.flatMap((c) => [c.cause, c.detail]),
    ...a.repairSteps,
    a.whenToCallPro,
  ].join(" ");

/** R81/R83: published ⇒ reviewedByOwner and author "owner". */
const publishedUnreviewed = (): string[] =>
  articles
    .filter((a) => a.status === "published" && !(a.reviewedByOwner && a.author === "owner"))
    .map((a) => a.slug);

/** R83: not reviewed ⇒ no author, technician or dates. */
const creditedUnreviewed = (): string[] =>
  articles
    .filter(
      (a) =>
        !a.reviewedByOwner &&
        [a.author, a.technician, a.datePublished, a.dateModified].some((v) => v !== undefined),
    )
    .map((a) => a.slug);

/** R82: at least one source; each with a claim, a title and an https url. */
const badSources = (): string[] =>
  articles
    .filter(
      (a) =>
        a.sources.length === 0 ||
        a.sources.some(
          (s) => !s.claim || !s.title || !URL.canParse(s.url) || new URL(s.url).protocol !== "https:",
        ),
    )
    .map((a) => a.slug);

/** R82: every error code in the title/text is named in at least one source claim. */
const codesWithoutSource = (): string[] =>
  articles.flatMap((a) =>
    [...new Set(textOf(a).match(ERROR_CODE) ?? [])]
      .filter((code) => !a.sources.some((s) => s.claim.includes(code)))
      .map((code) => `${a.slug}: ${code}`),
  );

/** repairStepItems splits "Title — detail"; a step without the separator loses its body. */
const stepsWithoutSeparator = (): string[] =>
  articles.flatMap((a) =>
    a.repairSteps.filter((s) => !s.includes(" — ")).map((s) => `${a.slug}: ${s}`),
  );

describe("guide articles", () => {
  it("a published article is owner-reviewed and credits the owner as author (R81, R83)", () => {
    expect(publishedUnreviewed()).toEqual([]);
    withPushed(articles, fixture({ status: "published", reviewedByOwner: false, author: "owner" }), () =>
      expect(publishedUnreviewed()).toEqual(["fixture-article"]),
    );
    withPushed(articles, fixture({ status: "published", reviewedByOwner: true }), () =>
      expect(publishedUnreviewed()).toEqual(["fixture-article"]),
    );
  });

  it("an article not reviewed by the owner has no author, technician or dates (R83)", () => {
    expect(creditedUnreviewed()).toEqual([]);
    withPushed(articles, fixture({ author: "owner" }), () =>
      expect(creditedUnreviewed()).toEqual(["fixture-article"]),
    );
  });

  it("every article has sources: a claim, a title and an https url (R82)", () => {
    expect(badSources()).toEqual([]);
    withPushed(articles, fixture({ sources: [] }), () =>
      expect(badSources()).toEqual(["fixture-article"]),
    );
    withPushed(
      articles,
      fixture({ sources: [{ claim: "Claim.", url: "http://example.com/", title: "Source" }] }),
      () => expect(badSources()).toEqual(["fixture-article"]),
    );
  });

  it("the error-code pattern finds a code in a title and ignores units", () => {
    expect("Bosch dishwasher E15 error".match(ERROR_CODE)).toEqual(["E15"]);
    expect("120 volts, 20 psi, 0°F, 6 ounces, 30-amp".match(ERROR_CODE)).toBeNull();
  });

  it("every error code in an article is named in at least one source claim (R82)", () => {
    expect(codesWithoutSource()).toEqual([]);
    withPushed(articles, fixture({ title: "Fixture washer E22 error" }), () =>
      expect(codesWithoutSource()).toEqual(["fixture-article: E22"]),
    );
  });

  it("every repair step carries the \" — \" separator (title — detail)", () => {
    expect(stepsWithoutSeparator()).toEqual([]);
    withPushed(articles, fixture({ repairSteps: ["Step without a detail."] }), () =>
      expect(stepsWithoutSeparator()).toEqual(["fixture-article: Step without a detail."]),
    );
  });

  it("slugs are unique, categories known, and each article links to a service (R70)", () => {
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    const known = guideCategories.map((c) => c.slug);
    for (const a of articles) {
      expect(known, a.slug).toContain(a.category);
      expect(serviceLinkForArticle(a).length, a.slug).toBeGreaterThan(0);
    }
  });

  it("Article markup of a published, reviewed article credits /about#owner (story 20)", () => {
    const live = fixture({
      status: "published",
      reviewedByOwner: true,
      author: "owner",
      technician: "owner",
      datePublished: "2026-10-01",
    });
    expect(articleNode(live).author).toEqual({
      "@id": expect.stringMatching(/\/about#owner$/),
    });
    expect(() => articleNode({ ...live, status: "draft" })).toThrow();
    expect(() => articleNode({ ...live, reviewedByOwner: false })).toThrow();
  });
});
