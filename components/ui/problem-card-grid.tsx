import type { CSSProperties } from "react";

export type ProblemItem = {
  /** Explicit badge ("01"). When absent the 1-based index is zero-padded. */
  num?: string;
  title: string;
  body: string;
};

type ProblemCardGridProps = {
  items: ProblemItem[];
  /**
   * `dark` reproduces the inline styles the current dark sections carry
   * (about.html "What that means", for-business.html "Why … call us"):
   * card `background: var(--bg-dark-3); border-color: rgba(255,255,255,0.09)`,
   * h3 `color: var(--text-light)`, p `color: var(--text-light-60)`.
   */
  variant: "light" | "dark";
  /** `3` -> `.card-grid-3` (default), `4` -> `.card-grid-4`. */
  columns?: 3 | 4;
  style?: CSSProperties;
};

const DARK_CARD: CSSProperties = {
  background: "var(--bg-dark-3)",
  borderColor: "rgba(255,255,255,0.09)",
};
const DARK_H3: CSSProperties = { color: "var(--text-light)" };
const DARK_P: CSSProperties = { color: "var(--text-light-60)" };

// `.card-grid-3` / `.card-grid-4` of `.problem-card`s (`.num`, h3, p). Used for the
// service "common problems" grids (light) and the About / For Business explainer
// grids (dark).
export function ProblemCardGrid({
  items,
  variant,
  columns = 3,
  style,
}: ProblemCardGridProps) {
  const dark = variant === "dark";
  return (
    <div className={columns === 4 ? "card-grid-4" : "card-grid-3"} style={style}>
      {items.map((item, i) => (
        <div
          key={item.title}
          className="problem-card"
          style={dark ? DARK_CARD : undefined}
        >
          <div className="num">
            {item.num ?? String(i + 1).padStart(2, "0")}
          </div>
          <h3 style={dark ? DARK_H3 : undefined}>{item.title}</h3>
          <p style={dark ? DARK_P : undefined}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
