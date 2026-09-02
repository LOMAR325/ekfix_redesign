import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, serviceSlugs } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Anchor } from "@/components/ui/anchor";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { ChipRow } from "@/components/ui/chip-row";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";

// One dynamic route for all 12 appliance-repair pages. Structure is 1:1 with
// appliance-repair/*.html (refrigerator.html is the reference; it is the only one
// without the "Also repair" section). Content comes from data/services.
//
// Only two section headings vary per appliance and are not held in data/services
// (that module owns hero/problems/brands/faqs/whereWeWork/alsoRepair). They are
// transcribed verbatim from the static HTML here — keyed by slug so a diff against
// the HTML is trivial. Everything else (eyebrows, the brands / where-we-work /
// also-repair / CTA headings) is identical across all 12 files.
const SECTION_H2: Record<string, { problems: string; faq: string }> = {
  refrigerator: {
    problems: "Six refrigerator faults<br>we see most often.",
    faq: "Refrigerator repair,<br>answered honestly.",
  },
  washer: {
    problems: "Six washer faults<br>we see most often.",
    faq: "Washer repair,<br>answered honestly.",
  },
  dryer: {
    problems: "Six dryer faults<br>we see most often.",
    faq: "Dryer repair,<br>answered honestly.",
  },
  dishwasher: {
    problems: "Six dishwasher faults<br>we see most often.",
    faq: "Dishwasher repair,<br>answered honestly.",
  },
  stove: {
    problems: "Six stove &amp; oven faults<br>we see most often.",
    faq: "Stove repair,<br>answered honestly.",
  },
  range: {
    problems: "Six range faults<br>we see most often.",
    faq: "Range repair,<br>answered honestly.",
  },
  cooktop: {
    problems: "Six cooktop faults<br>we see most often.",
    faq: "Cooktop repair,<br>answered honestly.",
  },
  microwave: {
    problems: "Six microwave faults<br>we see most often.",
    faq: "Microwave repair,<br>answered honestly.",
  },
  freezer: {
    problems: "Six freezer faults<br>we see most often.",
    faq: "Freezer repair,<br>answered honestly.",
  },
  "ice-maker": {
    problems: "Six ice maker faults<br>we see most often.",
    faq: "Ice Maker repair,<br>answered honestly.",
  },
  "wine-cooler": {
    problems: "Six wine cooler faults<br>we see most often.",
    faq: "Wine Cooler repair,<br>answered honestly.",
  },
  "garbage-disposal": {
    problems: "Six garbage disposal faults<br>we see most often.",
    faq: "Garbage Disposal repair,<br>answered honestly.",
  },
};

const H2_CLAMP = {
  fontSize: "clamp(30px, 3.2vw, 44px)",
  letterSpacing: "-1.8px",
} as const;

// Only the 12 slugs from data/services render; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return pageMetadata({
    title: service.title,
    description: service.metaDescription,
    path: `/appliance-repair/${slug}`,
  });
}

export default async function ApplianceRepairPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const heads = SECTION_H2[slug];

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(service),
          faqJsonLd(service.faqs),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "We Repair", url: "/#repair" },
            {
              name: `${service.name} Repair`,
              url: `/appliance-repair/${service.slug}`,
            },
          ]),
        ]}
      />

      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "We Repair", href: "/#repair" },
          { label: `${service.name} Repair` },
        ]}
        h1={service.hero.h1}
        lede={service.hero.lede}
      />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow="Common problems we fix"
          h2={heads.problems}
          lede="Every diagnostic includes a plain-language explanation of what's actually wrong — before we touch a part."
        />
        <ProblemCardGrid items={service.problems} variant="light" columns={3} />
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow="Brands we service"
          h2="Standard to premium."
          h2Style={H2_CLAMP}
        />
        <ChipRow tone="dark" items={service.brands} />
        <p style={{ marginTop: 24 }}>
          <Anchor
            href="/brands"
            style={{
              color: "var(--accent)",
              fontSize: 14,
              fontWeight: 600,
              borderBottom: "1px solid rgba(198,242,78,0.5)",
            }}
          >
            See every brand we service →
          </Anchor>
        </p>
      </section>

      <section className="section section-light">
        <SectionHead tone="light" eyebrow="FAQ" h2={heads.faq} />
        <FaqAccordion items={service.faqs} style={{ maxWidth: 760 }} />
      </section>

      <section className="section section-dark-2">
        <SectionHead
          tone="dark"
          eyebrow="Where we work"
          h2="Charlotte &amp; nearby towns."
          style={{ marginBottom: 30 }}
          h2Style={H2_CLAMP}
        />
        <ChipRow
          tone="dark"
          items={service.whereWeWork.map((town) => ({
            label: town.name,
            href: town.href,
          }))}
        />
      </section>

      {service.alsoRepair.length > 0 && (
        <section className="section section-light">
          <SectionHead
            tone="light"
            eyebrow="Also repair"
            h2="Other appliances."
            style={{ marginBottom: 30 }}
            h2Style={H2_CLAMP}
          />
          <ChipRow
            items={service.alsoRepair.map((item) => ({
              label: item.name,
              href: `/appliance-repair/${item.slug}`,
            }))}
          />
        </section>
      )}

      <CtaBand
        h2="Ready when you are."
        body="$75 diagnostic — waived completely once you book the repair."
      />
    </>
  );
}
