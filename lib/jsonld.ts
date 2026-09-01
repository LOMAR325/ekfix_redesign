import { business } from "@/data/business";
import { aggregate } from "@/data/reviews";
import { commercialServices } from "@/data/b2b-segments";
import type { Service } from "@/data/types";
import { absoluteUrl } from "@/lib/seo";

// schema.org JSON-LD builders. Pure functions — every NAP value comes from data/business.ts
// so the business name, phone, and service area can never drift between pages.
// The old static HTML used "EK Global Appliance Repair" on the home page and
// "EK Global Appliance Repair — Charlotte, NC" on town pages; here it is always "EK Global".

const CONTEXT = "https://schema.org";

const postalAddress = () => ({
  "@type": "PostalAddress",
  addressLocality: business.address.locality,
  addressRegion: business.address.region,
  addressCountry: business.address.country,
});

/** AggregateRating built strictly from data/reviews.ts (real reviews), not the "5.0 on Google" badge. */
export function aggregateRatingJsonLd() {
  return {
    "@type": "AggregateRating",
    ratingValue: aggregate.ratingValue,
    reviewCount: aggregate.reviewCount,
  };
}

/** HomeAndConstructionBusiness for the home page (and layout-level metadata). */
export function businessJsonLd() {
  return {
    "@context": CONTEXT,
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    image: absoluteUrl("/images/hero-technician.webp"),
    telephone: business.phoneE164,
    priceRange: "$$",
    url: absoluteUrl("/"),
    address: postalAddress(),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.openingHours.days,
      opens: business.openingHours.opens,
      closes: business.openingHours.closes,
    },
    areaServed: business.areaServed.map((name) => ({ "@type": "City", name })),
    sameAs: [
      business.social.instagram,
      business.social.facebook,
      business.social.tiktok,
    ],
    knowsAbout: commercialServices,
    aggregateRating: aggregateRatingJsonLd(),
  };
}

/** Service block for an /appliance-repair/<slug> page. Shape mirrors the old appliance-repair/*.html. */
export function serviceJsonLd(service: Service) {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    serviceType: `${service.name} Repair`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: business.name,
      telephone: business.phoneE164,
    },
    areaServed: {
      "@type": "City",
      name: `${business.address.locality}, ${business.address.region}`,
    },
  };
}

/** FAQPage from a list of question/answer pairs (services and /for-business FAQ). */
export function faqJsonLd(items: readonly { q: string; a: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** BreadcrumbList from an ordered trail. `url` may be root-relative or absolute; it is absolutised. */
export function breadcrumbJsonLd(trail: readonly { name: string; url: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}
