// Copy of the lead form (ADR 0023): one form, four fields — name, phone, address, problem / notes
// (owner, 2026-09-30) — with per-branch titles and fine print. Placeholders stay in the JSX.

export const leadFormCopy = {
  home: {
    title: "Book your repair",
    sub: "Takes less than a minute. 10% off online bookings.",
    addressPlaceholder: "Service address",
    notesPlaceholder: "What's wrong? Appliance, brand, symptoms (optional)",
    thanks: "Thank you! We'll be in touch shortly.",
    thanksCall: (phone: string) => `Need it sooner? Call ${phone}.`,
    submit: "Send My Request →",
    finePrint: ["No hidden fees", "Free estimate", "Same-day slots"],
  },
  business: {
    title: "Request commercial service",
    sub: "Name, phone and the address — a written estimate comes before any work.",
    addressPlaceholder: "Business address",
    notesPlaceholder: "Equipment and what's wrong / notes (optional)",
    thanks: "Thank you! The request is in.",
    thanksCall: (phone: string) => `Equipment down right now? Call ${phone}.`,
    submit: "Send the Request →",
    finePrint: ["Written estimate first", "Photo report", "Invoice / ACH"],
  },
  submitting: "Sending…",
  netError: (phone: string) => `Couldn't send your request — please call ${phone}.`,
} as const;
