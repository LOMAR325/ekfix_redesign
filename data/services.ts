import type { CommercialCategory, Service } from "./types";
import { business } from "./business";

// 12 appliance-repair services, content carried over verbatim from appliance-repair/*.html.
// Order matches the "We Repair" menu in index.html.
//
// FAQ answers on every page follow one template with the appliance noun substituted and a
// per-appliance "beyond repair" example; `repairFaqs` reproduces that text exactly.
//
// Geography (spec stories 19, 62): every H1 names the same two places, and those places are
// also the page's JSON-LD `Service.areaServed` — both come from H1_AREAS, so they can't drift.

/** The places a service page's H1 names — Charlotte (the city) and South Charlotte (an area of it). */
const H1_AREAS: Service["areaServed"] = [
  { name: "Charlotte", kind: "city" },
  { name: "South Charlotte", kind: "area" },
];
const AREAS_TEXT = H1_AREAS.map((a) => a.name).join(" & "); // "Charlotte & South Charlotte"
const AREAS_HTML = H1_AREAS.map((a) => a.name).join(" &amp; ");

/** «Refrigerator repair<br><span>in Charlotte & South Charlotte.</span>» (brief 3.5). */
const heroH1 = (name: string): string => `${name} repair<br><span>in ${AREAS_HTML}.</span>`;

/** `<title>`: the service and both places from the H1. */
const seoTitle = (name: string): string => `${name} Repair in ${AREAS_TEXT}, NC | ${business.name}`;

/** Meta description: the service, both places, and the page's own leading faults. */
const seoDescription = (noun: string, faults: string): string =>
  `Same-day ${noun} repair in ${AREAS_TEXT}, NC — ${faults}. EPA 608 & OSHA certified, original parts, warranty on every repair.`;

const Q1_DEFAULT =
  "In most cases we can get a technician out same-day or within 24-48 hours. The repair itself usually takes place in a single visit once the issue is diagnosed and parts are on hand.";

function repairFaqs(opts: {
  noun: string;
  beyondRepair: string;
  q1?: string;
  onSiteExtra?: string;
}): { q: string; a: string }[] {
  const { noun, beyondRepair, q1 = Q1_DEFAULT, onSiteExtra = "" } = opts;
  return [
    { q: `How quickly can you repair my ${noun}?`, a: q1 },
    {
      q: `What if my ${noun} is beyond repair?`,
      a: `If a repair isn't cost-effective — for example ${beyondRepair} — we'll tell you plainly and walk through your options instead of running up a bill on a lost cause.`,
    },
    {
      q: "What guarantee comes with the repair?",
      a: `Every ${noun} repair carries a warranty on both the part and the labor. If the same issue comes back, we come back.`,
    },
    {
      q: `Do I need to bring the ${noun} anywhere?`,
      a: `No — ${noun} repairs are done on-site${onSiteExtra}. We bring diagnostic equipment and common parts on the truck.`,
    },
    {
      q: `How much does ${noun} repair cost?`,
      a: "Diagnostics are $75, fully waived if you go ahead with the repair. The exact repair cost depends on the part needed and the brand, and we give you that number before any work begins.",
    },
  ];
}

// "Where we work" — the 5 full-page towns, all linked. Refrigerator uses a different list (below).
const TOWNS_5: Service["whereWeWork"] = [
  { name: "Charlotte, NC", href: "/towns/charlotte" },
  { name: "Rock Hill, SC", href: "/towns/rock-hill" },
  { name: "Fort Mill, SC", href: "/towns/fort-mill" },
  { name: "Matthews, NC", href: "/towns/matthews" },
  { name: "Indian Trail, NC", href: "/towns/indian-trail" },
];

// "Also repair" chip rows. Pool of "core" appliances; core services list the pool minus self,
// non-core services (ice maker / wine cooler / garbage disposal) list the first 8 of the pool.
const CHIP_NAME: Record<string, string> = {
  refrigerator: "Refrigerator",
  washer: "Washer",
  dryer: "Dryer",
  dishwasher: "Dishwasher",
  stove: "Stove",
  range: "Range",
  cooktop: "Cooktop",
  microwave: "Microwave",
  freezer: "Freezer",
};
const CORE = ["refrigerator", "washer", "dryer", "dishwasher", "stove", "range", "cooktop", "microwave", "freezer"];
const CORE_8 = CORE.slice(0, 8);
const alsoRepair = (slugs: string[]): Service["alsoRepair"] =>
  slugs.map((slug) => ({ name: CHIP_NAME[slug], slug }));
const alsoRepairCore = (self: string): Service["alsoRepair"] =>
  alsoRepair(CORE.filter((s) => s !== self));

export const services: Service[] = [
  {
    slug: "refrigerator",
    name: "Refrigerator",
    formLabel: "Refrigerator",
    title: seoTitle("Refrigerator"),
    metaDescription: seoDescription("refrigerator", "not cooling, leaks, ice maker faults"),
    image: "/images/refrigerator-repair.webp",
    hero: {
      h1: heroH1("Refrigerator"),
      lede: "Not cooling, leaking, or making noise it shouldn't? Diagnosed on the spot and fixed with manufacturer-approved parts — most jobs finished in one visit.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six refrigerator faults<br>we see most often.",
      faq: "Refrigerator repair,<br>answered honestly.",
    },
    problems: [
      { title: "Cooling issues", body: "Not cooling, or cooling unevenly. We check condenser coils, the evaporator fan, and the compressor to restore consistent temperature." },
      { title: "Water leakage", body: "Water pooling inside or under the unit. Usually a water supply line, drain pan, or clogged defrost drain — we find the source, not just mop it up." },
      { title: "Ice maker malfunction", body: "Not producing or not dispensing ice. We repair or replace the water inlet valve, ice mold heater, or control module." },
      { title: "Strange noises", body: "Buzzing, clicking, or grinding. We check the fan motors, compressor, and evaporator coils to isolate the source before replacing anything." },
      { title: "Door seal problems", body: "A worn gasket lets warm air in and spikes your energy bill. We repair or replace door seals so the unit holds temperature properly again." },
      { title: "Electrical faults", body: "Control boards, sensors, and wiring issues. We troubleshoot electrical components safely rather than guessing and swapping parts." },
    ],
    brands: ["Sub-Zero", "Thermador", "Bosch", "Samsung", "LG", "Whirlpool", "KitchenAid", "GE", "Maytag", "Frigidaire", "Viking", "Fisher & Paykel"],
    faqs: repairFaqs({
      noun: "refrigerator",
      q1: "In most cases we can get a technician out same-day or within 24–48 hours. The repair itself usually happens in a single visit once the issue is diagnosed and parts are on hand.",
      beyondRepair: "an aging compressor on an older unit",
      onSiteExtra: " in your kitchen",
    }),
    whereWeWork: [
      { name: "Charlotte, NC", href: "/towns/charlotte" },
      { name: "Matthews" },
      { name: "Fort Mill, SC" },
      { name: "Rock Hill, SC" },
      { name: "Indian Trail" },
      { name: "Waxhaw" },
      { name: "Belmont" },
      { name: "Monroe" },
    ],
    alsoRepair: [],
    // Published fact (Charlotte / Ballantyne pages): newer construction there is heavier on
    // built-in and panel-ready Sub-Zero, Thermador, Bosch and KitchenAid units, which need
    // different tools and a different diagnostic approach. + this page's FAQ: on-site, in the kitchen.
    ballantyneNote: {
      status: "published",
      heading: "Built-in refrigeration in Ballantyne",
      body: "Newer construction in Ballantyne is heavier on built-in and panel-ready refrigerators from Sub-Zero, Thermador, Bosch and KitchenAid. A unit framed into the cabinetry calls for different tools and a different diagnostic approach than a freestanding one, and the repair still happens on-site, in the kitchen.",
    },
  },
  {
    slug: "washer",
    name: "Washer",
    formLabel: "Washer",
    title: seoTitle("Washer"),
    metaDescription: seoDescription("washer", "won't spin, leaks, won't drain"),
    image: "/images/washer-dryer-repair.webp", // TODO: нужно фото стиральной машины — в public/images его нет
    hero: {
      h1: heroH1("Washer"),
      lede: "Not spinning, leaking, or stuck mid-cycle? Diagnosed on the spot and fixed with manufacturer-approved parts — most jobs finished in one visit.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six washer faults<br>we see most often.",
      faq: "Washer repair,<br>answered honestly.",
    },
    problems: [
      { title: "Won't spin", body: "A worn drive belt, failed motor coupling, or a stuck lid/door switch. We check the parts that actually transfer power to the drum." },
      { title: "Leaking water", body: "Usually a worn door seal, a damaged hose, or a cracked tub. We find the exact source before replacing anything." },
      { title: "Won't drain", body: "A clogged drain pump or kinked hose. We clear the blockage and test the pump under a real load." },
      { title: "Excessive vibration", body: "Worn suspension springs, an unbalanced load sensor, or unlevel feet. We stabilize the machine properly, not just re-level it." },
      { title: "Won't start", body: "Door lock, control board, or power supply fault. We troubleshoot the electrical side safely." },
      { title: "Foul odor or mold", body: "Detergent buildup and drainage issues causing residue in the drum and gasket. We clean it out and adjust habits to stop it coming back." },
    ],
    brands: ["Whirlpool", "Samsung", "LG", "Maytag", "GE", "Speed Queen", "Electrolux", "Bosch", "Kenmore", "Amana", "Frigidaire"],
    faqs: repairFaqs({ noun: "washer", beyondRepair: "a cracked tub on an older top-loader" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("washer"),
  },
  {
    slug: "dryer",
    name: "Dryer",
    formLabel: "Dryer",
    title: seoTitle("Dryer"),
    metaDescription: seoDescription("dryer", "no heat, slow drying, won't tumble"),
    image: "/images/dryer-repair.webp",
    hero: {
      h1: heroH1("Dryer"),
      lede: "Not heating, taking forever to finish a cycle, or making noise it shouldn't? Diagnosed on the spot and fixed with manufacturer-approved parts.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six dryer faults<br>we see most often.",
      faq: "Dryer repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not heating", body: "A failed heating element on electric models, or an igniter issue on gas dryers. We test the heat source directly." },
      { title: "Takes multiple cycles to dry", body: "Almost always a clogged lint vent or a failing moisture sensor — a real fire-risk issue we take seriously." },
      { title: "Won't tumble", body: "A broken drive belt or a failing motor. We check both before replacing parts." },
      { title: "Loud thumping or squeaking", body: "Worn drum rollers, glides, or bearings — the usual suspects for a noisy drum." },
      { title: "Won't start", body: "Door switch, thermal fuse, or control board fault. We isolate which one is actually failing." },
      { title: "Overheats or shuts off mid-cycle", body: "Restricted airflow or a failing thermostat. We check the full vent path, not just the machine." },
    ],
    brands: ["Whirlpool", "Samsung", "LG", "Maytag", "GE", "Speed Queen", "Electrolux", "Kenmore", "Amana", "Frigidaire"],
    faqs: repairFaqs({ noun: "dryer", beyondRepair: "a scorched motor from a long-neglected clogged vent" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("dryer"),
  },
  {
    slug: "dishwasher",
    name: "Dishwasher",
    formLabel: "Dishwasher",
    title: seoTitle("Dishwasher"),
    metaDescription: seoDescription("dishwasher", "not cleaning, not draining, leaks"),
    image: "/images/dishwasher-repair.webp",
    hero: {
      h1: heroH1("Dishwasher"),
      lede: "Not cleaning, not draining, or leaking underneath? Diagnosed on the spot and fixed with manufacturer-approved parts — including commercial units.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six dishwasher faults<br>we see most often.",
      faq: "Dishwasher repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not cleaning properly", body: "Clogged spray arms, a dirty filter, or a failing wash pump. We check the whole water-circulation path." },
      { title: "Not draining", body: "A clogged drain hose or a faulty drain pump/check valve — usually a quick fix once we find the blockage." },
      { title: "Leaking", body: "A worn door gasket, a bad float switch, or a loose hose connection. We pressure-test to confirm the source." },
      { title: "Won't start", body: "Door latch, control board, or a tripped thermal fuse. We verify the safety interlocks first." },
      { title: "Strange noises", body: "Worn wash-arm bearings or debris caught in the pump — common, and usually cheap to fix." },
      { title: "Error codes", body: "Brand-specific sensor or control faults. We know the code tables, not just the guesswork." },
    ],
    brands: ["Bosch", "KitchenAid", "Whirlpool", "Samsung", "LG", "GE", "Maytag", "Frigidaire", "Thermador", "Fisher & Paykel"],
    faqs: repairFaqs({ noun: "dishwasher", beyondRepair: "a cracked tub on a 15-year-old unit" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("dishwasher"),
    // Same published observation (panel-ready units in Ballantyne's newer construction) +
    // this page's own facts: brand-specific error codes, manufacturer-approved parts.
    ballantyneNote: {
      status: "published",
      heading: "Panel-ready dishwashers in Ballantyne",
      body: "Ballantyne's newer kitchens often hide the dishwasher behind a cabinet-matched panel, with Bosch, KitchenAid and Thermador among the brands. Their fault codes are brand-specific, so the diagnosis starts from that brand's code table, and the fix uses manufacturer-approved parts.",
    },
  },
  {
    slug: "stove",
    name: "Stove",
    formLabel: "Stove / Range",
    title: seoTitle("Stove"),
    metaDescription: seoDescription("stove", "oven not heating, burners that won't ignite"),
    image: "/images/stove-repair.webp",
    hero: {
      h1: heroH1("Stove"),
      lede: "Oven not heating, burner won't ignite, or self-clean not working? Diagnosed on the spot and fixed with manufacturer-approved parts.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six stove &amp; oven faults<br>we see most often.",
      faq: "Stove repair,<br>answered honestly.",
    },
    problems: [
      { title: "Oven not heating", body: "A failing bake or broil element, or an igniter issue on gas models. We test the actual heat source." },
      { title: "Uneven baking", body: "An inaccurate thermostat or a failing temperature sensor throwing off the whole cook." },
      { title: "Burner won't ignite", body: "A clogged igniter, a faulty spark module, or a burner cap issue — usually a fast fix." },
      { title: "Self-clean cycle fails", body: "The door lock mechanism or control board is the usual culprit." },
      { title: "Control panel unresponsive", body: "Touchpad or control board failure. We diagnose which before replacing either." },
      { title: "Gas smell or burner won't stay lit", body: "Safety-critical — this needs an EPA 608 & OSHA certified technician, not a DIY fix." },
    ],
    brands: ["GE", "Whirlpool", "Samsung", "LG", "Frigidaire", "Maytag", "KitchenAid", "Bosch", "Thor", "Amana"],
    faqs: repairFaqs({ noun: "stove", beyondRepair: "a cracked porcelain interior on an older range" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("stove"),
  },
  {
    slug: "range",
    name: "Range",
    formLabel: "Stove / Range",
    title: seoTitle("Range"),
    metaDescription: seoDescription("range", "burners that won't stay lit, uneven oven heat"),
    image: "/images/stove-repair.webp", // range ≈ freestanding stove; идеально — отдельное фото плиты. stove и range теперь делят фото
    hero: {
      h1: heroH1("Range"),
      lede: "Burner won't stay lit, oven temperature is off, or the griddle zone quit heating? We work on freestanding and professional-grade ranges alike.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six range faults<br>we see most often.",
      faq: "Range repair,<br>answered honestly.",
    },
    problems: [
      { title: "Burner won't stay lit", body: "A worn simmer burner or a failing thermocouple — common on professional-style ranges." },
      { title: "Uneven oven temperature", body: "A convection fan or temperature sensor that needs recalibration." },
      { title: "Griddle or grill zone not heating", body: "A dedicated element or control fault specific to that zone." },
      { title: "Igniter clicking continuously", body: "A spark module issue, or moisture in the ignition switch after cleaning." },
      { title: "Oven door won't seal", body: "Worn hinges or gasket affecting real cooking temperature, not just what the dial says." },
      { title: "Control knobs or display failing", body: "Precision components on professional-grade ranges — we stock parts for the major brands." },
    ],
    brands: ["Thermador", "Viking", "Wolf", "Sub-Zero", "DCS", "JennAir", "Dacor", "Thor", "GE", "KitchenAid"],
    faqs: repairFaqs({ noun: "range", beyondRepair: "a warped burner grate assembly" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("range"),
  },
  {
    slug: "cooktop",
    name: "Cooktop",
    formLabel: "Cooktop",
    title: seoTitle("Cooktop"),
    metaDescription: seoDescription("cooktop", "dead burners, induction pan detection, touch controls"),
    image: "/images/cooktop-repair.webp",
    hero: {
      h1: heroH1("Cooktop"),
      lede: "Burner won't heat, induction isn't detecting pans, or the touch controls stopped responding? Diagnosed on the spot and fixed right.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six cooktop faults<br>we see most often.",
      faq: "Cooktop repair,<br>answered honestly.",
    },
    problems: [
      { title: "Burner won't heat", body: "An element failure on electric models, or an igniter/valve issue on gas." },
      { title: "Induction not detecting pans", body: "A sensor calibration or control board issue specific to induction models." },
      { title: "Uneven heating", body: "A worn element or a faulty control switch on that zone." },
      { title: "Touch controls unresponsive", body: "The glass-top control panel or its board has failed — we test both." },
      { title: "Irregular gas flame", body: "Clogged burner ports or a regulator issue affecting flame shape." },
      { title: "Cooktop won't power on", body: "A wiring or control board fault, safely diagnosed before anything gets replaced." },
    ],
    brands: ["Bosch", "GE", "Samsung", "Whirlpool", "KitchenAid", "Thermador", "Viking", "Frigidaire", "Wolf", "Electrolux"],
    faqs: repairFaqs({ noun: "cooktop", beyondRepair: "a cracked induction glass surface" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("cooktop"),
  },
  {
    slug: "microwave",
    name: "Microwave",
    formLabel: "Microwave",
    title: seoTitle("Microwave"),
    metaDescription: seoDescription("microwave", "no heat, sparking, a stalled turntable"),
    image: "/images/microwave-repair.webp",
    hero: {
      h1: heroH1("Microwave"),
      lede: "Not heating, sparking inside, or the turntable stopped turning? Diagnosed on the spot and fixed with manufacturer-approved parts.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six microwave faults<br>we see most often.",
      faq: "Microwave repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not heating", body: "A faulty magnetron or a bad high-voltage diode — the two most common failure points." },
      { title: "Turntable not turning", body: "A worn motor or a broken coupler underneath the tray." },
      { title: "Sparking inside", body: "A damaged waveguide cover — needs prompt replacement, don't keep running it." },
      { title: "Door won't latch or unit won't start", body: "A door switch failure — this is a safety interlock, not a minor issue." },
      { title: "Display or buttons unresponsive", body: "A control board fault behind the touchpad." },
      { title: "Loud humming or buzzing", body: "A failing transformer or capacitor — we test before replacing the expensive part." },
    ],
    brands: ["Samsung", "LG", "Whirlpool", "GE", "KitchenAid", "Frigidaire", "Bosch", "Maytag"],
    faqs: repairFaqs({ noun: "microwave", beyondRepair: "a failed magnetron on a builder-grade unit" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("microwave"),
  },
  {
    slug: "freezer",
    name: "Freezer",
    formLabel: "Freezer",
    title: seoTitle("Freezer"),
    metaDescription: seoDescription("freezer", "not freezing, frost buildup, constant running"),
    image: "/images/freezer-repair.webp",
    hero: {
      h1: heroH1("Freezer"),
      lede: "Not freezing, running constantly, or leaking water? Diagnosed on the spot and fixed with manufacturer-approved parts — upright, chest, or built-in.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six freezer faults<br>we see most often.",
      faq: "Freezer repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not freezing", body: "A failing compressor or a bad thermostat — we test both before condemning the compressor." },
      { title: "Excessive frost buildup", body: "A failing defrost heater, or a door seal letting humidity in." },
      { title: "Running constantly", body: "Dirty condenser coils or a failing thermostat working overtime." },
      { title: "Water leaking", body: "A clogged defrost drain — usually a quick clear." },
      { title: "Loud noise", body: "An evaporator fan or compressor mount issue." },
      { title: "Runs but food still thaws", body: "Restricted airflow or a failing evaporator fan not moving cold air where it needs to go." },
    ],
    brands: ["Sub-Zero", "GE", "Whirlpool", "Frigidaire", "Samsung", "LG", "Maytag", "U-Line", "True", "Viking"],
    faqs: repairFaqs({ noun: "freezer", beyondRepair: "a sealed-system refrigerant leak on an aging unit" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepairCore("freezer"),
  },
  {
    slug: "ice-maker",
    name: "Ice Maker",
    formLabel: "Ice Maker",
    title: seoTitle("Ice Maker"),
    metaDescription: seoDescription("ice maker", "no ice, hollow cubes, overflowing"),
    image: "/images/ice-maker-repair.webp",
    hero: {
      h1: heroH1("Ice Maker"),
      lede: "Not making ice, dispensing small or hollow cubes, or overflowing? Diagnosed on the spot and fixed — built-in, under-counter, or in-fridge.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six ice maker faults<br>we see most often.",
      faq: "Ice Maker repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not making ice", body: "A faulty water inlet valve or a frozen supply line — the two usual suspects." },
      { title: "Ice tastes or smells off", body: "A filter overdue for replacement, or buildup in the line." },
      { title: "Small or hollow cubes", body: "Low water pressure or a failing inlet valve not filling the mold properly." },
      { title: "Ice maker overflowing", body: "A faulty shutoff arm or control module." },
      { title: "Won't dispense", body: "An auger motor or door solenoid fault in the dispenser mechanism." },
      { title: "Cycles constantly without producing ice", body: "A thermostat or control module failure." },
    ],
    brands: ["Sub-Zero", "U-Line", "Scotsman", "GE", "Samsung", "LG", "Whirlpool", "KitchenAid", "Viking", "Perlick"],
    faqs: repairFaqs({ noun: "ice maker", beyondRepair: "a failed sealed system on a built-in unit" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepair(CORE_8),
  },
  {
    slug: "wine-cooler",
    name: "Wine Cooler",
    formLabel: "Wine Cooler",
    title: seoTitle("Wine Cooler"),
    metaDescription: seoDescription("wine cooler", "temperature drift, compressor noise, condensation"),
    image: "/images/wine-cooler-repair.webp",
    hero: {
      h1: heroH1("Wine Cooler"),
      lede: "Not holding temperature, fluctuating, or the compressor's too loud? Diagnosed on the spot and fixed with manufacturer-approved parts.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six wine cooler faults<br>we see most often.",
      faq: "Wine Cooler repair,<br>answered honestly.",
    },
    problems: [
      { title: "Not cooling to the set temperature", body: "A compressor or thermostat fault — we confirm which before replacing anything." },
      { title: "Temperature fluctuating", body: "A door seal or fan issue letting the internal climate drift." },
      { title: "Loud compressor noise", body: "A worn compressor mount or a refrigerant issue." },
      { title: "Interior light not working", body: "A simple bulb or wiring fault — often the easiest fix on the list." },
      { title: "Condensation buildup", body: "A door seal or humidity control issue." },
      { title: "Control panel unresponsive", body: "A control board failure behind the display." },
    ],
    brands: ["Sub-Zero", "U-Line", "Perlick", "Viking", "True", "Whirlpool", "KitchenAid", "Electrolux", "Wolf"],
    faqs: repairFaqs({ noun: "wine cooler", beyondRepair: "a failed compressor on a dual-zone unit out of warranty" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepair(CORE_8),
  },
  {
    slug: "garbage-disposal",
    name: "Garbage Disposal",
    formLabel: "Garbage Disposal",
    title: seoTitle("Garbage Disposal"),
    metaDescription: seoDescription("garbage disposal", "jams, leaks, slow draining"),
    image: "/images/garbage-disposal-repair.webp",
    hero: {
      h1: heroH1("Garbage Disposal"),
      lede: "Won't turn on, humming but not spinning, or leaking underneath? Diagnosed on the spot and fixed the same visit in almost every case.",
    },
    areaServed: H1_AREAS,
    sectionHeads: {
      problems: "Six garbage disposal faults<br>we see most often.",
      faq: "Garbage Disposal repair,<br>answered honestly.",
    },
    problems: [
      { title: "Won't turn on", body: "A tripped reset button or a wiring fault — often solved in minutes." },
      { title: "Humming but not spinning", body: "A jammed impeller — usually cleared quickly and safely." },
      { title: "Leaking underneath", body: "Worn seals or a cracked housing letting water through." },
      { title: "Slow draining", body: "A clogged discharge line downstream of the unit." },
      { title: "Excessive noise", body: "A foreign object lodged in the grinding chamber." },
      { title: "Frequent tripping", body: "An overheating motor or an electrical fault worth checking before it becomes a bigger problem." },
    ],
    brands: ["GE", "Whirlpool", "KitchenAid", "Kenmore", "Frigidaire"],
    faqs: repairFaqs({ noun: "garbage disposal", beyondRepair: "a cracked housing on an old unit past its service life" }),
    whereWeWork: TOWNS_5,
    alsoRepair: alsoRepair(CORE_8),
  },
];

// The 4 commercial equipment categories (the /about chips; `formLabel` = the equipment preset
// of the business form). Cards link through lib/links.commercialCardHref (published child page,
// else this hub anchor). `image` is a placeholder.
// TODO: реальные коммерческие фото (below are existing residential webp as stand-ins)
export const commercialCategories: CommercialCategory[] = [
  { label: "Commercial Refrigeration", formLabel: "Commercial Refrigeration", image: "/images/refrigerator-repair.webp", href: "/commercial-appliance-repair#horeca" }, // временная замена до реального коммерческого фото
  { label: "Commercial Dishwasher/Warewasher", formLabel: "Commercial Dishwasher", image: "/images/dishwasher-repair.webp", href: "/commercial-appliance-repair#horeca" }, // временная замена до реального коммерческого фото
  { label: "Commercial Laundry Equipment", formLabel: "Commercial Laundry Equipment", image: "/images/dryer-repair.webp", href: "/commercial-appliance-repair#laundry" }, // временная замена до реального коммерческого фото
  { label: "Ice Machine (high-volume)", formLabel: "Ice Machine", image: "/images/ice-maker-repair.webp", href: "/commercial-appliance-repair#horeca" }, // временная замена до реального коммерческого фото
];

export const serviceSlugs: string[] = services.map((s) => s.slug);

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

/** "Refrigerator Repair" — the service page's crumb and JSON-LD `Service.name`. */
export const serviceRepairName = (s: Pick<Service, "name">): string => `${s.name} Repair`;

// Copy shared by all 12 /appliance-repair/[slug] pages (moved verbatim out of the page, spec §2).
// Headings are trusted HTML strings.
export const servicePage = {
  homeCrumb: "Home",
  problems: {
    eyebrow: "Common problems we fix",
    lede: "Every diagnostic includes a plain-language explanation of what's actually wrong — before we touch a part.",
  },
  brands: {
    eyebrow: "Brands we service",
    h2: "Standard to premium.",
    link: { label: "See every brand we service →", href: "/brands" },
  },
  faq: { eyebrow: "FAQ" },
  whereWeWork: { eyebrow: "Where we work", h2: "Charlotte &amp; nearby towns." },
  alsoRepair: { eyebrow: "Also repair", h2: "Other appliances." },
  cta: {
    h2: "Ready when you are.",
    body: "$75 diagnostic — waived completely once you book the repair.",
  },
} as const;

// The residential branch root (ADR 0022). The page itself — the residential home — takes its
// copy from data/residential; service pages use the path and the crumb name.
export const applianceRepairHub = {
  path: "/appliance-repair",
  /** crumb label on every service page, and the JSON-LD crumb name */
  name: "Home Appliance Repair",
} as const;

/**
 * Hero photo of each service page — a dark scene of the appliance with the left side empty for the
 * text (generated from docs/photos/prompts.md, 2026-10-03).
 */
const hero = (slug: string, alt: string) => ({ src: `/images/hero-${slug}.webp`, alt });
export const serviceHeroPhoto: Record<string, { src: string; alt: string; position?: string }> = {
  refrigerator: hero("refrigerator", "French-door refrigerator in a home kitchen, opened for repair"),
  washer: hero("washer", "Front-load washer in a laundry room, drain filter open"),
  dryer: hero("dryer", "Clothes dryer pulled from the wall, vent hose detached"),
  dishwasher: hero("dishwasher", "Built-in dishwasher, door open, kick panel removed"),
  stove: hero("stove", "Gas stove in a home kitchen, oven door open"),
  range: hero("range", "Professional-style range in a home kitchen"),
  cooktop: hero("cooktop", "Gas cooktop with the grates lifted off"),
  microwave: hero("microwave", "Over-the-range microwave with the door open"),
  freezer: hero("freezer", "Upright freezer in a garage, door open"),
  "ice-maker": hero("ice-maker", "Undercounter ice maker with the front grille removed"),
  "wine-cooler": hero("wine-cooler", "Dual-zone wine cooler in a home bar"),
  "garbage-disposal": hero("garbage-disposal", "Garbage disposal under a kitchen sink"),
};
