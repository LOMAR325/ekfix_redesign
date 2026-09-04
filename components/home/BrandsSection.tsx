import { BrandGrid } from "@/components/ui/brand-grid";
import { SectionHead } from "@/components/ui/section-head";
import { Anchor } from "@/components/ui/anchor";
import { homeBrands, brandNote, homeBrandsLede } from "@/data/brands";

// `#brands` — ported 1:1 from index.html, with the two B2B changes from spec story
// 24: the grid cells are reordered commercial → premium → mass (data/brands.homeBrands
// already carries that order) and the `.lede` becomes the commercial-first
// data/brands.homeBrandsLede. `SectionHead` carries the same inline overrides
// index.html sets (margin-bottom, h2 clamp, `.lede` max-width:300). The "See all
// brands" accent link lost its underline 2026-09-03 per owner feedback (docs/adr/0002).
export function BrandsSection() {
  return (
    <section id="brands" className="section section-dark-2">
      <SectionHead
        tone="dark"
        eyebrow="05 / Brands"
        h2="Certified across every major brand."
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
          See all brands we service →
        </Anchor>
      </p>
    </section>
  );
}
