import { BrandGrid } from "@/components/ui/brand-grid";
import { SectionHead } from "@/components/ui/section-head";
import { Anchor } from "@/components/ui/anchor";
import { homeBrands, brandNote, homeBrandsLede } from "@/data/brands";
import { home } from "@/data/home";

// `#brands` — ported 1:1 from index.html: the grid cells are ordered commercial →
// premium → mass (data/brands.homeBrands already carries that order — story 44) and the
// `.lede` is the commercial-first data/brands.homeBrandsLede. The h2 is neutral copy
// from data/home (spec §13: no unsourced "every major brand" claim). `SectionHead` carries the same inline overrides
// index.html sets (margin-bottom, h2 clamp, `.lede` max-width:300). The "See all
// brands" accent link lost its underline 2026-09-03 per owner feedback (docs/adr/0002).
export function BrandsSection() {
  return (
    <section id="brands" className="section section-dark-2">
      <SectionHead
        tone="dark"
        eyebrow={home.brands.eyebrow}
        h2={home.brands.h2}
        h2Style={{
          fontSize: "clamp(30px, 3.2vw, 44px)",
          letterSpacing: "-1.8px",
        }}
        lede={homeBrandsLede}
        ledeStyle={{ maxWidth: 300 }}
        style={{ marginBottom: 50 }}
      />

      <BrandGrid brands={homeBrands} note={brandNote.home} />

      <p style={{ marginTop: 18 }}>
        <Anchor
          href="/brands"
          style={{
            color: "var(--accent)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {home.brands.seeAll}
        </Anchor>
      </p>
    </section>
  );
}
