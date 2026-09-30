// Drafts QA: every draft unit with a URL → 404 in prod, absent from sitemap, nav/HTML links and
// JSON-LD of every published page; draft blocks without a URL → their text absent from prod HTML.
// Usage: node --no-warnings drafts.mjs [prod] [dev] → drafts-report.md
import { writeFileSync } from "node:fs";
import { load } from "./ts-load.mjs";
import { visibleText } from "../../../scripts/html-text.mjs";
const prod = process.argv[2] || "http://localhost:3111", dev = process.argv[3] || "http://localhost:3112";
const { publishedPaths, articlePath } = await load("lib/routes.ts");
const { towns } = await load("data/towns.ts");
const { commercialPages, commercialHubPath } = await load("data/commercial.ts");
const { articles, publishedArticles } = await load("data/guides.ts");
const { cases } = await load("data/cases.ts");
const units = [
  ...towns.filter((t) => t.page && t.page.status === "draft").map((t) => ({ kind: "район/город", path: `/towns/${t.slug}` })),
  ...commercialPages.filter((c) => c.status === "draft").map((c) => ({ kind: "коммерческая", path: `${commercialHubPath}/${c.slug}` })),
  ...articles.filter((a) => a.status === "draft").map((a) => ({ kind: "статья", path: articlePath(a.slug) })),
  ...cases.filter((c) => c.status === "draft").map((c) => ({ kind: "кейс", path: `/repair-cases/${c.slug}` })),
];
if (publishedArticles().length === 0) units.push({ kind: "хаб гайдов (0 опубликованных статей)", path: "/appliance-repair-guide" });
const sitemap = await (await fetch(prod + "/sitemap.xml")).text();
const pages = await Promise.all(publishedPaths().map(async (p) => [p, await (await fetch(prod + p)).text()]));
const rows = [];
for (const u of units) {
  const st = (await fetch(prod + u.path, { redirect: "manual" })).status;
  const ds = await fetch(dev + u.path, { redirect: "manual" }).then((r) => r.status).catch(() => "—");
  const inMap = sitemap.includes(`${u.path}</loc>`);
  const linked = pages.filter(([, h]) => new RegExp(`href="${u.path}(["#?/])`).test(h)).map(([p]) => p);
  const inLd = pages.filter(([, h]) => [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].some((m) => m[1].includes(u.path + '"') || m[1].includes(u.path + "#"))).map(([p]) => p);
  rows.push({ ...u, st, ds, inMap, linked, inLd, ok: st === 404 && !inMap && !linked.length && !inLd.length });
}
// draft blocks without a URL: any object with status "draft" in the data modules
const mods = ["towns", "commercial", "guides", "cases", "people", "b2b-segments", "services", "residential", "entry", "reviews", "site", "business"];
const texts = pages.map(([p, h]) => [p, visibleText(h.slice(h.search(/<body/i))).toLowerCase()]);
const blocks = [];
for (const m of mods) {
  const mod = await load(`data/${m}.ts`);
  const seen = new Set();
  const walk = (v, at) => {
    if (!v || typeof v !== "object" || seen.has(v)) return; seen.add(v);
    if (v.status === "draft") {
      const strs = []; const grab = (x) => { if (typeof x === "string" && x.length >= 30 && !/^[/\w.-]+$/.test(x)) strs.push(x.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); else if (x && typeof x === "object") Object.values(x).forEach(grab); };
      Object.entries(v).forEach(([k, x]) => k !== "status" && grab(x));
      const hits = strs.filter((s) => texts.some(([, t]) => t.includes(s.toLowerCase().slice(0, 80))));
      blocks.push({ at, n: strs.length, hits, where: hits.length ? texts.filter(([, t]) => hits.some((s) => t.includes(s.toLowerCase().slice(0, 80)))).map(([p]) => p) : [] });
      return;
    }
    for (const [k, x] of Object.entries(v)) walk(x, `${at}.${k}`);
  };
  for (const [k, v] of Object.entries(mod)) walk(v, `${m}.${k}`);
}
const L = [`# Черновики — недоступность`, ``, `Прогон: ${new Date().toISOString().slice(0, 16)} · \`node --no-warnings qa/drafts.mjs ${prod} ${dev}\`. Черновые единицы берутся из \`data/*\` (статус \`draft\`), проверка — против prod (\`npm start\`); dev-статус — для контроля превью.`, ``, `## Единицы с URL (${rows.length})`, ``, `| Тип | Путь | prod | dev | в sitemap | ссылки с опубл. страниц | в JSON-LD | итог |`, `|---|---|---|---|---|---|---|---|`];
for (const r of rows) L.push(`| ${r.kind} | ${r.path} | ${r.st} | ${r.ds} | ${r.inMap ? "**да**" : "нет"} | ${r.linked.length ? "**" + r.linked.join(", ") + "**" : "нет"} | ${r.inLd.length ? "**" + r.inLd.join(", ") + "**" : "нет"} | ${r.ok ? "ок" : "**дефект**"} |`);
L.push(``, `## Черновые блоки без URL (${blocks.length})`, ``, `Каждый объект со \`status: "draft"\` в \`data/*\` (кроме единиц выше): его строки ≥30 символов ищутся в видимом тексте всех ${pages.length} опубликованных страниц prod.`, ``, `| Блок | строк | найдено в prod |`, `|---|---|---|`);
for (const b of blocks) L.push(`| \`${b.at}\` | ${b.n} | ${b.hits.length ? "**" + b.hits.length + "** — " + b.where.join(", ") + " — «" + b.hits[0].slice(0, 70) + "…»" : "0"} |`);
writeFileSync("drafts-report.md", L.join("\n") + "\n");
console.log("DRAFTS url-units", rows.length, "defects", rows.filter((r) => !r.ok).length, "| blocks", blocks.length, "with hits", blocks.filter((b) => b.hits.length).length);
rows.filter((r) => !r.ok).forEach((r) => console.log("  ", JSON.stringify(r))); blocks.filter((b) => b.hits.length).forEach((b) => console.log("  ", b.at, b.where.join(","), "«" + b.hits[0].slice(0, 80)));
