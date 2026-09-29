import { business } from "./business";

// Header and footer copy (spec §2: "тексты шапки и подвала"). Footer links carried over 1:1
// except spec §8: For Business → "Commercial" (the new hub path) and + Reviews. The menu
// structure lives in lib/nav; its labels are here.
export const site = {
  /** The "EK" badge in the header and the footer. */
  brandBadge: "EK",
  header: {
    brandSubtitle: "Appliance Repair",
    menuToggleLabel: "Toggle menu",
    bookCta: { label: "Book a Repair", href: "/#book" },
  },
  footer: {
    description:
      "Family-owned appliance repair serving Charlotte NC, the surrounding towns, and northern SC. EPA 608 & OSHA certified. Fully insured.",
    contactTitle: "Contact",
    followTitle: "Follow",
    siteTitle: "Site",
    social: [
      { label: "Instagram", href: business.social.instagram },
      { label: "Facebook", href: business.social.facebook },
      { label: "TikTok", href: business.social.tiktok },
    ],
    siteLinks: [
      { label: "Home", href: "/" },
      { label: "Our Story", href: "/about" },
      { label: "Brands We Service", href: "/brands" },
      { label: "Commercial", href: "/commercial-appliance-repair" },
      { label: "Service Area", href: "/towns" },
      { label: "Reviews", href: "/reviews" },
    ],
    copyrightYear: 2026,
    rightsReserved: "All rights reserved.",
    discounts: "Discounts for veterans, seniors & families with kids",
  },
  /** Top-level menu labels (lib/nav), in the brief's order (spec §8). */
  nav: {
    commercial: "Commercial",
    // "Home Appliances", not "Residential"/"Home Repair": the search wording ("home appliance
    // repair"), pairs with the hero's "For Homes", says the menu holds appliances (spec §8).
    homeAppliances: "Home Appliances",
    serviceArea: "Service Area",
    guides: "Guides",
    about: "About",
    reviews: "Reviews",
  },
  /** Link labels shared by lib/links (chip rows) and lib/nav. */
  links: {
    allServiceTowns: "All Service Towns →", // also the last item of the nav "Service Area" group
    commercialHub: "Commercial Appliance Repair",
  },
  /** Label under the rating number in `.rating-badge` (components/ui/section-head). */
  ratingBadgeLabel: "Google reviews",
  /** Booking form copy (components/BookForm). Input placeholders stay in the JSX (field hints). */
  bookForm: {
    title: "Book your repair",
    sub: "Takes less than a minute. 10% off online bookings.",
    thanks: "Thank you! We'll be in touch shortly.",
    thanksCall: (phone: string) => `Need it sooner? Call ${phone}.`,
    submit: "Send My Request →",
    submitting: "Sending…",
    netError: (phone: string) => `Couldn't send your request — please call ${phone}.`,
    finePrint: ["No hidden fees", "Free estimate", "Same-day slots"],
  },
  /** Shown only in `next dev` on a draft page (components/DraftBanner). */
  draftBanner: "DRAFT — not published",
} as const;
