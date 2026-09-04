import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/page-hero";
import { BookCallCtas } from "@/components/ui/ctas";
import { AudienceGrid } from "@/components/ui/audience-card";
import { Prose } from "@/components/ui/prose";
import { ChipRow } from "@/components/ui/chip-row";
import { LocalPhoto } from "@/components/ui/local-photo";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";
import { ProcessSteps } from "@/components/for-business/ProcessSteps";
import { ServiceFormats } from "@/components/for-business/ServiceFormats";
import {
  publicForBusinessSegments,
  forBusinessHeroLedeExtra,
  laundryObjectTypes,
  processSteps,
  whyCallUs,
  serviceFormats,
  businessFaqs,
} from "@/data/b2b-segments";

// <title>/<description> extended per b2b-priority-brief §9 (hotels added to the
// page); canonical is the clean route path.
export const metadata: Metadata = pageMetadata({
  title:
    "Appliance Repair for Property Managers, Restaurants & Hotels | EK Global",
  description:
    "Commercial appliance repair in Charlotte, NC for property management companies, restaurants and cafés (HoReCa), hotels, and commercial laundry operators. Preventive maintenance and standing service contracts available.",
  path: "/for-business",
});

// First two sentences ported verbatim from for-business.html `.page-hero .lede`;
// the third sentence (service formats) comes from data/b2b-segments.
const HERO_LEDE = `Property managers, restaurants, cafés, and laundry operators across Charlotte trust EK Global to keep tenant and guest-facing equipment running — with the same technician on every call. ${forBusinessHeroLedeExtra}`;

// The `/for-business` segment cards. b2b-priority-brief §8 does not call for an
// in-card link here (that requirement is for the home page's #who-we-serve cards,
// and for-business.html has no links inside its audience cards), so `linkLabel` is
// cleared — the card's self-referential `href` would only scroll to itself.
// `publicForBusinessSegments` already drops any unconfirmed vertical (HOA carries
// `placeholder: true` in data/b2b-segments and is never rendered).
const segmentCards = publicForBusinessSegments.map((s) => ({
  ...s,
  linkLabel: "",
}));

export default function ForBusinessPage() {
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: "For Business", path: "/for-business" },
  ]);

  return (
    <>
      <JsonLd data={[jsonLd, faqJsonLd(businessFaqs)]} />

      <PageHero
        breadcrumb={crumbs}
        h1="Commercial appliance<br>repair, <span>done right.</span>"
        lede={HERO_LEDE}
        ctas={<BookCallCtas bookLabel="Request a Quote" />}
      />

      {/* Segments — anchor ids (#property-management, #horeca, #hotels) are
          rendered on each .audience-card by AudienceCard. `section-light-2` so the
          dark cards step off both the dark PageHero above and the #f4f5f2 #laundry
          section below (2026-09-03: section hairlines removed, adjacent sections
          must differ in tone). */}
      <section className="section section-light-2">
        <AudienceGrid layout="card-grid-4" items={segmentCards} />
      </section>

      {/* Commercial laundry — ported 1:1 from for-business.html. The object types
          already appear in the ported paragraph; a short caption bridges them to the
          brand chips (b2b §8 block 3) without restating the same thought. */}
      <section className="section section-light" id="laundry">
        <div className="two-col">
          <Prose
            heading="Commercial laundry equipment"
            paragraphs={[
              "For hotels, laundromats, healthcare facilities, and multi-housing properties, we repair and maintain washers, dryers, ironers, and folding machines — not just the individual unit in a resident's apartment, but full on-premise laundry systems.",
            ]}
          >
            <p style={{ marginTop: 20 }}>
              These are the commercial laundry brands we service:
            </p>
            <ChipRow
              items={[...laundryObjectTypes.brandChips]}
              style={{ marginTop: 12 }}
            />
          </Prose>
          <LocalPhoto
            src="/images/kostia-laundry.webp"
            alt="Commercial laundry equipment repair on a rooftop unit"
          />
        </div>
      </section>

      <ProcessSteps items={processSteps} />

      {/* Why … call us — ported 1:1, expanded from 3 to 5 cards via data. */}
      <section className="section section-dark-2">
        <SectionHead
          tone="dark"
          eyebrow="Why property & kitchen managers call us"
          h2="Fewer callbacks, less downtime."
          style={{ marginBottom: 30 }}
          h2Style={{
            fontSize: "clamp(30px, 3.2vw, 44px)",
            letterSpacing: "-1.8px",
          }}
        />
        <ProblemCardGrid items={whyCallUs} variant="dark" columns={3} />
      </section>

      <ServiceFormats items={serviceFormats} />

      <section className="section section-light" id="faq-business">
        <SectionHead
          tone="light"
          eyebrow="FAQ"
          h2="Working with EK Global,<br>answered."
        />
        <FaqAccordion items={businessFaqs} style={{ maxWidth: 760 }} />
      </section>

      <CtaBand
        h2="Let's talk about<br>your properties."
        body="Tell us what you manage — a single emergency call, standing maintenance, or a whole portfolio — and we'll put together a straightforward quote."
        ctas={<BookCallCtas bookLabel="Request a Quote" />}
      />
    </>
  );
}
