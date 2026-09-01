import type { CSSProperties } from "react";
import { Anchor } from "./anchor";

export type ChipItem = string | { label: string; href?: string };

type ChipRowProps = {
  items: ChipItem[];
  /** `dark` adds `.on-dark` to every chip (dark sections of the service/town pages). */
  tone?: "light" | "dark";
  /** Existing per-page inline override, e.g. `{ marginTop: 24 }`. */
  style?: CSSProperties;
};

// `.chip-row` + `.chip` / `.chip.on-dark`. A chip is a `<span>` unless it carries an
// `href`, in which case it is a link (see the "where we work" rows on the service pages).
export function ChipRow({ items, tone = "light", style }: ChipRowProps) {
  const cls = tone === "dark" ? "chip on-dark" : "chip";
  return (
    <div className="chip-row" style={style}>
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const href = typeof item === "string" ? undefined : item.href;
        return href ? (
          <Anchor key={label} href={href} className={cls}>
            {label}
          </Anchor>
        ) : (
          <span key={label} className={cls}>
            {label}
          </span>
        );
      })}
    </div>
  );
}
