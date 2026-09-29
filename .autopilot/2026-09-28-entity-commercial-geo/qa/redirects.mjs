// Story 84 QA: every old URL (7 old *.html, /for-business, 43 from the old ekfix.us sitemap,
// and every source in lib/redirects) against prod → 308 to a live 200 page, one hop.
import { readFileSync, writeFileSync } from "node:fs";
import { load } from "./ts-load.mjs";
const base = process.argv[2] || "http://localhost:3111";
const { redirectRules } = await load("lib/redirects.ts");
const { publishedPaths } = await load("lib/routes.ts");
const live = new Set(publishedPaths());
const old = readFileSync("../old-ekfix-urls.txt", "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => { const s = l.trim().split(/\s+/)[0]; try { return decodeURI(new URL(s, "https://ekfix.us").pathname); } catch { return s; } });
// pattern rules (/…/:slug.html) are exercised with a real slug
const SAMPLE = { "/appliance-repair/": "refrigerator", "/towns/": "charlotte" };
const expand = (src) => src.includes(":slug") ? src.replace(":slug", Object.entries(SAMPLE).find(([k]) => src.startsWith(k))?.[1] ?? "x") : src;
const html = redirectRules().map((r) => expand(r.source)).filter((s) => s.endsWith(".html"));
const sources = [...new Set([...html, "/for-business", ...old, ...redirectRules().map((r) => expand(r.source))])];
const rows = [];
for (const s of sources) {
  const r1 = await fetch(base + encodeURI(s), { redirect: "manual" });
  const loc = r1.headers.get("location");
  let dest = null, st2 = null, loc2 = null;
  if (loc) { dest = new URL(loc, base).pathname + new URL(loc, base).hash; const r2 = await fetch(new URL(loc, base), { redirect: "manual" }); st2 = r2.status; loc2 = r2.headers.get("location"); }
  const destPath = dest ? dest.split("#")[0] : s;
  const ok = (r1.status === 308 && st2 === 200 && live.has(destPath) && !(s !== "/" && destPath === "/" && !s.startsWith("/index"))) || (r1.status === 200 && live.has(s));
  rows.push({ s, st: r1.status, dest, st2, loc2, ok, from: old.includes(s) ? "старый ekfix.us" : html.includes(s) ? "старый *.html" : s === "/for-business" ? "снятый роут" : "lib/redirects" });
}
const L = [`# Редиректы — story 84 (R99)`, ``, `Прогон: ${new Date().toISOString().slice(0, 16)} · \`node --no-warnings qa/redirects.mjs ${base}\` против prod (\`npm start\`), запросы без следования за редиректом (эквивалент \`curl -sI\`).`, `Норма: 308 → назначение ∈ \`publishedPaths()\` отвечает 200 без второго редиректа; не-корневой источник не ведёт на \`/\`; либо старый путь совпадает с живым и сам отвечает 200.`, ``, `| # | Источник | Откуда | Ответ | Назначение | Ответ назначения | Итог |`, `|---|---|---|---|---|---|---|`];
rows.forEach((r, i) => L.push(`| ${i + 1} | \`${r.s}\` | ${r.from} | ${r.st} | ${r.dest ? "`" + r.dest + "`" : "—"} | ${r.st2 ?? "—"}${r.loc2 ? " → " + r.loc2 : ""} | ${r.ok ? "ок" : "**дефект**"} |`));
const c = (f) => rows.filter(f).length;
L.push(``, `**Итого:** ${rows.length} адресов — ${c((r) => r.st === 308)} × 308, ${c((r) => r.st === 200)} × 200 (совпадают с живыми), дефектов ${c((r) => !r.ok)}.`);
writeFileSync("redirects-report.md", L.join("\n") + "\n");
console.log("REDIRECTS", rows.length, "308:", c((r) => r.st === 308), "200:", c((r) => r.st === 200), "defects:", c((r) => !r.ok)); rows.filter((r) => !r.ok).forEach((r) => console.log("  ", JSON.stringify(r)));
