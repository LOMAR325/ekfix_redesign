import { SectionHead } from "@/components/ui/section-head";
import { AudienceGrid } from "@/components/ui/audience-card";
import { whoWeServeHead } from "@/data/b2b-segments";
import { whoWeServeCards } from "@/data/home";

// `#who-we-serve` — right after the hero (spec story 43). 4 `.audience-card`s in a
// `.card-grid-4`, businesses first (Property Management, Restaurants, Hotels) and
// Homeowners last. Business cards link to their published industry page, otherwise to
// their commercial-hub anchor; Homeowners → /appliance-repair (data/home.whoWeServeCards).
export function WhoWeServeGrid() {
  return (
    <section id="who-we-serve" className="section section-light-2">
      <SectionHead
        tone="light"
        eyebrow={whoWeServeHead.eyebrow}
        h2={whoWeServeHead.h2}
      />
      <AudienceGrid layout="card-grid-4" items={whoWeServeCards()} />
    </section>
  );
}
