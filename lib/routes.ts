import { services } from "../data/services";
import { hasPublishedPage, towns } from "../data/towns";
import { publishedCommercialPages } from "../data/commercial";
import { publishedArticles } from "../data/guides";
import { publishedCases } from "../data/cases";

// The single list of live URLs (spec §5, story 79). app/sitemap.ts, the redirect test and
// the QA scripts read it. Built at call time from each data module's one "published"
// entry point, so flipping one `status` adds/removes a path — never a draft, not even
// in `next dev`.
//
// Static hubs /reviews, /appliance-repair, /commercial-appliance-repair are listed ahead
// of their routes (tickets 03/04/06); /for-business is retired in favour of the
// commercial hub.
const STATIC_PATHS = [
  "/",
  "/about",
  "/brands",
  "/towns",
  "/reviews",
  "/appliance-repair",
  "/commercial-appliance-repair",
] as const;

export function publishedPaths(): string[] {
  const liveArticles = publishedArticles();
  return [
    ...STATIC_PATHS,
    ...services.map((s) => `/appliance-repair/${s.slug}`),
    ...publishedCommercialPages().map((p) => `/commercial-appliance-repair/${p.slug}`),
    ...towns.filter(hasPublishedPage).map((t) => `/towns/${t.slug}`),
    ...(liveArticles.length > 0 ? ["/appliance-repair-guide"] : []),
    ...liveArticles.map((a) => `/appliance-repair-guide/${a.slug}`),
    ...publishedCases().map((c) => `/repair-cases/${c.slug}`),
  ];
}
