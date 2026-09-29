import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Brand } from "@/data/types";
import { brands } from "@/data/brands";
import { reviewsByAuthors } from "@/data/reviews";
import { site } from "@/data/site";
import {
  commercialHubPath,
  commercialPageCopy as copy,
  commercialSlugs,
  getCommercialPage,
} from "@/data/commercial";
import { pageMetadata } from "@/lib/seo";
import { isPublished, published, routable } from "@/lib/publish";
import { linksForCommercial } from "@/lib/links";
import { businessNode, faqNode, graph, serviceNode, type ServedArea } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { ChipRow } from "@/components/ui/chip-row";
import { BrandGrid } from "@/components/ui/brand-grid";
import { LocalPhoto } from "@/components/ui/local-photo";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ReviewsGrid } from "@/components/ui/review-card";
import { CtaBand } from "@/components/ui/cta-band";
import { CommercialCtas } from "@/components/commercial/CommercialCtas";
import { FailureGrid } from "@/components/commercial/FailureGrid";

// Commercial child pages (spec §6, stories 32–39): hero → equipment & brands → failures and
// their cost to the business → how the call works (link to the hub's #process/#formats) →
// FAQ → business review (if any) → areas & guides (if any) → CTA. Everything comes from
// data/commercial; sub-blocks waiting on owner facts (`status: "draft"`) are not rendered, so
// the dev preview and the template test see exactly what production would show.
// Tones alternate: hero D · equipment L · failures L2 · call D · FAQ L · reviews L2 ·
// links D2 · CTA band D.

const H2_CLAMP = { fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-1.8px" } as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return commercialSlugs().map((slug) => ({ slug }));
}

const pathOf = (slug: string) => `${commercialHubPath}/${slug}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCommercialPage(slug);
  if (!page || !routable(page)) notFound();
  return pageMetadata({ ...page.seo, path: pathOf(slug) });
}

export default async function CommercialChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCommercialPage(slug);
  // Double guard (R07): getCommercialPage already returns only routable pages.
  if (!page || !routable(page)) notFound();

  const path = pathOf(slug);
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: site.links.commercialHub, path: commercialHubPath },
    { name: page.name, path },
  ]);

  // Brands by name: logo cells for data/brands entries, chips for the hub's laundry names.
  const logoBrands = page.equipment.brandNames
    .map((name) => brands.find((b) => b.name === name))
    .filter((b): b is Brand => b !== undefined);
  const chipBrands = page.equipment.brandNames.filter((name) => !logoBrands.some((b) => b.name === name));
  const moreEquipment =
    page.equipment.moreEquipment && isPublished(page.equipment.moreEquipment)
      ? page.equipment.moreEquipment.items
      : [];
  const callProcess = page.callProcess && isPublished(page.callProcess) ? page.callProcess : null;
  const faqs = published(page.faqs);
  const reviews = reviewsByAuthors(page.reviewAuthors);
  const links = linksForCommercial(slug);

  // areaServed = the places this page shows: Charlotte, NC (every lede) + the area chips.
  const areaServed: ServedArea[] = [
    "Charlotte, NC",
    ...links.flatMap((l) =>
      typeof l !== "string" && l.href?.startsWith("/towns/") ? [{ name: l.label, kind: "area" as const }] : [],
    ),
  ];

  const ctas = <CommercialCtas contactAs={page.contactAs} appliance={page.applianceFormLabel} />;

  return (
    <>
      <DraftBanner item={page} />
      <JsonLd
        data={graph(
          businessNode(),
          serviceNode({ url: path, name: page.name, areaServed }),
          faqNode(path, page.faqs),
          jsonLd,
        )}
      />

      <PageHero breadcrumb={crumbs} h1={page.hero.h1} lede={page.hero.lede} ctas={ctas} />

      <section className="section section-light">
        <SectionHead tone="light" eyebrow={copy.equipment.eyebrow} h2={copy.equipment.h2} />
        <div className="two-col">
          <Prose paragraphs={[page.equipmentIntro]}>
            <ChipRow items={[...page.equipment.types, ...moreEquipment]} style={{ marginTop: 24 }} />
            {chipBrands.length > 0 && <ChipRow items={chipBrands} style={{ marginTop: 12 }} />}
          </Prose>
          {page.photo && <LocalPhoto src={page.photo.src} alt={page.photo.alt} />}
        </div>
        {logoBrands.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <BrandGrid brands={logoBrands} />
          </div>
        )}
      </section>

      <section className="section section-light-2">
        <SectionHead
          tone="light"
          eyebrow={copy.failures.eyebrow}
          h2={copy.failures.h2}
          style={{ marginBottom: 30 }}
        />
        <FailureGrid items={page.failures} />
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow={copy.call.eyebrow}
          h2={copy.call.h2}
          lede={copy.call.body}
          style={{ marginBottom: 30 }}
          h2Style={H2_CLAMP}
        />
        {callProcess && (
          <p style={{ color: "var(--text-light-60)", maxWidth: 760, marginBottom: 24 }}>
            {callProcess.body}
          </p>
        )}
        <ChipRow
          tone="dark"
          items={[
            { label: copy.call.processLabel, href: `${commercialHubPath}#process` },
            { label: copy.call.formatsLabel, href: `${commercialHubPath}#formats` },
          ]}
        />
      </section>

      {faqs.length > 0 && (
        <section className="section section-light">
          <SectionHead tone="light" eyebrow={copy.faq.eyebrow} h2={copy.faq.h2} />
          <FaqAccordion items={faqs} style={{ maxWidth: 760 }} />
        </section>
      )}

      {reviews.length > 0 && (
        <section className="section section-light-2">
          <SectionHead tone="light" eyebrow={copy.reviews.eyebrow} h2={copy.reviews.h2} />
          <ReviewsGrid reviews={reviews} />
        </section>
      )}

      {links.length > 0 && (
        <section className="section section-dark-2">
          <SectionHead
            tone="dark"
            eyebrow={copy.links.eyebrow}
            h2={copy.links.h2}
            style={{ marginBottom: 24 }}
            h2Style={H2_CLAMP}
          />
          <ChipRow tone="dark" items={links} />
        </section>
      )}

      <CtaBand h2={copy.ctaBand.h2} body={copy.ctaBand.body} ctas={ctas} />
    </>
  );
}
