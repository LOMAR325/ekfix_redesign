import type { CSSProperties, ReactNode } from "react";
import type {
  WhoWeServeCard,
  ForBusinessSegment,
} from "@/data/b2b-segments";
import { Anchor } from "./anchor";

export type AudienceItem = WhoWeServeCard | ForBusinessSegment;

const isSegment = (item: AudienceItem): item is ForBusinessSegment =>
  "bullets" in item;

// The "see more" link inside a card reuses the accent-underline inline style the
// current HTML already applies to "See all brands →" links (index.html #brands,
// the service pages) — no new class or style is introduced.
const CARD_LINK: CSSProperties = {
  color: "var(--accent)",
  fontSize: 14,
  fontWeight: 600,
  borderBottom: "1px solid rgba(198,242,78,0.5)",
};

// `.audience-card` — `.eyebrow`, h3, p, and (for `/for-business` segments) a `ul`
// whose `✓` bullets come from `.audience-card li::before` in globals.css. Accepts a
// home `WhoWeServeCard` or a `/for-business` `ForBusinessSegment`; a segment also
// carries its anchor `id` and a bullet list.
export function AudienceCard({
  item,
  children,
}: {
  item: AudienceItem;
  children?: ReactNode;
}) {
  const segment = isSegment(item);
  return (
    <div className="audience-card" id={segment ? item.id : undefined}>
      <div className="eyebrow">{item.eyebrow}</div>
      <h3>{segment ? item.heading : item.title}</h3>
      <p>{item.text}</p>
      {segment && (
        <ul>
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {item.linkLabel && (
        <p>
          <Anchor href={item.href} style={CARD_LINK}>
            {item.linkLabel}
          </Anchor>
        </p>
      )}
      {children}
    </div>
  );
}

type AudienceGridProps = {
  items: AudienceItem[];
  /** `.two-col` (default, current for-business.html) or `.card-grid-4` (home #who-we-serve). */
  layout?: "two-col" | "card-grid-4";
  children?: ReactNode;
};

// Wrapper for a row of `AudienceCard`s.
export function AudienceGrid({
  items,
  layout = "two-col",
  children,
}: AudienceGridProps) {
  return (
    <div className={layout === "card-grid-4" ? "card-grid-4" : "two-col"}>
      {items.map((item) => (
        <AudienceCard
          key={isSegment(item) ? item.id : item.title}
          item={item}
        />
      ))}
      {children}
    </div>
  );
}
