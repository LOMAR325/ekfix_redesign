import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import {
  townsIndex,
  fullPageTowns,
  alsoServedNC,
  alsoServedSC,
} from "@/data/towns";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";
import { CtaBand } from "@/components/ui/cta-band";

// /towns — ported 1:1 from towns/index.html. Hero + section copy comes from
// data/towns.townsIndex; the "Full local pages" grid is data/towns.fullPageTowns (5);
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
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Area", url: "/towns" },
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Service Area" }]}
        h1={townsIndex.heroH1}
        lede={townsIndex.heroLede}
      />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow="Full local pages"
          h2={townsIndex.activeHead.h2}
          lede={townsIndex.activeHead.lede}
        />
        <RepairGrid
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
          items={fullPageTowns.map((town) => ({
            label: `${town.name}, ${town.state}`,
            href: `/towns/${town.slug}`,
            tag: "Full local page",
            style: { minHeight: "auto" },
            bodyStyle: { padding: 22, marginTop: 0 },
          }))}
        />
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow="Also serving — North Carolina"
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
          {alsoServedNC.join(", ")}, and the towns between them.
        </p>
      </section>

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow="Also serving — South Carolina"
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
          {alsoServedSC.join(", ")}, and the towns between them.
        </p>
      </section>

      <CtaBand
        h2="Not sure if you're<br>in range?"
        body="Just call — we'll tell you straight away."
      />
    </>
  );
}
