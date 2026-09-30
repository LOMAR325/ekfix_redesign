// Lead-form constants shared by both forms (home and business). Both forms send
// the same four fields — name, phone, address, message — so the only list left is
// the branch discriminator. lib/book/schema.ts reads it via lib/book/options.
// Relative imports and erasable TS only: scripts load data/* via Node type stripping.

/** Which of the two lead forms a submission comes from — the discriminator. */
export const leadBranches = ["home", "business"] as const;
