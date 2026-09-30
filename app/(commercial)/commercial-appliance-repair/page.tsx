import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getReviews } from "@/lib/google-reviews";
import { GoogleReviewLinks } from "@/components/ui/google-review-links";
import { businessNode, faqNode, graph, type ServedArea } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/ui/hero";
import { AudienceGrid } from "@/components/ui/audience-card";
import { Prose } from "@/components/ui/prose";
import { ChipRow } from "@/components/ui/chip-row";
import { LocalPhoto } from "@/components/ui/local-photo";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { RepairGrid } from "@/components/ui/repair-grid";
import { BrandGrid } from "@/components/ui/brand-grid";
import { ReviewsGrid } from "@/components/ui/review-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { BookSection } from "@/components/ui/book-section";
import { ProcessSteps } from "@/components/commercial/ProcessSteps";
import { ServiceFormats } from "@/components/commercial/ServiceFormats";
import { TrustBand } from "@/components/commercial/TrustBand";
import { LeadForm } from "@/components/LeadForm";
import { business } from "@/data/business";
import { commercialBrands, brandNote } from "@/data/brands";
import {
  publicForBusinessSegments,
  laundryObjectTypes,
  processSteps,
  whyCallUs,
  serviceFormats,
  businessFaqs,
} from "@/data/b2b-segments";
import {
  commercialCta,
  commercialHub as hub,
  commercialHubPath,
  publishedCommercialPages,
} from "@/data/commercial";

// The commercial home (ADR 0022): the former hub (every section and anchor — #property-management,
// #horeca, #hotels, #laundry, #process, #formats, #faq-business) plus the business half of the
// former `/`, and the business form. Copy: data/commercial (page copy) and data/b2b-segments
// (segments, process, why-call-us, formats, FAQ). A draft segment (HOA) is never rendered.
// Tones: hero D → trust L2 → #industries L → #equipment D2 → #laundry L → #process L2 →
// #formats D → why D2 → reviews L → #brands D → #service-area D2 → #faq-business L → #request D2.
export const metadata: Metadata = pageMetadata({ ...hub.seo, path: commercialHubPath });

const H2_CLAMP = { fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-1.8px" } as const;

/** Service-area chips: Charlotte, its two areas, then the rest of business.areaServed. */
function serviceArea(): { chips: string[]; areaServed: ServedArea[] } {
  const [first, ...rest] = business.areaServed;
  return {
    chips: [first, ...hub.serviceArea.areas, ...rest],
    areaServed: [first, ...hub.serviceArea.areas.map((name) => ({ name, kind: "area" as const })), ...rest],
  };
}

export default async function CommercialHomePage() {
  const reviewsData = await getReviews();
  const pages = publishedCommercialPages();
  const industryPage = (segmentId: string) =>
    pages.find((p) => p.kind === "industry" && p.segmentId === segmentId);
  // A segment card leads to its industry page when one is published, else to the form below.
  const segmentCards = publicForBusinessSegments.map((s) => {
    const page = industryPage(s.id);
    return page
      ? { ...s, href: `${commercialHubPath}/${page.slug}`, linkLabel: `${page.name} →` }
      : { ...s, href: "#request", linkLabel: commercialCta.cardLink };
  });
  const equipment = pages.filter((p) => p.kind === "equipment");
  // Google reviews when live; else the site's business review(s).
  const businessReviews =
    reviewsData.source === "google" ? reviewsData.reviews : reviewsData.reviews.filter((r) => r.segment === "commercial");
  const area = serviceArea();

  return (
    <>
      {/* knowsAbout: the commercial services this page shows; aggregateRating: the hero states
          both numbers; areaServed: the #service-area chips; the FAQ is on the page. */}
      <JsonLd
        data={graph(
          businessNode({ knowsAbout: true, aggregateRating: reviewsData.source === "site", areaServed: area.areaServed }),
          faqNode(commercialHubPath, businessFaqs),
        )}
      />

      <Hero
        photo={hub.hero.photo}
        objectPosition="60% 40%"
        eyebrow={hub.hero.eyebrow}
        h1={hub.hero.h1}
        lede={hub.hero.lede}
        trust={hub.hero.trust}
        reviews={reviewsData}
        ctas={
          <>
            <a href="#request" className="btn btn-accent">
              {hub.hero.requestLabel} <span>→</span>
            </a>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              {hub.hero.callLabel}
            </a>
          </>
        }
      />
      <TrustBand />

      <section id="industries" className="section section-light">
        <SectionHead tone="light" eyebrow={hub.industries.eyebrow} h2={hub.industries.h2} />
        <AudienceGrid layout="card-grid-3" items={segmentCards} />
      </section>

      <section id="equipment" className="section section-dark-2">
        <SectionHead tone="dark" eyebrow={hub.equipment.eyebrow} h2={hub.equipment.h2} lede={hub.equipment.lede} />
        <RepairGrid
          items={equipment.map((p) => ({
            label: p.name,
            href: `${commercialHubPath}/${p.slug}`,
            tag: hub.equipment.tag,
            image: p.cardImage,
            imageAlt: p.name,
          }))}
        />
      </section>

      <section className="section section-light" id="laundry">
        <div className="two-col">
          <Prose heading={hub.laundry.heading} paragraphs={[hub.laundry.paragraph]}>
            <p style={{ marginTop: 20 }}>{hub.laundry.brandsCaption}</p>
            <ChipRow items={[...laundryObjectTypes.brandChips]} style={{ marginTop: 12 }} />
          </Prose>
          <LocalPhoto src={hub.laundry.photo.src} alt={hub.laundry.photo.alt} />
        </div>
      </section>

      <ProcessSteps items={processSteps} />

      <ServiceFormats items={serviceFormats}>
        <div style={{ maxWidth: 760, marginTop: 40 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700 }}>{hub.formats.contractHeading}</h3>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--text-light-60)" }}>
            {hub.formats.contract}
          </p>
        </div>
      </ServiceFormats>

      <section className="section section-dark-2">
        <SectionHead tone="dark" eyebrow={hub.why.eyebrow} h2={hub.why.h2} style={{ marginBottom: 30 }} h2Style={H2_CLAMP} />
        <ProblemCardGrid items={whyCallUs} variant="dark" columns={3} />
      </section>

      {businessReviews.length > 0 && (
        <section id="business-reviews" className="section section-light">
          <SectionHead tone="light" eyebrow={reviewsData.source === "google" ? hub.reviews.googleEyebrow : hub.reviews.eyebrow} h2={hub.reviews.h2} ratingBadge={reviewsData} />
          <ReviewsGrid reviews={businessReviews} />
          <ChipRow items={[{ label: hub.reviews.allReviews, href: "/reviews" }]} style={{ marginTop: 24 }} />
          <GoogleReviewLinks data={reviewsData} style={{ marginTop: 12 }} />
        </section>
      )}

      <section id="brands" className="section section-dark">
        <SectionHead tone="dark" eyebrow={hub.brands.eyebrow} h2={hub.brands.h2} h2Style={H2_CLAMP} />
        <BrandGrid brands={commercialBrands} note={brandNote.brandsPage} />
      </section>

      <section id="service-area" className="section section-dark-2">
        <SectionHead tone="dark" eyebrow={hub.serviceArea.eyebrow} h2={hub.serviceArea.h2} h2Style={H2_CLAMP} />
        <p style={{ maxWidth: 760, margin: "0 0 28px", fontSize: 16, lineHeight: 1.7, color: "var(--text-light-60)" }}>
          {hub.serviceArea.body}
        </p>
        <ChipRow tone="dark" items={area.chips} />
      </section>

      <section className="section section-light" id="faq-business">
        <SectionHead tone="light" eyebrow={hub.faq.eyebrow} h2={hub.faq.h2} />
        <FaqAccordion items={businessFaqs} style={{ maxWidth: 760 }} />
      </section>

      <BookSection id="request" eyebrow={hub.request.eyebrow} h2={hub.request.h2} body={hub.request.body} facts={hub.request.facts}>
        <LeadForm branch="business" phone={business.phone} />
      </BookSection>
    </>
  );
}
