import type { RepairCase } from "./types";
import { published, routable } from "../lib/publish";
import { business } from "./business";

// Repair cases /repair-cases/[slug] (spec story 75). Empty until real cases are confirmed:
// no case → no route, no sitemap entry, no nav item. RepairCase has no customer fields.

export const cases: RepairCase[] = [];

/** Published cases — sitemap and links. Never drafts. */
export const publishedCases = (): RepairCase[] => published(cases);
/** generateStaticParams for /repair-cases/[slug] (drafts only in `next dev`). */
export const caseSlugs = (): string[] => cases.filter(routable).map((c) => c.slug);
/** A case only if it may be routed (published, or a draft in `next dev`). */
export const getCase = (slug: string): RepairCase | undefined =>
  cases.find((c) => c.slug === slug && routable(c));

/** Page copy for the case template (no JSX literals in app/**). */
export const caseCopy = {
  home: "Home",
  titleSuffix: ` | ${business.name}`,
  repairHeading: "The repair",
  detailsHeading: "Details",
  labels: {
    appliance: "Appliance",
    model: "Model",
    symptom: "Symptom",
    diagnosis: "Diagnosis",
    failedComponent: "Failed component",
    repair: "Repair",
    result: "Result",
    parts: "Parts",
    area: "Area",
    technician: "Technician",
  },
  cta: {
    h2: "Ready when you are.",
    body: "$75 diagnostic — waived completely once you book the repair.",
  },
} as const;
