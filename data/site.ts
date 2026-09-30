import { business } from "./business";

// Site chrome copy: the three headers and four footers of the two-branch site (ADR 0022),
// menu labels (the menus themselves are built in lib/nav), shared link labels, the rating
// badge and the draft banner. The branch roots and their form anchors are spelled here once.

/** The two branches: roots, the form anchor of each, the commercial service-area block. */
export const branchPaths = {
  business: {
    root: "/commercial-appliance-repair",
    request: "/commercial-appliance-repair#request",
    serviceArea: "/commercial-appliance-repair#service-area",
  },
  home: {
    root: "/appliance-repair",
    book: "/appliance-repair#book",
    pricing: "/appliance-repair#pricing",
  },
} as const;

export type SiteVariant = "commercial" | "residential" | "shared";

const social = [
  { label: "Instagram", href: business.social.instagram },
  { label: "Facebook", href: business.social.facebook },
  { label: "TikTok", href: business.social.tiktok },
];

export const site = {
  /** The "EK" badge in the header and the footer. */
  brandBadge: "EK",
  menuToggleLabel: "Toggle menu",
  /** Per header: the brand subtitle, where the logo leads, the accent button, the branch switch. */
  header: {
    commercial: {
      brandSubtitle: "Commercial Repair",
      brandHref: branchPaths.business.root,
      cta: { label: "Request Service", href: branchPaths.business.request },
      switchTo: { label: "For Homes", href: branchPaths.home.root },
    },
    residential: {
      brandSubtitle: "Appliance Repair",
      brandHref: branchPaths.home.root,
      cta: { label: "Book a Repair", href: branchPaths.home.book },
      switchTo: { label: "For Business", href: branchPaths.business.root },
    },
    shared: {
      brandSubtitle: "Appliance Repair",
      brandHref: "/",
      cta: null,
      switchTo: null,
    },
    entry: { brandSubtitle: "Appliance Repair" },
  },
  footer: {
    contactTitle: "Contact",
    followTitle: "Follow",
    social,
    copyrightYear: 2026,
    rightsReserved: "All rights reserved.",
    commercial: {
      description:
        "Commercial appliance repair for restaurants, property managers, hotels, and laundry operators in Charlotte, NC and the surrounding towns. EPA 608 & OSHA certified. Fully insured.",
      servicesTitle: "Commercial",
      companyTitle: "Company",
      request: { label: "Request Service", href: branchPaths.business.request },
      company: [
        { label: "Our Story", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "Brands We Service", href: "/brands" },
        { label: "For Homes →", href: branchPaths.home.root },
      ],
    },
    residential: {
      description:
        "Family-owned appliance repair serving Charlotte NC, the surrounding towns, and northern SC. EPA 608 & OSHA certified. Fully insured.",
      servicesTitle: "We Repair",
      companyTitle: "Site",
      allAppliances: { label: "All Home Appliances", href: branchPaths.home.root },
      company: [
        { label: "Service Area", href: "/towns" },
        { label: "Brands We Service", href: "/brands" },
        { label: "Our Story", href: "/about" },
        { label: "Reviews", href: "/reviews" },
        { label: "For Business →", href: branchPaths.business.root },
      ],
      /** A household offer — only the residential footer carries it (brief §2). */
      discounts: "Discounts for veterans, seniors & families with kids",
    },
    shared: {
      description:
        "Appliance repair for businesses and homes in Charlotte, NC, the surrounding towns, and northern SC. EPA 608 & OSHA certified. Fully insured.",
      siteTitle: "Site",
      siteLinks: [
        { label: "For Business", href: branchPaths.business.root },
        { label: "For Homes", href: branchPaths.home.root },
        { label: "Service Area", href: "/towns" },
        { label: "Brands We Service", href: "/brands" },
        { label: "Our Story", href: "/about" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
    /** The thin footer of the entry page `/`. */
    entry: [
      { label: "About", href: "/about" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  /** Top-level menu labels (lib/nav). */
  nav: {
    equipment: "Equipment",
    industries: "Industries",
    hotelsLaundry: "Hotels & Laundry",
    serviceArea: "Service Area",
    weRepair: "We Repair",
    brands: "Brands",
    guides: "Guides",
    about: "About",
    reviews: "Reviews",
    forBusiness: "For Business",
    forHomes: "For Homes",
  },
  /** Link labels shared by lib/links (chip rows) and lib/nav. */
  links: {
    allServiceTowns: "All Service Towns →", // also the last item of the nav "Service Area" group
    commercialHub: "Commercial Appliance Repair",
  },
  /** The one link from a page of one branch to its counterpart in the other (lib/links). */
  crossBranch: {
    toBusiness: "Need this for a business? →",
    toHome: "Need this at home?",
    commercialInArea: "Commercial service in this area →",
  },
  /** The button pair of the shared pages (/about, /reviews, /brands): business first. */
  branchCtas: {
    business: { label: "Request Business Service", href: branchPaths.business.request },
    home: { label: "Book a Home Repair", href: branchPaths.home.book },
  },
  /** Text next to every `.stars` row (they are decorative, aria-hidden): "5.0 · 6 reviews". */
  ratingText: (value: number, count: number) =>
    `${value.toFixed(1)} · ${count} ${count === 1 ? "review" : "reviews"}`,
  /** Label under the rating number in `.rating-badge` (components/ui/section-head): the review count. */
  ratingBadgeCountLabel: (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`,
  /** Screen-reader text of one review's decorative stars. */
  reviewStarsLabel: "Rated 5 out of 5",
  /** Shown only in `next dev` on a draft page (components/DraftBanner). */
  draftBanner: "DRAFT — not published",
} as const;
