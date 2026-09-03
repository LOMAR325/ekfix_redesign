import { ChipRow } from "@/components/ui/chip-row";
import { SectionHead } from "@/components/ui/section-head";
import { trustHeading, trustChips } from "@/data/b2b-segments";

// NEW section `#trust-b2b` — vendor-onboarding trust band between `#reviews` and
// `#brands` (spec story 25). `.section-dark` (2026-09-03: was `.section-dark-2`;
// shades were re-alternated when the section hairlines were removed so no two
// adjacent sections share a tone). A `.section-head` with no eyebrow (the home
// eyebrow numbering 02…06 is left untouched — SectionHead omits the `.eyebrow` div
// entirely when none is given), and a `.chip-row` of the 5 trust chips.
export function TrustBand() {
  return (
    <section id="trust-b2b" className="section section-dark">
      <SectionHead tone="dark" h2={trustHeading} />
      <ChipRow tone="dark" items={trustChips} />
    </section>
  );
}
