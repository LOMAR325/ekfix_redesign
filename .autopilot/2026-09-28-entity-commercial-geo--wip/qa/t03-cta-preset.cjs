// Task 03 QA: commercial CTA -> /#book with "I'm contacting you as a…" (and appliance) preset.
const { chromium } = require("/Users/User/.npm/_npx/705bc6b22212b352/node_modules/playwright");
const base = process.argv[2] || "http://localhost:3003";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const read = async () => page.evaluate(() => ({
    url: location.pathname + location.search + location.hash,
    as: document.querySelector("#contact-as")?.value,
    appliance: document.querySelector("#appliance")?.value,
  }));
  await page.goto(base + "/commercial-appliance-repair/commercial-laundry-equipment-repair");
  await page.click(".page-hero .btn-accent");
  await page.waitForURL(/#book/); await page.waitForTimeout(1500);
  console.log("child CTA  ", JSON.stringify(await read()));
  await page.goto(base + "/commercial-appliance-repair");
  await page.click("#hotels a[style]");
  await page.waitForURL(/#book/); await page.waitForTimeout(1500);
  console.log("hub #hotels", JSON.stringify(await read()));
  await page.goto(base + "/?as=Astronaut&appliance=Spaceship#book"); await page.waitForTimeout(1500);
  console.log("unknown    ", JSON.stringify(await read()));
  await page.goto(base + "/?as=Restaurant+or+Caf%C3%A9#book"); await page.waitForTimeout(1500);
  console.log("direct     ", JSON.stringify(await read()));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
