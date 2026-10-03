import type { CommercialPage, PublishableFaq } from "./types";
import { commercialCategories } from "./services";
import { business } from "./business";
import { owner } from "./people";
import { published, routable } from "../lib/publish";

// Commercial section: the hub /commercial-appliance-repair (ex-/for-business) and its 7
// child pages /commercial-appliance-repair/[slug] (spec §6, stories 28–40, 51–53).
//
// Facts: equipment types come only from text already published on the site (hub segments,
// the #laundry section, commercialCategories, /about); brands only by name from
// data/brands (tier "commercial") or the hub's laundry chips (data/commercial.test.ts).
// Failures are general technical knowledge — no figures, no statistics. New copy is third
// person or impersonal (spec §13). Blocks waiting on owner facts 6/7 are `status: "draft"`
// and never render (the page renders only published sub-blocks).
// `applianceFormLabel` ties an equipment page to its commercialCategories card (lib/links.commercialCardHref);
// `homeCounterparts` — the residential services the same equipment has at home (brief §6); lib/links
// turns them into the cross-branch links.

export const commercialHubPath = "/commercial-appliance-repair";

/** Appliance preset for the form — reuses the existing commercialCategories.formLabel. */
function categoryFormLabel(label: string): string {
  const category = commercialCategories.find((c) => c.label === label);
  if (!category) throw new Error(`data/commercial: unknown commercial category "${label}"`);
  return category.formLabel;
}

// ---------------------------------------------------------------------------
// Commercial CTA (story 53) and the form preset per segment.
// ---------------------------------------------------------------------------
export const commercialCta = {
  label: "Request Service or a Quote",
  cardLink: "Request Service or a Quote →",
  call: `Call ${business.phone}`,
} as const;


// ---------------------------------------------------------------------------
// The commercial home /commercial-appliance-repair (ADR 0022): the former hub and the
// business half of the former `/`, redistributed. Anchors kept: #property-management, #horeca,
// #hotels, #laundry, #process, #formats, #faq-business; new: #industries, #equipment,
// #service-area, #request. New copy is impersonal and built from facts already on the site.
// ---------------------------------------------------------------------------
export const commercialHub = {
  seo: {
    title: `Commercial Appliance Repair in Charlotte, NC | ${business.name}`,
    description:
      "Commercial appliance repair in Charlotte, NC for restaurants, property managers, hotels, and laundry operators — refrigeration, dish machines, ice machines, laundry, ovens and ranges. Written estimates, photo reports, invoice / ACH billing.",
  },
  hero: {
    eyebrow: "For business",
    h1: "Commercial appliance repair<br><span>in Charlotte.</span>",
    lede: "For restaurants, property management companies, hotels, and laundry operators across Charlotte, NC — the same EPA 608 & OSHA certified technician on every visit.",
    requestLabel: "Request Service",
    callLabel: `Call ${business.phone}`,
    // .hero-trust — three steps of the published process (data/b2b-segments.processSteps)
    trust: [
      "Written Estimate Before Any Work",
      "Photo Report After Every Visit",
      "Same-Day Priority When a Slot Is Open",
    ],
    // the same photo as the entry page's For Business panel (owner, 2026-10-03)
    photo: {
      src: "/images/entry-business-technician.webp",
      alt: "Technician checking a commercial refrigerator with refrigerant gauges in a restaurant kitchen",
    },
  },
  industries: {
    eyebrow: "Industries",
    h2: "Kitchens, portfolios,<br>and hotels.",
  },
  equipment: {
    eyebrow: "Equipment",
    h2: "Equipment kept<br>running.",
    lede: "Refrigeration, dish machines, ice machines, on-premise laundry, ovens and ranges — for restaurants, hotels, and managed properties.",
    tag: "Commercial · See service",
  },
  laundry: {
    heading: "Commercial laundry equipment",
    paragraph:
      "For hotels, laundromats, healthcare facilities, and multi-housing properties, we repair and maintain washers, dryers, ironers, and folding machines — not just the individual unit in a resident's apartment, but full on-premise laundry systems.",
    brandsCaption: "These are the commercial laundry brands we service:",
    photo: owner.photos.washerExtractor,
  },
  process: { eyebrow: "How we work", h2: "From the first call<br>to a photo report." },
  why: { eyebrow: "Why property & kitchen managers call us", h2: "Fewer callbacks, less downtime." },
  formats: {
    eyebrow: "Service formats",
    h2: "Ways to work<br>with us.",
    contractHeading: "Maintenance contracts",
    contract:
      "A standing maintenance contract sets recurring preventive visits on a schedule that fits the property or the portfolio, with one point of contact and consolidated invoicing. Scope and visit frequency are agreed up front, in writing.",
  },
  brands: {
    eyebrow: "Commercial brands",
    h2: "Kitchen, refrigeration<br>and laundry brands.",
  },
  reviews: {
    eyebrow: "From a business customer",
    googleEyebrow: "Google reviews",
    h2: "What they say.",
    allReviews: "All reviews →",
  },
  serviceArea: {
    eyebrow: "Service area",
    h2: "Charlotte, Ballantyne,<br>and the towns around them.",
    // the commercial wording moved here from the Ballantyne page (brief §4)
    body: `${business.name} provides commercial appliance repair throughout Charlotte, NC — Ballantyne and South Charlotte included — and the surrounding towns in North and South Carolina. ${owner.name}, the owner and lead technician, lives in the Ballantyne area and works out of it.`,
    // named without a page of their own in this branch (no commercial area pages — brief §3)
    areas: ["South Charlotte", "Ballantyne"],
  },
  faq: { eyebrow: "FAQ", h2: `Working with ${business.name},<br>answered.` },
  request: {
    eyebrow: "Request service",
    h2: "Equipment down?<br><span>Start here.</span>",
    body: "Send the company, the address and what is wrong — or call if it can't wait. A written estimate comes before any work.",
    facts: [
      { k: "COI", v: "Certificate of Insurance naming your company or property, on request." },
      { k: "W-9", v: "Available on request for your accounts payable team." },
      { k: "ACH", v: "Invoice to the business, payment by ACH or on account." },
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// Child-page section copy shared by all 7 pages (headings only — the content is per page).
// ---------------------------------------------------------------------------
export const commercialPageCopy = {
  equipment: {
    eyebrow: "Equipment & brands",
    /** Brands are not listed per page — every brand is serviced (owner, 2026-09-30); one link to /brands. */
    allBrands: { label: "All major brands serviced — see the full list →", href: "/brands" },
    h2: "What gets serviced." },
  failures: {
    eyebrow: "Common failures",
    h2: "What breaks, and<br>what it costs the business.",
    impactLabel: "For the business:",
  },
  call: {
    eyebrow: "How the call works",
    h2: "Four steps,<br>in writing.",
    body: "Every commercial call follows the same path: the request, access and scheduling, an on-site diagnosis with a written estimate, then the repair with a photo report and an invoice to the business. The full process and the service formats are on the main commercial page.",
    processLabel: "How we work →",
    formatsLabel: "Service formats →",
  },
  faq: { eyebrow: "FAQ", h2: "Questions businesses ask." },
  reviews: { eyebrow: "From a business customer", h2: "What they say." },
  links: { eyebrow: "Areas & guides", h2: "Where the work happens." },
  ctaBand: {
    h2: "Equipment down?<br>Start with the form.",
    body: "The form opens with the business option already selected — add the address and what is wrong, or call if it can't wait.",
  },
} as const;

// ---------------------------------------------------------------------------
// Blocks waiting on owner facts — drafts, never rendered.
// ---------------------------------------------------------------------------
/** Fact 7: business diagnostic fee, calls outside 8AM – 8PM, program name. */
const callProcessDraft = {
  status: "draft",
  body: "Awaiting owner fact 7: the diagnostic fee for business accounts and whether calls outside 8AM – 8PM are taken.",
} as const satisfies CommercialPage["callProcess"];

/** Fact 6: commercial equipment and brands beyond what the site already publishes. */
const moreEquipmentDraft = {
  status: "draft",
  items: [],
} as const satisfies CommercialPage["equipment"]["moreEquipment"];

const draftFaq = (q: string, a: string): PublishableFaq => ({ status: "draft", q, a });
const faq = (q: string, a: string): PublishableFaq => ({ status: "published", q, a });

/** A child page plus the one per-page paragraph that introduces its equipment list. */
export type CommercialPageContent = CommercialPage & { equipmentIntro: string };

export const commercialPages: CommercialPageContent[] = [
  {
    status: "published",
    slug: "commercial-refrigerator-repair",
    name: "Commercial Refrigerator Repair",
    kind: "equipment",
    applianceFormLabel: categoryFormLabel("Commercial Refrigeration"),
    homeCounterparts: ["refrigerator"],
    cardImage: "/images/refrigerator-repair.webp",
    seo: {
      title: `Commercial Refrigerator & Walk-In Repair in Charlotte, NC | ${business.name}`,
      description:
        "Repair of commercial refrigerators, walk-ins and walk-in freezers in Charlotte, NC — EPA Universal certified refrigerant work, written estimates, photo reports and invoicing for the business.",
    },
    hero: {
      h1: "Commercial refrigerator<br><span>and walk-in repair.</span>",
      lede: `When a walk-in or a commercial refrigerator stops holding temperature, the stock inside is on a clock. ${business.name} diagnoses the refrigeration system on site in Charlotte, NC, handles the refrigerant side under EPA Universal certification, and puts the estimate in writing before any work starts.`,
    },
    equipmentIntro:
      "The refrigeration covered here is the part of the commercial work already shown on this site: restaurant walk-ins and walk-in freezers, the compressors that drive them, and the refrigerators in hotel rooms.",
    equipment: {
      types: ["Commercial refrigerators", "Walk-ins", "Walk-in freezers", "Walk-in compressors", "In-room refrigerators"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Box won't hold temperature",
        body: "A dirty or blocked condenser coil, a failing condenser fan motor, or a low refrigerant charge from a slow leak all look the same from the outside: the cabinet drifts warm while the compressor runs longer and longer.",
        businessImpact: "Product held above a safe temperature may have to be thrown out, and a warm cooler is a finding in a health inspection.",
      },
      {
        title: "Evaporator iced over",
        body: "A failed defrost heater, defrost timer or termination thermostat lets frost build on the evaporator until air no longer passes through it. Door gaskets that stopped sealing feed the same ice with humid kitchen air.",
        businessImpact: "Airflow fades gradually, so the problem tends to surface only once the back of the walk-in is already warm.",
      },
      {
        title: "Compressor short-cycling or not starting",
        body: "Start components, a contactor, a pressure control tripping on a clogged condenser, or the compressor itself. Diagnosis separates the inexpensive electrical fault from the mechanical one before anything is replaced.",
        businessImpact: "Replacing a compressor that only needed a start relay is money the operation never gets back.",
      },
      {
        title: "Water on the floor",
        body: "A frozen or cracked drain line, a clogged evaporator drain pan or a failed drain-line heater sends defrost water onto the floor instead of into the drain.",
        businessImpact: "Standing water inside a walk-in is a slip hazard for staff and a sanitation problem of its own.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Are you certified to work on the refrigerant in our walk-in?",
        `Yes. ${owner.name} is EPA Universal certified — the certification that covers refrigerant handling on every class of equipment — and OSHA certified.`,
      ),
      faq(
        "Our cooler is warm right now. Can someone come today?",
        "Commercial calls that are actively losing product get priority for a same-day visit whenever a slot is open. Common parts ride on the truck; when one has to be ordered, the timeline comes before any work starts.",
      ),
      faq(
        "Will we know the cost before a compressor or coil is replaced?",
        "Yes. The diagnosis comes first, then a written estimate, and nothing is replaced until it has been approved.",
      ),
      faq(
        "Can the walk-in be put on a maintenance schedule?",
        "Yes, under a standing maintenance contract. Scheduled visits catch a dirty coil or a worn gasket before it becomes a shutdown; the visit schedule and what each visit covers are set out in writing up front.",
      ),
      draftFaq("What does a diagnostic visit cost for a business?", "Awaiting owner fact 7."),
    ],
    photo: { src: "/images/hero-commercial-refrigerator.webp", alt: "Restaurant walk-in cooler with a refrigerant gauge set" },
    reviewAuthors: [],
  },
  {
    status: "published",
    slug: "commercial-dishwasher-repair",
    name: "Commercial Dishwasher Repair",
    kind: "equipment",
    applianceFormLabel: categoryFormLabel("Commercial Dishwasher/Warewasher"),
    homeCounterparts: ["dishwasher"],
    cardImage: "/images/dishwasher-repair.webp",
    seo: {
      title: `Commercial Dishwasher & Warewasher Repair in Charlotte, NC | ${business.name}`,
      description:
        "Commercial dishwasher and warewasher repair for restaurants and cafés in Charlotte, NC — same-day priority when a slot is open, written estimates, photo reports, invoicing by ACH.",
    },
    hero: {
      h1: "Commercial dishwasher<br><span>and warewasher repair.</span>",
      lede: `A dish machine that quits mid-service backs up the whole line. ${business.name} repairs commercial dishwashers and warewashers for restaurants and cafés in Charlotte, NC.`,
    },
    equipmentIntro:
      "Dish machines are named in the kitchen work published on this site — commercial dishwashers, warewashers and the dish line built around them.",
    equipment: {
      types: ["Commercial dishwashers", "Warewashers", "Dish line equipment"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Wash or rinse water too cool",
        body: "A failed tank heater element, a bad thermostat or a booster heater that no longer keeps up leaves the wash and final rinse below temperature.",
        businessImpact: "Plates can come out looking clean without being sanitized — a machine that can't hold its rinse temperature is a health-code problem, not only a slow one.",
      },
      {
        title: "Spots, film and residue",
        body: "Clogged wash arms, worn pump seals, a weak wash pump or a chemical feed that has run dry or failed all leave soil on plates and glassware.",
        businessImpact: "Every rack that runs twice costs labor and water, and cloudy glassware goes back to the bar or to a guest.",
      },
      {
        title: "Won't fill or won't drain",
        body: "A stuck fill solenoid, a failed float switch or a blocked drain valve stops the cycle before it begins or leaves dirty water standing in the tank.",
        businessImpact: "Clean plates run out during the rush and someone has to be taken off the line to wash by hand.",
      },
      {
        title: "Door switch and conveyor faults",
        body: "A worn door switch stops a door-type machine from starting; on a conveyor machine a broken drive or a jammed rack mechanism stops the racks from moving.",
        businessImpact: "On a conveyor unit one stuck part halts the entire dish flow, not a single rack.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Our dish machine went down in the middle of service. How soon can someone get here?",
        "It is handled as an urgent commercial call, and a same-day visit is the aim whenever the schedule has an opening. Frequently used parts travel with the technician, so a first-visit fix is possible when the part is a common one.",
      ),
      faq(
        "Do we get something in writing after the repair?",
        "Yes. Each commercial visit ends with a photo report and a written record of the diagnosis and the work — something to hand the owner or whoever signs off on equipment spending.",
      ),
      faq(
        "Can you bill the restaurant instead of charging a card on the spot?",
        "Yes. The business can be invoiced directly and pay by ACH or on account; a W-9 is available on request for the accounts payable setup.",
      ),
      draftFaq("Do you take dish machine calls after 8PM?", "Awaiting owner fact 7."),
    ],
    reviewAuthors: [],
    photo: { src: "/images/hero-commercial-dishwasher.webp", alt: "Door-type commercial dish machine in a restaurant dish room" },
  },
  {
    status: "published",
    slug: "commercial-ice-machine-repair",
    name: "Commercial Ice Machine Repair",
    kind: "equipment",
    applianceFormLabel: categoryFormLabel("Ice Machine (high-volume)"),
    homeCounterparts: ["ice-maker"],
    cardImage: "/images/ice-maker-repair.webp",
    seo: {
      title: `Commercial Ice Machine Repair in Charlotte, NC | ${business.name}`,
      description:
        "High-volume ice machine repair for restaurants, cafés and hotels in Charlotte, NC — refrigeration and water-system diagnosis by an EPA Universal certified technician, scheduled around service and events.",
    },
    hero: {
      h1: "High-volume ice machine<br><span>repair.</span>",
      lede: `An ice machine is a small refrigeration plant with a water system attached, and it can fail on either side. ${business.name} services high-volume ice machines for restaurants, cafés and hotels in Charlotte, NC — from the lobby unit guests walk past to the banquet machine that has to keep pace with an event.`,
    },
    equipmentIntro:
      "Ice machines show up twice in the commercial work on this site: in restaurant and café kitchens, and in hotels, where lobby and banquet units run in front of guests.",
    equipment: {
      types: ["High-volume ice machines", "Lobby ice machines", "Banquet ice machines"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Running, but little or no ice",
        body: "Scale on the evaporator plate, a failing water inlet valve, a restricted filter or a low refrigerant charge stretch the freeze cycle until production falls off.",
        businessImpact: "Drink service depends on the bin; when output drops, staff end up buying bagged ice to get through the day.",
      },
      {
        title: "Ice won't release at harvest",
        body: "A worn hot-gas valve, a failed harvest component or a dirty evaporator keeps the slab from dropping, and the machine freezes into a solid block.",
        businessImpact: "A frozen-up machine is out of service until it has thawed and been cleaned.",
      },
      {
        title: "Cloudy, soft or off-tasting ice",
        body: "Scale and slime in the water system, an exhausted filter or a wrong water level produce ice that looks or tastes wrong.",
        businessImpact: "Ice is food: contaminated ice has to be dumped and the machine sanitized, which makes it a food-safety issue rather than a cosmetic one.",
      },
      {
        title: "Water around the unit",
        body: "A cracked water line, a blocked bin drain or a stuck float lets water run onto the floor.",
        businessImpact: "Near a lobby or banquet station, a leak is a guest-facing slip hazard.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Can the ice machine in our hotel lobby be serviced without disrupting guests?",
        "Yes. Hotel visits are planned around occupancy, housekeeping windows and the event calendar, so the work happens while the lobby and banquet areas are quiet.",
      ),
      faq(
        "Do you repair the refrigeration side of an ice machine, or only the water side?",
        "Both. The refrigeration circuit is handled under EPA Universal certification, so a leak or a low charge stays with the same technician instead of being passed along to another contractor.",
      ),
      faq(
        "Can our ice machines be set up for preventive maintenance?",
        "Yes, as a standing maintenance contract, with frequency and scope agreed in writing before the first visit. Regular cleaning and inspection catch scale and slow leaks before output drops.",
      ),
      faq(
        "Does your company carry insurance our hotel can verify?",
        `${business.name} is licensed and insured, and a Certificate of Insurance can be issued on request with the hotel or its management company named on it.`,
      ),
      draftFaq("Can you come late at night, after a banquet ends?", "Awaiting owner fact 7."),
    ],
    photo: { src: "/images/hero-commercial-ice-machine.webp", alt: "Commercial ice machine on a storage bin, front panel off" },
    reviewAuthors: [],
  },
  {
    status: "published",
    slug: "commercial-laundry-equipment-repair",
    name: "Commercial Laundry Equipment Repair",
    kind: "equipment",
    applianceFormLabel: categoryFormLabel("Commercial Laundry Equipment"),
    homeCounterparts: ["washer", "dryer"],
    cardImage: "/images/dryer-repair.webp",
    seo: {
      title: `Commercial Laundry Equipment Repair in Charlotte, NC | ${business.name}`,
      description:
        "Repair and maintenance of commercial washers, dryers, ironers and folding machines for hotels, laundromats, healthcare facilities and multi-housing properties in Charlotte, NC.",
    },
    hero: {
      h1: "Commercial laundry<br><span>equipment repair.</span>",
      lede: `Hotels, laundromats, healthcare facilities and multi-housing properties run laundry as a system rather than a single machine. ${business.name} repairs and maintains the whole on-premise setup in Charlotte, NC — washers, dryers, ironers and folding machines, rooftop installations included.`,
    },
    equipmentIntro:
      "Laundry here means the whole on-premise setup — commercial washers and dryers, ironers and folding machines, rooftop installations included — for hotels, laundromats, healthcare facilities and multi-housing properties.",
    equipment: {
      types: ["Commercial washers", "Commercial dryers", "Ironers", "Folding machines", "On-premise laundry systems"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Washer won't spin or extract",
        body: "A failed drive motor or inverter, worn bearings, a faulty door lock or a drain that can't keep up stops the extract step and leaves loads soaking wet.",
        businessImpact: "Wet loads double the dryer time and back up the room — for a hotel, that means linen shortfalls on the floors.",
      },
      {
        title: "Dryer runs without heat",
        body: "A failed gas valve coil, igniter or flame sensor, a burned-out heating element, or an airflow switch tripped by a clogged lint screen or exhaust duct.",
        businessImpact: "Loads come out damp and have to run again, and a blocked exhaust is a fire risk as well as a delay.",
      },
      {
        title: "Payment and control faults",
        body: "A failed control board, a jammed coin mechanism or a card reader that no longer talks to the machine takes it out of service even when the mechanics are sound.",
        businessImpact: "In a laundromat or a multi-housing laundry room, a machine that can't take payment earns nothing and draws resident complaints.",
      },
      {
        title: "Ironer and folder jams",
        body: "Worn ironer padding, feed and tension problems, or failing sensors on a folding machine cause jams, scorching and uneven finishing.",
        businessImpact: "Finishing is the bottleneck of a hotel or healthcare laundry; one jammed ironer holds up clean linen for the whole building.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Do you service a full on-premise laundry, or only single machines?",
        "The full system. Washers, dryers, ironers and folding machines in an on-premise laundry are serviced together — not only the individual unit in one apartment.",
      ),
      faq(
        "Our machines are installed on the roof. Is that a problem?",
        "No. Rooftop laundry installations are part of the commercial laundry work shown on this site; roof access is arranged with building staff when the visit is booked.",
      ),
      faq(
        "Can laundry rooms at several properties be covered by one agreement?",
        "Yes. A multi-property portfolio agreement puts every laundry room under one point of contact with consolidated invoicing, with the schedule and scope set in writing.",
      ),
      faq(
        "Can you send a W-9 so we can add you as a vendor?",
        "Yes, a W-9 is available on request, and the business can be invoiced directly with payment by ACH.",
      ),
      draftFaq("Which laundry models and parts do you stock?", "Awaiting owner fact 6."),
    ],
    reviewAuthors: [],
    photo: { src: "/images/hero-commercial-laundry.webp", alt: "Row of commercial washer-extractors in a hotel laundry" },
  },
  {
    status: "published",
    slug: "commercial-oven-range-repair",
    name: "Commercial Oven & Range Repair",
    kind: "equipment",
    applianceFormLabel: "Commercial Oven / Range",
    homeCounterparts: ["stove", "range", "cooktop"],
    cardImage: "/images/stove-repair.webp",
    seo: {
      title: `Commercial Oven & Range Repair in Charlotte, NC | ${business.name}`,
      description:
        "Repair of commercial ovens, ranges, fryers and grills for restaurant, café and hotel kitchens in Charlotte, NC — on-site diagnosis, written estimates before work, photo reports.",
    },
    hero: {
      h1: "Commercial oven, range<br><span>and fryer repair.</span>",
      lede: `The cook line is where a breakdown shows up on the menu: an oven that won't heat or a range that won't light takes dishes off the board. ${business.name} repairs commercial ovens, ranges, fryers and grills for restaurant, café and hotel kitchens in Charlotte, NC.`,
    },
    equipmentIntro:
      "Cooking equipment is named in the restaurant and hotel work on this site — ovens and ranges, fryers, grills, and banquet and catering equipment.",
    equipment: {
      types: ["Commercial ovens", "Ranges", "Fryers", "Grills", "Banquet and catering equipment"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Oven won't reach or hold temperature",
        body: "A failing thermostat or temperature probe, a bad igniter or gas valve, a burned-out element on an electric unit, or a convection fan motor that no longer moves air.",
        businessImpact: "Food cooks unevenly or slowly, tickets back up and plates get remade.",
      },
      {
        title: "Burners or pilots won't light",
        body: "Clogged burner ports, a failing thermocouple or a weak pilot keep a range burner or an oven from lighting or staying lit.",
        businessImpact: "Losing burners on a busy line cuts capacity for the whole shift, and gas that won't stay lit has to be fixed rather than worked around.",
      },
      {
        title: "Fryer too cold or overshooting",
        body: "A bad thermostat, a failing high-limit switch or a gas control fault either keeps the oil cold or lets it run too hot.",
        businessImpact: "Cold oil turns out greasy, undercooked food; oil that overheats trips the high-limit and shuts the fryer down.",
      },
      {
        title: "Door, hinge and gasket wear",
        body: "Sprung hinges and worn door gaskets let heat escape, so the oven labors to recover between loads.",
        businessImpact: "Slow recovery shows up as longer ticket times at the pass and extra gas or power spent on every bake.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Can our oven be looked at before lunch service?",
        "Urgent kitchen calls get same-day priority whenever there is an open slot. Say when service starts, and the visit is planned to disturb it as little as possible.",
      ),
      faq(
        "Will parts be replaced without asking us first?",
        "No. The oven or range is diagnosed on site, a written estimate follows, and repairs start only after it is approved.",
      ),
      faq(
        "Can our cook line be covered by preventive maintenance?",
        "Yes. Scheduled checks on ovens, ranges and fryers find worn igniters, gaskets and controls before they fail mid-shift.",
      ),
      faq(
        "What happens if the part isn't on the truck?",
        "The part is ordered and the expected timeline is given before any work begins, so the kitchen can plan around it.",
      ),
      draftFaq("Which other cooking equipment brands have you serviced?", "Awaiting owner fact 6."),
    ],
    photo: { src: "/images/hero-commercial-oven-range.webp", alt: "Restaurant cook line with a commercial range and fryer" },
    reviewAuthors: [],
  },
  {
    status: "published",
    slug: "restaurant-appliance-repair",
    name: "Restaurant Appliance Repair",
    kind: "industry",
    segmentId: "horeca",
    seo: {
      title: `Restaurant Appliance Repair in Charlotte, NC | ${business.name}`,
      description:
        "Appliance repair for restaurants and cafés in Charlotte, NC — walk-ins, commercial refrigerators, dish machines, ovens, ranges, fryers, grills and ice machines. Preventive maintenance and invoicing for the business.",
    },
    hero: {
      h1: "Restaurant appliance<br><span>repair in Charlotte.</span>",
      lede: `In a restaurant, every piece of equipment is tied to a service window. ${business.name} works with restaurants and cafés in Charlotte, NC on the whole kitchen — cold storage, the dish pit, the cook line and the ice machine — with one technician who learns the equipment instead of a new face on every call.`,
    },
    equipmentIntro:
      "The whole kitchen, grouped the way the line is laid out — from the walk-in and the reach-ins to the dish line, the cook line and the ice machine.",
    equipment: {
      types: [
        "Walk-ins",
        "Commercial refrigerators",
        "Dishwashers and warewashers",
        "Ovens and ranges",
        "Fryers",
        "Grills",
        "High-volume ice machines",
      ],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "Cold storage fails overnight",
        body: "A condenser fan or a defrost control that quits after close gives no warning; the fault is found when the morning crew opens the walk-in.",
        businessImpact: "Stock may have to be discarded and the menu trimmed for the day.",
      },
      {
        title: "The dish pit stops mid-service",
        body: "When the dish machine faults, clean plates, pans and glassware stop coming back to the line.",
        businessImpact: "Service slows to whatever can be washed by hand, and orders stack up at the pass.",
      },
      {
        title: "A station drops off the cook line",
        body: "One oven that won't hold temperature or a burner that won't light takes a whole station out of rotation.",
        businessImpact: "Ticket times stretch, dishes are remade, and some items come off the menu until the repair.",
      },
      {
        title: "Ice runs short",
        body: "An ice machine producing slowly is easy to miss until the bin is empty at the start of a busy stretch.",
        businessImpact: "Beverage service depends on it, and bagged ice is a stopgap that costs money every day it lasts.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Can one technician handle all of our kitchen equipment?",
        `Yes. ${owner.name} handles the account personally, so the same technician sees the walk-in, the dish machine and the cook line — and knows their history on the next visit.`,
      ),
      faq(
        "What does preventive maintenance look like for a restaurant?",
        "Scheduled visits check the equipment behind mid-shift breakdowns — refrigeration, dish machines and cooking equipment — and flag small issues before they shut something down. Scope and frequency are agreed in writing.",
      ),
      faq(
        "Our vendor onboarding needs a COI and a W-9. Can you provide them?",
        "Yes. A Certificate of Insurance naming the restaurant or its management company and a W-9 are both available on request.",
      ),
      draftFaq("Do you answer emergency calls after the kitchen closes?", "Awaiting owner fact 7."),
    ],
    reviewAuthors: [],
    photo: { src: "/images/hero-restaurant.webp", alt: "Restaurant kitchen after closing" },
  },
  {
    status: "published",
    slug: "property-management-appliance-repair",
    name: "Property Management Appliance Repair",
    kind: "industry",
    segmentId: "property-management",
    seo: {
      title: `Appliance Repair for Property Managers in Charlotte, NC | ${business.name}`,
      description:
        "Tenant appliance repair for property management companies and multifamily portfolios in Charlotte, NC — lockbox and leasing-office access, written estimates, photo reports, consolidated invoicing.",
    },
    hero: {
      h1: "Appliance repair for<br><span>property managers.</span>",
      lede: `For a property manager, a broken appliance is a tenant ticket, an access question and an invoice to approve at once. ${business.name} takes those calls for single buildings and whole portfolios in Charlotte, NC, and works the way leasing offices already do: lockboxes, key pickup, turn deadlines and paperwork for the owner.`,
    },
    equipmentIntro:
      "In a rental portfolio the equipment is mostly residential — the refrigerator, stove, washer and dryer in each unit — plus the laundry rooms of multi-housing buildings.",
    equipment: {
      types: ["Refrigerators", "Stoves", "Washers", "Dryers", "Multi-housing laundry rooms"],
      moreEquipment: moreEquipmentDraft,
    },
    failures: [
      {
        title: "No-cool refrigerator in an occupied unit",
        body: "Condenser fan, defrost and sealed-system faults all end in the same tenant call: the fridge is warm and food is spoiling.",
        businessImpact: "It is an urgent ticket; a slow answer turns into tenant complaints and reviews of the property.",
      },
      {
        title: "Washer or dryer out",
        body: "Drain pumps, door locks, belts and heating circuits are the usual causes; in a shared laundry room one dead machine pushes every resident onto the rest.",
        businessImpact: "Laundry complaints arrive quickly, and a shared room with machines down draws them from the whole building.",
      },
      {
        title: "Stove burner or oven element out",
        body: "Failed surface elements, infinite switches, bake elements or igniters leave a tenant with part of a stove.",
        businessImpact: "Partial failures are easy to defer and hard to explain at renewal time; tenants remember how long the fix took.",
      },
      {
        title: "Repairs against a turn deadline",
        body: "Appliances in a vacant unit are checked and repaired between tenants, working from a lockbox or a key pickup so nobody has to meet the technician.",
        businessImpact: "A fault discovered on move-in day delays the lease start or opens the tenancy with a complaint.",
      },
    ],
    callProcess: callProcessDraft,
    faqs: [
      faq(
        "Can the technician get into a vacant unit without someone from our office?",
        "Yes — through a lockbox, a key picked up from the leasing or management office, or an access code. Note the access method and anything unusual when the call is booked.",
      ),
      faq(
        "Can a visit be arranged with the tenant at home instead?",
        "Yes. The technician can meet the tenant at the unit, as long as the time and the access method are agreed when the call is scheduled.",
      ),
      faq(
        "How do repairs get approved across a portfolio?",
        "Every job starts with an on-site diagnosis and a written estimate, so approvals go through your normal process before any work is done.",
      ),
      faq(
        "Can all our properties be on one contract with one point of contact?",
        "Yes. A multi-property portfolio agreement or a standing maintenance contract gives the whole portfolio one point of contact and consolidated invoicing.",
      ),
      faq(
        "What documentation do owners and asset managers receive?",
        "A written record of the diagnosis and the work with a photo report — sent per visit, or rolled into a summary across a property or the whole portfolio.",
      ),
      draftFaq("What does a service call cost for a property management account?", "Awaiting owner fact 7."),
    ],
    photo: { src: "/images/hero-property-management.webp", alt: "Apartment kitchen with standard appliances and a work order" },
    reviewAuthors: [],
  },
];

/** Published child pages — sitemap, links, nav. Never drafts. */
export const publishedCommercialPages = (): CommercialPageContent[] => published(commercialPages);
/** generateStaticParams for /commercial-appliance-repair/[slug] (drafts only in `next dev`). */
export const commercialSlugs = (): string[] =>
  commercialPages.filter(routable).map((p) => p.slug);
/** A child page only if it may be routed (published, or a draft in `next dev`). */
export const getCommercialPage = (slug: string): CommercialPageContent | undefined =>
  commercialPages.find((p) => p.slug === slug && routable(p));
