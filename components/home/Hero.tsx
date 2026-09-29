import Image from "next/image";
import { business } from "@/data/business";
import { owner } from "@/data/people";
import { homeHero } from "@/data/b2b-segments";
import { home } from "@/data/home";
import { Anchor } from "@/components/ui/anchor";
import { richProps } from "@/components/ui/rich-text";

// `#home` hero (spec §7, stories 42/46/47). The slogan is the secondary `.eyebrow` line;
// the `<h1>` names what and where in the two-line style with an accent second line.
// Two paths: "For Business" (accent, primary) → the commercial hub, "For Homes" (ghost)
// → the home-appliance hub; the phone is a text link in the hero's accent-link style.
// "Book Online — Save 10%" is gone from the hero (it stays in #book and the home CTAs).
// The background photo is the LCP image, so it goes through next/image with `priority`.

// Accent text-link: lime colour + trailing arrow are the link signal (the
// underline was dropped 2026-09-03 per owner feedback — see docs/adr/0002).
// Hover lift / focus ring come from the `a[style*="--accent"]` rules in globals.css.
const TEXT_LINK = {
  color: "var(--accent)",
  fontSize: 14,
  fontWeight: 600,
} as const;

export function Hero() {
  return (
    <section id="home" className="hero">
      <Image
        className="hero-photo"
        src={owner.photos.hero.src}
        alt={owner.photos.hero.alt}
        fill
        priority
        sizes="100vw"
      />
      <div className="hero-scrim" />
      <div className="hero-fade-top" />
      <div className="hero-fade-bottom" />

      <div className="hero-content">
        <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>
          {homeHero.eyebrow}
        </div>
        <h1 {...richProps(homeHero.h1)} />
        <p className="lede">{homeHero.lede}</p>
        <div className="hero-ctas">
          <Anchor href={homeHero.forBusiness.href} className="btn btn-accent">
            {homeHero.forBusiness.label} <span>→</span>
          </Anchor>
          <Anchor href={homeHero.forHomes.href} className="btn btn-ghost-dark">
            {homeHero.forHomes.label}
          </Anchor>
        </div>
        <p style={{ margin: "18px 0 0" }}>
          <a href={business.phoneHref} style={TEXT_LINK}>
            {homeHero.callLabel} {business.phone} →
          </a>
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
        <div className="role">{owner.role}</div>
        <div className="name">{owner.name}</div>
      </div>

      <div className="hero-trust">
        {home.heroTrust.map((item) => (
          <div key={item}>
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
    </section>
  );
}
