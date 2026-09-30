// two-branch-site checks: the header of each published page belongs to its route group; the
// branch switch leads to the other branch; the entry page works with JS off at 1440/1024/768/390
// (both paths visible, business wider/first, its button above the fold); /api/book for both forms.
// Usage: node --no-warnings branches.mjs [base] → branches-report.md
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { load } from "./ts-load.mjs";
const { chromium } = createRequire(import.meta.url)("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3111";
const { publishedPaths } = await load("lib/routes.ts");
const group = (p) => p === "/" ? "entry" : p.startsWith("/commercial-appliance-repair") ? "commercial"
  : p.startsWith("/appliance-repair-guide") ? "shared" : p.startsWith("/appliance-repair") || p.startsWith("/towns") ? "residential" : "shared";
const L = ["# Ветки: шапки, переключатель, страница выбора, формы", "", "| Путь | Группа | Шапка | Переключатель | Логотип → | итог |", "|---|---|---|---|---|---|"];
let defects = 0;
for (const p of publishedPaths()) {
  const html = await (await fetch(base + p)).text();
  const header = html.match(/<header[^>]*>[\s\S]*?<\/header>/)?.[0] ?? "";
  const sw = header.match(/class="branch-switch"[^>]*href="([^"]+)"|href="([^"]+)"[^>]*class="branch-switch"/);
  const swHref = sw ? sw[1] || sw[2] : "";
  const brand = (header.match(/href="([^"]+)"[^>]*class="brand"|class="brand"[^>]*href="([^"]+)"/) || []).slice(1).find(Boolean);
  const nav = /Equipment/.test(header) ? "commercial" : /We Repair/.test(header) ? "residential" : /For Business/.test(header) && /For Homes/.test(header) ? "shared" : !/main-nav/.test(header) ? "entry" : "?";
  const g = group(p);
  const want = { commercial: ["/appliance-repair", "/commercial-appliance-repair"], residential: ["/commercial-appliance-repair", "/appliance-repair"], shared: ["", "/"], entry: ["", "/"] }[g];
  const ok = nav === g && swHref === want[0] && brand === want[1];
  if (!ok) defects++;
  L.push(`| ${p} | ${g} | ${nav} | ${swHref || "—"} | ${brand} | ${ok ? "ок" : "**дефект**"} |`);
}
const b = await chromium.launch();
let noJsClick = "";
L.push("", "## Страница выбора без JavaScript", "", "| Ширина | H1 | панели (бизнес / дом, px) | бизнес первым | низ кнопки бизнеса / высота окна | гориз. скролл | итог |", "|---|---|---|---|---|---|---|");
for (const [w, h] of [[1440, 900], [1024, 768], [768, 1024], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: false });
  const pg = await ctx.newPage();
  await pg.goto(base + "/", { waitUntil: "load" });
  const r = await pg.evaluate(() => {
    const [bz, hm] = [".branch-panel--business", ".branch-panel--home"].map((s) => document.querySelector(s).getBoundingClientRect());
    const btn = document.querySelector(".branch-panel--business .btn").getBoundingClientRect();
    return { h1: document.querySelectorAll("h1").length, bw: Math.round(bz.width), hw: Math.round(hm.width), first: bz.top < hm.top || bz.left < hm.left, btn: Math.round(btn.bottom), sw: document.documentElement.scrollWidth };
  });
  const ok = r.h1 === 1 && r.first && r.btn <= h && r.sw <= w && (w < 901 || r.bw > r.hw);
  if (!ok) defects++;
  L.push(`| ${w} | ${r.h1} | ${r.bw} / ${r.hw} | ${r.first ? "да" : "нет"} | ${r.btn} / ${h} | ${r.sw > w ? "да" : "нет"} | ${ok ? "ок" : "**дефект**"} |`);
  // a click with JS off still navigates (plain <a>)
  if (w === 1440) { await pg.click(".branch-panel--business .btn"); noJsClick = new URL(pg.url()).pathname; }
  await ctx.close();
}
L.push("", `Клик по «Commercial Service» без JS → ${noJsClick}`, "");
// header switch works (JS on)
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.goto(base + "/commercial-appliance-repair"); await pg.click(".branch-switch"); await pg.waitForURL("**/appliance-repair");
const a = new URL(pg.url()).pathname; await pg.click(".branch-switch"); await pg.waitForURL("**/commercial-appliance-repair");
L.push(`Переключатель: /commercial-appliance-repair → ${a} → ${new URL(pg.url()).pathname}`, "");
await b.close();
L.push("## /api/book", "", "| Запрос | HTTP | ответ | итог |", "|---|---|---|---|");
const post = async (body) => { const r = await fetch(base + "/api/book", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); return [r.status, await r.text()]; };
for (const [name, body, code, key] of [
  ["home валидный", { branch: "home", name: "QA", phone: "000", address: "1 QA St, Charlotte", message: "QA test — ignore" }, 200],
  ["home без address", { branch: "home", name: "QA", phone: "000" }, 400, "address"],
  ["business валидный", { branch: "business", name: "QA", phone: "000", address: "2 QA Ave, Charlotte", message: "" }, 200],
  ["business без name", { branch: "business", phone: "000", address: "2 QA Ave" }, 400, "name"],
  ["business без phone", { branch: "business", name: "QA", address: "2 QA Ave" }, 400, "phone"],
  ["без branch", { name: "QA", phone: "000", address: "x" }, 400, "branch"],
]) {
  const [s, t] = await post(body);
  const ok = s === code && (!key || JSON.parse(t).errors?.[key]);
  if (!ok) defects++;
  L.push(`| ${name} | ${s} | ${t.slice(0, 90).replace(/\|/g, "/")} | ${ok ? "ок" : "**дефект**"} |`);
}
L.push("", `**Дефектов:** ${defects}`);
writeFileSync("branches-report.md", L.join("\n") + "\n");
console.log("BRANCHES defects", defects);
