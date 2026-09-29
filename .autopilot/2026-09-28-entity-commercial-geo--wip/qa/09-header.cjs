// Task 09 QA: header height / one row at several widths, desktop dropdowns, burger menu.
const { chromium } = require("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3109";
const out = process.argv[3] || ".";
(async () => {
  const browser = await chromium.launch();
  for (const w of [390, 1024, 1025, 1100, 1280, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(base + "/commercial-appliance-repair", { waitUntil: "networkidle" });
    const measure = () => page.evaluate(() => {
      const h = document.querySelector(".site-header").getBoundingClientRect().height;
      const tops = [...document.querySelectorAll(".main-nav > a, .main-nav > .nav-item")]
        .filter((e) => e.offsetParent !== null).map((e) => Math.round(e.getBoundingClientRect().top));
      const labels = [...document.querySelectorAll(".main-nav > a, .main-nav > .nav-item > .nav-trigger")].map((e) => e.textContent.trim());
      return { h: Math.round(h), navRows: new Set(tops).size, labels, scrollX: document.documentElement.scrollWidth > innerWidth };
    });
    const m = await measure();
    // worst case: Guides visible (first published article) — inject a sibling link before About.
    await page.evaluate(() => { const about = [...document.querySelectorAll(".main-nav > a")].find((a) => a.textContent === "About"); const g = about.cloneNode(true); g.textContent = "Guides"; about.before(g); });
    const g = await measure();
    console.log(w, "header", m.h, "rows", m.navRows, "| +Guides header", g.h, "rows", g.navRows, "hscroll", m.scrollX, m.labels.join(" | "));
    if (w >= 1025) {
      await page.hover(".main-nav > .nav-item:nth-of-type(1) .nav-trigger");
      await page.waitForTimeout(300);
      await page.screenshot({ path: out + "/09-dd-commercial-" + w + ".png", clip: { x: 0, y: 0, width: w, height: 560 } });
      const dd = await page.evaluate(() => [...document.querySelectorAll(".main-nav > .nav-item")[0].querySelectorAll(".nav-dropdown a")].map((a) => a.textContent + " " + Math.round(a.getBoundingClientRect().height)));
      if (w === 1280) console.log("  commercial dropdown:", dd.join(" / "));
    } else {
      await page.click(".nav-toggle");
      await page.click(".main-nav .nav-item:nth-of-type(1) .nav-trigger");
      await page.waitForTimeout(300);
      const vis = await page.evaluate(() => { const d = document.querySelectorAll(".main-nav > .nav-item")[0].querySelector(".nav-dropdown"); const r = d.getBoundingClientRect(); const cs = getComputedStyle(d); return { shown: cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0", pos: cs.position, h: Math.round(r.height), links: d.querySelectorAll("a").length }; });
      console.log("  burger: Commercial dropdown", JSON.stringify(vis));
      await page.screenshot({ path: out + "/09-burger-" + w + ".png" });
    }
    await page.close();
  }
  await browser.close();
})();
