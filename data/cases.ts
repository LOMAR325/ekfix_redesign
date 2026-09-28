import type { RepairCase } from "./types";
import { published, routable } from "../lib/publish";

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
