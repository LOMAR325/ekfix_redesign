import { ChipRow } from "@/components/ui/chip-row";
import { trustHeading, trustChips } from "@/data/b2b-segments";

// NEW section `#trust-b2b` — vendor-onboarding trust band between `#reviews` and
// `#brands` (spec story 25). `.section .section-dark-2`, a plain `.section-head`
// heading (no eyebrow — the home eyebrow numbering 02…06 is left untouched), and a
// `.chip-row` of the 5 trust chips from data/b2b-segments.
export function TrustBand() {
  return (
    <section id="trust-b2b" className="section section-dark-2">
      <div className="section-head on-dark">
        <div>
          <h2>{trustHeading}</h2>
        </div>
      </div>
      <ChipRow tone="dark" items={trustChips} />
    </section>
  );
}
