import { ChipRow } from "@/components/ui/chip-row";
import { SectionHead } from "@/components/ui/section-head";
import { trustHeading, trustChips } from "@/data/b2b-segments";

// `#trust-b2b` — the vendor-onboarding trust band of the commercial home, right after the hero:
// a `.section-head` with no eyebrow and a `.chip-row` of the 5 trust chips (data/b2b-segments).
export function TrustBand() {
  return (
    <section id="trust-b2b" className="section section-light-2">
      <SectionHead tone="light" h2={trustHeading} />
      <ChipRow tone="light" items={trustChips} />
    </section>
  );
}
