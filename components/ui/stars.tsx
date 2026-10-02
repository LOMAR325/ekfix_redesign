import { site } from "@/data/site";

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

// `.stars` — decorative ★ (brief 7.1: 1.3:1 on the light cards, so they carry no information):
// aria-hidden, the look unchanged. The rating is always text next to them — the hero's
// "5.0 · 6 reviews", the badge's "5.0" — or, on a review card, `srLabel`. `count` — a Google
// review's own stars (1–5); the site's reviews are all 5.
export function Stars({
  as: Tag = "div",
  srLabel,
  count = 5,
}: {
  as?: "div" | "span";
  srLabel?: boolean;
  count?: number;
}) {
  const n = Math.max(1, Math.min(5, Math.round(count)));
  return (
    <>
      <Tag className="stars" aria-hidden="true">
        {"★".repeat(n)}
      </Tag>
      {srLabel && <span style={SR_ONLY}>{site.reviewStarsLabel(n)}</span>}
    </>
  );
}
