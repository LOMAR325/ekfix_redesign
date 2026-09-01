import type { CSSProperties, ReactNode } from "react";
import { richProps } from "./rich-text";

type ProseProps = {
  heading?: ReactNode;
  /** Paragraphs; may be trusted HTML strings (town prose carries `<strong>`). */
  paragraphs?: ReactNode[];
  /** Extra content appended inside `.prose` (a `StatRow`, a `ChipRow`, …). */
  children?: ReactNode;
  style?: CSSProperties;
};

// `.prose` block (h2 + paragraphs) from about.html / brands.html / the town pages.
export function Prose({ heading, paragraphs, children, style }: ProseProps) {
  return (
    <div className="prose" style={style}>
      {heading != null && <h2 {...richProps(heading)} />}
      {paragraphs?.map((paragraph, i) => (
        <p key={i} {...richProps(paragraph)} />
      ))}
      {children}
    </div>
  );
}
