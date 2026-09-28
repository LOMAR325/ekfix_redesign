#!/usr/bin/env node
// npm run check:copy — safety net over the production build (brief 1.5, R26).
// Reads the prerendered HTML in .next/server/app/**/*.html (run `npm run build` first),
// keeps only visible text (no <script>/<style>/comments/attributes) and reports:
//   ERROR (exit 1): "Globall", "#1", "top-rated", "best in", any Cyrillic;
//   REVIEW (no error): \bbest\b, \bmost\b, leading, premier — for a manual read.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { visibleText } from "./html-text.mjs";

const ROOT = fileURLToPath(new URL("../.next/server/app/", import.meta.url));

const ERRORS = [
  ["Globall", /globall/gi],
  ["#1", /#1(?!\d)/g],
  ["top-rated", /top-rated/gi],
  ["best in", /best in/gi],
  ["Cyrillic", /[Ѐ-ӿ]+/g],
];
const REVIEW = [
  ["best", /\bbest\b/gi],
  ["most", /\bmost\b/gi],
  ["leading", /\bleading\b/gi],
  ["premier", /\bpremier\b/gi],
];

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const route = (file) => {
  const r = "/" + relative(ROOT, file).split(sep).join("/").replace(/\.html$/, "");
  return r === "/index" ? "/" : r;
};

function findings(text, patterns) {
  const out = [];
  for (const [label, re] of patterns) {
    for (const m of text.matchAll(re)) {
      const from = Math.max(0, m.index - 50);
      const to = Math.min(text.length, m.index + m[0].length + 50);
      out.push({ label, fragment: `…${text.slice(from, to)}…` });
    }
  }
  return out;
}

if (!existsSync(ROOT)) {
  console.error("check:copy — no .next/server/app. Run `npm run build` first.");
  process.exit(2);
}

const files = htmlFiles(ROOT).sort();
let errorCount = 0;
const review = [];
for (const file of files) {
  const text = visibleText(readFileSync(file, "utf8"));
  for (const f of findings(text, ERRORS)) {
    errorCount += 1;
    console.log(`ERROR  ${route(file)}  «${f.label}»  ${f.fragment}`);
  }
  for (const f of findings(text, REVIEW)) review.push({ page: route(file), ...f });
}

console.log(`\ncheck:copy — ${files.length} pages, ${errorCount} error(s).`);
if (review.length) {
  console.log(`\nFor manual review (${review.length}, not an error):`);
  for (const r of review) console.log(`REVIEW ${r.page}  «${r.label}»  ${r.fragment}`);
}
process.exit(errorCount > 0 ? 1 : 0);
