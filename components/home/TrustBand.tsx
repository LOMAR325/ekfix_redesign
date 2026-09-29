import { ChipRow } from "@/components/ui/chip-row";
import { SectionHead } from "@/components/ui/section-head";
import { trustHeading, trustChips } from "@/data/b2b-segments";

// `#trust-b2b` — vendor-onboarding trust band, right after #commercial-equipment and
// before the home grid (spec story 43). `.section-dark` between two light sections.
// A `.section-head` with no eyebrow (SectionHead omits the `.eyebrow` div when none is
// given) and a `.chip-row` of the 5 trust chips.
export function TrustBand() {
  return (
    <section id="trust-b2b" className="section section-dark">
      <SectionHead tone="dark" h2={trustHeading} />
      <ChipRow tone="dark" items={trustChips} />
    </section>
  );
}
