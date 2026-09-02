import type { CSSProperties, ReactNode } from "react";
import { business } from "@/data/business";
import { richProps } from "./rich-text";

type SectionHeadProps = {
  /** `.on-light` for light sections, `.on-dark` for dark ones. */
  tone: "light" | "dark";
  /**
   * `.eyebrow` line. Optional: new sections that never carried one in the static
   * HTML (e.g. `#trust-b2b`) omit it, and the `.eyebrow` div is not rendered at all
   * — an empty one would add `margin-bottom: 20px` and shift the h2.
   */
  eyebrow?: ReactNode;
  /** JSX or a trusted HTML string (`"...<br>..."`). */
  h2: ReactNode;
  /** Right-hand `.lede` paragraph. Mutually exclusive with `ratingBadge` in practice. */
  lede?: ReactNode;
  /** Renders the standard right-hand `.rating-badge` (5.0 / ★★★★★ / Google reviews). */
  ratingBadge?: boolean;
  /** Existing per-page inline overrides, e.g. `{ marginBottom: 50 }`. */
  style?: CSSProperties;
  /** Existing per-page h2 inline overrides, e.g. `{ fontSize: "clamp(30px, 3.2vw, 44px)" }`. */
  h2Style?: CSSProperties;
  /** Existing per-page `.lede` inline overrides, e.g. `{ maxWidth: 320 }` (brands.html). */
  ledeStyle?: CSSProperties;
};

// `.section-head` — `.eyebrow` + `h2`, plus an optional right column that is either a
// `.lede` or a `.rating-badge`. Matches index.html, brands.html, the service pages
// and the town pages 1:1.
export function SectionHead({
  tone,
  eyebrow,
  h2,
  lede,
  ratingBadge,
  style,
  h2Style,
  ledeStyle,
}: SectionHeadProps) {
  return (
    <div className={`section-head on-${tone}`} style={style}>
      <div>
        {eyebrow != null && <div className="eyebrow" {...richProps(eyebrow)} />}
        <h2 style={h2Style} {...richProps(h2)} />
      </div>
      {lede != null && (
        <p className="lede" style={ledeStyle} {...richProps(lede)} />
      )}
      {ratingBadge && business.rating && (
        <RatingBadge value={business.rating.value} />
      )}
    </div>
  );
}

// Rendered only when data/business actually carries a rating — no invented number
// stands in for missing data.
function RatingBadge({ value }: { value: number }) {
  return (
    <div className="rating-badge">
      <div className="num">{value.toFixed(1)}</div>
      <div>
        <span className="stars">★★★★★</span>
        <small>Google reviews</small>
      </div>
    </div>
  );
}
