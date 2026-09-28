import { business } from "./business";

// Header and footer copy (spec §2: "тексты шапки и подвала"). Link targets and their order
// are carried over 1:1 from the current Header/Footer — the menu itself lives in lib/nav.
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
      { label: "For Business", href: "/for-business" },
      { label: "Service Area", href: "/towns" },
    ],
    copyrightYear: 2026,
    rightsReserved: "All rights reserved.",
    discounts: "Discounts for veterans, seniors & families with kids",
  },
  /** Link labels shared by lib/links (chip rows) and lib/nav. */
  links: {
    allServiceTowns: "All Service Towns →", // also the last item of the nav "Service Area" group
    commercialHub: "Commercial Appliance Repair",
  },
  /** Shown only in `next dev` on a draft page (components/DraftBanner). */
  draftBanner: "DRAFT — not published",
} as const;
