import type { ContactAsOption, ForBusinessSegment, SegmentId } from "./types";
import { owner } from "./people";
import { published } from "../lib/publish";

// B2B content layer — the reorientation of the home page and the commercial hub
// (/commercial-appliance-repair) toward property managers, restaurants, and hotels first
// (b2b-priority-brief §7–8).
//
// Every prose block here is written fresh for its page. Nothing is copied verbatim between
// `whoWeServe` (home #who-we-serve) and `forBusinessSegments` (the commercial hub) — see spec story 34.
// No invented trust numbers: COI / W-9 / ACH are phrased as "available on request" / "we can",
// never as commitments to specifics.

// Home #who-we-serve card — no <h3>, no anchor, no bullets. `href` is the hub anchor;
// a card with a `segmentId` links to that segment's published industry page instead
// (resolved in data/home.whoWeServeCards — this module can't import data/commercial).
export type WhoWeServeCard = {
  title: string;
  eyebrow: string;
  text: string;
  href: string;
  linkLabel: string;
  segmentId?: SegmentId;
};

// Commercial-hub segment card — the type lives in data/types (publication via `status`,
// the single draft/published mechanism); re-exported here for existing importers.
export type { ForBusinessSegment } from "./types";

export type NumberedCard = { num: string; title: string; body: string };

// ---------------------------------------------------------------------------
// Home page (#who-we-serve), 4 cards — businesses first, homeowners last.
// ---------------------------------------------------------------------------
export const whoWeServeHead = {
  eyebrow: "01 / Who we serve",
  h2: "Homes, kitchens, and everything you manage.",
} as const;

export const whoWeServe: WhoWeServeCard[] = [
  {
    title: "Property Management & Multifamily",
    eyebrow: "For portfolios",
    text: "Portfolio work, handled as portfolio work. We take tenant appliance calls one unit at a time or across every property you manage, with a single point of contact, transparent per-visit pricing, and scheduling that fits lockboxes, leasing offices, and turn deadlines.",
    href: "/commercial-appliance-repair#property-management",
    linkLabel: "See property management services →",
    segmentId: "property-management",
  },
  {
    title: "Restaurants & Commercial Kitchens",
    eyebrow: "For kitchens",
    text: "When a walk-in or the dish line goes down mid-service, the clock is the problem. We repair commercial refrigeration, cooking, and warewashing equipment fast, and set up preventive checks so the next breakdown doesn't land in the middle of a Friday rush.",
    href: "/commercial-appliance-repair#horeca",
    linkLabel: "See restaurant & kitchen services →",
    segmentId: "horeca",
  },
  {
    title: "Hotels & Multifamily Laundry",
    eyebrow: "For hospitality",
    text: "Guest-facing and back-of-house at once. We keep in-room refrigerators, ice machines, and on-premise laundry running for hotels and multifamily buildings, working around occupancy and event schedules so equipment downtime never reaches your guests or residents.",
    href: "/commercial-appliance-repair#laundry",
    linkLabel: "See hotel & laundry services →",
  },
  {
    title: "Homeowners",
    eyebrow: "For your home",
    text: "Still the same promise for your own kitchen. Book a refrigerator, washer, dryer, oven, or dishwasher repair online and the owner who diagnoses it is the one who comes back if anything's off. Same-day slots, warranty on every job.",
    href: "/appliance-repair",
    linkLabel: "See home appliance repair →",
  },
];

// ---------------------------------------------------------------------------
// Commercial hub — 4 segment cards, each with an anchor id.
// ---------------------------------------------------------------------------
export const forBusinessSegments: ForBusinessSegment[] = [
  {
    id: "property-management",
    status: "published",
    title: "Property Management & Multifamily",
    eyebrow: "Property management",
    heading: "For rental & multi-housing portfolios",
    text: "Managing rental units means keeping every appliance in working order across multiple properties. We provide prompt, reliable repair for refrigerators, stoves, washers, and dryers — across a single property or a full portfolio — plus preventive maintenance to cut down on future service calls and keep tenants happy.",
    href: "/commercial-appliance-repair#property-management",
    linkLabel: "Request a quote →",
    bullets: [
      "Same-day response for urgent tenant issues",
      "Preventive maintenance programs",
      "Competitive, transparent pricing across a portfolio",
      "One point of contact for every property",
    ],
  },
  {
    id: "horeca",
    status: "published",
    title: "Restaurants & Cafés (HoReCa)",
    eyebrow: "Restaurants & cafés (HoReCa)",
    heading: "For kitchens that can't afford downtime",
    text: "A broken walk-in or dishwasher during service is a real problem. We repair commercial refrigerators and walk-ins, ovens and ranges, dishwashers and warewashers, fryers, grills, and high-volume ice machines for restaurants and cafés across Charlotte, with a focus on getting the kitchen back online fast.",
    href: "/commercial-appliance-repair#horeca",
    linkLabel: "Request a quote →",
    bullets: [
      "Commercial refrigeration & cooking equipment",
      "Fast turnaround to minimize service disruption",
      "Experience with Hobart, Blodgett, Middleby & more",
      "Preventive maintenance to avoid mid-shift breakdowns",
    ],
  },
  {
    id: "hotels",
    status: "published",
    title: "Hotels & Hospitality",
    eyebrow: "Hotels & hospitality",
    heading: "For guest-facing equipment that can't fail",
    text: "Hotels run on equipment guests never think about until it stops. We service in-room refrigerators and microwaves, lobby and banquet ice machines, on-premise laundry, and catering and kitchen equipment — and we schedule around occupancy, housekeeping windows, and event calendars so the work stays invisible to guests.",
    href: "/commercial-appliance-repair#hotels",
    linkLabel: "Request a quote →",
    bullets: [
      "In-room refrigeration & ice machines",
      "On-premise and back-of-house laundry",
      "Banquet, catering & kitchen equipment",
      "Scheduling around occupancy and events",
    ],
  },
  {
    id: "hoa",
    status: "draft", // owner has not confirmed the HOA / condo vertical — publish by switching to "published"
    title: "HOA / Condo Associations",
    eyebrow: "HOA / condo associations",
    heading: "For shared and common-area equipment",
    text: "Community clubhouses, fitness rooms, and shared laundry all run appliances the association is responsible for. We can handle common-area repair and maintenance, coordinate scheduling with your property manager or board, and provide the service documentation a board needs for its records.",
    href: "/commercial-appliance-repair#hoa",
    linkLabel: "Request a quote →",
    bullets: [
      "Clubhouse and common-area appliances",
      "Shared and coin-op laundry equipment",
      "Coordination with board and property manager",
      "Documentation and invoicing for association records",
    ],
  },
];

// Segments safe to render publicly — a `status: "draft"` segment (vertical not confirmed by
// the owner) is filtered out by lib/publish, so it can never reach production.
// The hub builds its cards from this, not from `forBusinessSegments`.
export const publicForBusinessSegments: ForBusinessSegment[] = published(forBusinessSegments);

// ---------------------------------------------------------------------------
// Commercial hub — "How we work" (#process), numbered .problem-card style.
// ---------------------------------------------------------------------------
export const processSteps: NumberedCard[] = [
  { num: "01", title: "Request", body: "Call or send the form with a short description of the problem and the address of the property or unit." },
  { num: "02", title: "Access & Scheduling", body: "We confirm how the technician gets in — lockbox, concierge, on-site staff, or a tenant meeting — and lock in a time slot." },
  { num: "03", title: "Diagnosis & Written Estimate", body: "On-site diagnosis, then a written estimate before any work starts, so approvals and budgets are never a guessing game." },
  { num: "04", title: "Repair, Photo Report & Invoice", body: "The repair, a photo report of what was done, and an invoice — billed to the business by ACH or on account where you need it." },
];

// Commercial hub — "Service formats" (#formats), .chip-row.
export const serviceFormats: string[] = [
  "Single Service Call",
  "Standing Maintenance Contract",
  "Multi-Property Portfolio Agreement",
  "Invoice / ACH Billing",
];

// Home page — "Built for vendor onboarding." (#trust-b2b), .chip-row.
export const trustHeading = "Built for vendor onboarding.";
export const trustChips: string[] = [
  "Licensed & Insured",
  "EPA 608 & OSHA Certified",
  "COI Available on Request",
  "Invoice / ACH Billing for Businesses",
  "Same Technician, Every Visit",
];

// Commercial hub — FAQ (#faq-business). 6 B2B questions (b2b §8 block 7); answers written to
// the site's existing tone, with no invented figures.
export const businessFaqs: { q: string; a: string }[] = [
  {
    q: "Do you provide a Certificate of Insurance (COI) for our property?",
    a: "A Certificate of Insurance naming your company or property is available on request. Send us the exact wording and the entity that needs to be named and we can provide one for your vendor file.",
  },
  {
    q: "Can you access a vacant unit with a lockbox or through our leasing office?",
    a: "Yes. We regularly work from lockboxes, key pickup at a leasing or management office, or an access code you provide. Just tell us the access method when you schedule and note anything the technician should know.",
  },
  {
    q: "Do you offer standing maintenance contracts across multiple properties?",
    a: "Yes. We set up recurring preventive maintenance on a schedule that fits your portfolio, with one point of contact and consolidated invoicing. Scope and visit frequency are agreed up front in writing.",
  },
  {
    q: "How fast can you respond to an emergency at a restaurant or hotel?",
    a: "For urgent commercial calls we prioritize same-day response whenever a slot is open, and we carry common parts on the truck. If a part has to be ordered, we tell you the timeline before any work begins.",
  },
  {
    q: "Can you invoice our company directly, or pay by ACH?",
    a: "Yes. We can invoice your business directly and accept payment by ACH or on account. A W-9 is available on request so your accounts payable team can set us up as a vendor.",
  },
  {
    q: "Do you provide service documentation for our owners/asset managers?",
    a: "Every commercial repair comes with a written record of the diagnosis, the work performed, and a photo report. We can send it per visit or as a summary across a property or portfolio.",
  },
];

// Commercial hub — "Why property & kitchen managers call us" — 3 existing cards + 2 new.
export const whyCallUs: NumberedCard[] = [
  { num: "01", title: "Not on the list? Still call.", body: "EPA Universal and OSHA certification covers a wide range of commercial equipment beyond what's pictured on this site — ask before assuming it's out of scope." },
  { num: "02", title: "Preventive maintenance", body: "Scheduled maintenance extends equipment life and catches small issues before they become an emergency shutdown." },
  { num: "03", title: "One technician, every visit", body: `${owner.name} handles the account personally — no rotating subcontractors relearning your equipment each time.` },
  { num: "04", title: "Documented, not just done", body: "Every visit leaves a photo report and a service history for the property, so owners and asset managers can see what was done and when." },
  { num: "05", title: "Vendor-ready paperwork", body: "Certificate of Insurance on request, W-9 on request, licensed and insured — the paperwork your onboarding process needs, without the back-and-forth." },
];

// Home JSON-LD — HomeAndConstructionBusiness.knowsAbout (b2b §7 block 8 / §32a).
export const commercialServices: string[] = [
  "Commercial Appliance Repair",
  "Preventive Maintenance for Property Managers",
  "Commercial Kitchen Equipment Repair",
  "Commercial Laundry Equipment Repair",
];

// Home page — second .cta-band (#business-cta), between #brands and #book. The button is
// data/commercial.commercialCta.label ("Request Service or a Quote", story 53): it presets
// the form's "I'm contacting you as a…" to the business default and scrolls to #book.
export const businessCta = {
  heading: "Managing a property, restaurant, or hotel?",
  text: "Request service or a quote for a property, a kitchen, or a hotel — the form below opens with the business option already selected.",
} as const;

// Commercial hub — commercial-laundry section (#laundry). `types` names the object-type
// verticals the ported paragraph already lists; `brandChips` feeds the chip row under it.
export const laundryObjectTypes = {
  types: ["Hotels", "Laundromats", "Healthcare facilities", "Multi-housing properties"],
  brandChips: [
    "Speed Queen",
    "Girbau",
    "Unimac",
    "Dexter",
    "Huebsch",
    "Maytag Commercial",
    "Wascomat",
    "Whirlpool Commercial",
  ],
} as const;

// Form (#book) — "I'm contacting you as a…" <select> (b2b §7 block 9 / spec story 27).
// Businesses listed before "Other Business"; feeds LeadInput.contactAs.
export const contactAsOptions: ContactAsOption[] = [
  "Homeowner",
  "Property Manager",
  "Restaurant or Café",
  "Hotel or Hospitality",
  "Other Business",
];

// Home hero (spec §7, stories 42/46/47). The H1 names what and where in the two-line style
// with an accent second line; the brief's longer example ("Commercial & home appliance
// repair / in Charlotte.") takes 6 lines at 1440px, so the H1 is cut to fit 3 lines @1440
// and 2 @390 (story 47) and the lede carries "commercial & home": businesses first, then
// homes, then Charlotte / South Charlotte / Ballantyne. No ZIP (owner fact 3 not given).
// The slogan stays as the secondary line above the H1.
export const homeHero = {
  eyebrow: "We fix it. You enjoy it.",
  h1: "Appliance repair,<br><span>Charlotte.</span>",
  lede: "For property managers, restaurants, and hotels — and for homes — across Charlotte, South Charlotte, and Ballantyne. EPA 608 & OSHA certified, warranty on every job.",
  // the two paths (story 42): business is the accent (primary) button, homes the ghost one
  forBusiness: { label: "For Business", href: "/commercial-appliance-repair" },
  forHomes: { label: "For Homes", href: "/appliance-repair" },
  // the phone — a text link in the hero's accent-link style
  callLabel: "Or call",
  // .hero-meta small
  metaSmall: "5.0 on Google · property managers, restaurants & homeowners",
} as const;

// Extra sentence appended to #family .family-copy on the home page (spec story 26).
export const familyBusinessSentence =
  "That's true whether it's a homeowner's kitchen or a restaurant walk-in — same technician, same standard.";

// Third sentence appended to the commercial hub's .page-hero .lede (spec story 28 / b2b §8 block 1).
export const forBusinessHeroLedeExtra =
  "Whether it's a single emergency call, a standing maintenance contract, or service across a whole portfolio — we work the way your business already operates.";
