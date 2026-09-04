import type { CSSProperties, ReactNode } from "react";
import { RepairCard, type RepairCardProps } from "./repair-card";

type RepairGridProps = {
  /** Plain (non-interactive) cards — the /towns list, service "also repair", etc. */
  items?: Omit<RepairCardProps, "onSelect">[];
  /** Or supply cards directly (the home page passes `RepairCard`s wired to `onSelect`). */
  children?: ReactNode;
  /** Existing per-page inline override (towns/index.html sets `grid-template-columns`). */
  style?: CSSProperties;
};

// `.repair-grid` wrapper. Thin by design: page tasks either hand it a list of link
// cards or their own interactive `RepairCard`s.
export function RepairGrid({ items, children, style }: RepairGridProps) {
  return (
    <div className="repair-grid" style={style}>
      {items?.map((item) => (
        <RepairCard key={item.label} {...item} />
      ))}
      {children}
    </div>
  );
}
