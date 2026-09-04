import type { ReactNode } from "react";
import { BookCallCtas } from "./ctas";
import { richProps } from "./rich-text";

type CtaBandProps = {
  /** JSX or a trusted HTML string (`"...<br>..."`). */
  h2: ReactNode;
  body?: ReactNode;
  /** Overrides the default "Book Online — Save 10%" / "Call ..." pair. */
  ctas?: ReactNode;
};

// `.cta-band` from about.html / brands.html / for-business.html — h2 (with `<br>`),
// a paragraph, and `.ctas` with two buttons.
export function CtaBand({ h2, body, ctas }: CtaBandProps) {
  return (
    <div className="cta-band">
      <h2 {...richProps(h2)} />
      {body != null && <p {...richProps(body)} />}
      <div className="ctas">{ctas ?? <BookCallCtas />}</div>
    </div>
  );
}
