import { business } from "@/data/business";
import { aggregate } from "@/data/reviews";
import { commercialServices } from "@/data/b2b-segments";
import { owner } from "@/data/people";
import type { GuideArticle, Publishable, Town } from "@/data/types";
import { isPublished } from "@/lib/publish";
import { articlePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

// schema.org JSON-LD as one graph per page (spec §4, stories 16–22). Node builders are
// pure functions without `@context`; `graph(...)` wraps them for `<JsonLd>`. Nodes refer
// to each other only by `{ "@id": … }`, and every @id is built from data/business.siteUrl
// (via lib/seo.absoluteUrl), so the business is one entity on every page.
//
// Rule (R23): markup describes only what the page shows. Base business fields are visible
// in the header/footer of every page; `image`, `areaServed`, `aggregateRating` and
// `knowsAbout` are opt-in per page. Drafts (spec §1) never reach the markup: `faqNode` drops
// draft items, `articleNode` refuses a draft article. `priceRange` is not emitted anywhere (no price range is shown).

export type JsonLdNode = { "@type": string; "@id"?: string; [key: string]: unknown };
export type JsonLdGraph = { "@context": "https://schema.org"; "@graph": JsonLdNode[] };

export const ids = {
  business: absoluteUrl("/#business"),
  website: absoluteUrl("/#website"),
  owner: absoluteUrl("/about#owner"),
} as const;

const ref = (id: string) => ({ "@id": id });

/** Skips `null` nodes (e.g. a `faqNode` with nothing published). */
export function graph(...nodes: (JsonLdNode | null)[]): JsonLdGraph {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((n): n is JsonLdNode => n !== null),
  };
}

/**
 * A served place. A plain string is a city ("Charlotte, NC"); a district of a city
 * (data/towns `kind: "area"`) is passed as `{ name, kind: "area" }` and becomes a Place.
 * `containedIn` — the state's name, for a place the page lists without its state (under a
 * visible "North Carolina" heading): `name` stays as shown, the state becomes `containedInPlace`.
 */
export type ServedArea = string | { name: string; kind: Town["kind"]; containedIn?: string };

const placeNode = (area: ServedArea) =>
  typeof area === "string"
    ? { "@type": "City", name: area }
    : {
        "@type": area.kind === "city" ? "City" : "Place",
        name: area.name,
        ...(area.containedIn
          ? { containedInPlace: { "@type": "State", name: area.containedIn } }
          : {}),
      };

export type BusinessNodeOptions = {
  /** only where the owner's hero photo is shown (`/`) */
  image?: boolean;
  /** the places listed on this page; omitted when absent or empty */
  areaServed?: readonly ServedArea[];
  /** only on pages that show the reviews (`/`, `/reviews`) */
  aggregateRating?: boolean;
  /** only on the commercial hub */
  knowsAbout?: boolean;
};

export function businessNode(opts: BusinessNodeOptions = {}): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "HomeAndConstructionBusiness",
    "@id": ids.business,
    name: business.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    telephone: business.phoneE164,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.openingHours.days,
      opens: business.openingHours.opens,
      closes: business.openingHours.closes,
    },
    sameAs: [business.social.instagram, business.social.facebook, business.social.tiktok],
  };
  if (opts.image) node.image = absoluteUrl(owner.photos.hero.src);
  if (opts.areaServed && opts.areaServed.length > 0) {
    node.areaServed = opts.areaServed.map(placeNode);
  }
  if (opts.aggregateRating) {
    // Built strictly from data/reviews.ts, not the "5.0 on Google" badge.
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregate.ratingValue,
      reviewCount: aggregate.reviewCount,
    };
  }
  if (opts.knowsAbout) node.knowsAbout = commercialServices;
  return node;
}

/** The site itself — home page only. */
export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absoluteUrl("/"),
    name: business.name,
    publisher: ref(ids.business),
  };
}

/** The owner as a Person — in full only on /about (other pages refer to `ids.owner`). */
export function ownerNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": ids.owner,
    name: owner.name,
    jobTitle: owner.role,
    url: absoluteUrl("/about"),
    image: absoluteUrl(owner.photos.portrait.src),
    worksFor: ref(ids.business),
    knowsAbout: owner.knowsAbout,
    hasCredential: owner.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: c.name,
    })),
  };
}

/** A repair service page. `areaServed` = the place named in the page's H1. */
export function serviceNode(input: {
  url: string;
  name: string;
  areaServed: readonly ServedArea[];
}): JsonLdNode {
  const url = absoluteUrl(input.url);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name: input.name,
    serviceType: input.name,
    url,
    provider: ref(ids.business),
    areaServed: input.areaServed.map(placeNode),
  };
}

/** A knowledge-centre article. Refuses a draft, and an article the owner has not reviewed (R21/R83). */
export function articleNode(article: GuideArticle): JsonLdNode {
  if (!isPublished(article)) {
    throw new Error(`articleNode: "${article.slug}" is a draft — drafts get no markup`);
  }
  if (!article.reviewedByOwner) {
    throw new Error(
      `articleNode: "${article.slug}" is not reviewedByOwner — it must not be published`,
    );
  }
  const url = absoluteUrl(articlePath(article.slug));
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.metaDescription,
    url,
    mainEntityOfPage: url,
    author: ref(ids.owner),
    publisher: ref(ids.business),
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
  };
}

/** A FAQ item; one without `status` (service FAQs) counts as published. */
export type FaqItem = { q: string; a: string } & Partial<Publishable>;

/**
 * FAQPage for the FAQ shown on the page at `url`. Draft items are dropped; `null` when
 * nothing is published (no FAQ is shown, so no node — `graph` skips it).
 */
export function faqNode(url: string, items: readonly FaqItem[]): JsonLdNode | null {
  const live = items.filter((item) => !item.status || isPublished({ status: item.status }));
  if (live.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(url)}#faq`,
    mainEntity: live.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** BreadcrumbList for the page at `url`. Trail urls may be root-relative; they are absolutised. */
export function breadcrumbNode(
  url: string,
  trail: readonly { name: string; url: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(url)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}
