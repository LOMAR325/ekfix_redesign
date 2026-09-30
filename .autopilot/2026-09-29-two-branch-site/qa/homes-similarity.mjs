// Two branch homes must not repeat each other (brief, «Проверка перед сдачей»): section ids of
// each page and the Jaccard similarity of their visible text (3-word shingles), full page and
// main region (header/footer removed). Usage: node homes-similarity.mjs [base]
import { fullText, editorialText } from "../../../scripts/html-text.mjs";
const base = process.argv[2] || "http://localhost:3112";
const get = async (p) => (await fetch(base + p)).text();
const shingles = (t) => {
  const w = t.toLowerCase().replace(/[^a-z0-9$%'\s]/g, " ").split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 2 < w.length; i++) s.add(w.slice(i, i + 3).join(" "));
  return s;
};
const jaccard = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n); };
const sections = (html) =>
  [...html.matchAll(/<section\b([^>]*)>/g)].map((m) => (m[1].match(/\bid="([^"]+)"/) || [, "·"])[1]);
const [c, r] = await Promise.all([get("/commercial-appliance-repair"), get("/appliance-repair")]);
console.log("commercial sections:", sections(c).join(" "));
console.log("residential sections:", sections(r).join(" "));
const sc = new Set(sections(c).filter((x) => x !== "·")), sr = new Set(sections(r).filter((x) => x !== "·"));
console.log("shared section ids:", [...sc].filter((x) => sr.has(x)).join(" ") || "none");
console.log("full-text Jaccard:", jaccard(shingles(fullText(c)), shingles(fullText(r))).toFixed(3));
console.log("main-region Jaccard:", jaccard(shingles(editorialText(c)), shingles(editorialText(r))).toFixed(3));
