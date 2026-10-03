import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { aboutPage, aboutPendingBlocks, owner } from "@/data/people";
import { commercialCategories, services } from "@/data/services";
import { businessNode, graph, ownerNode } from "@/lib/jsonld";
import { commercialCardHref } from "@/lib/links";
import { routable } from "@/lib/publish";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { BranchCtas } from "@/components/ui/ctas";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { StatRow } from "@/components/ui/stat-row";
import { LocalPhoto } from "@/components/ui/local-photo";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { PhotoPair } from "@/components/ui/photo-pair";
import { ChipRow, type ChipItem } from "@/components/ui/chip-row";
import { CtaBand } from "@/components/ui/cta-band";

// /about — the owner-technician page (stories 66–68). All copy is data/people.aboutPage;
// every block is guarded by lib/publish.routable, so the draft blocks (brands, training,
// company history) render only in `next dev`, under the DRAFT banner. The Person node is
// ownerNode() — its jobTitle, credentials and knowsAbout are printed below verbatim
// (data/people.test.ts). Sections alternate shades: hero D · meet L · approach D ·
// appliances L · on the job L2 · [pending L, dev only] · cta-band D.

export const metadata: Metadata = pageMetadata({ ...aboutPage.meta, path: "/about" });

/** Residential chip → its service page; commercial chip → lib/links' target for that category. */
const residentialChip = (name: string): ChipItem => {
  const service = services.find((s) => s.name === name);
  return service ? { label: name, href: `/appliance-repair/${service.slug}` } : name;
};
const commercialChip = (label: string): ChipItem => {
  const category = commercialCategories.find((c) => c.label === label);
  return category ? { label, href: commercialCardHref(category) } : label;
};

export default function AboutPage() {
  const { breadcrumb, hero, meet, appliances, approach, onTheJob, pending, cta } = aboutPage;
  const pendingBlocks = aboutPendingBlocks();
  const previewedDraft = pendingBlocks.find((block) => block.status === "draft");
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: breadcrumb.home, path: "/" },
    { name: breadcrumb.self, path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={graph(businessNode(), ownerNode(), jsonLd)} />

      <PageHero
        breadcrumb={crumbs}
        h1={hero.h1}
        lede={hero.lede}
        ctas={<BranchCtas />}
      />

      {routable(meet) && (
        <section className="section section-light">
          <div className="two-col">
            <Prose heading={meet.heading} paragraphs={meet.paragraphs}>
              <StatRow stats={meet.stats} />
            </Prose>
            <LocalPhoto
              src={owner.photos.washerExtractor.src}
              alt={owner.photos.washerExtractor.alt}
              imgStyle={{ background: "var(--bg-light-2)" }}
            />
          </div>
        </section>
      )}

      {routable(approach) && (
        <section className="section section-dark">
          <SectionHead tone="dark" eyebrow={approach.eyebrow} h2={approach.h2} />
          <ProblemCardGrid variant="dark" items={approach.items} />
        </section>
      )}

      {routable(appliances) && (
        <section className="section section-light">
          <SectionHead
            tone="light"
            eyebrow={appliances.eyebrow}
            h2={appliances.h2}
            lede={appliances.lede}
          />
          <div className="two-col">
            <Prose heading={appliances.residential.heading}>
              <ChipRow items={appliances.residential.items.map(residentialChip)} />
            </Prose>
            <Prose heading={appliances.commercial.heading}>
              <ChipRow items={appliances.commercial.items.map(commercialChip)} />
            </Prose>
          </div>
        </section>
      )}

      {routable(onTheJob) && (
        <section className="section section-light-2">
          <SectionHead
            tone="light"
            eyebrow={onTheJob.eyebrow}
            h2={onTheJob.h2}
            style={{ marginBottom: 30 }}
          />
          <PhotoPair
            style={{ marginTop: 0, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            photos={onTheJob.photos.map((photo) => ({ ...photo, figureStyle: { height: 280 } }))}
          />
        </section>
      )}

      {pendingBlocks.length > 0 && (
        <section className="section section-light">
          {previewedDraft && <DraftBanner item={previewedDraft} />}
          <SectionHead tone="light" eyebrow={pending.eyebrow} h2={pending.h2} />
          <div className="two-col">
            {pendingBlocks.map((block) => (
              <Prose key={block.id} heading={block.heading} paragraphs={block.paragraphs} />
            ))}
          </div>
        </section>
      )}

      <CtaBand h2={cta.h2} body={cta.body} ctas={<BranchCtas />} />
    </>
  );
}
