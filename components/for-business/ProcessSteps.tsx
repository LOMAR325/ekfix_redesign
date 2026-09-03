import { ProblemCardGrid, type ProblemItem } from "@/components/ui/problem-card-grid";
import { SectionHead } from "@/components/ui/section-head";

// `#process` — "How we work", a numbered `.problem-card` grid (b2b-priority-brief
// §8 block 4). `section-light-2` so it steps off the #f4f5f2 `#laundry` section
// above it (2026-09-03: section hairlines removed, adjacent sections must differ in
// tone); the white problem-cards read fine on the slightly darker ground.
export function ProcessSteps({ items }: { items: ProblemItem[] }) {
  return (
    <section className="section section-light-2" id="process">
      <SectionHead
        tone="light"
        eyebrow="How we work"
        h2="From the first call<br>to a photo report."
        style={{ marginBottom: 30 }}
      />
      <ProblemCardGrid items={items} variant="light" columns={4} />
    </section>
  );
}
