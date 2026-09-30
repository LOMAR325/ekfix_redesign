// Copy of the two lead forms (ADR 0023). The option lists live in data/forms (the <select>s and
// the zod schema read the same arrays); input placeholders stay in the JSX (field hints).

export const homeFormCopy = {
  title: "Book your repair",
  sub: "Takes less than a minute. 10% off online bookings.",
  appliancePlaceholder: "Select appliance...",
  thanks: "Thank you! We'll be in touch shortly.",
  thanksCall: (phone: string) => `Need it sooner? Call ${phone}.`,
  submit: "Send My Request →",
  submitting: "Sending…",
  netError: (phone: string) => `Couldn't send your request — please call ${phone}.`,
  finePrint: ["No hidden fees", "Free estimate", "Same-day slots"],
} as const;

export const businessFormCopy = {
  title: "Request commercial service",
  sub: "Company, contact and the equipment — a written estimate comes before any work.",
  businessTypePlaceholder: "Type of business...",
  equipmentPlaceholder: "Equipment (optional)...",
  urgencyPlaceholder: "How urgent? (optional)...",
  thanks: "Thank you! The request is in.",
  thanksCall: (phone: string) => `Equipment down right now? Call ${phone}.`,
  submit: "Send the Request →",
  submitting: "Sending…",
  netError: (phone: string) => `Couldn't send the request — please call ${phone}.`,
  finePrint: ["Written estimate first", "Photo report", "Invoice / ACH"],
} as const;
