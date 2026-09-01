// Shared content types for the data/ layer. Pure types — no runtime, no imports.
// Shapes come from spec.md §"Слой данных" and interfaces.md §"Ключевые типы".

export type BusinessRating = { value: number; count: number };

export type Business = {
  name: string;
  legalName: string;
  phone: string;
  /** href-ready, e.g. "tel:+19803714319" */
  phoneHref: string;
  /** E.164-ish display form, e.g. "+1-980-371-4319" */
  phoneE164: string;
  hours: string;
  hoursNote: string;
  openingHours: { days: string[]; opens: string; closes: string };
  address: { locality: string; region: string; country: string };
  siteUrl: string;
  social: { instagram: string; facebook: string; tiktok: string };
  gaId: string;
  maintenancePlanName: string;
  /** GBP allows <= 20 zones; finalised in ticket 02, synced with sitemap */
  areaServed: string[];
  /** derived from data/reviews.ts; finalised in ticket 02 */
  rating: BusinessRating | null;
};

export type Service = {
  slug: string;
  name: string;
  formLabel: string;
  title: string;
  metaDescription: string;
  /** thumbnail used in the home #repair grid, e.g. "/images/Refrigerator.webp" */
  image: string;
  hero: { h1: string; lede: string }; // h1 may contain <br><span>
  problems: { title: string; body: string }[]; // exactly 6
  brands: string[];
  faqs: { q: string; a: string }[]; // 5
  whereWeWork: { name: string; href?: string }[];
  alsoRepair: { name: string; slug: string }[]; // empty for refrigerator
};

export type CommercialCategory = {
  label: string;
  formLabel: string;
  image: string;
  href: string;
};

export type Town = {
  slug: string;
  name: string;
  state: "NC" | "SC";
  isFullPage: boolean;
  // only for isFullPage:
  hero?: { lede: string };
  prose?: string[]; // paragraphs, may contain <strong>
  districts?: string[];
  reviewAuthors?: string[]; // which of data/reviews to show (matched by author)
  nearby?: string[]; // "Also serving" chip towns (non-charlotte)
  nearbyProse?: string; // charlotte only — free-text "also serving nearby" paragraph
  hasMap?: boolean; // true only for charlotte
};

export type Review = {
  author: string;
  detail: string;
  text: string;
  appliance?: string;
  town?: string;
};

export type Brand = {
  name: string;
  logo: string;
  alt: string;
  tier: "commercial" | "premium" | "mass";
  wide?: boolean;
  /** appears in the reordered home #brands grid (subset of the full /brands list) */
  home?: boolean;
};

export type LeadInput = {
  name: string;
  phone: string;
  appliance: string;
  contactAs: string;
  message?: string;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export interface LeadSink {
  name: string;
  enabled: boolean;
  send(lead: LeadInput): Promise<void>;
}
