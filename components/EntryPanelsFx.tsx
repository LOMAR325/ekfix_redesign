"use client";

import type { ReactNode } from "react";

// The panels' wrapper on the entry page: passes the pointer position to the panel under it as
// `--mx` / `--my` (the hover spotlight in globals.css, `.branch-panel::after`). Pure decoration —
// without JS the panels, links and the CSS hover effects work the same.
export function EntryPanelsFx({ children }: { children: ReactNode }) {
  return (
    <div
      className="branch-entry-panels"
      onPointerMove={(e) => {
        const panel = (e.target as HTMLElement).closest<HTMLElement>(".branch-panel");
        if (!panel) return;
        const r = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", `${e.clientX - r.left}px`);
        panel.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
