import type { CSSProperties } from "react";

type FaqItem = { q: string; a: string };

type FaqAccordionProps = {
  items: FaqItem[];
  /**
   * When set, wraps the list in a `<div style={...}>` — the service pages use
   * `{ maxWidth: 760 }`, matching the current markup. Omit for a bare list.
   */
  style?: CSSProperties;
};

// Native `<details class="faq-item">` (`summary` + `p`), first one `open`, exactly
// like the static service pages. No JS — the `+`/`×` marker is pure CSS.
export function FaqAccordion({ items, style }: FaqAccordionProps) {
  const list = items.map((item, i) => (
    <details key={item.q} className="faq-item" open={i === 0}>
      <summary>{item.q}</summary>
      <p>{item.a}</p>
    </details>
  ));
  return style ? <div style={style}>{list}</div> : <>{list}</>;
}
