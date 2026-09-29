import type { GuideArticle, GuideCategory } from "./types";
import type { ProblemItem } from "../components/ui/problem-card-grid";
import { business } from "./business";
import { published, routable } from "../lib/publish";

// Knowledge centre /appliance-repair-guide (spec §11). Categories are fixed; articles stay
// drafts until the owner's technical review (R81): no `author`, no dates, reviewedByOwner
// false. With no published article the hub itself has no route and no nav item (story 8).
//
// Writing rules (R80/R82): impersonal, technical, no advertising. Every statement about an
// error code or a procedure is backed by a `sources` entry (primary sources only —
// manufacturer support pages); anything that could not be confirmed is left out.
// `sources` is never rendered.

export const guideCategories: { slug: GuideCategory; label: string }[] = [
  { slug: "refrigerator", label: "Refrigerators" },
  { slug: "dishwasher", label: "Dishwashers" },
  { slug: "washer", label: "Washers" },
  { slug: "dryer", label: "Dryers" },
  { slug: "oven-range", label: "Ovens & Ranges" },
  { slug: "ice-maker", label: "Ice Makers" },
  { slug: "commercial", label: "Commercial Equipment" },
];

/** Page copy for the hub and the article template (no JSX literals in app/**). */
export const guideCopy = {
  home: "Home",
  hub: {
    title: `Appliance Repair Guide | ${business.name}`,
    metaDescription:
      "Technical notes on common appliance faults: symptoms, diagnosis, possible causes, repair steps and when a technician is needed.",
    breadcrumb: "Appliance Repair Guide",
    h1: "Appliance repair guide.",
    lede: "Symptoms, diagnosis, possible causes and repair steps for common household appliance faults, grouped by appliance.",
  },
  article: {
    titleSuffix: ` | ${business.name}`,
    symptoms: "Symptoms",
    diagnosis: "Diagnosis",
    causes: "Possible causes",
    repairSteps: "Repair steps",
    whenToCallPro: "When to call a technician",
    serviceLinkLead: `${business.name} service for this appliance:`,
    meta: {
      model: "Model",
      author: "Written by",
      technician: "Technician",
      published: "Published",
      updated: "Updated",
      pending: "Pending technical review",
    },
  },
  cta: {
    h2: "Ready when you are.",
    body: "$75 diagnostic — waived completely once you book the repair.",
  },
} as const;

// ── Sources (primary: manufacturer support pages; each URL was opened while writing) ──

const S = {
  samsungIce: {
    url: "https://www.samsung.com/us/support/troubleshoot/TSG10002387/",
    title: "Samsung ice maker is not working — Samsung US Support",
  },
  samsungCooling: {
    url: "https://www.samsung.com/us/support/troubleshoot/TSG10003479/",
    title: "Cooling issues with Samsung refrigerator or freezer — Samsung US Support",
  },
  boschE15us: {
    url: "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-error-e15",
    title: "Dishwasher Troubleshooting: E15 Bosch Dishwasher Error Code — Bosch US",
  },
  boschE15uk: {
    url: "https://www.bosch-home.co.uk/customer-service/get-support/dishwashers/e15",
    title: "E15 error code — Bosch Home Appliances UK, Customer Service",
  },
  geElectricDryer: {
    url: "https://products.geappliances.com/appliance/gea-support-search-content?contentId=16921",
    title: "Electric Dryer - Runs But Does Not Heat — GE Appliances",
  },
  geGasDryer: {
    url: "https://products.geappliances.com/appliance/gea-support-search-content?contentId=16922",
    title: "Gas Dryer - Runs But Does Not Heat — GE Appliances",
  },
  whirlpoolDryer: {
    url: "https://producthelp.whirlpool.com/Laundry/Dryers/Product_Info/Dryer_Product_Assistance/Dryer_is_Not_Heating",
    title: "Dryer is Not Heating — Product Help, Whirlpool",
  },
  whirlpoolGasDryer: {
    url: "https://producthelp.whirlpool.com/Laundry/Dryers/Dryer/Operation/Not_Heating/Not_Heating_-_Gas_Dryer",
    title: "Not Heating - Gas Dryer — Product Help, Whirlpool",
  },
  geElectricOven: {
    url: "https://products.geappliances.com/appliance/gea-support-search-content?contentId=16242",
    title: "Electric Range - Oven Doesn't Heat But Burners Do Heat — GE Appliances",
  },
  geGasOven: {
    url: "https://products.geappliances.com/appliance/gea-support-search-content?contentId=38007",
    title: "Gas Range - Oven Does Not Heat, But The Burners Heat — GE Appliances",
  },
  geBurners: {
    url: "https://products.geappliances.com/appliance/gea-support-search-content?contentId=17827",
    title:
      "Gas Range & Cooktop - Common Causes for Slow Ignition, No Ignition or Clicking on Surface Burners — GE Appliances",
  },
  whirlpoolBurners: {
    url: "https://producthelp.whirlpool.com/Cooking/Cooktops/Product_Info/Cooktop_Product_Assistance/Gas_Burners_are_Clicking_but_Not_Lighting",
    title: "Gas Burners are Clicking but Not Lighting — Product Help, Whirlpool",
  },
} as const;

const src = (s: { url: string; title: string }, claim: string) => ({ claim, url: s.url, title: s.title });

// Drafts: no author, no technician, no dates until the owner has reviewed them (R83).
const DRAFT = { status: "draft", reviewedByOwner: false } as const;

export const articles: GuideArticle[] = [
  {
    ...DRAFT,
    slug: "refrigerator-not-cooling-freezer-works",
    category: "refrigerator",
    title: "Refrigerator not cooling but freezer works",
    metaDescription:
      "Freezer cold, fresh-food section warm: how to check airflow, vents, frost and door seals, and what points to a fault behind the panels.",
    symptoms: [
      "Freezer holds temperature",
      "Fresh-food section is warm",
      "Weak or no airflow from the vents",
      "Frost or ice on the rear wall",
    ],
    diagnosis: [
      "Check the interior vents. Food packed against the vents blocks circulation; keep items about 2 inches clear of them.",
      "Look at the vents on the back wall of the fresh-food section. If they are covered in ice or frost, air cannot pass and the ice has to be cleared.",
      "Test the door seals with a paper bill closed in the door: slight resistance when pulling it out means the seal is working; if it slips out easily, the gasket needs cleaning or service.",
    ],
    causes: [
      {
        cause: "Blocked interior vents",
        detail:
          "Food stored against the vents stops cold air from circulating through the fresh-food section.",
      },
      {
        cause: "Ice or frost over the rear vents",
        detail:
          "Ice covering the vent openings on the back wall blocks the air path into the compartment.",
      },
      {
        cause: "Leaking door seal",
        detail:
          "A gasket that lets a paper bill slip out without resistance allows cold air to escape.",
      },
    ],
    repairSteps: [
      "Clear the vents — Rearrange food so nothing sits within about 2 inches of the interior vents.",
      "Remove ice from the rear vents — If ice or frost covers the vents on the back wall, it has to be cleared before air can flow again.",
      "Check the door seals — Repeat the paper-bill test around each door; clean a gasket that fails, and have it serviced if it still fails.",
    ],
    whenToCallPro:
      "If the vents are clear and ice-free, the seals pass the paper-bill test and the fresh-food section is still warm, the fault is behind the interior panels. Diagnosing it means removing panels on a powered unit. Any work on the sealed refrigerant system is technician work only.",
    serviceSlug: "refrigerator",
    sources: [
      src(S.samsungCooling, "Keep food 2 inches clear of the interior vents; blocking them prevents proper air circulation."),
      src(S.samsungCooling, "If the vents on the back wall of the refrigerator are covered in ice or frost, it will need to be cleared away."),
      src(S.samsungCooling, "Door seal test with a bill: slight resistance means the seal works; if it slips out easily, clean the seals or request service."),
    ],
  },
  {
    ...DRAFT,
    slug: "samsung-refrigerator-ice-maker-problems",
    category: "ice-maker",
    title: "Samsung refrigerator ice maker problems",
    metaDescription:
      "Samsung ice maker not making ice: freezer temperature, Ice Off setting, bucket seating, water filter and pressure checks, and the Test button reset.",
    model: "Samsung refrigerators with a built-in ice maker (freezer or fresh-food compartment)",
    appliesTo: { brand: "Samsung" },
    symptoms: [
      "No ice in the bucket",
      "Ice production slower than usual",
      "Ice maker stopped after a filter change or power-up",
    ],
    diagnosis: [
      "Check the freezer temperature: the freezer must be at 0°F or less for the ice maker to produce ice.",
      "Check the control panel: if the Ice Off icon is lit, the ice maker is switched off.",
      "On models with the ice maker in the fresh-food compartment, confirm the ice bucket is fully seated and locked in position.",
      "Check the water filter. It is rated for 300 gallons, about 6 months of use; an expired filter restricts water flow.",
      "Check water supply: the home supply valve must be fully open, and the line needs at least 20 psi — enough to fill 6 ounces (3/4 cup) in less than 10 seconds.",
      "Confirm the refrigerator is level so water flows properly through the ice maker.",
    ],
    causes: [
      { cause: "Freezer too warm", detail: "Above 0°F the ice maker does not produce ice." },
      { cause: "Ice maker switched off", detail: "The Ice Off icon on the control panel is lit." },
      {
        cause: "Ice bucket not seated",
        detail: "On fresh-food compartment ice makers the bucket must be fully seated and locked.",
      },
      {
        cause: "Expired water filter",
        detail: "A filter past its 300-gallon (about 6-month) rating restricts water flow.",
      },
      {
        cause: "Low water pressure",
        detail: "Below 20 psi, or with the supply valve not fully open, the ice maker does not fill properly.",
      },
      { cause: "Refrigerator not level", detail: "Water may not flow properly through the ice maker." },
    ],
    repairSteps: [
      "Lower the freezer temperature — Set it to 0°F or less.",
      "Turn the ice maker on — Change the setting so the Ice Off icon is not lit.",
      "Reseat the bucket — Push the ice bucket fully into place until it locks.",
      "Replace the filter — Fit a new filter if the current one is past about 6 months or 300 gallons.",
      "Check the water line — Open the home supply valve fully and confirm the line fills 6 ounces in under 10 seconds.",
      "Reset the ice maker — Press and hold the Test button until a chime sounds (up to 10 seconds).",
      "Allow time — Ice should start within 3 hours; a return to normal amounts can take a full 24 hours.",
    ],
    whenToCallPro:
      "If the ice maker does not respond to the Test button, or production has not returned within 24 hours after the checks above, the fault is in the ice maker assembly or its water supply components and needs service.",
    serviceSlug: "ice-maker",
    sources: [
      src(S.samsungIce, "The freezer needs to be at 0°F or less in order to produce ice."),
      src(S.samsungIce, "The ice maker is on when the Ice Off icon on the control panel is not lit."),
      src(S.samsungIce, "If the ice maker is in the fridge compartment, the ice bucket needs to be fully seated and locked in its proper position."),
      src(S.samsungIce, "The water filter is rated for 300 gallons of usage, about 6 months."),
      src(S.samsungIce, "Minimum water pressure is 20 psi; the line should fill 6 ounces (3/4 cup) in less than 10 seconds; the home supply valve should be fully open."),
      src(S.samsungIce, "The refrigerator should be level so water flows properly through the ice maker."),
      src(S.samsungIce, "Reset: press and hold the Test button until a chime (may take up to 10 seconds)."),
      src(S.samsungIce, "Normal ice production should begin within 3 hours; it may take a full 24 hours to return to normal amounts."),
    ],
  },
  {
    ...DRAFT,
    slug: "bosch-dishwasher-e15-error",
    category: "dishwasher",
    title: "Bosch dishwasher E15 error",
    metaDescription:
      "What the Bosch E15 code means (water detected in the base, leakage protection active), what to check first, and when the base needs service.",
    model: "Bosch dishwashers that display E-codes",
    appliesTo: { brand: "Bosch" },
    symptoms: ["E15 on the display", "Water around the base of the dishwasher"],
    diagnosis: [
      "E15 means the safety switch has detected water in the base of the dishwasher and the leakage protection system has activated.",
      "Turn off the water inflow to the dishwasher before anything else.",
      "Check around the base of the dishwasher for leakage.",
      "Check the hoses for visible kinks or damage.",
    ],
    causes: [
      {
        cause: "Water in the base",
        detail: "The safety switch in the base has detected water and triggered the leakage protection.",
      },
      {
        cause: "Kinked or damaged hose",
        detail: "A visibly kinked or damaged hose can contribute to water reaching the base.",
      },
    ],
    repairSteps: [
      "Stop the water — Turn off the water inflow to the dishwasher.",
      "Inspect the base — Look around the base of the dishwasher for signs of leakage.",
      "Inspect the hoses — Check for visible kinks or damage and replace a damaged hose.",
      "Book service if nothing is visible — With no visible fault, the leak source has to be found by a technician.",
    ],
    whenToCallPro:
      "E15 with no visible leak or hose damage calls for service: Bosch's instruction for this code is to turn off the water inflow and contact service. Keep the water inflow off until the unit has been checked.",
    serviceSlug: "dishwasher",
    sources: [
      src(S.boschE15us, "E15 indicates that the safety switch has detected water in the base of the dishwasher; the leakage protection system has activated."),
      src(S.boschE15us, "For E15, turn off the water inflow and contact customer support."),
      src(S.boschE15uk, "For E15, check around the dishwasher base for leakage and the hoses for any visible kinks or damage."),
      src(S.boschE15uk, "If damaged hoses are visible, replacements can be ordered; if the fault is not visible, book an engineer."),
    ],
  },
  {
    ...DRAFT,
    slug: "dryer-runs-but-does-not-heat",
    category: "dryer",
    title: "Dryer runs but doesn't heat",
    metaDescription:
      "Drum turns, no heat: supply voltage and breakers, cycle selection, gas valve, venting and power cord checks for electric and gas dryers.",
    symptoms: [
      "Drum turns, air stays cold",
      "Loads come out damp after a full cycle",
      "Heat stopped after a move or new installation",
    ],
    diagnosis: [
      "Check the cycle: a heated drying cycle must be selected — not Air Only, Fluff or Cool Down.",
      "Electric dryer: it can run on partial voltage (120 volts) but will not heat without a 208/240-volt supply. The dryer circuit is fused on both sides of the line — one side runs the motor, the other the heating element — so the drum can turn while the heat side is off.",
      "Reset the breaker: turn the dryer circuit breaker off and back on, since it can be partially tripped without looking tripped. Confirm the breaker or fuse has the correct amperage.",
      "Gas dryer: the drum turns but the dryer will not heat if the gas shutoff valve is closed. The valve is open when its handle is parallel to the gas pipe. On a new installation, confirm the gas line has been turned on.",
      "Check airflow: the front of the dryer must not be blocked, and the home venting line should be cleaned every 1–2 years.",
      "Check the power cord: a burned, broken or loose connection at the back of the dryer interrupts power; the terminal screws must be tight.",
    ],
    causes: [
      {
        cause: "Partial voltage or tripped breaker",
        detail: "One side of the 240-volt circuit is out; the motor runs but the heating side has no power.",
      },
      { cause: "No-heat cycle selected", detail: "Air Only, Fluff or Cool Down cycles run without heat." },
      { cause: "Gas valve closed", detail: "On a gas dryer the drum turns but there is no heat with the valve closed." },
      { cause: "Restricted airflow", detail: "A blocked front or a clogged home vent line reduces drying performance." },
      { cause: "Power cord connection", detail: "A burned, broken or loose connection at the terminal block." },
    ],
    repairSteps: [
      "Select a heated cycle — Run a timed or automatic dry cycle, not Air Only, Fluff or Cool Down.",
      "Reset the breaker — Turn the dryer breaker fully off and back on; replace a blown fuse.",
      "Open the gas valve — On a gas dryer, turn the handle parallel to the pipe.",
      "Clear airflow — Unblock the front of the dryer and clean the home vent line if it has not been done in 1–2 years.",
      "Test empty — Run the empty dryer for 5 minutes on a heated setting to confirm heat.",
    ],
    whenToCallPro:
      "If the supply, cycle, gas valve and venting checks pass and there is still no heat, the fault is inside the heating circuit or gas burner assembly. That work involves 240-volt wiring or the gas supply and is for a technician; a burned power-cord connection is also a service call.",
    serviceSlug: "dryer",
    sources: [
      src(S.geElectricDryer, "An electric dryer may run with a partial voltage of 120 volts but will not heat unless it has a 208V/240V supply."),
      src(S.geElectricDryer, "The circuit breaker could be partially tripped; turn it off and back on. Make sure the breaker or fuse has the correct amperage."),
      src(S.geElectricDryer, "The cycle should be a dry cycle, not fluff or cool down. The front of the dryer must not be blocked."),
      src(S.geElectricDryer, "The power cord may have a burned, broken or loose connection at the back of the dryer."),
      src(S.geGasDryer, "Gas dryer: make sure the gas line has been turned on for new installations; proper air flow is needed."),
      src(S.whirlpoolDryer, "Electric dryers require a separate 30-amp circuit fused on both sides of the line: one side operates the motor, the other the heating element."),
      src(S.whirlpoolDryer, "Verify a heated cycle was selected (not Air Only); clean the home venting line every 1-2 years; run a 5-minute test on an empty dryer; terminal screws must be tight."),
      src(S.whirlpoolGasDryer, "The drum of a gas dryer will turn, but the dryer will not heat if the gas shutoff valve is closed; the valve is open when the handle is parallel to the pipe."),
    ],
  },
  {
    ...DRAFT,
    slug: "oven-wont-heat",
    category: "oven-range",
    title: "Oven won't heat",
    metaDescription:
      "Oven cold while the burners work: control settings, door latch, bake element inspection on electric models and igniter glow check on gas models.",
    symptoms: [
      "Oven stays cold, cooktop burners work",
      "Preheat never finishes",
      "No red glow from the gas oven igniter",
    ],
    diagnosis: [
      "Check the controls: the oven must be set to Bake or Broil, and knobs that were removed must be back in their proper positions.",
      "Self-clean models with a mechanical door latch: the latch must be in the unlocked position.",
      "Electric oven: with the range off and power cut at the fuse or circuit breaker, inspect the lower bake element for cracks or breaks.",
      "Gas oven: turn the oven on, open the door and look for a red glow at the Glo-Bar igniter. No glow points to the igniter, the on/off control or other electrical components.",
      "Gas oven after installation: the main gas regulator on the range must be ON. The top burners still work with the regulator off, but the oven does not.",
    ],
    causes: [
      { cause: "Control or knob setting", detail: "Oven not set to Bake or Broil, or knobs refitted in the wrong positions." },
      { cause: "Door latch locked", detail: "A mechanical self-clean latch left in the locked position." },
      { cause: "Failed bake element (electric)", detail: "A cracked or broken lower element does not heat." },
      {
        cause: "Igniter or control fault (gas)",
        detail: "No red glow at the Glo-Bar igniter: the igniter, the on/off control or related electrical parts.",
      },
      { cause: "Gas regulator off (gas)", detail: "Burners run, but the oven gets no gas." },
    ],
    repairSteps: [
      "Check settings — Set the oven to Bake, confirm the knob positions and unlock a mechanical door latch.",
      "Cut power before inspecting — Turn the range off and remove the fuse or switch off the breaker.",
      "Inspect the bake element — Look for cracks or breaks in the lower element (electric).",
      "Check the igniter glow — On a gas oven, look for the red glow at the igniter with the oven on.",
      "Check the regulator — On a new gas installation, confirm the main gas regulator is in the ON position.",
    ],
    whenToCallPro:
      "A cracked element, an igniter that does not glow or a control fault needs service. Element replacement is done with power off at the breaker; igniter, gas valve and regulator work involves the gas supply and belongs to a technician.",
    serviceSlug: "stove",
    sources: [
      src(S.geElectricOven, "Make sure the oven controls are set correctly for Bake or Broil and the knobs are in the correct position."),
      src(S.geElectricOven, "On self-clean ranges with a mechanical door latch, the latch must be in the unlocked position."),
      src(S.geElectricOven, "Check the bake element: turn the range off and remove the fuse or turn the breaker off; inspect the lower element for cracks or breaks."),
      src(S.geGasOven, "Turn the oven on, open the door and look for a red glow at the Glo-Bar igniter; no glow may mean a malfunction with the Glo-Bar, the on/off control or other electrical components."),
      src(S.geGasOven, "The main gas regulator must be ON; the top burners still work with the regulator off, but the oven will not."),
      src(S.geGasOven, "Control knobs removed for cleaning must be reinstalled in the proper location."),
    ],
  },
  {
    ...DRAFT,
    slug: "range-burner-wont-ignite",
    category: "oven-range",
    title: "Range burner won't ignite",
    metaDescription:
      "Gas burner clicks but won't light, or lights slowly: burner cap and head position, wet or clogged ports, electrode seating, gas supply and lockout checks.",
    symptoms: [
      "Burner clicks but does not light",
      "Slow or uneven ignition",
      "Igniters keep clicking with the knob off",
    ],
    diagnosis: [
      "Check the burner cap and head: each head must sit in its correct position, and each cap must match its head, lying flat and secure.",
      "Check for moisture: after cleaning or a spill, water in the burner head ignition port and flame ports prevents ignition, and moisture in the switches can make igniters click with the knobs off.",
      "Check the electrode: an electrode that is not seated properly prevents ignition.",
      "Check the ports: food debris in the burner ports restricts gas flow.",
      "Check supply and controls: the range needs power, the gas shut-off must be on, and on models with a Control Lockout the burners stay locked after power is restored until the lock key is held for 3 seconds. On first use, air in the gas line has to be purged by turning on a burner knob.",
    ],
    causes: [
      { cause: "Cap or head misaligned", detail: "A cap that does not match its head or does not sit flat." },
      { cause: "Wet burner or switches", detail: "Moisture in the ignition port, flame ports or switches after cleaning or a spill." },
      { cause: "Electrode not seated", detail: "The electrode is not flush with the cooktop." },
      { cause: "Clogged ports", detail: "Debris in the burner ports restricts gas flow." },
      { cause: "Supply or lockout", detail: "Gas shut-off closed, air in a new line, or Control Lockout active." },
    ],
    repairSteps: [
      "Refit cap and head — Put each head in its correct position with its matching cap lying flat.",
      "Dry the parts — Let the burner parts and switches dry fully; cool air from a hair dryer speeds up drying of the switches.",
      "Seat the electrode — Press down on the electrode with a clockwise twisting motion until it sits flush with the cooktop.",
      "Clear the ports — Clean clogged ports with a straight pin without enlarging or distorting them.",
      "Check supply and lockout — Confirm the gas shut-off is on; release Control Lockout by holding the lock key for 3 seconds where fitted.",
    ],
    whenToCallPro:
      "If the burner still does not light after cleaning, drying and refitting, or the flame needs adjustment, the next step is service. A range that is not connected to the gas supply, and any burner or gas-line adjustment, is work for a qualified gas technician.",
    serviceSlug: "range",
    sources: [
      src(S.geBurners, "Slow or no ignition is caused by wet or dirty burners, moisture in the burner head ignition port and flame ports, an electrode not seated properly, or a burner cap/head in the wrong position."),
      src(S.geBurners, "The burner cap must match its burner head and lay flat and fit securely."),
      src(S.geBurners, "Press down on the electrode using a twisting (clockwise) motion until it sits flush with the cooktop."),
      src(S.geBurners, "Check that the appliance has power."),
      src(S.whirlpoolBurners, "Surface burners are in Control Lockout when power is first supplied or restored; touch the lock key for 3 seconds to deactivate."),
      src(S.whirlpoolBurners, "On first use, turn on a burner knob to release air from the gas lines."),
      src(S.whirlpoolBurners, "Check that the appliance is connected to the gas supply and the shut-off is on; if not connected, contact a qualified gas technician."),
      src(S.whirlpoolBurners, "Clicking with knobs off can be moisture in the switches; allow drying time or use cool air from a hair dryer."),
      src(S.whirlpoolBurners, "Clean clogged burner ports with a straight pin; do not enlarge or distort the port. Burner adjustment: contact a trained repair specialist."),
    ],
  },
];

/** Published articles — sitemap, links, nav ("Guides" only when this is non-empty). */
export const publishedArticles = (): GuideArticle[] => published(articles);
/** generateStaticParams for /appliance-repair-guide/[slug] (drafts only in `next dev`). */
export const articleSlugs = (): string[] => articles.filter(routable).map((a) => a.slug);
/** An article only if it may be routed (published, or a draft in `next dev`). */
export const getArticle = (slug: string): GuideArticle | undefined =>
  articles.find((a) => a.slug === slug && routable(a));

/** Hub groups: routable articles per category; a category with none is left out. */
export function guideHubGroups(): { slug: GuideCategory; label: string; articles: GuideArticle[] }[] {
  const live = articles.filter(routable);
  return guideCategories
    .map((c) => ({ ...c, articles: live.filter((a) => a.category === c.slug) }))
    .filter((g) => g.articles.length > 0);
}

export const categoryLabel = (slug: GuideCategory): string =>
  guideCategories.find((c) => c.slug === slug)?.label ?? slug;

/** Repair steps as numbered cards: "Title — detail" → { title, body }. */
export const repairStepItems = (a: GuideArticle): ProblemItem[] =>
  a.repairSteps.map((step) => {
    const [title, ...rest] = step.split(" — ");
    return { title, body: rest.join(" — ") };
  });
