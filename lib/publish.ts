import type { Publishable } from "../data/types";

// The single place that decides whether a unit of content is visible (spec §1).
//
// - sitemap, nav, lib/links, lib/jsonld, lib/routes, lib/redirects use only
//   published()/isPublished(): no drafts there, not even in dev.
// - Routes (generateStaticParams + the notFound() guard) use routable(): in `next dev` a
//   draft renders so the owner can proof-read it; `next build` sets NODE_ENV=production,
//   so a draft never gets a production route.
// NODE_ENV is read at call time (not captured at import) so the rule is testable.

const isDev = (): boolean => process.env.NODE_ENV === "development";

export function isPublished(x: Publishable): boolean {
  return x.status === "published";
}

export function published<T extends Publishable>(xs: readonly T[]): T[] {
  return xs.filter(isPublished);
}

/** For generateStaticParams and page guards: in `next dev` drafts render too (owner preview). */
export function routable(x: Publishable): boolean {
  return isPublished(x) || isDev();
}

/** True only when a draft is being previewed in `next dev` — drives the DRAFT banner. */
export const isDraftPreview = (x: Publishable): boolean => !isPublished(x) && isDev();
