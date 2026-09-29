import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import {
  townsIndex,
  townsWithPublishedPage,
  publishedAncestors,
  alsoServedNC,
  alsoServedSC,
  townsIndexAreaServed,
} from "@/data/towns";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";
import { CtaBand } from "@/components/ui/cta-band";

// /towns — ported 1:1 from towns/index.html. Hero + section copy comes from
// data/towns.townsIndex; the "Full local pages" grid is data/towns.townsWithPublishedPage() (published pages only);
// the NC / SC text lists are data/towns.alsoServedNC / alsoServedSC (full lists, incl.
// towns beyond the 20 in business.areaServed — see spec story 8 / R11i).
export const metadata: Metadata = pageMetadata({
  title: townsIndex.title,
  description: townsIndex.metaDescription,
  path: "/towns",
});

// towns/index.html: h2 clamp on the two "Also serving" sections.
const LIST_H2_STYLE = {
  fontSize: "clamp(28px, 3vw, 40px)",
  letterSpacing: "-1.6px",
} as const;

export default function TownsPage() {
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: "Service Area", path: "/towns" },
  ]);

  return (
    <>
      {/* areaServed: the places of business.areaServed, named as this page lists them. */}
      <JsonLd data={graph(businessNode({ areaServed: townsIndexAreaServed() }), jsonLd)} />

      <PageHero
        breadcrumb={crumbs}
        h1={townsIndex.heroH1}
        lede={townsIndex.heroLede}
      />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={townsIndex.activeHead.eyebrow}
          h2={townsIndex.activeHead.h2}
          lede={townsIndex.activeHead.lede}
        />
        <RepairGrid
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
          items={townsWithPublishedPage().map((town) => ({
            label: `${town.name}, ${town.state}`,
            href: `/towns/${town.slug}`,
            // A published area sits right under its city in data/towns, so it follows it here.
            tag:
              town.kind === "area"
                ? townsIndex.areaCardTag(publishedAncestors(town)[0]?.name ?? town.name)
                : townsIndex.cardTag,
            style: { minHeight: "auto" },
            bodyStyle: { padding: 22, marginTop: 0 },
          }))}
        />
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow={townsIndex.alsoServingNCEyebrow}
          h2={townsIndex.alsoServingNCLabel}
          h2Style={LIST_H2_STYLE}
        />
        <p
          style={{
            maxWidth: 820,
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-light-60)",
          }}
        >
          {alsoServedNC.join(", ")}
          {townsIndex.alsoServingTail}
        </p>
      </section>

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={townsIndex.alsoServingSCEyebrow}
          h2={townsIndex.alsoServingSCLabel}
          h2Style={LIST_H2_STYLE}
        />
        <p
          style={{
            maxWidth: 820,
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-dark-60)",
          }}
        >
          {alsoServedSC.join(", ")}
          {townsIndex.alsoServingTail}
        </p>
      </section>

      <CtaBand h2={townsIndex.cta.h2} body={townsIndex.cta.body} />
    </>
  );
}
