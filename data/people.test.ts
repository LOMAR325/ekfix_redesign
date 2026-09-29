import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { aboutPage, owner } from "@/data/people";
import { reviews } from "@/data/reviews";
import { commercialCategories, services } from "@/data/services";
import { ownerNode } from "@/lib/jsonld";

// Seam 6, data invariant (spec story 9 / R11): the owner is "Constantin" everywhere in
// the content layer. The only place the other spelling may survive is a review quote
// (`reviews[].text` is never edited — R12), and none of them carries it today.
// Every data/*.ts module is discovered from disk, so modules added later are covered too.

const dataDir = import.meta.dirname;
const moduleFiles = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
  .sort();

const reviewQuotes = new Set(reviews.map((r) => r.text));

/** Every string reachable from a module's exported values (functions are not called). */
function strings(value: unknown, seen = new Set<unknown>()): string[] {
  if (typeof value === "string") return [value];
  if (value === null || typeof value !== "object" || seen.has(value)) return [];
  seen.add(value);
  return Object.values(value).flatMap((v) => strings(v, seen));
}

describe("owner name in data/*", () => {
  it("discovers the data modules from disk", () => {
    expect(moduleFiles).toEqual(
      expect.arrayContaining(["b2b-segments.ts", "people.ts", "reviews.ts", "towns.ts"]),
    );
  });

  it("spells the owner only as Constantin (the K-spelling survives nowhere outside review quotes)", async () => {
    const offenders: string[] = [];
    for (const file of moduleFiles) {
      const mod: unknown = await import(path.join(dataDir, file));
      for (const s of strings(mod)) {
        if (!/konstantin/i.test(s) || reviewQuotes.has(s)) continue;
        // photo file names keep the old spelling until R88
        if (/^\/images\//.test(s)) continue;
        offenders.push(`${file}: ${s.slice(0, 80)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("names the owner Constantin, with no surname field", () => {
    expect(owner.name).toBe("Constantin");
    for (const key of ["surname", "lastName", "familyName"]) {
      expect(owner).not.toHaveProperty(key);
    }
  });
});

// Seam 6 + 3 (stories 18, 66, R23): the Person node on /about claims only what /about shows.
// Visible copy = every string of `aboutPage` outside a `status: "draft"` block (drafts never
// render in production), tags stripped.
function visibleText(value: unknown): string {
  if (typeof value === "string") return value.replace(/<[^>]+>/g, " ");
  if (value === null || typeof value !== "object") return "";
  if ((value as { status?: unknown }).status === "draft") return "";
  return Object.values(value).map(visibleText).join(" \n ");
}

describe("the Person node and the /about copy", () => {
  const text = visibleText(aboutPage);
  const node = ownerNode();

  it("prints the jobTitle and each credential name verbatim", () => {
    const creds = (node.hasCredential as { name: string }[]).map((c) => c.name);
    for (const s of [node.jobTitle as string, ...creds]) expect(text).toContain(s);
  });

  it("prints every knowsAbout category verbatim", () => {
    const missing = (node.knowsAbout as string[]).filter((k) => !text.includes(k));
    expect(missing).toEqual([]);
  });

  it("knows about the site's appliance categories: the 12 services + the commercial categories", () => {
    expect(node.knowsAbout).toEqual([
      ...services.map((s) => s.name),
      ...commercialCategories.map((c) => c.label),
    ]);
  });
});
