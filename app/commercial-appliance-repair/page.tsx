import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { businessNode, faqNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/page-hero";
import { AudienceGrid } from "@/components/ui/audience-card";
import { Prose } from "@/components/ui/prose";
import { ChipRow } from "@/components/ui/chip-row";
import { LocalPhoto } from "@/components/ui/local-photo";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";
import { ProcessSteps } from "@/components/commercial/ProcessSteps";
import { ServiceFormats } from "@/components/commercial/ServiceFormats";
import { CommercialCtas } from "@/components/commercial/CommercialCtas";
import { bookingHref } from "@/components/commercial/booking-link";
import { site } from "@/data/site";
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
  commercialDefaultContactAs,
  commercialHub,
  commercialHubPath,
  publishedCommercialPages,
  segmentContactAs,
} from "@/data/commercial";

// The commercial hub (spec §6, story 28): the former /for-business content 1:1 — every
// section and anchor (#property-management, #horeca, #hotels, #laundry, #process, #formats,
// #faq-business) — on the new path, plus the "Commercial services" row of published child
// pages. Copy comes from data/commercial (hub text) and data/b2b-segments (segments,
// process, why-call-us, formats, FAQ). A draft segment (HOA) is never rendered.
export const metadata: Metadata = pageMetadata({
  ...commercialHub.seo,
  path: commercialHubPath,
});

// Each segment card ends with the commercial CTA, preset to that segment's form option
// (story 52: #hotels → "Hotel or Hospitality", etc.).
const segmentCards = publicForBusinessSegments.map((s) => ({
  ...s,
  href: bookingHref({ contactAs: segmentContactAs[s.id] }),
  linkLabel: commercialCta.cardLink,
}));

const hubCtas = <CommercialCtas contactAs={commercialDefaultContactAs} />;

export default function CommercialHubPage() {
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: site.links.commercialHub, path: commercialHubPath },
  ]);
  const children = publishedCommercialPages();

  return (
    <>
      {/* knowsAbout: the commercial services are what this hub shows; the FAQ is on the page. */}
      <JsonLd
        data={graph(
          businessNode({ knowsAbout: true }),
          faqNode(commercialHubPath, businessFaqs),
          jsonLd,
        )}
      />

      <PageHero
        breadcrumb={crumbs}
        h1={commercialHub.hero.h1}
        lede={commercialHub.hero.lede}
        ctas={hubCtas}
      />

      {/* Segments — `section-light-2` so the dark cards step off the dark PageHero. */}
      <section className="section section-light-2">
        <AudienceGrid layout="card-grid-4" items={segmentCards} />
      </section>

      {/* Published child pages only; the row disappears while all of them are drafts.
          Dark, between the light-2 segments and the light #laundry. */}
      {children.length > 0 && (
        <section className="section section-dark-2">
          <SectionHead
            tone="dark"
            eyebrow={commercialHub.services.eyebrow}
            h2={commercialHub.services.h2}
            style={{ marginBottom: 30 }}
          />
          <ChipRow
            tone="dark"
            items={children.map((p) => ({ label: p.name, href: `${commercialHubPath}/${p.slug}` }))}
          />
        </section>
      )}

      <section className="section section-light" id="laundry">
        <div className="two-col">
          <Prose
            heading={commercialHub.laundry.heading}
            paragraphs={[commercialHub.laundry.paragraph]}
          >
            <p style={{ marginTop: 20 }}>{commercialHub.laundry.brandsCaption}</p>
            <ChipRow items={[...laundryObjectTypes.brandChips]} style={{ marginTop: 12 }} />
          </Prose>
          <LocalPhoto src={commercialHub.laundry.photo.src} alt={commercialHub.laundry.photo.alt} />
        </div>
      </section>

      <ProcessSteps items={processSteps} />

      <section className="section section-dark-2">
        <SectionHead
          tone="dark"
          eyebrow={commercialHub.why.eyebrow}
          h2={commercialHub.why.h2}
          style={{ marginBottom: 30 }}
          h2Style={{ fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-1.8px" }}
        />
        <ProblemCardGrid items={whyCallUs} variant="dark" columns={3} />
      </section>

      <ServiceFormats items={serviceFormats} />

      <section className="section section-light" id="faq-business">
        <SectionHead tone="light" eyebrow={commercialHub.faq.eyebrow} h2={commercialHub.faq.h2} />
        <FaqAccordion items={businessFaqs} style={{ maxWidth: 760 }} />
      </section>

      <CtaBand h2={commercialHub.ctaBand.h2} body={commercialHub.ctaBand.body} ctas={hubCtas} />
    </>
  );
}
