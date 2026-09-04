import type { ReactNode } from "react";
import { business } from "@/data/business";
import { familyBusinessSentence } from "@/data/b2b-segments";
import { PhotoPair } from "@/components/ui/photo-pair";

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
const STATS: { icon: ReactNode; k: string; v: string }[] = [
  {
    icon: svg(
      <>
        <path d="M12 3l7 2.6v5.2c0 4.2-2.9 7.5-7 8.9-4.1-1.4-7-4.7-7-8.9V5.6L12 3z" />
        <path d="M9 12l2 2 4-4.2" />
      </>,
    ),
    k: "Certified",
    v: "EPA 608 & OSHA",
  },
  {
    icon: svg(
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.2 13.4 6.5 21 12 18l5.5 3-1.7-7.6" />
      </>,
    ),
    k: "Warranty",
    v: "On every repair",
  },
  {
    icon: svg(
      <>
        <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9z" />
        <path d="M12 12v6a2.5 2.5 0 0 1-5 0" />
      </>,
    ),
    k: "Insured",
    v: "Fully covered",
  },
  {
    icon: svg(
      <>
        <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L4 13.8a2 2 0 0 1-.6-1.4V4.5A1.5 1.5 0 0 1 4.9 3H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" />
        <path d="M7.8 7.8h.01" />
      </>,
    ),
    k: "Discounts",
    v: "Veterans & seniors",
  },
];

// `#family` — ported 1:1 from index.html. The only B2B change (spec story 26) is the
// extra `.family-copy` sentence from data/b2b-segments.familyBusinessSentence,
// added after the existing paragraph.
export function FamilySection() {
  return (
    <section id="family" className="section section-dark">
      <div className="family-grid">
        <div className="family-copy">
          <div
            className="eyebrow"
            style={{ color: "var(--accent)", marginBottom: 20 }}
          >
            03 / Who we are
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 58px)",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-2.4px",
            }}
          >
            A family business,
            <br />
            not a call center.
          </h2>
          <p>
            EK Global is run by Konstantin and his family, right here in
            Charlotte. You talk to the person who does the repair — no ticket
            numbers, no dispatch queue. We show up at neighborhood fairs, and we
            see our customers again at the grocery store. That&apos;s the reason
            we do every job properly the first time.
          </p>
          <p>{familyBusinessSentence}</p>
          <div className="family-stats">
            {STATS.map((stat) => (
              <div key={stat.k} className="fstat">
                <span className="fstat-ic">{stat.icon}</span>
                <div className="k">{stat.k}</div>
                <div className="v">{stat.v}</div>
              </div>
            ))}
          </div>
          <div className="family-ctas">
            <a href="#book" className="btn btn-accent">
              Book a Repair
            </a>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              Talk to Konstantin
            </a>
          </div>
        </div>
        <div>
          <div className="quote-card">
            <p>
              <span className="mark" aria-hidden="true">
                &ldquo;
              </span>
              I answer the phone, I do the diagnostic, and I&apos;m the one who
              comes back if something isn&apos;t right. That&apos;s the whole
              promise.
              <span className="mark" aria-hidden="true">
                &rdquo;
              </span>
            </p>
            <div className="who">
              <div className="quote-avatar">K</div>
              <div>
                <strong>Konstantin</strong>
                <span>Owner · EPA 608 &amp; OSHA certified</span>
              </div>
            </div>
          </div>
          <PhotoPair
            photos={[
              {
                src: "/images/kostia_reast.webp",
                alt: "Konstantin on a service call in a restaurant kitchen",
                caption: "On a service call — restaurant kitchen",
              },
              {
                src: "/images/kostia-laundry.webp",
                alt: "Konstantin repairing commercial laundry equipment on a rooftop",
                caption: "Commercial laundry repair",
                objectPosition: "30% 75%",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
