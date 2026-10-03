import { Fragment } from "react";
import Image from "next/image";
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
  /** Background photo on the right, under a left-to-right scrim (ADR 0002, two-branch block). */
  photo?: { src: string; alt: string; position?: string };
};

// `.page-hero` from about.html / brands.html: breadcrumb, h1 (with accent `<span>`),
// `.lede`, `.ctas`. Structure is 1:1 with the static markup.
export function PageHero({ breadcrumb, h1, lede, ctas, style, photo }: PageHeroProps) {
  return (
    <section className={photo ? "page-hero branch-hero-has-photo" : "page-hero"} style={style}>
      {photo && (
        <>
          <Image
            className="branch-hero-photo"
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
          <div className="branch-hero-scrim" />
        </>
      )}
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
