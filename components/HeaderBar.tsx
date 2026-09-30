"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { NavEntry } from "@/lib/nav";

/** Header labels + phone, read from data/ by the server `Header` (no data/ import here). */
export type HeaderCopy = {
  brandBadge: string;
  brandName: string;
  brandSubtitle: string;
  brandHref: string;
  menuToggleLabel: string;
  /** The accent button ("Request Service" / "Book a Repair"); the shared header has none. */
  cta: { label: string; href: string } | null;
  /** The switch to the other branch ("For Homes" / "For Business"); none in the shared header. */
  switchTo: { label: string; href: string } | null;
  phone: string;
  phoneHref: string;
};

// Client half of the branch headers (components/Header computes the menu and the copy on the server
// and passes them in, so no data/ module ends up in the client bundle).
// Ported 1:1 from the static <header class="site-header"> + js/main.js:
// mobile toggle (body.nav-locked / header.nav-open / main-nav.open),
// click-to-toggle dropdowns (.nav-item.open), close on outside click,
// close menu when any nav link is clicked. Active item comes from usePathname().
export function HeaderBar({ nav, copy }: { nav: NavEntry[]; copy: HeaderCopy }) {
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

  const toggleGroup = useCallback(
    (label: string, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // Desktop (>=1025px, the menu breakpoint) opens dropdowns on hover / focus-within via CSS. A click
      // toggle there fights the hover (click closes, hover instantly reopens) and
      // leaves menus stuck open after a pointer click, so it is a no-op; a pointer
      // click still drops focus so the menu isn't pinned by :focus-within.
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 1025px)").matches;
      if (isDesktop) {
        if (e.detail > 0) e.currentTarget.blur();
        return;
      }
      setOpenGroup((current) => (current === label ? null : label));
    },
    [],
  );

  const isActive = (href: string) => pathname === href;
  // A group is active under its route prefix, or — without one — on one of its own pages.
  const groupActive = (group: { basePath?: string; children: { href: string }[] }) =>
    group.basePath
      ? pathname === group.basePath || pathname.startsWith(group.basePath + "/")
      : group.children.some((c) => c.href === pathname);

  return (
    <header
      className={[
        "site-header",
        copy.switchTo ? "branch-has-switch" : "",
        navOpen ? "nav-open" : "",
      ].filter(Boolean).join(" ")}
    >
      <Link href={copy.brandHref as Route} className="brand" onClick={closeMenu}>
        <span className="brand-badge">{copy.brandBadge}</span>
        <span className="brand-name">
          <strong>{copy.brandName}</strong>
          <span>{copy.brandSubtitle}</span>
        </span>
      </Link>
      <button
        className="nav-toggle"
        aria-label={copy.menuToggleLabel}
        aria-expanded={navOpen}
        onClick={toggleNav}
      >
        ☰
      </button>
      <nav className={navOpen ? "main-nav open" : "main-nav"}>
        {nav.map((entry) =>
          "children" in entry ? (
            <div
              key={entry.label}
              className={
                openGroup === entry.label ? "nav-item open" : "nav-item"
              }
            >
              <button
                className={
                  groupActive(entry)
                    ? "nav-trigger active"
                    : "nav-trigger"
                }
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
        {/* Shown only inside the open menu on ≤1024px (CSS `.nav-ctas`) — keeps
            the phone + Book reachable without a two-row top bar. */}
        <div className="nav-ctas">
          <a
            href={copy.phoneHref}
            className="call-pill"
            onClick={closeMenu}
          >
            <span className="call-text">{copy.phone}</span>
          </a>
          {copy.cta && (
            <Link
              href={copy.cta.href as Route}
              className="btn btn-accent btn-sm"
              onClick={closeMenu}
            >
              {copy.cta.label}
            </Link>
          )}
        </div>
      </nav>
      {/* The switch to the other branch: in the top bar at every width (ADR 0022). */}
      {copy.switchTo && (
        <Link
          href={copy.switchTo.href as Route}
          className="branch-switch"
          onClick={closeMenu}
        >
          {copy.switchTo.label} <span aria-hidden="true">→</span>
        </Link>
      )}
      <div className="header-actions">
        <a href={copy.phoneHref} className="call-pill">
          <span className="call-text">{copy.phone}</span>
        </a>
        {copy.cta && (
          <Link href={copy.cta.href as Route} className="btn btn-accent btn-sm">
            {copy.cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}
