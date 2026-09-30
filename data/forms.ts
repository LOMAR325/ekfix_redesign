import { services } from "./services";

// Option lists of the two lead forms (home and business). The <select>s in the
// UI and the zod schema in lib/book/schema.ts read these exact arrays (via
// lib/book/options), so a visible option and an accepted value never drift.
// Relative imports and erasable TS only: scripts load data/* via Node type stripping.

/** Which of the two lead forms a submission comes from — the discriminator. */
export const leadBranches = ["home", "business"] as const;

/** Home form: one entry per residential service form label (deduped), plus "Other". */
export const homeApplianceOptions: string[] = [
  ...new Set(services.map((s) => s.formLabel)),
  "Other",
];

/** Business form: type of business. */
export const businessTypeOptions = [
  "Restaurant",
  "Property Management",
  "Hotel",
  "Laundry",
  "Other",
] as const;

/** Business form: equipment (optional field). */
export const businessEquipmentOptions: string[] = [
  "Commercial Refrigeration",
  "Commercial Dishwasher",
  "Ice Machine",
  "Commercial Laundry Equipment",
  "Commercial Oven / Range",
  "Other commercial equipment",
];

/** Business form: urgency (optional field). */
export const urgencyOptions = [
  "Emergency",
  "Scheduled repair",
  "Maintenance contract",
  "Quote",
] as const;
