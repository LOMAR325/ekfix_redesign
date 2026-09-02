import Image from "next/image";
import { business } from "@/data/business";
import { homeHero } from "@/data/b2b-segments";
import { Anchor } from "@/components/ui/anchor";

// `#home` hero — ported 1:1 from index.html, with the B2B copy changes from spec
// stories 26 / 31: the `.lede` names the business audience first, a text link to
// `/for-business` sits beside `.hero-ctas`, and `.hero-meta` small names businesses
// first. The `<h1>` ("We fix it. / You enjoy it.") is untouched. The background
// photo is the LCP image, so it goes through next/image with `priority`.
const HERO_PHOTO = "/images/hero-technician.webp";

// The accent-underline text-link treatment the current HTML already uses for
// "See all brands we service →" (index.html #brands) — reused, no new class.
const TEXT_LINK = {
  color: "var(--accent)",
  fontSize: 14,
  fontWeight: 600,
  borderBottom: "1px solid rgba(198,242,78,0.5)",
} as const;

export function Hero() {
  return (
    <section id="home" className="hero">
      <Image
        className="hero-photo"
        src={HERO_PHOTO}
        alt="Konstantin, EK Global owner and lead technician, next to a washer he's repairing"
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-scrim" />
      <div className="hero-fade-top" />
      <div className="hero-fade-bottom" />

      <div className="hero-content">
        <h1>
          We fix it.
          <br />
          <span>You enjoy it.</span>
        </h1>
        <p className="lede">{homeHero.lede}</p>
        <div className="hero-ctas">
          <a href="#book" className="btn btn-accent">
            Book Online — Save 10% <span>→</span>
          </a>
          <a href={business.phoneHref} className="btn btn-ghost-dark">
            Call {business.phone}
          </a>
        </div>
        <p style={{ margin: "18px 0 0" }}>
          <Anchor href={homeHero.businessLink.href} style={TEXT_LINK}>
            {homeHero.businessLink.label}
          </Anchor>
        </p>
        <div className="hero-meta">
          <div>
            <div className="stars">★★★★★</div>
            <small>{homeHero.metaSmall}</small>
          </div>
          <div className="hero-divider" />
          <div className="hero-hours">
            <strong>{business.hours}</strong>
            <small>{business.hoursNote}</small>
          </div>
        </div>
      </div>

      <div className="hero-owner-tag">
        <div className="role">Owner &amp; lead technician</div>
        <div className="name">Konstantin</div>
      </div>

      <div className="hero-trust">
        <div>
          <span className="tick">✓</span> Same-Day Service
        </div>
        <div>
          <span className="tick">✓</span> Warranty on All Repairs
        </div>
        <div>
          <span className="tick">✓</span> $75 Diagnostic — Waived With Repair
        </div>
      </div>
    </section>
  );
}
