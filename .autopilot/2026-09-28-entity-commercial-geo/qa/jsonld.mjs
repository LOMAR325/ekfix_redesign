// Story 82 QA: JSON-LD of every published page (prod HTML) — parses, one @graph, every @id
// reference resolves, one business, Person without surname, and every string value is in the
// page's visible text (URL fields: the resource is on the page). → jsonld-report.md
import { writeFileSync } from "node:fs";
import { load } from "./ts-load.mjs";
import { visibleText, decodeEntities } from "../../../scripts/html-text.mjs";
const base = process.argv[2] || "http://localhost:3111";
const { publishedPaths } = await load("lib/routes.ts");
const { business } = await load("data/business.ts");
const SITE = business.siteUrl.replace(/\/$/, "");
const TEXT_KEYS = new Set(["name", "alternateName", "telephone", "jobTitle", "serviceType", "headline", "text", "description", "knowsAbout", "addressLocality", "addressRegion", "ratingValue", "reviewCount", "areaServed", "email"]);
const URL_KEYS = new Set(["url", "logo", "image", "sameAs", "item"]);
const norm = (s) => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
const rows = []; const issues = [];
for (const p of publishedPaths()) {
  const html = await (await fetch(base + p)).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const body = html.slice(html.search(/<body/i));
  const text = norm(visibleText(body)); const digits = text.replace(/\D/g, "");
  const raw = decodeEntities(html);
  const bad = (m) => issues.push(`${p}: ${m}`);
  let doc; try { doc = JSON.parse(blocks[0]); } catch (e) { bad("JSON не парсится: " + e.message); continue; }
  if (blocks.length !== 1) bad(`${blocks.length} блоков ld+json (нужен 1)`);
  const g = doc["@graph"]; if (!Array.isArray(g)) { bad("нет @graph"); continue; }
  const ids = new Set(g.map((n) => n["@id"]).filter(Boolean));
  const biz = g.filter((n) => n["@id"] === `${SITE}/#business`);
  const bizTyped = g.filter((n) => [].concat(n["@type"]).some((t) => /LocalBusiness|HomeAndConstructionBusiness|Organization|Service$/.test(t) && !/^Service$/.test(t)));
  if (biz.length !== 1) bad(`узлов #business: ${biz.length}`);
  if (bizTyped.length > 1) bad(`бизнес-узлов по @type: ${bizTyped.length}`);
  let refs = 0, strings = 0, urls = 0;
  const walk = (v, key, node) => {
    if (Array.isArray(v)) return v.forEach((x) => walk(x, key, node));
    if (v && typeof v === "object") {
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === "@id") { refs++; if (!ids.has(v["@id"])) bad(`@id не разрешается: ${v["@id"]}`); return; }
      if ([].concat(v["@type"]).includes("Person") && !/^Constantin$/.test(v.name)) bad(`Person.name = ${v.name}`);
      for (const [k, x] of Object.entries(v)) if (!k.startsWith("@")) walk(x, k, v);
      return;
    }
    if (typeof v !== "string" && typeof v !== "number") return;
    const s = String(v);
    if (URL_KEYS.has(key) || /^https?:\/\//.test(s)) {
      urls++;
      const u = new URL(s, SITE); const path = u.origin === SITE ? u.pathname + u.hash : s;
      const own = u.origin === SITE && u.pathname === p;
      const found = own || raw.includes(`href="${path}"`) || raw.includes(`href="${s}"`) || raw.includes(`href="${path}?`) || raw.includes(encodeURIComponent(u.pathname)) || (u.origin === SITE && raw.includes(`"${u.pathname}"`));
      if (!found) bad(`${key}: ресурс не найден на странице — ${s}`);
      return;
    }
    if (!TEXT_KEYS.has(key)) return;
    strings++;
    if (key === "telephone") { if (!digits.includes(s.replace(/\D/g, "").replace(/^1/, ""))) bad(`telephone ${s} нет в тексте`); return; }
    if (key === "reviewCount") { if (!new RegExp(`\\b${s}\\b[^.]{0,40}review|review[^.]{0,40}\\b${s}\\b`).test(text)) bad(`reviewCount ${s} не виден рядом со словом review`); return; }
    if (key === "ratingValue") { if (!text.includes(Number(s).toFixed(1))) bad(`ratingValue ${s} нет в тексте`); return; }
    const want = norm(decodeEntities(s.replace(/<[^>]+>/g, " ")));
    if (!text.includes(want)) bad(`${node["@type"] ?? ""}.${key}: «${s.slice(0, 90)}» нет в видимом тексте`);
  };
  walk(g, "", {});
  rows.push({ p, nodes: g.length, types: g.map((n) => [].concat(n["@type"]).join("+")).join(", "), refs, strings, urls });
}
const L = [`# JSON-LD — story 82 (R96, R23)`, ``, `Прогон: ${new Date().toISOString().slice(0, 16)} · \`node --no-warnings qa/jsonld.mjs ${base}\` по prod-HTML (\`npm start\`), ${rows.length} опубликованных путей.`, `Проверки: JSON парсится; ровно один \`<script type=application/ld+json>\` с \`@graph\`; каждая ссылка \`{"@id"}\` разрешается внутри графа; один узел \`${SITE}/#business\`; \`Person.name === "Constantin"\`; каждое строковое значение (${[...TEXT_KEYS].join(", ")}) есть в видимом тексте страницы (регистр/пробелы/тире нормализованы, телефон — по цифрам, reviewCount — рядом со словом review); URL-поля (${[...URL_KEYS].join(", ")}) — ресурс есть на странице (ссылка, картинка или сама страница).`, ``, `| Путь | Узлов | Типы | @id-ссылок | строк сверено | URL сверено |`, `|---|---|---|---|---|---|`];
for (const r of rows) L.push(`| ${r.p} | ${r.nodes} | ${r.types} | ${r.refs} | ${r.strings} | ${r.urls} |`);
L.push(``, `## Расхождения (${issues.length})`, ``, ...(issues.length ? issues.map((i) => `- ${i}`) : ["Нет."]));
writeFileSync("jsonld-report.md", L.join("\n") + "\n");
console.log("JSONLD pages", rows.length, "issues", issues.length); issues.slice(0, 40).forEach((i) => console.log(" ", i));
