import type { ForBusinessSegment } from "./types";
import { owner } from "./people";
import { published } from "../lib/publish";

// B2B content of the commercial home /commercial-appliance-repair (the module name is
// historical — it began as the /for-business content): segments, process, formats, trust
// chips, why-call-us, FAQ, knowsAbout, the #laundry lists.
// No invented trust numbers: COI / W-9 / ACH are phrased as "available on request" / "we can",
// never as commitments to specifics.

// Commercial-hub segment card — the type lives in data/types (publication via `status`,
// the single draft/published mechanism); re-exported here for existing importers.
export type { ForBusinessSegment } from "./types";

export type NumberedCard = { num: string; title: string; body: string };

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

// Commercial home — "Built for vendor onboarding." (#trust-b2b), .chip-row.
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

// Commercial hub JSON-LD — HomeAndConstructionBusiness.knowsAbout (b2b §7 block 8 / §32a).
// Each entry is worded exactly as the hub shows it (story 82 — markup only says what the page
// shows): the H1/breadcrumb, the "Preventive maintenance" service format, and two chips of
// the "Commercial services" row. (Were "Preventive Maintenance for Property Managers" and
// "Commercial Kitchen Equipment Repair" — neither phrase is on the page.) If the restaurant or
// laundry page goes back to draft, its chip disappears — drop it here too.
export const commercialServices: string[] = [
  "Commercial Appliance Repair",
  "Preventive maintenance",
  "Restaurant Appliance Repair",
  "Commercial Laundry Equipment Repair",
];

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
