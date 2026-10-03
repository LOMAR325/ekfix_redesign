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

// Lists of facts and links (owner, 2026-10-03: the pill "chips" read as generated — replaced site-wide).
// Three looks, chosen by the content, one visual language (hairlines, mono index, arrow):
//  • 1–3 links only → plain text links with an arrow (`.branch-links`);
//  • a list with links → an index of rows, each link ending in an arrow (`.branch-list`);
//  • a list of facts → spec-sheet rows with a mono index 01, 02… (`.branch-list.is-spec`).
// The trailing "→" of a label is drawn by CSS, so the data may keep or drop it.
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
  const spec = !items.some(isLink);
  return (
    // ≤5 items share one row on wide screens (`cols-N`); longer lists fill 230px columns.
    <ul
      className={`branch-list${spec ? " is-spec" : ""}${items.length <= 5 ? ` cols-${items.length}` : ""}${dark}`}
      style={style}
    >
      {items.map((item, i) => (
        <li key={labelOf(item)}>
          {spec && <span className="idx">{String(i + 1).padStart(2, "0")}</span>}
          {isLink(item) ? (
            <Anchor href={item.href}>{labelOf(item)}</Anchor>
          ) : (
            <span>{labelOf(item)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
