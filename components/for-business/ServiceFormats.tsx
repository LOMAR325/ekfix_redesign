import { ChipRow } from "@/components/ui/chip-row";
import { SectionHead } from "@/components/ui/section-head";

// `#formats` — "Service formats", a dark `.section` whose body is a single
// `.chip-row` (b2b-priority-brief §8 block 6). Thin wrapper over the shared UI
// components; the chips come from `data/b2b-segments.serviceFormats`.
export function ServiceFormats({ items }: { items: string[] }) {
  return (
    <section className="section section-dark" id="formats">
      <SectionHead
        tone="dark"
        eyebrow="Service formats"
        h2="Ways to work<br>with us."
        style={{ marginBottom: 30 }}
      />
      <ChipRow items={items} tone="dark" />
    </section>
  );
}
