import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Anchor } from "./anchor";
import { BookCallCtas } from "./ctas";
import { richProps } from "./rich-text";

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  /** `<div class="breadcrumb">` — items joined by " / "; last one is usually hrefless. */
  breadcrumb: Crumb[];
  /** JSX, or a trusted HTML string (`"...<br><span>...</span>"`). */
  h1: ReactNode;
  lede?: ReactNode;
  /** Overrides the default Book/Call pair (about.html uses "Book a Repair", etc.). */
  ctas?: ReactNode;
  style?: CSSProperties;
};

// `.page-hero` from about.html / brands.html: breadcrumb, h1 (with accent `<span>`),
// `.lede`, `.ctas`. Structure is 1:1 with the static markup.
export function PageHero({ breadcrumb, h1, lede, ctas, style }: PageHeroProps) {
  return (
    <section className="page-hero" style={style}>
      <div className="breadcrumb">
        {breadcrumb.map((crumb, i) => (
          <Fragment key={crumb.label}>
            {i > 0 ? " / " : null}
            {crumb.href ? (
              <Anchor href={crumb.href}>{crumb.label}</Anchor>
            ) : (
              crumb.label
            )}
          </Fragment>
        ))}
      </div>
      <h1 {...richProps(h1)} />
      {lede != null && <p className="lede" {...richProps(lede)} />}
      <div className="ctas">{ctas ?? <BookCallCtas />}</div>
    </section>
  );
}
