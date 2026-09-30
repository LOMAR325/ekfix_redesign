// Single source for the <select> option lists of both lead forms (home and
// business). Re-exported from the data layer so lib/book/schema.ts and the form
// components validate and render from the exact same arrays — no duplicated literals.

export {
  leadBranches,
  homeApplianceOptions,
  businessTypeOptions,
  businessEquipmentOptions,
  urgencyOptions,
} from "@/data/forms";
