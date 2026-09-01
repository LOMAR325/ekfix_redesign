import type { ReactNode } from "react";

// Several data/* fields carry trusted HTML fragments rather than plain text —
// e.g. a service `hero.h1` of `"Refrigerator repair,<br><span>done same day.</span>"`
// or a town prose paragraph with `<strong>`. These strings are authored in the repo,
// never user input.
//
// `richProps` lets a component prop be EITHER ready JSX (rendered as-is) OR such a
// string (rendered through dangerouslySetInnerHTML, so the inner `<br>/<span>/<strong>`
// keep working). Spread the result straight onto the host element:
//
//   <h1 className="page-hero-h1" {...richProps(h1)} />
//
// A tag-free string still renders correctly through the HTML branch.
export function richProps(
  value: ReactNode,
):
  | { dangerouslySetInnerHTML: { __html: string } }
  | { children: ReactNode } {
  return typeof value === "string"
    ? { dangerouslySetInnerHTML: { __html: value } }
    : { children: value };
}
