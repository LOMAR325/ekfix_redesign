// Shared content types for the data/ layer. Pure types — no runtime, no imports.
// Shapes come from spec.md §"Слой данных" and interfaces.md §"Ключевые типы".

export type BusinessRating = { value: number; count: number };

export type Business = {
  name: string;
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
  /** thumbnail used in the home #repair grid, e.g. "/images/refrigerator-repair.webp" */
  image: string;
  hero: { h1: string; lede: string }; // h1 may contain <br><span>
  /** The places the H1 names, in H1 order — the page's JSON-LD `Service.areaServed` (story 19). */
  areaServed: { name: string; kind: Town["kind"] }[];
  /** The two section headings that vary per appliance (trusted HTML, may contain <br>). */
  sectionHeads: { problems: string; faq: string };
  problems: { title: string; body: string }[]; // exactly 6
  brands: string[];
  faqs: { q: string; a: string }[]; // 5
  whereWeWork: { name: string; href?: string }[];
  alsoRepair: { name: string; slug: string }[]; // empty for refrigerator
  /** Local Ballantyne block — only where this appliance has published local specifics (story 63). */
  ballantyneNote?: Publishable & { heading: string; body: string };
};

export type CommercialCategory = {
  label: string;
  formLabel: string;
  image: string;
  href: string;
};

// ---------------------------------------------------------------------------
// Publication status (spec §1) — one mechanism for every unit of content. Visibility is
// decided only in lib/publish.ts; a draft never reaches sitemap, nav, links or JSON-LD.
// ---------------------------------------------------------------------------
export type PublishStatus = "draft" | "published";
export type Publishable = { status: PublishStatus };

/** A FAQ item with its own status (town/area pages, commercial pages). */
export type PublishableFaq = Publishable & { q: string; a: string };

// Towns and areas (spec §3). A town without `page` has no route (only the text lists on
// /towns); `page.status` decides whether the route exists in production.
export type TownPage = Publishable & {
  seo: { title: string; description: string };
  hero: { h1?: string; lede: string };
  prose: string[]; // paragraphs, may contain <strong>
  districts?: string[];
  /** cities: hand-picked authors from data/reviews; areas take reviews by Review.area */
  reviewAuthors?: string[];
  /** a city page without its own terms paragraph links to the pricing block instead (brief 7.2) */
  termsLink?: boolean;
  nearby?: string[]; // "Also serving" chip towns (non-charlotte)
  nearbyProse?: string; // charlotte only — free-text "also serving nearby" paragraph
  hasMap?: boolean; // true only for charlotte
  /** "What we repair" chips (ex-CHARLOTTE_REPAIR_CHIPS); absent → all 12 services */
  repairChips?: { label: string; href: string }[];
  // areas only:
  coverage?: Publishable & { body: string };
  zips?: Publishable & { items: string[] };
  communities?: Publishable & { items: string[] };
  whoWeServe?: Publishable & { business: string; homes: string };
  applianceNotes?: (Publishable & { serviceSlug: string; heading: string; body: string })[];
  faqs?: PublishableFaq[];
};

export type Town = {
  slug: string;
  name: string;
  state: "NC" | "SC";
  kind: "city" | "area";
  /** slug of the parent: south-charlotte → charlotte, ballantyne → south-charlotte */
  parent?: string;
  /** no page — the town has no route of its own */
  page?: TownPage;
};

export type Review = {
  author: string;
  detail: string;
  text: string;
  appliance?: string;
  town?: string;
  /** set only where the review itself says so (Tony Z. — "Restaurant") */
  segment?: "commercial";
  /** slug of an area from data/towns — only when known (none yet) */
  area?: string;
};

/** A /reviews section: label + the reviews its rule selects (see data/reviews). */
export type ReviewCategory = { id: string; label: string; reviews: Review[] };

/** Anchor ids of the hub segments (data/b2b-segments.forBusinessSegments). */
export type SegmentId = "property-management" | "horeca" | "hotels" | "hoa";

/** Business form "Type of business" options (data/forms.businessTypeOptions). */
export type BusinessTypeOption = "Restaurant" | "Property Management" | "Hotel" | "Laundry" | "Other";

// /for-business (→ /commercial-appliance-repair) segment card — anchor id, <h3>, bullets.
// Publication via `status` — the single draft/published mechanism (spec story 5).
export type ForBusinessSegment = Publishable & {
  id: SegmentId; // anchor id on the hub
  title: string;
  eyebrow: string;
  heading: string; // <h3>
  text: string;
  href: string;
  linkLabel: string;
  bullets: string[];
};

// Commercial child pages /commercial-appliance-repair/[slug] (spec §6).
export type CommercialPage = Publishable & {
  slug: string; // one of the 7 from the brief
  /** short name for chips/links, e.g. "Commercial Refrigerator Repair" */
  name: string;
  kind: "equipment" | "industry";
  segmentId?: SegmentId; // industry pages only
  /** industry pages: the business form's "Type of business" preset for the page's CTA */
  businessType?: BusinessTypeOption;
  /** equipment pages: the business form's equipment preset (= data/forms.businessEquipmentOptions) */
  applianceFormLabel?: string;
  /** equipment pages: the residential services (data/services slugs) this equipment has at home */
  homeCounterparts?: string[];
  /** equipment pages: the card image on the commercial home */
  cardImage?: string;
  seo: { title: string; description: string };
  hero: { h1: string; lede: string }; // h1 may contain <br><span>
  equipment: {
    types: string[];
    brandNames: string[];
    moreEquipment?: Publishable & { items: string[] };
  };
  failures: { title: string; body: string; businessImpact: string }[];
  callProcess?: Publishable & { body: string };
  faqs: PublishableFaq[];
  reviewAuthors: string[];
  photo?: { src: string; alt: string };
};

// Knowledge centre (spec §11).
export type GuideCategory =
  | "refrigerator"
  | "dishwasher"
  | "washer"
  | "dryer"
  | "oven-range"
  | "ice-maker"
  | "commercial";

export type GuideArticle = Publishable & {
  slug: string;
  category: GuideCategory;
  title: string;
  metaDescription: string;
  model?: string;
  appliesTo?: { brand?: string };
  symptoms: string[];
  diagnosis: string[];
  causes: { cause: string; detail: string }[];
  repairSteps: string[];
  whenToCallPro: string;
  /** a data/services slug or a data/commercial slug */
  serviceSlug: string;
  reviewedByOwner: boolean;
  author?: "owner"; // only when reviewedByOwner
  technician?: "owner";
  datePublished?: string; // ISO, set on publication
  dateModified?: string;
  sources: { claim: string; url: string; title: string }[]; // never rendered
};

// Repair cases (story 75) — deliberately NO customer name/address fields.
export type RepairCase = Publishable & {
  slug: string;
  title: string;
  appliance: string;
  model?: string;
  symptom: string;
  diagnosis: string;
  failedComponent: string;
  repair: string;
  parts: string[];
  result: string;
  /** slug of a town/area from data/towns */
  area?: string;
  technician?: "owner";
  /** a data/services slug or a data/commercial slug */
  serviceSlug: string;
};

export type Brand = {
  name: string;
  logo: string;
  alt: string;
  tier: "commercial" | "premium" | "mass";
  /** appears in the reordered home #brands grid (subset of the full /brands list) */
  home?: boolean;
};

/** Home-form lead (branch "home"), as accepted by lib/book/schema.ts. */
export type HomeLeadInput = {
  branch: "home";
  name: string;
  phone: string;
  /** one of data/forms homeApplianceOptions */
  appliance: string;
  message?: string;
};

/** Business-form lead (branch "business"); blank optional fields are absent. */
export type BusinessLeadInput = {
  branch: "business";
  company: string;
  contactName: string;
  phone: string;
  email?: string;
  /** one of data/forms businessTypeOptions */
  businessType: string;
  /** one of data/forms businessEquipmentOptions */
  equipment?: string;
  units?: string;
  /** one of data/forms urgencyOptions */
  urgency?: string;
  message?: string;
};

/** A validated lead from either form, discriminated by `branch`. */
export type LeadInput = HomeLeadInput | BusinessLeadInput;

export type LeadResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export interface LeadSink {
  name: string;
  enabled: boolean;
  send(lead: LeadInput): Promise<void>;
}
