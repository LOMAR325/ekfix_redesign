import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guideCopy, guideHubGroups, publishedArticles } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";
import { articlePath } from "@/lib/routes";
import { businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ChipRow } from "@/components/ui/chip-row";
import { CtaBand } from "@/components/ui/cta-band";

// Knowledge-centre hub (story 69): routable articles grouped by category, empty categories
// left out. With no published article the hub is a 404 in production (`routable` hides
// drafts at build time); in `next dev` it lists the drafts under the DRAFT banner.
const PATH = "/appliance-repair-guide";
const copy = guideCopy.hub;

export const metadata: Metadata = pageMetadata({
  title: copy.title,
  description: copy.metaDescription,
  path: PATH,
});

export default function GuideHubPage() {
  const groups = guideHubGroups();
  if (groups.length === 0) notFound();

  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: guideCopy.home, path: "/" },
    { name: copy.breadcrumb, path: PATH },
  ]);
  const hubStatus = publishedArticles().length > 0 ? "published" : "draft";

  return (
    <>
      <DraftBanner item={{ status: hubStatus }} />
      <JsonLd data={graph(businessNode(), jsonLd)} />
      <PageHero breadcrumb={crumbs} h1={copy.h1} lede={copy.lede} />
      {groups.map((group, i) => (
        <section
          key={group.slug}
          id={group.slug}
          className={`section ${i % 2 === 0 ? "section-light" : "section-light-2"}`}
        >
          <SectionHead tone="light" h2={group.label} style={{ marginBottom: 30 }} />
          <ChipRow
            items={group.articles.map((a) => ({ label: a.title, href: articlePath(a.slug) }))}
          />
        </section>
      ))}
      <CtaBand h2={guideCopy.cta.h2} body={guideCopy.cta.body} />
    </>
  );
}
