import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  applianceRepairHub as hub,
  getService,
  servicePage as copy,
  serviceRepairName,
  serviceSlugs,
} from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { isPublished } from "@/lib/publish";
import { areaLinksForService, businessLinkForService } from "@/lib/links";
import { BookCallCtas } from "@/components/ui/ctas";
import { businessNode, faqNode, graph, serviceNode } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { Anchor } from "@/components/ui/anchor";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { ChipRow, type ChipItem } from "@/components/ui/chip-row";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Prose } from "@/components/ui/prose";
import { CtaBand } from "@/components/ui/cta-band";

// One dynamic route for all 12 appliance-repair pages. Structure is 1:1 with
// appliance-repair/*.html (refrigerator.html is the reference; it is the only one
// without the "Also repair" section). All copy comes from data/services: the service
// itself (H1 with the places, title/meta, section headings, the optional Ballantyne
// note) and `servicePage` (headings shared by all 12).
//
// Sections alternate shades (no divider lines): hero D · problems L · brands D ·
// [Ballantyne note L2] · FAQ L · where-we-work D2 · [also repair L] · CTA band.

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
    path: `${hub.path}/${slug}`,
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

  const path = `${hub.path}/${service.slug}`;
  const serviceName = serviceRepairName(service);
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: copy.homeCrumb, path: "/" },
    { name: hub.name, path: hub.path },
    { name: serviceName, path },
  ]);
  const note =
    service.ballantyneNote && isPublished(service.ballantyneNote) ? service.ballantyneNote : null;

  // "Where we work": the published areas (lib/links — Ballantyne, South Charlotte; drafts
  // never appear) ahead of the service's own town list.
  const whereWeWork: ChipItem[] = [
    ...areaLinksForService(service.slug),
    ...service.whereWeWork.map((town) => ({ label: town.name, href: town.href })),
  ].filter(
    (chip, i, all) => all.findIndex((c) => chipLabel(c) === chipLabel(chip)) === i,
  );

  // The one link to the commercial counterpart (brief §6), when that page is published.
  const businessLink = businessLinkForService(service.slug);
  const ctas = <BookCallCtas />;

  return (
    <>
      <JsonLd
        data={graph(
          businessNode(),
          // areaServed = exactly the places the H1 names (data/services H1_AREAS).
          serviceNode({ url: path, name: serviceName, areaServed: service.areaServed }),
          faqNode(path, service.faqs),
          jsonLd,
        )}
      />

      <PageHero
        breadcrumb={crumbs}
        h1={service.hero.h1}
        lede={service.hero.lede}
        ctas={ctas}
      />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={copy.problems.eyebrow}
          h2={service.sectionHeads.problems}
          lede={copy.problems.lede}
        />
        <ProblemCardGrid items={service.problems} variant="light" columns={3} />
        {businessLink && <ChipRow items={[businessLink]} style={{ marginTop: 28 }} />}
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow={copy.brands.eyebrow}
          h2={copy.brands.h2}
          h2Style={H2_CLAMP}
        />
        <ChipRow tone="dark" items={service.brands} />
        <p style={{ marginTop: 24 }}>
          <Anchor
            href={copy.brands.link.href}
            style={{
              color: "var(--accent)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {copy.brands.link.label}
          </Anchor>
        </p>
      </section>

      {note && (
        <section className="section section-light-2">
          <Prose heading={note.heading} paragraphs={[note.body]} />
        </section>
      )}

      <section className="section section-light">
        <SectionHead tone="light" eyebrow={copy.faq.eyebrow} h2={service.sectionHeads.faq} />
        <FaqAccordion items={service.faqs} style={{ maxWidth: 760 }} />
      </section>

      <section className="section section-dark-2">
        <SectionHead
          tone="dark"
          eyebrow={copy.whereWeWork.eyebrow}
          h2={copy.whereWeWork.h2}
          style={{ marginBottom: 30 }}
          h2Style={H2_CLAMP}
        />
        <ChipRow tone="dark" items={whereWeWork} />
      </section>

      {service.alsoRepair.length > 0 && (
        <section className="section section-light">
          <SectionHead
            tone="light"
            eyebrow={copy.alsoRepair.eyebrow}
            h2={copy.alsoRepair.h2}
            style={{ marginBottom: 30 }}
            h2Style={H2_CLAMP}
          />
          <ChipRow
            items={service.alsoRepair.map((item) => ({
              label: item.name,
              href: `${hub.path}/${item.slug}`,
            }))}
          />
        </section>
      )}

      <CtaBand h2={copy.cta.h2} body={copy.cta.body} ctas={ctas} />
    </>
  );
}

const chipLabel = (chip: ChipItem): string => (typeof chip === "string" ? chip : chip.label);
