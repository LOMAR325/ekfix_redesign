// Task 11 QA: header height / one row at the menu breakpoints, burger groups at 900px.
const { chromium } = require("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3111";
const widths = [390, 861, 900, 1000, 1024, 1025, 1029, 1030, 1040, 1060, 1080, 1100, 1200, 1279, 1280, 1440];
(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(base + "/", { waitUntil: "load" }); await page.evaluate(() => document.fonts.ready);
    const measure = () => page.evaluate(() => {
      const hd = document.querySelector(".site-header");
      const r = (s) => { const e = document.querySelector(s); return e && e.offsetParent !== null ? Math.round(e.getBoundingClientRect().width) : 0; };
      const kids = [...hd.children].filter((e) => getComputedStyle(e).display !== "none");
      return { h: Math.round(hd.getBoundingClientRect().height), rows: new Set(kids.map((e) => Math.round(e.getBoundingClientRect().top))).size,
        brand: r(".brand"), navLeft: Math.round(document.querySelector(".main-nav").getBoundingClientRect().left), nav: r(".main-nav"), actions: r(".header-actions"), pad: getComputedStyle(hd).paddingLeft, hscroll: document.documentElement.scrollWidth > innerWidth };
    });
    const m = await measure();
    await page.evaluate(() => { const about = [...document.querySelectorAll(".main-nav > a")].find((a) => a.textContent === "About"); if (about) { const g = about.cloneNode(true); g.textContent = "Guides"; about.before(g); } });
    const g = await measure();
    rows.push({ w, ...m, guidesH: g.h, guidesRows: g.rows });
    if (w === 900) {
      await page.reload({ waitUntil: "load" }); await page.evaluate(() => document.fonts.ready);
      await page.click(".nav-toggle");
      const n = await page.locator(".main-nav > .nav-item").count();
      for (let i = 0; i < n; i++) {
        const trig = page.locator(".main-nav > .nav-item").nth(i).locator(".nav-trigger");
        await trig.click(); await page.waitForTimeout(250);
        const open = await page.locator(".main-nav > .nav-item").nth(i).evaluate((it) => { const d = it.querySelector(".nav-dropdown"); const cs = getComputedStyle(d); const r = d.getBoundingClientRect(); const t = it.getBoundingClientRect();
          return { label: it.querySelector(".nav-trigger").textContent.trim(), pos: cs.position, shown: cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0", inFlow: r.top >= t.top && r.bottom <= t.bottom + 1, links: d.querySelectorAll("a").length }; });
        await trig.click(); await page.waitForTimeout(250);
        const closed = await page.locator(".main-nav > .nav-item").nth(i).evaluate((it) => getComputedStyle(it.querySelector(".nav-dropdown")).display === "none");
        console.log("900 burger tap", JSON.stringify(open), "closedOnSecondTap", closed);
      }
      await page.locator(".main-nav > .nav-item").nth(0).locator(".nav-trigger").click();
      await page.screenshot({ path: "11-burger-900.png" });
    }
    await page.close();
  }
  console.log("w | header h | rows | brand | navLeft | nav | actions | padL | hscroll | +Guides h | +Guides rows");
  for (const r of rows) console.log([r.w, r.h, r.rows, r.brand, r.navLeft, r.nav, r.actions, r.pad, r.hscroll, r.guidesH, r.guidesRows].join(" | "));
  await browser.close();
})();
