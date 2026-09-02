import { BrandGrid } from "@/components/ui/brand-grid";
import { Anchor } from "@/components/ui/anchor";
import { homeBrands, brandNote, homeBrandsLede } from "@/data/brands";

// `#brands` — ported 1:1 from index.html, with the two B2B changes from spec story
// 24: the grid cells are reordered commercial → premium → mass (data/brands.homeBrands
// already carries that order) and the `.lede` becomes the commercial-first
// data/brands.homeBrandsLede. The `.section-head` inline overrides, `.brand-note`
// and the "See all brands" link match index.html exactly.
export function BrandsSection() {
  return (
    <section id="brands" className="section section-dark-2">
      <div className="section-head on-dark" style={{ marginBottom: 50 }}>
        <div>
          <div className="eyebrow">05 / Brands</div>
          <h2
            style={{
              fontSize: "clamp(30px, 3.2vw, 44px)",
              letterSpacing: "-1.8px",
            }}
          >
            Certified across every major brand.
          </h2>
        </div>
        <p className="lede" style={{ maxWidth: 300 }}>
          {homeBrandsLede}
        </p>
      </div>

      <BrandGrid brands={homeBrands} note={brandNote.home} />

      <p style={{ marginTop: 18 }}>
        <Anchor
          href="/brands"
          style={{
            color: "var(--accent)",
            fontSize: 14,
            fontWeight: 600,
            borderBottom: "1px solid rgba(198,242,78,0.5)",
          }}
        >
          See all brands we service →
        </Anchor>
      </p>
    </section>
  );
}
