import type { Metadata } from "next";
import { applianceRepairHub as hub, servicePage, services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";
import { CtaBand } from "@/components/ui/cta-band";
import { richProps } from "@/components/ui/rich-text";

// /appliance-repair — the residential hub (spec story 41): the 12 services from
// data/services as the same `.repair-card`s as the home #repair grid, each linking to its
// service page (no booking preset — that belongs to the home grid). All copy is in
// data/services.applianceRepairHub.
export const metadata: Metadata = pageMetadata({
  title: hub.title,
  description: hub.metaDescription,
  path: hub.path,
});

export default function ApplianceRepairHubPage() {
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: servicePage.homeCrumb, path: "/" },
    { name: hub.name, path: hub.path },
  ]);

  return (
    <>
      <JsonLd data={graph(businessNode(), jsonLd)} />

      <PageHero breadcrumb={crumbs} h1={hub.hero.h1} lede={hub.hero.lede} />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={hub.grid.eyebrow}
          h2={hub.grid.h2}
          lede={hub.grid.lede}
        />
        <RepairGrid
          items={services.map((service) => ({
            label: service.name,
            href: `${hub.path}/${service.slug}`,
            tag: hub.grid.cardTag,
            image: service.image, // alt defaults to "<label> repair", as on the home grid
          }))}
        />
        <div className="not-listed" {...richProps(hub.notListed)} />
      </section>

      <CtaBand h2={hub.cta.h2} body={hub.cta.body} />
    </>
  );
}
