import Image from "next/image";
import type { ReactNode } from "react";
import { business } from "@/data/business";
import { owner } from "@/data/people";
import { site } from "@/data/site";
import { richProps } from "./rich-text";
import { Stars } from "./stars";

// The full-screen `.hero` of the two branch homes (ADR 0022), ported from the former home
// hero: photo (LCP, `priority`), scrim and fades, eyebrow, the two-line H1 with the accent
// second line, lede, buttons, `.hero-meta` (the rating as text next to the decorative stars,
// and the hours), the owner tag, and the `.hero-trust` band.
export function Hero({
  id = "top",
  photo,
  objectPosition,
  eyebrow,
  h1,
  lede,
  ctas,
  trust,
}: {
  id?: string;
  photo: { src: string; alt: string };
  /** Overrides `.hero-photo { object-position }` for a photo framed differently. */
  objectPosition?: string;
  eyebrow: string;
  h1: string;
  lede: string;
  ctas: ReactNode;
  trust: readonly string[];
}) {
  return (
    <section id={id} className="hero">
      <Image
        className="hero-photo"
        src={photo.src}
        alt={photo.alt}
        fill
        priority
        sizes="100vw"
        style={objectPosition ? { objectPosition } : undefined}
      />
      <div className="hero-scrim" />
      <div className="hero-fade-top" />
      <div className="hero-fade-bottom" />

      <div className="hero-content">
        <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>
          {eyebrow}
        </div>
        <h1 {...richProps(h1)} />
        <p className="lede">{lede}</p>
        <div className="hero-ctas">{ctas}</div>
        <div className="hero-meta">
          {business.rating && (
            <>
              <div>
                <Stars />
                <small>{site.ratingText(business.rating.value, business.rating.count)}</small>
              </div>
              <div className="hero-divider" />
            </>
          )}
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
        {trust.map((item) => (
          <div key={item}>
            <span className="tick">✓</span> {item}
          </div>
        ))}
      </div>
    </section>
  );
}
