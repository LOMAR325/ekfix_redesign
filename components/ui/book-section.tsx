import type { ReactNode } from "react";
import { business } from "@/data/business";
import { richProps } from "./rich-text";

// `.book-grid` — the form section of both branch homes (ported from index.html `#book`):
// `.book-copy` (eyebrow, h2, body, the phone, three facts) and the form column.
export function BookSection({
  id,
  eyebrow,
  h2,
  body,
  facts,
  children,
}: {
  id: string;
  eyebrow: string;
  h2: string;
  body: string;
  facts: readonly { k: string; v: string }[];
  children: ReactNode;
}) {
  return (
    <section id={id} className="section section-dark-2">
      <div className="book-grid">
        <div className="book-copy">
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>
            {eyebrow}
          </div>
          <h2 {...richProps(h2)} />
          <p>{body}</p>
          <a href={business.phoneHref} className="book-phone">
            {business.phone}
          </a>
          <div className="book-facts">
            {facts.map((fact) => (
              <div key={fact.k} className="fact">
                <div className="k">{fact.k}</div>
                <div className="v">{fact.v}</div>
              </div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
