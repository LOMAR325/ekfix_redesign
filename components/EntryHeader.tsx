import Link from "next/link";
import { business } from "@/data/business";
import { site } from "@/data/site";

// The entry page's header (ADR 0022): the logo and the phone, no menu — the page's one job is
// the choice between the two branches. Server-only markup, the same `.site-header` / `.brand` /
// `.call-pill` as the branch headers; `.branch-entry-header` keeps the pill visible ≤1024px.
export function EntryHeader() {
  return (
    <header className="site-header branch-entry-header">
      <Link href="/" className="brand">
        <span className="brand-badge">{site.brandBadge}</span>
        <span className="brand-name">
          <strong>{business.name}</strong>
          <span>{site.header.entry.brandSubtitle}</span>
        </span>
      </Link>
      <a href={business.phoneHref} className="call-pill">
        <span className="call-text">{business.phone}</span>
      </a>
    </header>
  );
}
