"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { business } from "@/data/business";
import { mainNav } from "@/lib/nav";

// Ported 1:1 from the static <header class="site-header"> + js/main.js:
// mobile toggle (body.nav-locked / header.nav-open / main-nav.open),
// click-to-toggle dropdowns (.nav-item.open), close on outside click,
// close menu when any nav link is clicked. Active item comes from usePathname().
export function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", navOpen);
    return () => document.body.classList.remove("nav-locked");
  }, [navOpen]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest(".nav-item")) setOpenGroup(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const closeMenu = useCallback(() => {
    setNavOpen(false);
    setOpenGroup(null);
  }, []);

  const toggleNav = useCallback(() => {
    setNavOpen((open) => {
      if (open) setOpenGroup(null);
      return !open;
    });
  }, []);

  const toggleGroup = useCallback((label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenGroup((current) => (current === label ? null : label));
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <header className={navOpen ? "site-header nav-open" : "site-header"}>
      <Link href="/" className="brand" onClick={closeMenu}>
        <span className="brand-badge">EK</span>
        <span className="brand-name">
          <strong>{business.name}</strong>
          <span>Appliance Repair</span>
        </span>
      </Link>
      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={navOpen}
        onClick={toggleNav}
      >
        ☰
      </button>
      <nav className={navOpen ? "main-nav open" : "main-nav"}>
        {mainNav.map((entry) =>
          "children" in entry ? (
            <div
              key={entry.label}
              className={
                openGroup === entry.label ? "nav-item open" : "nav-item"
              }
            >
              <button
                className="nav-trigger"
                aria-expanded={openGroup === entry.label}
                onClick={(e) => toggleGroup(entry.label, e)}
              >
                {entry.label} <span className="chev">⌄</span>
              </button>
              <div className={entry.wide ? "nav-dropdown wide" : "nav-dropdown"}>
                {entry.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href as Route}
                    className={isActive(child.href) ? "active" : undefined}
                    onClick={closeMenu}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={entry.href}
              href={entry.href as Route}
              className={isActive(entry.href) ? "active" : undefined}
              onClick={closeMenu}
            >
              {entry.label}
            </Link>
          ),
        )}
      </nav>
      <div className="header-actions">
        <a href={business.phoneHref} className="call-pill">
          <span className="call-dot" />
          <span className="call-text">{business.phone}</span>
        </a>
        <Link href={"/#book" as Route} className="btn btn-accent btn-sm">
          Book a Repair
        </Link>
      </div>
    </header>
  );
}
