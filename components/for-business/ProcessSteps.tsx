import { ProblemCardGrid, type ProblemItem } from "@/components/ui/problem-card-grid";
import { SectionHead } from "@/components/ui/section-head";

// `#process` — "How we work", a light `.section` with a numbered `.problem-card`
// grid (b2b-priority-brief §8 block 4). Thin wrapper over the shared UI components;
// the four steps come from `data/b2b-segments.processSteps`.
export function ProcessSteps({ items }: { items: ProblemItem[] }) {
  return (
    <section className="section section-light" id="process">
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
