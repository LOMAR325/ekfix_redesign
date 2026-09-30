import Link from "next/link";
import type { Route } from "next";
import { business } from "@/data/business";
import { site, type SiteVariant } from "@/data/site";
import { services } from "@/data/services";
import { commercialHubPath, publishedCommercialPages } from "@/data/commercial";

type FooterLink = { label: string; href: string };
const r = (href: string) => href as Route;

// The three branch footers (ADR 0022): one `.site-footer` markup, a different set of link
// columns per variant. NAP (phone, hours, city, socials) is the same everywhere and comes from
// data/business; copy and link labels from data/site. The household discounts line is a
// residential offer — only the residential footer shows it. The entry page has EntryFooter.
export function Footer({ variant }: { variant: SiteVariant }) {
  const columns = footerColumns(variant);
  const discounts = variant === "residential" ? site.footer.residential.discounts : null;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-brand-badge">{site.brandBadge}</span>
            <strong>{business.name}</strong>
          </div>
          <p>{site.footer[variant].description}</p>
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
          <div className="footer-col-title" style={{ margin: "28px 0 12px" }}>
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
        {columns.map((col) => (
          <div key={col.title} className="footer-col">
            <div className="footer-col-title" style={{ marginBottom: 12 }}>
              {col.title}
            </div>
            <div className="footer-links">
              {col.links.map((link) => (
                <Link key={link.href} href={r(link.href)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>
          &copy; {site.footer.copyrightYear} {business.name}.{" "}
          {site.footer.rightsReserved}
        </span>
        {discounts && <span>{discounts}</span>}
      </div>
    </footer>
  );
}

function footerColumns(variant: SiteVariant): { title: string; links: FooterLink[] }[] {
  if (variant === "commercial") {
    const f = site.footer.commercial;
    const pages = publishedCommercialPages().map((p) => ({
      label: p.name,
      href: `${commercialHubPath}/${p.slug}`,
    }));
    return [
      { title: f.servicesTitle, links: [...pages, f.request] },
      { title: f.companyTitle, links: [...f.company] },
    ];
  }
  if (variant === "residential") {
    const f = site.footer.residential;
    return [
      {
        title: f.servicesTitle,
        links: [
          ...services.slice(0, 6).map((s) => ({
            label: `${s.name} Repair`,
            href: `${f.allAppliances.href}/${s.slug}`,
          })),
          f.allAppliances,
        ],
      },
      { title: f.companyTitle, links: [...f.company] },
    ];
  }
  return [{ title: site.footer.shared.siteTitle, links: [...site.footer.shared.siteLinks] }];
}
