// Task 08 QA: count <h1> lines for candidate texts in the real .hero CSS (globals.css + Manrope),
// at 1440x900 and 390x844, without a Next server. Lines = h1 height / computed line-height.
const path = require("path");
const { chromium } = require("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const css = "file://" + path.resolve(__dirname, "../../../app/globals.css");
const candidates = [
  "Commercial &amp; home appliance repair<br><span>in Charlotte.</span>",
  "Appliance repair<br><span>in Charlotte.</span>",
  "Appliance repair,<br><span>Charlotte.</span>",
  "Charlotte<br><span>appliance repair.</span>",
  "Appliance repair<br><span>Charlotte, NC.</span>",
  "<i style='white-space:nowrap;font-style:normal'>in Charlotte.</i>",
  "<i style='white-space:nowrap;font-style:normal'>Commercial &amp;</i>",
  "<i style='white-space:nowrap;font-style:normal'>Appliance</i>",
];
(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const html = `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=block"><link rel="stylesheet" href="${css}"></head><body>${candidates.map((c) => `<section class="hero"><div class="hero-content"><h1>${c}</h1></div></section>`).join("")}</body></html>`;
    const file = path.join(require("os").tmpdir(), "t08-h1.html"); require("fs").writeFileSync(file, html);
    await page.goto("file://" + file, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const rows = await page.$$eval(".hero-content h1", (els) => els.map((el) => {
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight);
      return { text: el.textContent, lines: +(el.getBoundingClientRect().height / lh).toFixed(2), font: cs.fontFamily.split(",")[0], w: Math.round(el.getBoundingClientRect().width), iw: el.querySelector('i') ? Math.round(el.querySelector('i').getBoundingClientRect().width) : '' };
    }));
    console.log(`@${w}`); rows.forEach((r) => console.log(`  ${r.lines}  w=${r.w} ${r.iw}  ${r.font}  ${r.text}`));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
