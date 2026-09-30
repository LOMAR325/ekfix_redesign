import Link from "next/link";
import type { Route } from "next";
import { business } from "@/data/business";
import { site } from "@/data/site";

// The entry page's thin footer (ADR 0022): name, phone, hours, city, the socials (the business
// node's sameAs), /about and /reviews —
// one row on desktop, wrapping on mobile. NAP from data/business.
export function EntryFooter() {
  return (
    <footer className="site-footer branch-entry-footer">
      <div className="footer-bottom">
        <span>
          &copy; {site.footer.copyrightYear} {business.name}
        </span>
        <a href={business.phoneHref} className="phone">
          {business.phone}
        </a>
        <span>
          {business.hours}, {business.hoursNote.toLowerCase()}
        </span>
        <span>
          {business.address.locality}, {business.address.region}
        </span>
        {site.footer.social.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
        {site.footer.entry.map((link) => (
          <Link key={link.href} href={link.href as Route}>
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
