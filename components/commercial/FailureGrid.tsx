import type { CommercialPage } from "@/data/types";
import { commercialPageCopy } from "@/data/commercial";

// Commercial child page failures (story 34): the `.problem-card` markup of ui/ProblemCardGrid
// (`.num`, h3, p) plus a second paragraph for what the failure costs the business. Existing
// classes only; the 4-card rows use `.card-grid-4`, anything else `.card-grid-3`.
export function FailureGrid({ items }: { items: CommercialPage["failures"] }) {
  return (
    <div className={items.length === 4 ? "card-grid-4" : "card-grid-3"}>
      {items.map((item, i) => (
        <div key={item.title} className="problem-card">
          <div className="num">{String(i + 1).padStart(2, "0")}</div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <p style={{ marginTop: 12 }}>
            <strong>{commercialPageCopy.failures.impactLabel}</strong> {item.businessImpact}
          </p>
        </div>
      ))}
    </div>
  );
}
