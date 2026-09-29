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
  kitchenaidIceFd: {
    url: "https://producthelp.kitchenaid.com/Refrigeration/Full-Size_Refrigerators/French_Door_Bottom_Freezer_Refrigerator/Ice_and_Water_Concerns/Ice_and_Dispenser_Concerns/Ice_Production/Not_Making_Ice_-_Refrigerator",
    title: "Not Making Ice - Refrigerator — Product Help, KitchenAid",
  },
  kitchenaidIceSxs: {
    url: "https://producthelp.kitchenaid.com/Refrigeration/Full-Size_Refrigerators/Side_By_Side_Refrigerator/Ice_and_Water_Concerns/Ice_and_Dispenser_Concerns/Ice_Production/Not_Making_Ice/Not_Making_Ice_-_Side_by_Side_Refrigerator",
    title: "Not Making Ice - Side by Side Refrigerator — Product Help, KitchenAid",
  },
  kitchenaidIceGeneral: {
    url: "https://producthelp.kitchenaid.com/Refrigeration/Full-Size_Refrigerators/Product_Info/Product_Assistance/Ice_Maker_Not_Working_-_Troubleshooting",
    title: "Ice Maker Not Working - Troubleshooting — Product Help, KitchenAid",
  },
  kitchenaidPressure: {
    url: "https://producthelp.kitchenaid.com/Refrigeration/Full-Size_Refrigerators/Product_Info/Tips_and_Tricks/Ensuring_Correct_Water_Pressure",
    title: "Ensuring Correct Water Pressure — Product Help, KitchenAid",
  },
  thermadorCodes: {
    url: "https://www.thermador.com/us/support/dishwashers/error-codes",
    title: "Error Codes | Dishwashers Support — Thermador US",
  },
  thermadorDwhd560: {
    url: "https://media3.bsh-group.com/Documents/9001682047_B.pdf",
    title: "Use and Care Guide, Dishwasher DWHD560C — Thermador",
  },
  thermadorDwhd640: {
    url: "https://media3.bsh-group.com/Documents/9001861678_A.pdf",
    title: "Use and Care Guide, Dishwasher DWHD640EFP — Thermador",
  },
  mieleG5006: {
    url: "https://media.miele.com/downloads/9a/3c/01_C7F138384EF71EEEB2AF8A4386E49A3C.pdf",
    title: "Operating Instructions, Dishwasher G 5006, G 5008 (en-US, M.-Nr. 11 694 023) — Miele",
  },
  lgFrontOe: {
    url: "https://www.lg.com/us/support/help-library/lg-washer-what-is-a-front-load-washing-machine-oe-error-code--1337714738535",
    title: "LG Washer - What is a Front Load Washing Machine OE Error Code? — LG USA Support",
  },
  lgTopOe: {
    url: "https://www.lg.com/us/support/help-library/lg-top-load-washer-troubleshooting-an-oe-error-code--1425330996723",
    title: "LG Top Load Washer - Troubleshooting An OE Error Code — LG USA Support",
  },
  samsungWasherCodes: {
    url: "https://www.samsung.com/us/support/troubleshoot/TSG10000997/",
    title: "Samsung washing machine information and error codes — Samsung US Support",
  },
  samsungWasherDrain: {
    url: "https://www.samsung.com/us/support/troubleshoot/TSG10007110/",
    title: "Samsung washing machine will not drain — Samsung US Support",
  },
  samsungWasherFill: {
    url: "https://www.samsung.com/us/support/troubleshoot/TSG10007295/",
    title: "Water fill issues with Samsung washing machines — Samsung US Support",
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
  // ── Task 10: additional drafts (story 70a) ──
  {
    ...DRAFT,
    slug: "kitchenaid-ice-maker-not-making-ice",
    category: "ice-maker",
    title: "KitchenAid ice maker not making ice",
    metaDescription:
      "KitchenAid ice maker not making ice: ice maker switch and reset, freezer temperature, water line and pressure, and filter installation checks.",
    model: "KitchenAid full-size refrigerators with a built-in ice maker (French door and side-by-side)",
    appliesTo: { brand: "KitchenAid" },
    symptoms: [
      "No ice in the bin",
      "Slow ice production",
      "Small, hollow or irregular cubes",
      "Ice stopped after a filter change",
    ],
    diagnosis: [
      "Check that the ice maker is on. An ice maker switched off by accident is a common reason for no ice.",
      "Check the freezer setting: 0 to 5°F (-17 to -15°C) is the range for ice production. A refrigerator running too warm reduces ice production; after changing the controls, wait at least 24 hours before rechecking the temperature.",
      "Check the water supply: the refrigerator must be connected to a cold water supply, the line securely connected and the shutoff valve fully open. Look for kinks; a refrigerator pushed too far back against the wall or cabinet can pinch the line.",
      "Check the water pressure: 30–120 psi (207–827 kPa) at the refrigerator connection, typically optimal at 40–80 psi. Low pressure causes slow or no ice production and small or hollow cubes. A reverse osmosis system can lower the pressure; with one, the system pressure needs to be at least 40–60 psi.",
      "After a filter change, confirm the filter is locked in place and sealing. The installation check: remove the filter from the housing and try to dispense water; if water dispenses, the filter was installed improperly and has to be reinstalled.",
      "On a recently installed side-by-side, the doors, the water dispenser tube connection and the wiring connection at the bottom of the freezer door hinge must be installed as described in the installation instructions.",
      "An ice maker left on without a water line connected can cause a buzzing noise, and the refrigerator, crisper drawers and freezer may run too cold.",
    ],
    causes: [
      { cause: "Ice maker switched off", detail: "Turned off by accident; a common reason for no ice." },
      {
        cause: "Freezer too warm",
        detail: "Above the 0 to 5°F range the ice maker may not work properly and ice production drops.",
      },
      {
        cause: "Restricted water supply",
        detail: "Shutoff valve not fully open, a loose connection, or a kinked or pinched water line.",
      },
      {
        cause: "Low water pressure",
        detail: "Outside 30–120 psi at the connection (with reverse osmosis, system pressure at least 40–60 psi): slow or no ice, small or hollow cubes.",
      },
      {
        cause: "Clogged or badly installed filter",
        detail: "Reduces water flow to the ice maker; the filter is due every 6 months, when the indicator light comes on, or as needed.",
      },
    ],
    repairSteps: [
      "Turn the ice maker on — Press and hold the reset button for a few seconds (the manual shows where it is); without a reset button, unplug the refrigerator for one minute and plug it back in.",
      "Set the freezer — Adjust it to 0–5°F and wait at least 24 hours before rechecking.",
      "Open the water supply — Open the shutoff valve fully, straighten any kinks and keep the refrigerator from pinching the line against the wall.",
      "Check the filter — Confirm it is locked and sealed; replace it at 6 months or when the indicator light is on.",
      "Have the pressure tested — A licensed plumber can test household water pressure if it may be outside 30–120 psi.",
      "Reset and wait — If ice is made but not dropped into the bin, unplug the refrigerator for 1 minute, then check for ice after a couple of hours.",
    ],
    whenToCallPro:
      "If the ice maker is on, the freezer holds 0–5°F, the water line, pressure and filter check out and there is still no ice, the next step is service. Door water-tube and wiring connections at the freezer hinge are checked against the installation instructions.",
    serviceSlug: "ice-maker",
    sources: [
      src(S.kitchenaidIceSxs, "A common reason an ice maker does not make ice is that it was accidentally turned off. Reset: press and hold the reset button for a few seconds; without one, unplug the refrigerator for one minute."),
      src(S.kitchenaidIceSxs, "If the ice maker is making ice but not dumping it into the bin, unplug the refrigerator for 1 minute, then wait a couple of hours and check for ice production."),
      src(S.kitchenaidIceSxs, "If the ice maker is not connected to a water supply line but remains turned on: buzzing noise, refrigerator too cold, crisper food may freeze, freezer too cold."),
      src(S.kitchenaidIceSxs, "If the refrigerator is too warm, ice production can be impacted; wait at least 24 hours between temperature adjustments."),
      src(S.kitchenaidIceSxs, "Recently installed side-by-side: check the doors, the water dispenser tube connection and the wiring connection at the bottom of the freezer door hinge."),
      src(S.kitchenaidIceSxs, "The refrigerator must be installed to a cold water supply; a kink reduces water flow; do not push the refrigerator too far back against the wall or cabinet."),
      src(S.kitchenaidIceSxs, "Replace the water filter every 6 months, when the indicator light comes on, or as needed; a clogged or improperly installed filter reduces water flow to the ice maker."),
      src(S.kitchenaidIceGeneral, "Ensure the water line is securely connected and the valve is fully opened. Freezer temperature between 0 and 5 degrees Fahrenheit (-17 to -15 °C) for optimal ice production; too high and the ice maker may not function properly."),
      src(S.kitchenaidIceFd, "Check that the water filter is locked in place and creating a proper seal; remove the filter from the housing and try to dispense water — if water dispenses, the filter was installed improperly; reinstall it."),
      src(S.kitchenaidPressure, "Water pressure 30–120 psi (207–827 kPa) at the refrigerator connection, typically optimal at 40–80 psi; outside the range: hollow, small or irregular cubes, slow or no ice production. A licensed plumber can test the pressure."),
      src(S.kitchenaidPressure, "Connecting a refrigerator to a reverse-osmosis system could lower its water pressure, so ensure the system pressure is at least 40-60 psi."),
    ],
  },
  {
    ...DRAFT,
    slug: "thermador-dishwasher-e15-error",
    category: "dishwasher",
    title: "Thermador dishwasher E15 error",
    metaDescription:
      "What Thermador code E15 means (water detected in the base, leakage protection active), its equivalent on four-digit displays, and the steps before service.",
    model: "Thermador dishwashers that display E-codes",
    appliesTo: { brand: "Thermador" },
    symptoms: [
      "E15 on the display",
      "E3100 on a four-digit display",
      "E:31-00 or E:30-00 lit alternately (newer models)",
    ],
    diagnosis: [
      "E15 means the safety switch has detected water in the base of the dishwasher and the leakage protection system has activated.",
      "On dishwashers that show four-digit codes, the same condition is listed as E3100. The use and care guide for the DWHD640EFP lists E:30-00 and E:31-00 as the water protection system being activated.",
      "The first action for all of these codes is to turn off the water inflow by closing the water supply valve.",
      "On older two-digit models such as the DWHD560C, a code between E:01 and E:30 that has no entry of its own in the fault table indicates a probable technical fault.",
    ],
    causes: [
      {
        cause: "Water in the base",
        detail: "The safety switch in the base has detected water and triggered the leakage protection.",
      },
      {
        cause: "Technical fault (older models)",
        detail: "On two-digit models, an unlisted code from E:01 to E:30 points to a probable technical fault.",
      },
    ],
    repairSteps: [
      "Turn off the water — Close the water supply valve to the dishwasher.",
      "Note the code — Record the code exactly as displayed; customer service asks for it.",
      "Restart once (older models) — Switch off with the ON/OFF switch and restart after a short time.",
      "Disconnect if it returns — If the code comes back, keep the tap off and pull out the mains plug.",
      "Book service — Thermador's instruction for this code is to contact customer support once the water inflow is off.",
    ],
    whenToCallPro:
      "E15 is a service code: the manufacturer's instruction is to turn off the water inflow and contact support, and the same applies to E3100 and E:31-00 on newer displays. On older models, a code that returns after a restart also goes to customer service.",
    serviceSlug: "dishwasher",
    sources: [
      src(S.thermadorCodes, "E15 - The safety switch has detected water in the base of the dishwasher. The leakage protection system has activated. Turn off the water inflow and contact Thermador Customer Support."),
      src(S.thermadorCodes, "E3100 - The safety switch has detected water in the base of the dishwasher; the leakage protection system has been activated. Turn off the water inflow and contact Customer Support."),
      src(S.thermadorDwhd640, "E:30-00 and E:31-00 light up alternately: water protection system is activated. Close the water supply valve; contact customer service."),
      src(S.thermadorDwhd560, "A different error code (E:01 to E:30): a technical fault has probably occurred. Switch off with the ON/OFF switch and restart after a short time; if the problem recurs, turn off the tap, pull out the mains plug and call customer service, mentioning the error code."),
    ],
  },
  {
    ...DRAFT,
    slug: "miele-dishwasher-error-codes",
    category: "dishwasher",
    title: "Miele dishwasher error codes",
    metaDescription:
      "Miele dishwasher fault numbers F11, F12, F13, F18, F70 and F78: what each one means and the remedy steps from the operating instructions.",
    model: "Miele G 5006 and G 5008 (US operating instructions); other models: the model's own operating instructions",
    appliesTo: { brand: "Miele" },
    symptoms: [
      "Fault number in the time display",
      "Water intake/drainage indicator flashing",
      "Dishwasher stops during a program",
      "Water left in the wash cabinet",
    ],
    diagnosis: [
      "F11 — water drainage fault; there might be water in the wash cabinet.",
      "F12 or F13 — water intake fault. When F and 173 alternate on the time display, the water faucet is turned off.",
      "F18 — a technical fault has occurred.",
      "F70 — the Waterproof system has reacted; the drain pump may still be running with the door open.",
      "F78 — circulation-pump fault; all program selection indicator lights flash.",
      "A fault number not listed in the instructions may be a technical fault: turn the dishwasher off, back on after a few seconds and restart the program. If the indicator lights flash again, it is a technical fault.",
      "The water-connection pressure must be between 7.25 and 145 psi (50 and 1,000 kPa).",
    ],
    causes: [
      {
        cause: "Blocked drain path (F11)",
        detail: "Clogged filter combination, a blocked drain pump, or a kink or loop in the drain hose.",
      },
      {
        cause: "Restricted water intake (F12, F13)",
        detail: "Shut-off valve not fully open, a clogged water-intake filter, or pressure below 7.25 psi (50 kPa).",
      },
      {
        cause: "Drain connection too low (F12, F13)",
        detail: "The on-site drain connection may be too low, in which case the water drainage has to be vented.",
      },
      { cause: "Waterproof system reaction (F70)", detail: "The built-in leak protection has reacted." },
      {
        cause: "Technical or pump fault (F18, F78)",
        detail: "F18 is a technical fault; F78 is a circulation-pump fault that counts as technical if it returns after a restart.",
      },
    ],
    repairSteps: [
      "Switch off first — Turn the dishwasher off before remedying F11, F12 or F13.",
      "Open the water supply (F12, F13) — Open the shut-off valve all the way, clean the water-intake filter and start the program again.",
      "Clean the filters (F11) — Remove the lower spray arm and the filter combination, pull the microfilter away, rinse all filters under running water, refit the combination flat and lock the spray arm.",
      "Clean the drain pump (F11) — Unplug the dishwasher, take out the filters, scoop out the water, press the cover catch inwards and tip the cover to release it. Remove foreign objects carefully (glass splinters are hard to see) and turn the impeller by hand; a little resistance is normal.",
      "Straighten the drain hose (F11) — Remove any kink or loop.",
      "Restart once (F78) — Turn the dishwasher off and back on and restart the program.",
      "Shut off and call (F18, F70) — Turn the dishwasher off, turn off the water-supply faucet and contact Miele service.",
    ],
    whenToCallPro:
      "F18 and F70 go straight to service once the dishwasher and the water supply are off. F78, or an unlisted fault number, goes to service when it returns after a restart. Water-connection pressure below 7.25 psi calls for professional advice on the supply.",
    serviceSlug: "dishwasher",
    sources: [
      src(S.mieleG5006, "Fault number F11 in the time display: water drainage fault; there might be water in the wash cabinet. Turn off the dishwasher; clean the filter combination and the drain pump; remove any kink or loop in the drain hose."),
      src(S.mieleG5006, "Fault number F12 or F13: water-intake fault. Open the shut-off valve all the way and start the program again; clean the water-intake filter; pressure lower than 7.25 psi (50 kPa): seek professional advice; the on-site drainage connection may be too low and need venting. F and 173 alternating: the faucet is turned off."),
      src(S.mieleG5006, "Fault number F18: a technical fault has occurred. Turn off the dishwasher, close the shut-off valve, contact Miele Customer Service."),
      src(S.mieleG5006, "Fault F70: the Waterproof system has reacted; the drain pump may still be running with the door open. Turn off the dishwasher and the water-supply faucet; contact Miele Customer Service."),
      src(S.mieleG5006, "Fault number F78 with all program selection lights flashing: circulation-pump fault. Turn off, turn back on, restart the program; if it appears again it is a technical fault — turn off the dishwasher and the water-supply faucet and contact Miele Customer Service."),
      src(S.mieleG5006, "A fault number not listed: turn off, turn back on after a few seconds, restart the program; if the indicator lights flash again there is a technical fault."),
      src(S.mieleG5006, "The water-connection pressure needs to be between 7.25 and 145 psi (50 and 1,000 kPa)."),
      src(S.mieleG5006, "Cleaning the filters: remove the lower spray arm and filter combination, pull the microfilter away, rinse under running water, reinstall flat and lock the spray arm. Cleaning the drain pump: disconnect power, remove filters, scoop out water, press the cover catch inwards and tip the cover; remove foreign objects (glass splinters are hard to see); turn the impeller by hand — a little resistance is normal."),
    ],
  },
  {
    ...DRAFT,
    slug: "lg-washer-oe-error",
    category: "washer",
    title: "LG washer OE error",
    metaDescription:
      "LG washer OE code means the washer cannot drain: drain hose, drain pump test, pump filter cleaning on front loaders, forced drain on top loaders, and suds.",
    model: "LG front-load and top-load washers",
    appliesTo: { brand: "LG" },
    symptoms: ["OE on the display", "Water remains in the tub", "Heavy suds in the drum"],
    diagnosis: [
      "OE means the washer is unable to drain the water used during the wash cycle. On top-load models the code appears when the washer has been unable to drain for 13 minutes.",
      "Check the drain hose behind the washer for kinks or clogs. On a top loader, pull the washer far enough from the wall to confirm the hose is not bent, clogged or pinched between the washer and the wall.",
      "Front loader: test the drain pump with a SPIN ONLY cycle at HIGH spin speed. A humming sound, and possibly water draining, in the first 15 seconds means the pump motor is running; no hum means the pump is not working.",
      "If the pump hums, the drain pump filter is the next thing to check for a clog.",
      "If the filter is clean, excessive suds can trigger OE: suds create air pockets, the pump draws air instead of water and signals a drain issue.",
    ],
    causes: [
      { cause: "Kinked or clogged drain hose", detail: "Behind the washer, or pinched between the washer and the wall." },
      { cause: "Clogged drain pump filter", detail: "Front loaders: debris in the filter behind the service panel." },
      { cause: "Excessive suds", detail: "Air pockets make the pump draw air instead of water." },
      { cause: "Drain pump not working", detail: "No humming sound during the spin-only test." },
    ],
    repairSteps: [
      "Clear the drain hose — Straighten kinks and remove clogs, then run a spin cycle to see whether OE has cleared.",
      "Run SPIN ONLY — Front loader: select HIGH spin speed and start the spin-only cycle. Top loader: select SPIN ONLY under Special Use; the washer tries to drain the remaining water.",
      "Force a drain (top loaders without SPIN ONLY) — Start a cycle, let it run a few minutes and pause it; after 8 minutes the washer times out, shows DR and tries to drain.",
      "Drain the tub (front loaders) — Unplug the washer, open the service panel at the bottom-left, unclip the small drain hose, remove its cap and drain into a shallow pan. Do not pull the hose too far out; if nothing drains, push it back in about 1 inch.",
      "Clean the pump filter (front loaders) — With a towel underneath, twist the filter counter-clockwise to remove it; clean it and its opening with a soft-bristle brush and warm water (not in a dishwasher), refit it clockwise until it stops and recap the drain hose.",
      "Run a tub clean — Run TUB CLEAN, reduce the detergent dose, then run a new cycle to see whether the code clears.",
    ],
    whenToCallPro:
      "No humming during the spin-only test means the drain pump is not working and the washer needs repair. OE that returns after the hose, filter and tub clean steps (front loaders), or on an empty wash cycle after the forced drain (top loaders), also needs repair service.",
    serviceSlug: "washer",
    sources: [
      src(S.lgFrontOe, "An OE error code indicates the washing machine is unable to drain the water used during the wash cycle; it can be caused by a kinked drain hose or a clogged drain pump filter. Check behind the washer that the drain hose is not kinked or clogged, then run a spin cycle."),
      src(S.lgFrontOe, "Test the drain pump: POWER on, SPIN SPEED to HIGH, start SPIN ONLY; a humming sound and possibly draining water for the first 15 seconds means the pump motor works. No humming: the drain pump is not working and the unit requires repair service."),
      src(S.lgFrontOe, "OE filter cleaning: unplug; open the service panel on the bottom-left; unclip the drain hose, remove its cap and drain into a shallow pan — do not pull the hose too far out; if nothing drains, push it back in about 1 inch; twist the pump filter counter-clockwise to remove; clean with a soft-bristle brush and warm water, not in the dishwasher; refit clockwise until it stops."),
      src(S.lgFrontOe, "OE with a clean filter: excessive suds create air pockets and the pump sucks air instead of water; perform a TUB CLEAN cycle and reduce detergent. If OE appears again, the unit may require repair service."),
      src(S.lgTopOe, "Top load OE: the washer has been unable to drain water for 13 minutes. Check the drain hose is not bent, clogged or pinched between the washer and the wall; run SPIN ONLY (Special Use); then a TUB CLEAN cycle."),
      src(S.lgTopOe, "Top load without SPIN ONLY: start a cycle, pause it after a few minutes; after 8 minutes the unit times out, displays DR and tries to drain. If OE occurs again on an empty wash cycle, the unit requires repair service."),
    ],
  },
  {
    ...DRAFT,
    slug: "samsung-washer-error-codes",
    category: "washer",
    title: "Samsung washer error codes",
    metaDescription:
      "Samsung washer codes for filling (4C, 4E), draining (5C, 5E), door, unbalanced load, leakage and suds: what each means and the checks before service.",
    model: "Samsung washers with a digital display; some codes differ by model — the user manual confirms",
    appliesTo: { brand: "Samsung" },
    symptoms: [
      "Code on the display and the cycle stops",
      "Washer does not fill",
      "Water left in the drum",
      "Cycle does not finish because the load is unbalanced",
    ],
    diagnosis: [
      "4C, 4E or nF — not filling: water is not entering the washer correctly. 4C2 or 4E2 means the hot and cold supply hoses are swapped.",
      "5C, 5E, nd, SC or SE — no drain: water is not draining at the correct speed, or at all. OE, OC, 0E or 0C — overflow: too much water in the washer.",
      "dC, dE, dS, dL, FL or LO — the door is not detected as closed and locked. On some models dC means an unbalanced load instead; the user manual for the model confirms which.",
      "UE, Ub or U6 — the load is unbalanced and the cycle cannot complete. Ur means the washer is retrying to balance the load; it is not a fault.",
      "LE, LC, 1E or 1C — water level or leakage: moisture where it does not belong, or a sensor issue.",
      "SUd, Sd or SUdS — over-sudsing: the washer pauses so the suds can dissipate and then continues. This is not a service code; it comes from incorrect detergent use.",
      "Codes such as 3E have different meanings across models (voltage error on some, motor error on others). A code without its own entry follows the basic steps: power off for 2–3 minutes, power on, restart the cycle.",
    ],
    causes: [
      {
        cause: "Supply problem (4C, 4E)",
        detail: "Hoses on the wrong inlets, bent or kinked; supply valves not fully open; debris blocking the inlet filters.",
      },
      {
        cause: "Drain problem (5C, 5E)",
        detail: "Incorrect drain hose installation (a common cause), a clogged pump filter on front loaders, or a washer that is not level.",
      },
      { cause: "Door not latched (dC, dE)", detail: "Laundry caught in the door, or the latch not secure." },
      { cause: "Unbalanced load (UE, Ub)", detail: "Tangled or unevenly spread laundry." },
      {
        cause: "Leak or suds (LE, 1E, SUd)",
        detail: "A small leak, kinked hoses, or suds from too much or non-HE detergent.",
      },
    ],
    repairSteps: [
      "Check the supply (4C, 4E) — Hot hose to the hot inlet, cold to cold, no kinks; open both valves fully; unplug the washer or switch off its breaker for 1 minute, then retry.",
      "Clean the inlet filters (4C, 4E) — Turn the valves off, disconnect the hoses at the washer, remove debris from the inlet filters, reconnect and open the valves fully.",
      "Check the drain hose (5C, 5E) — Inserted 6–8 inches into the standpipe, secured, not airtight, not kinked; at least 18 inches high (24 for a wash basin) and not above 96 inches (35 for a basin); no extension kit. After a hot cycle, allow about an hour for the water to cool first.",
      "Clean the pump filter (5C, 5E, front loaders) — Top loaders have no removable pump filter. Then start a cycle: the washer should drain at the beginning.",
      "Close the door properly (dC, dE) — Check the latch and that no laundry is caught in the door.",
      "Rebalance the load (UE, Ub) — Untangle and spread the laundry, close the door and restart the cycle.",
      "Clear the suds (LE, 1E, SUd) — Run empty cycles with no detergent or softener until no suds appear.",
      "Reset other codes — Power off for 2–3 minutes, power on and restart the cycle.",
    ],
    whenToCallPro:
      "Service is the next step when a code returns after its checks: a not-filling or leakage code that continues, a washer that does not drain at the start of a test cycle, a damaged door or latch, or any other code that persists after a 2–3 minute power-off. A washer that keeps filling needs its water valves turned off before service. A missing drain-hose holder on the back of the washer is also a service item.",
    serviceSlug: "washer",
    sources: [
      src(S.samsungWasherCodes, "4C, 1 4C, nF, 4E: not filling error — hot to hot and cold to cold, hoses not kinked; open the water valves completely; drain hose 6–8 inches into the drain pipe; unplug or flip the breaker for 1 minute; debris in the inlet filters blocks water; if the code continues, request service."),
      src(S.samsungWasherCodes, "4C2, 4E2, CE, 14C2, nF1: hot/cold error — supply hoses are swapped; connect cold to cold and hot to hot."),
      src(S.samsungWasherCodes, "nd, 5E, SE, 5C, SC, 1 5C: no drain error. OE, 0E, OC, 0C: overflow error — too much water in the washer."),
      src(S.samsungWasherCodes, "dS, dE, dC, dL, FL, LO: door error — latch secure, nothing caught in the door; damaged door or latch: request service. On some models dC is a Door Error, on others an Unbalanced Load Error; see the user manual."),
      src(S.samsungWasherCodes, "dc, Ub, U6, Ur, UE: unbalanced load — untangle and rearrange the laundry, close the door and restart; Ur means the washer is retrying and is not an issue."),
      src(S.samsungWasherCodes, "1E, LE, 1C, LC: water level or leakage error — look for a leak, check hoses are not kinked, run an empty cycle with no additives; suds mean too much or non-HE detergent; if no suds and the code continues, request service. Do not remove the screw holding the drain hose; a missing holder requires service."),
      src(S.samsungWasherCodes, "SUd, Sd, SUdS: excessive suds — the washer stops for a short period and continues automatically; not a service issue; caused by incorrect detergent use."),
      src(S.samsungWasherCodes, "3E is a Voltage Error on some models and a Motor Error on others. All other errors: power off for 2-3 minutes, power on, restart the cycle; if the error continues, request service."),
      src(S.samsungWasherDrain, "Drain hose: not inserted less than 6 or more than 8 inches, secured, not airtight, not kinked, at least 18 inches high (24 for wash basins), not higher than 96 inches (35 for wash basins), no extension kit. Level the washer. Pump filter on front loaders only. The washer should drain at the beginning of the test cycle, otherwise request service. After hot cycles allow approximately one hour for the water to cool."),
      src(S.samsungWasherFill, "If the washer continuously fills with water, turn off the water valves and request service."),
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
