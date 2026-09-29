// Task 08 QA: home hero (H1 lines, buttons, phone), section order + tones, reviews/brands
// order, "Where we work" vs JSON-LD areaServed, business CTA preset, no h-scroll @390.
const path = require("path");
const { chromium } = require("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3008";
const out = (f) => path.join(__dirname, f);
(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector(".hero-content h1");
      const cs = getComputedStyle(h1);
      const hero = document.querySelector("#home");
      const btns = [...hero.querySelectorAll(".hero-ctas a")].map((a) => `${a.textContent.trim()} [${a.className}] ${a.getAttribute("href")}`);
      const tel = [...hero.querySelectorAll("a[href^='tel:']")].map((a) => a.textContent.trim());
      const content = document.querySelector(".hero-content").getBoundingClientRect();
      const trust = document.querySelector(".hero-trust").getBoundingClientRect();
      return {
        font: cs.fontFamily.split(",")[0],
        h1Lines: +(h1.getBoundingClientRect().height / parseFloat(cs.lineHeight)).toFixed(2),
        h1: h1.innerHTML,
        eyebrow: hero.querySelector(".eyebrow")?.textContent,
        btns, tel,
        save10InHero: hero.textContent.includes("Save 10%"),
        heroContentBottom: Math.round(content.bottom), trustTop: Math.round(trust.top), heroH: Math.round(hero.getBoundingClientRect().height),
        hScroll: document.documentElement.scrollWidth > window.innerWidth,
        scrollW: document.documentElement.scrollWidth,
      };
    });
    console.log(`@${w}`, JSON.stringify(r, null, 1));
    await page.screenshot({ path: out(`t08-hero-${w}.png`) });
    if (w === 390) await page.screenshot({ path: out(`t08-home-390-full.png`), fullPage: true });
    else await page.screenshot({ path: out(`t08-home-1440-full.png`), fullPage: true });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const s = await page.evaluate(() => {
    const bg = (el) => getComputedStyle(el).backgroundColor;
    const sections = [...document.querySelectorAll("body section[id]")].filter((el) => !el.parentElement.closest("section"));
    const tones = sections.map((el) => {
      const inner = el.querySelector(":scope > .cta-band");
      return `${el.id}:${bg(inner || el)}`;
    });
    const adjacentSame = tones.filter((t, i) => i > 0 && t.split(":")[1] === tones[i - 1].split(":")[1]);
    const chips = [...document.querySelectorAll("#family .chip-row a")].map((a) => `${a.textContent}=${a.getAttribute("href")}`);
    const ld = JSON.parse(document.querySelector("script[type='application/ld+json']").textContent);
    const biz = ld["@graph"].find((n) => n["@type"] === "HomeAndConstructionBusiness");
    const served = (biz.areaServed || []).map((p) => `${p["@type"]}:${p.name}`);
    return {
      tones, adjacentSame,
      whoHrefs: [...document.querySelectorAll("#who-we-serve .audience-card a")].map((a) => a.getAttribute("href")),
      equipHrefs: [...document.querySelectorAll("#commercial-equipment .repair-card")].map((a) => a.getAttribute("href")),
      repairCount: document.querySelectorAll("#repair .repair-card").length,
      firstReview: document.querySelector("#reviews .review-card, #reviews [class*=review]")?.textContent.slice(0, 80),
      brands: [...document.querySelectorAll("#brands .brand-cell img")].slice(0, 6).map((i) => i.alt),
      chips, served, rating: !!biz.aggregateRating, image: !!biz.image,
      graphTypes: ld["@graph"].map((n) => n["@type"]),
      ctaLabel: document.querySelector("#business-cta .btn-accent")?.textContent,
    };
  });
  console.log(JSON.stringify(s, null, 1));
  await page.click("#business-cta .btn-accent");
  await page.waitForTimeout(800);
  console.log("after business CTA:", JSON.stringify(await page.evaluate(() => ({ hash: location.hash, as: document.querySelector("#contact-as")?.value, y: Math.round(document.querySelector("#book").getBoundingClientRect().top) }))));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
