import type { CSSProperties } from "react";
import { Anchor } from "./anchor";

export type ChipItem = string | { label: string; href?: string };

type ChipRowProps = {
  items: ChipItem[];
  /** `dark` for dark sections (light text, light hairlines). */
  tone?: "light" | "dark";
  /** Existing per-page inline override, e.g. `{ marginTop: 24 }`. */
  style?: CSSProperties;
};

const isLink = (item: ChipItem): item is { label: string; href: string } =>
  typeof item !== "string" && Boolean(item.href);
const labelOf = (item: ChipItem) => (typeof item === "string" ? item : item.label).replace(/\s*→\s*$/, "");

// Lists of facts and links (owner, 2026-10-03: the pill "chips" read as generated; the owner picked the
// checklist look out of three). One visual language, chosen by the content:
//  • 1–3 links only → a row of links, each led by a lime arrow circle (`.branch-links`);
//  • otherwise → a checklist grid (`.branch-list`): a fact gets a lime tick in a dark rounded square
//    (the `.fstat-ic` look), a link gets the lime arrow circle (the `.repair-card .arrow` look).
// Columns follow the list's own width (auto-fill), so the same list fits a narrow prose column, a
// full-width band and a phone. The trailing "→" of a label is drawn by CSS.
export function ChipRow({ items, tone = "light", style }: ChipRowProps) {
  const dark = tone === "dark" ? " on-dark" : "";
  if (items.length <= 3 && items.every(isLink)) {
    return (
      <div className={`branch-links${dark}`} style={style}>
        {items.map((item) => (
          <Anchor key={item.href} href={item.href}>
            {labelOf(item)}
          </Anchor>
        ))}
      </div>
    );
  }
  return (
    <ul className={`branch-list${dark}`} style={style}>
      {items.map((item) =>
        isLink(item) ? (
          <li key={labelOf(item)} className="is-link">
            <Anchor href={item.href}>{labelOf(item)}</Anchor>
          </li>
        ) : (
          <li key={labelOf(item)}>{labelOf(item)}</li>
        ),
      )}
    </ul>
  );
}
