import { BrandGrid } from "@/components/ui/brand-grid";
import { SectionHead } from "@/components/ui/section-head";
import { Anchor } from "@/components/ui/anchor";
import { residentialBrands } from "@/data/brands";
import { residentialHome } from "@/data/residential";

// `#brands` — the residential and premium brands (data/brands, every tier but commercial), the
// same inline overrides the former home #brands carried, and the link to /brands.
export function BrandsSection() {
  const copy = residentialHome.brands;
  return (
    <section id="brands" className="section section-dark-2">
      <SectionHead
        tone="dark"
        eyebrow={copy.eyebrow}
        h2={copy.h2}
        h2Style={{ fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-1.8px" }}
        lede={copy.lede}
        ledeStyle={{ maxWidth: 300 }}
        style={{ marginBottom: 50 }}
      />
      <BrandGrid brands={residentialBrands} />
      <p style={{ marginTop: 18 }}>
        <Anchor href="/brands" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>
          {copy.seeAll}
        </Anchor>
      </p>
    </section>
  );
}
