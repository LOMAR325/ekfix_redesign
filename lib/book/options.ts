// Single source for the two <select> option lists in the booking form.
// Re-exported from the data layer so lib/book/schema.ts and components/BookForm.tsx
// validate and render from the exact same arrays — no duplicated literals.

export { applianceFormOptions } from "@/data/services";
export { contactAsOptions } from "@/data/b2b-segments";
