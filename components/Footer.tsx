import Link from "next/link";
import type { Route } from "next";
import { business } from "@/data/business";
import { site } from "@/data/site";

// Routes below are created by later migration tickets; cast until they exist.
const r = (href: string) => href as Route;

// Ported 1:1 from the static <footer class="site-footer">.
// NAP values (phone, hours, city, socials) come from data/business; copy and link labels
// from data/site.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-brand-badge">{site.brandBadge}</span>
            <strong>{business.name}</strong>
          </div>
          <p>{site.footer.description}</p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title" style={{ marginBottom: 12 }}>
            {site.footer.contactTitle}
          </div>
          <div className="footer-links">
            <a href={business.phoneHref} className="phone">
              {business.phone}
            </a>
            <span>
              {business.hours}, {business.hoursNote.toLowerCase()}
            </span>
            <span>
              {business.address.locality}, {business.address.region}
            </span>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title" style={{ marginBottom: 12 }}>
            {site.footer.followTitle}
          </div>
          <div className="footer-links">
            {site.footer.social.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title" style={{ marginBottom: 12 }}>
            {site.footer.siteTitle}
          </div>
          <div className="footer-links">
            {site.footer.siteLinks.map((link) => (
              <Link key={link.href} href={r(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          &copy; {site.footer.copyrightYear} {business.name}.{" "}
          {site.footer.rightsReserved}
        </span>
        <span>{site.footer.discounts}</span>
      </div>
    </footer>
  );
}
