import { commercialHubPath, publishedCommercialPages } from "../data/commercial";
import { publishedPaths } from "./routes";

// Every retired URL → the nearest live page with one 308 (spec §5, stories 23–24, 29, 84):
// the old static site's *.html (docs/adr/0013), /for-business, and the old ekfix.us sitemap.
// Read by next.config.ts at build/start, so destinations follow the current `status` values.
// Next matches `source` case-insensitively (experimental.caseSensitiveRoutes is off), so
// /towns/Lesslie also catches /towns/lesslie; a trailing slash is stripped by Next first.

export type RedirectRule = { source: string; destination: string; permanent: true };

/** The old static site (docs/adr/0013); /for-business.html goes straight to the new hub. */
const HTML_RULES: [source: string, destination: string][] = [
  ["/index.html", "/"],
  ["/about.html", "/about"],
  ["/brands.html", "/brands"],
  ["/for-business.html", commercialHubPath],
  ["/appliance-repair/:slug.html", "/appliance-repair/:slug"],
  // Must precede /towns/:slug.html so "index" is not treated as a slug.
  ["/towns/index.html", "/towns"],
  ["/towns/:slug.html", "/towns/:slug"],
];

/**
 * The old ekfix.us sitemap, paths verbatim (43, fetched 2026-09-28). To add an old URL found
 * in Search Console (Pages / Links): append its path here. The destination is computed —
 * the same path if live, else underscores → hyphens and lower case if live, else its
 * section index (/towns, /appliance-repair). A path none of these fits goes in
 * OLD_COMMERCIAL below (or the build fails with a message naming it).
 */
const OLD_EKFIX_PATHS = [
  "/",
  ...["stove", "wine-cooler", "refrigerator", "washer", "range", "garbage_disposal", "cooktop",
    "freezer", "ice_maker", "dryer", "microwave", "dishwasher"].map((s) => `/appliance-repair/${s}`),
  ...["charlotte", "stallings", "newell", "harrisburg", "allen", "mint_hill", "indian_trail",
    "wesley_chapel", "monroe", "unionville", "mineral_springs", "pineville", "waxhaw", "belmont",
    "matthews", "marvin", "weddington", "indian_hook", "indian_land", "catawba", "fort_mill",
    "Lesslie", "lake_wylie", "spring_valley", "rock_hill", "tega_cay"].map((s) => `/towns/${s}`),
  "/brands",
  "/property_management",
  "/property_management_cafe",
  "/laundry_equipment_repair",
];

/** Old commercial landing pages → the child page, or the hub section while it is a draft. */
const OLD_COMMERCIAL: Record<string, { slug: string; hubAnchor: string }> = {
  "/property_management": { slug: "property-management-appliance-repair", hubAnchor: "property-management" },
  "/property_management_cafe": { slug: "restaurant-appliance-repair", hubAnchor: "horeca" },
  "/laundry_equipment_repair": { slug: "commercial-laundry-equipment-repair", hubAnchor: "laundry" },
};

function nearestLivePath(oldPath: string, live: Set<string>): string {
  const commercial = OLD_COMMERCIAL[oldPath];
  if (commercial) {
    const child = publishedCommercialPages().some((p) => p.slug === commercial.slug);
    return child ? `${commercialHubPath}/${commercial.slug}` : `${commercialHubPath}#${commercial.hubAnchor}`;
  }
  if (live.has(oldPath)) return oldPath;
  const normalized = oldPath.toLowerCase().replace(/_/g, "-");
  if (live.has(normalized)) return normalized;
  const section = `/${normalized.split("/")[1]}`;
  if (section !== "/" && section !== normalized && live.has(section)) return section;
  throw new Error(`lib/redirects: no live page for old URL ${oldPath} — map it in OLD_COMMERCIAL`);
}

export function redirectRules(): RedirectRule[] {
  const live = new Set(publishedPaths());
  const ekfix = OLD_EKFIX_PATHS.flatMap((source): [string, string][] => {
    const destination = nearestLivePath(source, live);
    if (destination === source) return [];
    // Matching ignores case: a case-only difference would redirect to itself forever.
    if (destination.toLowerCase() === source.toLowerCase()) {
      throw new Error(`lib/redirects: ${source} differs from ${destination} only in letter case`);
    }
    return [[source, destination]];
  });
  return [...HTML_RULES, ["/for-business", commercialHubPath] as [string, string], ...ekfix].map(
    ([source, destination]) => ({ source, destination, permanent: true }),
  );
}
