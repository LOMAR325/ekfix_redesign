import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import {
  brandsPage,
  brandNote,
  residentialBrands,
  commercialBrands,
} from "@/data/brands";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { BrandGrid } from "@/components/ui/brand-grid";
import { Prose } from "@/components/ui/prose";
import { CtaBand } from "@/components/ui/cta-band";

// /brands — ported 1:1 from brands.html. All copy comes from data/brands.brandsPage;
// the two grids are data/brands.residentialBrands / commercialBrands, which keep the
// exact on-page order of brands.html (NOT the commercial-first home ordering).
export const metadata: Metadata = pageMetadata({
  title: brandsPage.title,
  description: brandsPage.metaDescription,
  path: "/brands",
});

export default function BrandsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Brands", url: "/brands" },
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Brands" }]}
        h1={brandsPage.hero.h1}
        lede={brandsPage.hero.lede}
      />

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={brandsPage.residentialSection.eyebrow}
          h2={brandsPage.residentialSection.h2}
        />
        <BrandGrid brands={residentialBrands} />
      </section>

      <section className="section section-dark-2">
        <SectionHead
          tone="dark"
          eyebrow={brandsPage.commercialSection.eyebrow}
          h2={brandsPage.commercialSection.h2}
          lede={brandsPage.commercialSection.lede}
          h2Style={{
            fontSize: "clamp(30px, 3.2vw, 44px)",
            letterSpacing: "-1.8px",
          }}
        />
        <BrandGrid brands={commercialBrands} note={brandNote.brandsPage} />
      </section>

      <section className="section section-light">
        <Prose
          heading={brandsPage.dontSeeYourBrand.h2}
          paragraphs={[brandsPage.dontSeeYourBrand.body]}
        />
      </section>

      <CtaBand h2={brandsPage.ctaBand.h2} body={brandsPage.ctaBand.body} />
    </>
  );
}
