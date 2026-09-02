import { SectionHead } from "@/components/ui/section-head";
import { AudienceGrid } from "@/components/ui/audience-card";
import { whoWeServe, whoWeServeHead } from "@/data/b2b-segments";

// NEW section `#who-we-serve` — sits right after the hero, before `#repair`
// (spec stories 23 / 30 / 31). 4 `.audience-card`s in a `.card-grid-4`, businesses
// first (Property Management, Restaurants, Hotels) and Homeowners last. Copy comes
// from data/b2b-segments (written fresh, not shared with /for-business).
export function WhoWeServeGrid() {
  return (
    <section id="who-we-serve" className="section section-light">
      <SectionHead
        tone="light"
        eyebrow={whoWeServeHead.eyebrow}
        h2={whoWeServeHead.h2}
      />
      <AudienceGrid layout="card-grid-4" items={whoWeServe} />
    </section>
  );
}
