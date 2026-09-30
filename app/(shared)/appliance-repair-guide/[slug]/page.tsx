import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleSlugs, categoryLabel, getArticle, guideCopy, repairStepItems } from "@/data/guides";
import { owner } from "@/data/people";
import { isPublished, routable } from "@/lib/publish";
import { articlePath } from "@/lib/routes";
import { serviceLinkForArticle } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { articleNode, businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ChipRow } from "@/components/ui/chip-row";
import { Prose } from "@/components/ui/prose";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { CtaBand } from "@/components/ui/cta-band";

// Article template (story 70b). Only routable articles get a route: in production that is
// published ones, in `next dev` drafts too (DRAFT banner, "Pending technical review").
// Author/technician/dates show only for a published, owner-reviewed article, and only
// such an article gets an Article node — a draft's graph has none. `sources` never renders.
const HUB = "/appliance-repair-guide";
const copy = guideCopy.article;

export const dynamicParams = false;

export function generateStaticParams() {
  return articleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return pageMetadata({
    title: `${article.title}${copy.titleSuffix}`,
    description: article.metaDescription,
    path: articlePath(article.slug),
  });
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  // Double guard: getArticle already returns only routable articles.
  if (!article || !routable(article)) notFound();

  const path = articlePath(article.slug);
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: guideCopy.home, path: "/" },
    { name: guideCopy.hub.breadcrumb, path: HUB },
    { name: categoryLabel(article.category), path: `${HUB}#${article.category}`, unlinked: true },
    { name: article.title, path },
  ]);

  const live = isPublished(article);
  const reviewed = live && article.reviewedByOwner;
  const m = copy.meta;
  const metaRow = [
    ...(article.model ? [`${m.model}: ${article.model}`] : []),
    ...(reviewed
      ? [
          ...(article.author === "owner" ? [`${m.author}: ${owner.name}, ${owner.role}`] : []),
          ...(article.technician === "owner" ? [`${m.technician}: ${owner.name}`] : []),
          ...(article.datePublished ? [`${m.published}: ${article.datePublished}`] : []),
          ...(article.dateModified ? [`${m.updated}: ${article.dateModified}`] : []),
        ]
      : [m.pending]),
  ];

  return (
    <>
      <DraftBanner item={article} />
      <JsonLd data={graph(businessNode(), live ? articleNode(article) : null, jsonLd)} />

      <PageHero breadcrumb={crumbs} h1={article.title} lede={article.metaDescription} />

      <section className="section section-light">
        <ChipRow items={metaRow} style={{ marginBottom: 40 }} />
        <SectionHead tone="light" h2={copy.symptoms} style={{ marginBottom: 30 }} />
        <ChipRow items={article.symptoms} />
      </section>

      <section className="section section-light-2">
        <SectionHead tone="light" h2={copy.diagnosis} style={{ marginBottom: 30 }} />
        <Prose paragraphs={article.diagnosis} />
      </section>

      <section className="section section-light">
        <SectionHead tone="light" h2={copy.causes} />
        <ProblemCardGrid
          variant="light"
          items={article.causes.map((c) => ({ title: c.cause, body: c.detail }))}
        />
      </section>

      <section className="section section-light-2">
        <SectionHead tone="light" h2={copy.repairSteps} />
        <ProblemCardGrid variant="light" items={repairStepItems(article)} />
      </section>

      <section className="section section-light">
        <SectionHead tone="light" h2={copy.whenToCallPro} style={{ marginBottom: 30 }} />
        <Prose paragraphs={[article.whenToCallPro, copy.serviceLinkLead]}>
          <ChipRow items={serviceLinkForArticle(article)} />
        </Prose>
      </section>

      <CtaBand h2={guideCopy.cta.h2} body={guideCopy.cta.body} />
    </>
  );
}
