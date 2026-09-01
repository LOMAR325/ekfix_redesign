import Link from "next/link";
import type { Route } from "next";
import { business } from "@/data/business";

// Routes below are created by later migration tickets; cast until they exist.
const r = (href: string) => href as Route;

// Ported 1:1 from the static <footer class="site-footer">.
// NAP values (phone, hours, city, socials) come from data/business.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-brand-badge">EK</span>
            <strong>{business.name}</strong>
          </div>
          <p>
            Family-owned appliance repair serving Charlotte NC, the surrounding
            towns, and northern SC. EPA 608 &amp; OSHA certified. Fully insured.
          </p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title" style={{ marginBottom: 12 }}>
            Contact
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
            Follow
          </div>
          <div className="footer-links">
            <a href={business.social.instagram}>Instagram</a>
            <a href={business.social.facebook}>Facebook</a>
            <a href={business.social.tiktok}>TikTok</a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title" style={{ marginBottom: 12 }}>
            Site
          </div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href={r("/about")}>Our Story</Link>
            <Link href={r("/brands")}>Brands We Service</Link>
            <Link href={r("/for-business")}>For Business</Link>
            <Link href={r("/towns")}>Service Area</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 {business.name}. All rights reserved.</span>
        <span>Discounts for veterans, seniors &amp; families with kids</span>
      </div>
    </footer>
  );
}
