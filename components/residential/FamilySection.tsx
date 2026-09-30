import type { ReactNode } from "react";
import { business } from "@/data/business";
import { owner } from "@/data/people";
import { residentialHome, type FamilyStatIcon } from "@/data/residential";
import { LocalPhoto } from "@/components/ui/local-photo";
import { richProps } from "@/components/ui/rich-text";

// Small line icons for the four trust facts below. Decorative — the label carries
// the meaning — so they're aria-hidden. 24px viewBox, stroke = currentColor (lime).
const svg = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const ICONS: Record<FamilyStatIcon, ReactNode> = {
  shield: svg(
    <>
      <path d="M12 3l7 2.6v5.2c0 4.2-2.9 7.5-7 8.9-4.1-1.4-7-4.7-7-8.9V5.6L12 3z" />
      <path d="M9 12l2 2 4-4.2" />
    </>,
  ),
  medal: svg(
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.2 13.4 6.5 21 12 18l5.5 3-1.7-7.6" />
    </>,
  ),
  umbrella: svg(
    <>
      <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z" />
      <path d="M12 12v6a2.5 2.5 0 0 1-5 0" />
    </>,
  ),
  tag: svg(
    <>
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L4 13.8a2 2 0 0 1-.6-1.4V4.5A1.5 1.5 0 0 1 4.9 3H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" />
      <path d="M7.8 7.8h.01" />
    </>,
  ),
};

// `#family` — ported from index.html (copy in data/residential) for the residential home: the
// family paragraph, the four facts, the owner's quote and his portrait at a Thermador
// refrigerator. The commercial photos and the "restaurant walk-in" sentence stay on the
// commercial side; "Where we work" became its own #areas section.
export function FamilySection() {
  const copy = residentialHome.family;
  return (
    <section id="family" className="section section-dark">
      <div className="family-grid">
        <div className="family-copy">
          <div
            className="eyebrow"
            style={{ color: "var(--accent)", marginBottom: 20 }}
          >
            {copy.eyebrow}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 58px)",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-2.4px",
            }}
            {...richProps(copy.h2)}
          />
          {copy.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <div className="family-stats">
            {copy.stats.map((stat) => (
              <div key={stat.k} className="fstat">
                <span className="fstat-ic">{ICONS[stat.icon]}</span>
                <div className="k">{stat.k}</div>
                <div className="v">{stat.v}</div>
              </div>
            ))}
          </div>
          <div className="family-ctas">
            <a href="#book" className="btn btn-accent">
              {copy.bookLabel}
            </a>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              {copy.talkLabel}
            </a>
          </div>
        </div>
        <div>
          <div className="quote-card">
            <p>
              <span className="mark" aria-hidden="true">
                &ldquo;
              </span>
              {copy.quote}
              <span className="mark" aria-hidden="true">
                &rdquo;
              </span>
            </p>
            <div className="who">
              <div className="quote-avatar">{owner.name.charAt(0)}</div>
              <div>
                <strong>{owner.name}</strong>
                <span>{copy.quoteCredit}</span>
              </div>
            </div>
          </div>
          <LocalPhoto
            src={owner.photos.portrait.src}
            alt={owner.photos.portrait.alt}
            style={{ marginTop: 24 }}
          />
        </div>
      </div>
    </section>
  );
}
