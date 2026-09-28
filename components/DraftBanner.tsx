import type { Publishable } from "@/data/types";
import { site } from "@/data/site";
import { isDraftPreview } from "@/lib/publish";

// Owner preview marker (spec story 7): renders only while a draft is being viewed in
// `next dev`; in a production build drafts have no route, so this is always null there.
// Inline style on purpose — no new CSS class (globals.css is frozen for this run).
export function DraftBanner({ item }: { item: Publishable }) {
  if (!isDraftPreview(item)) return null;
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "6px 16px",
        background: "#ffb020",
        color: "#0b0c0b",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "1.4px",
        textAlign: "center",
        textTransform: "uppercase",
      }}
    >
      {site.draftBanner}
    </div>
  );
}
