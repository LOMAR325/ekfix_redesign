import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseCopy, caseSlugs, getCase } from "@/data/cases";
import { hasPublishedPage, towns } from "@/data/towns";
import { owner } from "@/data/people";
import { routable } from "@/lib/publish";
import { serviceLinkForCase } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import type { ChipItem } from "@/components/ui/chip-row";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ChipRow } from "@/components/ui/chip-row";
import { Prose } from "@/components/ui/prose";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { CtaBand } from "@/components/ui/cta-band";

// Repair-case template (story 75). data/cases is empty until the owner confirms real
// cases, so generateStaticParams returns nothing and no /repair-cases/* route exists.
// RepairCase has no customer fields; `area` is a data/towns slug, linked only when that
// town/area has a published page.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseSlugs().map((slug) => ({ slug }));
}

const casePath = (slug: string) => `/repair-cases/${slug}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const repairCase = getCase(slug);
  if (!repairCase) notFound();
  return pageMetadata({
    title: `${repairCase.title}${caseCopy.titleSuffix}`,
    description: repairCase.symptom,
    path: casePath(slug),
  });
}

export default async function RepairCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const repairCase = getCase(slug);
  if (!repairCase || !routable(repairCase)) notFound();

  const path = casePath(repairCase.slug);
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: caseCopy.home, path: "/" },
    { name: repairCase.title, path },
  ]);

  const l = caseCopy.labels;
  const facts = [
    { title: l.appliance, body: repairCase.appliance },
    ...(repairCase.model ? [{ title: l.model, body: repairCase.model }] : []),
    { title: l.symptom, body: repairCase.symptom },
    { title: l.diagnosis, body: repairCase.diagnosis },
    { title: l.failedComponent, body: repairCase.failedComponent },
    { title: l.repair, body: repairCase.repair },
    { title: l.result, body: repairCase.result },
  ];

  const town = towns.find((t) => t.slug === repairCase.area);
  const details: ChipItem[] = [
    ...repairCase.parts.map((part) => `${l.parts}: ${part}`),
    ...(town
      ? [
          hasPublishedPage(town)
            ? { label: `${l.area}: ${town.name}`, href: `/towns/${town.slug}` }
            : `${l.area}: ${town.name}`,
        ]
      : []),
    ...(repairCase.technician === "owner" ? [`${l.technician}: ${owner.name}`] : []),
  ];

  return (
    <>
      <DraftBanner item={repairCase} />
      <JsonLd data={graph(businessNode(), jsonLd)} />

      <PageHero breadcrumb={crumbs} h1={repairCase.title} lede={repairCase.symptom} />

      <section className="section section-light">
        <SectionHead tone="light" h2={caseCopy.repairHeading} />
        <ProblemCardGrid variant="light" items={facts} />
      </section>

      <section className="section section-light-2">
        <SectionHead tone="light" h2={caseCopy.detailsHeading} style={{ marginBottom: 30 }} />
        <Prose>
          <ChipRow items={details} />
          <ChipRow items={serviceLinkForCase(repairCase)} style={{ marginTop: 16 }} />
        </Prose>
      </section>

      <CtaBand h2={caseCopy.cta.h2} body={caseCopy.cta.body} />
    </>
  );
}
