#!/usr/bin/env node
// npm run check:similarity -- --base http://localhost:3000 --group areas|commercial
// Template test (spec §10 + amendment D01, R93) against a running server (`npm run dev`
// renders drafts). For every pair of pages in the group it prints two Jaccard matrices over
// 3-word shingles, with the group's entity names (and their variants) masked as ⟨X⟩:
//   full      — all visible text of the page region (<main>, else header..footer), no CTA band;
//   editorial — paragraphs, headings, list items, FAQ q+a; no chip/link rows, crumbs, CTA band.
// The publication decision uses the EDITORIAL metric, threshold <= 0.30.
// Group members and names come straight from data/*.ts (Node's built-in type stripping +
// a resolve hook for extensionless relative imports) — no dependencies, no second list.
import { registerHooks } from "node:module";
import { editorialText, fullText } from "./html-text.mjs";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (/^\.\.?\//.test(specifier) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});

const THRESHOLD = 0.3;
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const base = arg("base", "http://localhost:3000").replace(/\/$/, "");
const groupName = arg("group", "areas");

const { towns } = await import("../data/towns.ts");
const { commercialPages } = await import("../data/commercial.ts");
const { commercialCategories } = await import("../data/services.ts");
const { forBusinessSegments } = await import("../data/b2b-segments.ts");
const { site } = await import("../data/site.ts");

// Industry wording that is not a data field on its own (plurals are added automatically).
const INDUSTRY_VARIANTS = {
  horeca: ["Restaurant", "Café", "Cafe", "Kitchen", "Commercial Kitchen", "Hotel", "Hospitality"],
  "property-management": ["Property Manager", "Property Management"],
};

/** Name variants: the name, "A / B" and "A & B" parts, no "(…)", and plurals. */
function variants(names) {
  const out = new Set();
  for (const raw of names.filter(Boolean)) {
    const name = raw.replace(/\s*\([^)]*\)/g, "").trim();
    const parts = [name, ...name.split(/\s*\/\s*/), ...name.split(/\s+&\s+/), name.replace(/^Commercial /, "")];
    for (const p of parts) {
      if (!p) continue;
      out.add(p);
      if (!/s$/i.test(p)) out.add(`${p}s`);
    }
  }
  return [...out];
}

const GROUPS = {
  // charlotte + its areas + the other cities with a page (any status — dev renders drafts)
  areas: () =>
    towns
      .filter((t) => t.page)
      .map((t) => ({
        id: t.slug,
        path: `/towns/${t.slug}`,
        names: [`${t.name}, ${t.state}`, t.name],
      })),
  commercial: () =>
    commercialPages.map((p) => {
      const category = commercialCategories.find((c) => c.formLabel === p.applianceFormLabel);
      const segment = forBusinessSegments.find((s) => s.id === p.segmentId);
      const bare = p.name.replace(/ Repair$/, "").replace(/ Appliance$/, "");
      return {
        id: p.slug,
        path: `/commercial-appliance-repair/${p.slug}`,
        names: variants([
          p.name,
          bare,
          p.applianceFormLabel,
          category?.label,
          segment?.title,
          segment?.eyebrow,
          ...(INDUSTRY_VARIANTS[p.segmentId] ?? []),
        ]),
      };
    }),
};

if (!GROUPS[groupName]) {
  console.error(`Unknown --group "${groupName}". Use: ${Object.keys(GROUPS).join(" | ")}`);
  process.exit(2);
}
const members = GROUPS[groupName]();
const masks = [...new Set(members.flatMap((m) => m.names))].sort((a, b) => b.length - a.length);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const maskRe = new RegExp(`(?<![\\p{L}\\p{N}])(?:${masks.map(escape).join("|")})(?![\\p{L}\\p{N}])`, "giu");

function shingles(text) {
  const masked = text.replaceAll(site.draftBanner, " ").replace(maskRe, " ⟨X⟩ ");
  const words = masked.toLowerCase().match(/⟨x⟩|[\p{L}\p{N}$]+(?:['’][\p{L}]+)?/gu) ?? [];
  const set = new Set();
  for (let i = 0; i + 2 < words.length; i += 1) set.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const s of a) if (b.has(s)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

const pages = [];
for (const m of members) {
  let res;
  try {
    res = await fetch(base + m.path);
  } catch (err) {
    console.error(`Cannot reach ${base} — start the server first (npm run dev). ${err.message}`);
    process.exit(2);
  }
  if (!res.ok) {
    console.log(`skip ${m.path} (HTTP ${res.status})`);
    continue;
  }
  const html = await res.text();
  pages.push({ ...m, full: shingles(fullText(html)), editorial: shingles(editorialText(html)) });
}

console.log(`\ncheck:similarity — group "${groupName}", ${pages.length} page(s), base ${base}`);
console.log(`masked as ⟨X⟩: ${masks.join(", ")}`);
if (pages.length < 2) {
  console.log("\nFewer than two pages reachable — nothing to compare.");
  process.exit(0);
}

const w = Math.max(...pages.map((p) => p.id.length));
const maxOf = (metric) =>
  new Map(
    pages.map((p) => {
      let best = { v: 0, with: "—" };
      for (const q of pages) {
        if (q === p) continue;
        const v = jaccard(p[metric], q[metric]);
        if (v > best.v) best = { v, with: q.id };
      }
      return [p.id, best];
    }),
  );

for (const metric of ["full", "editorial"]) {
  console.log(`\n${metric} text — Jaccard, 3-word shingles`);
  console.log(" ".repeat(w) + "  " + pages.map((_, i) => String(i + 1).padStart(5)).join(""));
  pages.forEach((p, i) => {
    const row = pages.map((q, j) => (i === j ? "    —" : jaccard(p[metric], q[metric]).toFixed(2).padStart(5)));
    console.log(`${p.id.padEnd(w)}  ${row.join("")}   (${i + 1}, ${p[metric].size} shingles)`);
  });
}

const full = maxOf("full");
const editorial = maxOf("editorial");
console.log(`\nMax per page — decision by EDITORIAL, threshold ≤ ${THRESHOLD.toFixed(2)}`);
console.log(`${"page".padEnd(w)}   full  editorial`);
for (const p of pages) {
  const f = full.get(p.id);
  const e = editorial.get(p.id);
  const verdict = e.v > THRESHOLD ? `OVER — keep as draft (vs ${e.with})` : "ok";
  console.log(`${p.id.padEnd(w)}  ${f.v.toFixed(2)}  ${e.v.toFixed(2).padStart(9)}   ${verdict}`);
}
