// two-branch-site QA (copied from entity-commercial-geo, aria-hidden decorations skipped): every published page (lib/routes.publishedPaths) at 1440×900 and 390×844 against
// `npm start` — WCAG text contrast, horizontal scroll, console errors, <img> loaded; home H1 lines
// and the first two hero buttons. Usage: node --no-warnings pages.mjs [base] → pages-report.md
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { load } from "./ts-load.mjs";
const { chromium } = createRequire(import.meta.url)("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3111";
const { publishedPaths } = await load("lib/routes.ts");
const paths = publishedPaths();
const VIEWS = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];

function audit() {
  const parse = (c) => {
    let m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = c.match(/^color\(srgb ([^)]+)\)$/);
    if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(Number); return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p.length > 3 ? p[3] : 1 }; }
    return null;
  };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const fails = []; let checked = 0, imageBg = 0, unparsed = 0;
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (el.closest("script,style,noscript,svg")) continue;
    if (el.closest('[aria-hidden="true"]')) continue; // decorative (brief 7.1: the stars)
    const rect = el.getBoundingClientRect(); if (rect.width <= 1 || rect.height <= 1) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility !== "visible") continue;
    let op = 1, hidden = false, chain = [], hasImg = false;
    for (let a = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.display === "none" || s.opacity === "0") { hidden = true; break; }
      op *= Number(s.opacity);
      chain.push(s);
    }
    if (hidden) continue;
    const bgs = [];
    for (const s of chain) {
      if (s.backgroundImage !== "none") { hasImg = true; break; }
      const c = parse(s.backgroundColor); if (!c) { unparsed++; continue; }
      if (c.a > 0) bgs.push(c);
      if (c.a >= 1) break;
    }
    if (hasImg) { imageBg++; continue; }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (const c of bgs.reverse()) bg = over(c, bg);
    const fg0 = parse(cs.color); if (!fg0) { unparsed++; continue; }
    const fg = over({ ...fg0, a: fg0.a * op }, bg);
    const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const r = ratio(fg, bg); checked++;
    if (r < (large ? 3 : 4.5)) fails.push({ text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 60), tag: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : ""), ratio: Math.round(r * 100) / 100, fg: hex(fg), bg: hex(bg), size, large });
  }
  return { checked, imageBg, unparsed, fails, scroll: { sw: document.documentElement.scrollWidth, iw: innerWidth } };
}

const browser = await chromium.launch();
const results = [];
let home = {};
for (const v of VIEWS) {
  for (const p of paths) {
    const page = await browser.newPage({ viewport: { width: v.w, height: v.h } });
    const errors = [], bad = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 160)));
    page.on("response", (r) => { if (r.url().startsWith(base) && r.status() >= 400) bad.push(r.status() + " " + r.url().slice(base.length)); });
    const res = await page.goto(base + p, { waitUntil: "load", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    // Walk the page slowly so every loading="lazy" image enters the viewport and starts,
    // wait for them at the bottom, and only then go back to the top. (A 60ms walk + an
    // immediate jump back left lazy images below the fold unstarted — 39 false "not loaded".)
    await page.evaluate(async () => { for (let y = 0; y <= document.documentElement.scrollHeight; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } });
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.addEventListener("load", r); i.addEventListener("error", r); setTimeout(r, 8000); }))));
    const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0 })));
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(400);
    const a = await page.evaluate(audit);
    if (p === "/") {
      home[v.w] = await page.evaluate(() => {
        const h1 = document.querySelector("h1"); const range = document.createRange(); range.selectNodeContents(h1);
        const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
        const btns = [...document.querySelector("section").querySelectorAll("a.btn, button.btn")].slice(0, 2).map((b) => ({ text: b.textContent.trim().replace(/\s+/g, " "), cls: b.className, bg: getComputedStyle(b).backgroundColor, left: Math.round(b.getBoundingClientRect().left), top: Math.round(b.getBoundingClientRect().top) }));
        return { h1: h1.textContent.trim(), lines: tops.size, btns };
      });
    }
    results.push({ p, w: v.w, status: res.status(), errors, bad, imgs, ...a });
    await page.close();
  }
}
await browser.close();

const L = [`# QA страниц — story 81 (R95)`, ``, `Прогон: ${new Date().toISOString().slice(0, 16)} · \`node --no-warnings qa/pages.mjs ${base}\` против \`npm start\` · ${paths.length} опубликованных путей (\`publishedPaths()\`) × 1440×900 и 390×844.`, `Контраст — WCAG 2.x по вычисленным цветам (альфа и opacity наложены на фон предков); порог 4.5:1, крупный текст (≥24px или ≥18.66px bold) 3:1. Текст на фоне-картинке/градиенте не считается автоматически (колонка «на картинке»).`, ``, `| Путь | Ширина | HTTP | Текстов | <4.5 | на картинке | Гориз. скролл | Ошибки консоли | Картинки ок/всего | 4xx/5xx |`, `|---|---|---|---|---|---|---|---|---|---|`];
for (const r of results) L.push(`| ${r.p} | ${r.w} | ${r.status} | ${r.checked} | ${r.fails.length} | ${r.imageBg} | ${r.scroll.sw > r.scroll.iw ? `**да** (${r.scroll.sw}>${r.scroll.iw})` : "нет"} | ${r.errors.length} | ${r.imgs.filter((i) => i.ok).length}/${r.imgs.length} | ${r.bad.length} |`);
const tot = (f) => results.reduce((s, r) => s + f(r), 0);
L.push(``, `**Итого:** ${results.length} прогонов; контраст-нарушений ${tot((r) => r.fails.length)}; гориз. скролл ${tot((r) => (r.scroll.sw > r.scroll.iw ? 1 : 0))}; ошибок консоли ${tot((r) => r.errors.length)}; незагруженных картинок ${tot((r) => r.imgs.filter((i) => !i.ok).length)}; ответов ≥400 ${tot((r) => r.bad.length)}.`, ``);
L.push(`## Главная: H1 и первые кнопки hero`, ``);
for (const w of [1440, 390]) { const h = home[w]; if (!h) continue; L.push(`- **${w}px:** H1 «${h.h1}» — ${h.lines} строк(и) (норма ${w === 1440 ? "≤3" : "≤4"}: ${h.lines <= (w === 1440 ? 3 : 4) ? "ок" : "**нарушение**"}). Кнопки: ${h.btns.map((b, i) => `${i + 1}) «${b.text}» \`${b.cls}\` фон ${b.bg}`).join("; ")}.`); }
const details = results.filter((r) => r.fails.length || r.errors.length || r.bad.length || r.imgs.some((i) => !i.ok) || r.scroll.sw > r.scroll.iw);
L.push(``, `## Находки`, ``);
if (!details.length) L.push(`Нет.`);
for (const r of details) {
  L.push(`### ${r.p} @${r.w}`);
  for (const f of r.fails) L.push(`- контраст ${f.ratio}:1 — «${f.text}» \`${f.tag}\` ${f.fg} на ${f.bg}, ${f.size}px${f.large ? " (крупный)" : ""}`);
  for (const e of r.errors) L.push(`- консоль: ${e}`);
  for (const b of r.bad) L.push(`- ответ: ${b}`);
  for (const i of r.imgs.filter((i) => !i.ok)) L.push(`- картинка не загрузилась: ${i.src}`);
}
writeFileSync("pages-report.md", L.join("\n") + "\n");
