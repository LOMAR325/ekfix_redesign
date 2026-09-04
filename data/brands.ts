import type { Brand } from "./types";

// All brands from brands.html, in the ON-PAGE ORDER of that page:
// first the "Residential & premium kitchen" grid, then "Commercial & specialty refrigeration".
// /brands renders these two groups by filtering on `tier`; the home page renders `homeBrands`.
// `logo` = file in public/images/ (names unchanged from assets/images/). `alt` = brands.html alt text.
// `home: true` marks the subset that appears in the reordered home #brands grid (keeps the
// home grid the same size it is today — 16 cells — just commercial-first).
export const brands: Brand[] = [
  // --- Residential & premium kitchen (brands.html section 1) ---
  { name: "Sub-Zero", logo: "/images/sub_zero_logo.webp", alt: "Sub-Zero repair", tier: "premium", home: true },
  { name: "Thermador", logo: "/images/thermador.webp", alt: "Thermador repair", tier: "premium", wide: true, home: true },
  { name: "Bosch", logo: "/images/bosch.webp", alt: "Bosch repair", tier: "premium", home: true },
  { name: "Samsung", logo: "/images/samsung.webp", alt: "Samsung repair", tier: "mass", home: true },
  { name: "Whirlpool", logo: "/images/whirlpool.webp", alt: "Whirlpool repair", tier: "mass", home: true },
  { name: "KitchenAid", logo: "/images/kitchen_aid.webp", alt: "KitchenAid repair", tier: "mass", wide: true, home: true },
  { name: "Electrolux", logo: "/images/electrolux.webp", alt: "Electrolux repair", tier: "mass", wide: true, home: true },
  { name: "Maytag", logo: "/images/maytag.webp", alt: "Maytag repair", tier: "mass", home: true },
  { name: "Frigidaire", logo: "/images/frigidare.webp", alt: "Frigidaire repair", tier: "mass", wide: true, home: true },
  { name: "Amana", logo: "/images/Amana.webp", alt: "Amana repair", tier: "mass", home: true },
  { name: "Kenmore", logo: "/images/Kenmore_Logo.webp", alt: "Kenmore repair", tier: "mass", home: true },
  { name: "GE", logo: "/images/GE.webp", alt: "GE repair", tier: "mass" },
  { name: "LG", logo: "/images/LG.webp", alt: "LG repair", tier: "mass" },
  { name: "Haier", logo: "/images/Haier.webp", alt: "Haier repair", tier: "mass" },
  { name: "Hotpoint", logo: "/images/Hotpoint.webp", alt: "Hotpoint repair", tier: "mass" },
  { name: "JennAir", logo: "/images/JennAir.webp", alt: "JennAir repair", tier: "premium" },
  { name: "Dacor", logo: "/images/Dacor.webp", alt: "Dacor repair", tier: "premium" },
  { name: "DCS", logo: "/images/DCS.webp", alt: "DCS repair", tier: "premium" },
  { name: "Fisher & Paykel", logo: "/images/Fisher_Paykel.webp", alt: "Fisher & Paykel repair", tier: "premium" },
  { name: "Viking", logo: "/images/Viking.webp", alt: "Viking repair", tier: "premium" },
  { name: "Wolf", logo: "/images/Wolf.webp", alt: "Wolf repair", tier: "premium" },
  { name: "Thor", logo: "/images/Thor.webp", alt: "Thor Kitchen repair", tier: "premium" },

  // --- Commercial & specialty refrigeration (brands.html section 2) ---
  { name: "Hobart", logo: "/images/hobart.webp", alt: "Hobart repair", tier: "commercial", home: true },
  { name: "Blodgett", logo: "/images/blodget.webp", alt: "Blodgett repair", tier: "commercial", home: true },
  { name: "Middleby", logo: "/images/Middleby_Corporation.webp", alt: "Middleby Corporation repair", tier: "commercial", wide: true, home: true },
  { name: "Girbau", logo: "/images/girbau.webp", alt: "Girbau repair", tier: "commercial", home: true },
  { name: "Copeland", logo: "/images/copeland.webp", alt: "Copeland repair", tier: "commercial", home: true },
  { name: "Beverage-Air", logo: "/images/Beverage_Air.webp", alt: "Beverage-Air repair", tier: "commercial" },
  { name: "Perlick", logo: "/images/Perlick.webp", alt: "Perlick repair", tier: "commercial" },
  { name: "Scotsman", logo: "/images/Scotsman.webp", alt: "Scotsman repair", tier: "commercial" },
  { name: "Speed Queen", logo: "/images/Speed_Queen.webp", alt: "Speed Queen repair", tier: "commercial" },
  { name: "True", logo: "/images/True.webp", alt: "True Refrigeration repair", tier: "commercial" },
  { name: "U-Line", logo: "/images/U_line.webp", alt: "U-Line repair", tier: "commercial" },
];

const TIER_ORDER: Record<Brand["tier"], number> = { commercial: 0, premium: 1, mass: 2 };

// Home #brands grid: the current 16 cells, reordered commercial -> premium -> mass
// (b2b-priority-brief §7 block 7). Order within a tier follows the brands.html order above.
export const homeBrands: Brand[] = brands
  .filter((b) => b.home)
  .slice()
  .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);

export const residentialBrands: Brand[] = brands.filter((b) => b.tier !== "commercial");
export const commercialBrands: Brand[] = brands.filter((b) => b.tier === "commercial");

// The `.brand-note` line under each grid (dotted "also serviced" list + a "call us" CTA).
export const brandNote = {
  // index.html #brands
  home: {
    tag: "Commercial",
    text: "Unimac · Miele · Fisher & Paykel · and more",
    cta: "ask us about your model",
  },
  // brands.html commercial section
  brandsPage: {
    tag: "Also serviced",
    text: "Unimac · Dexter · Huebsch · Wascomat · Miele · and more",
    cta: "ask us about your model",
  },
} as const;

// Home #brands lede — commercial-first wording (b2b §7 block 7 / spec story 24).
export const homeBrandsLede =
  "Commercial and residential — from Hobart and Girbau to Sub-Zero and Thermador.";

// /brands page copy — carried over 1:1 from brands.html so task 07 renders it from data,
// not hardcode (parallels data/towns.ts `townsIndex`). "Residential & premium kitchen" +
// "Commercial & specialty refrigeration" grids are filtered from `brands` by tier
// (residentialBrands / commercialBrands).
export const brandsPage = {
  title: "Brands We Repair — Sub-Zero, Thermador, Bosch & More | EK Global",
  metaDescription:
    "EK Global repairs every major residential and commercial appliance brand — Sub-Zero, Thermador, Bosch, Viking, Wolf, Hobart, Girbau and more — in Charlotte, NC.",
  breadcrumb: "Home / Brands",
  hero: {
    h1: "Certified across<br><span>every major brand.</span>",
    lede: "From everyday kitchen appliances to premium and commercial equipment — original parts, manufacturer-approved procedures, one technician who knows the difference.",
  },
  residentialSection: {
    eyebrow: "Residential & premium kitchen",
    h2: "Everyday to high-end.",
  },
  commercialSection: {
    eyebrow: "Commercial & specialty refrigeration",
    h2: "Restaurants, bars & laundry.",
    lede: "Hobart, Girbau, Middleby and the rest of the commercial-kitchen and laundry lineup we service for property managers and HoReCa clients.",
  },
  dontSeeYourBrand: {
    h2: "Don't see your brand?",
    body: "This list covers what we repair most often, not everything we're capable of. Konstantin is EPA Universal and OSHA certified, which covers the full range of residential and commercial refrigeration and cooking equipment — if your appliance isn't pictured above, call and we'll tell you straight away whether it's something we handle.",
  },
  ctaBand: {
    h2: "Whatever brand it is,<br>we'll diagnose it right.",
    body: "$75 diagnostic, waived completely if you move forward with the repair.",
  },
} as const;
