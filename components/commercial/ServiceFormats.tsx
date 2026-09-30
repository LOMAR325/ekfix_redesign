import type { ReactNode } from "react";
import { ChipRow } from "@/components/ui/chip-row";
import { SectionHead } from "@/components/ui/section-head";
import { commercialHub } from "@/data/commercial";

// `#formats` — "Service formats", a dark `.section` whose body is a single
// `.chip-row` (b2b-priority-brief §8 block 6). Thin wrapper over the shared UI
// components; the chips come from `data/b2b-segments.serviceFormats`.
export function ServiceFormats({ items, children }: { items: string[]; children?: ReactNode }) {
  return (
    <section className="section section-dark" id="formats">
      <SectionHead
        tone="dark"
        eyebrow={commercialHub.formats.eyebrow}
        h2={commercialHub.formats.h2}
        style={{ marginBottom: 30 }}
      />
      <ChipRow items={items} tone="dark" />
      {children}
    </section>
  );
}
