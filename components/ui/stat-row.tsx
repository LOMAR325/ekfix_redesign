import type { CSSProperties } from "react";

export type Stat = { k: string; v: string };

type StatRowProps = { stats: Stat[]; style?: CSSProperties };

// `.stat-row` — the bordered `.k` / `.v` grid under the About prose block.
export function StatRow({ stats, style }: StatRowProps) {
  return (
    <div className="stat-row" style={style}>
      {stats.map((stat) => (
        <div key={stat.k}>
          <div className="k">{stat.k}</div>
          <div className="v">{stat.v}</div>
        </div>
      ))}
    </div>
  );
}
