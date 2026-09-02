"use client";

import { useEffect, useState } from "react";

// Ports the js/main.js side-rail scroll-tracking: an IntersectionObserver marks the
// rail link for whichever section is centred in the viewport. Only the 6 original
// sections are tracked — the new #who-we-serve section is deliberately NOT in the
// rail (spec story 23), and deriving the tracked ids from RAIL keeps it that way.
const RAIL: { href: string; label: string }[] = [
  { href: "#home", label: "01 Home" },
  { href: "#repair", label: "02 We Repair" },
  { href: "#family", label: "03 About Us" },
  { href: "#reviews", label: "04 Reviews" },
  { href: "#brands", label: "05 Brands" },
  { href: "#book", label: "06 Book" },
];

export function SideRail() {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const els = RAIL.map((r) => document.getElementById(r.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="side-rail">
      {RAIL.map((r) => (
        <a
          key={r.href}
          href={r.href}
          className={activeId === r.href.slice(1) ? "active" : undefined}
        >
          <span className="dot" />
          <span className="label">{r.label}</span>
        </a>
      ))}
    </div>
  );
}
