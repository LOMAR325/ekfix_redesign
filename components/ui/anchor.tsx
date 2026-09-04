import Link from "next/link";
import type { Route } from "next";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

// Internal destinations ("/about", "/#book", "/for-business#horeca") route through
// next/link; `tel:`, `mailto:`, absolute `http(s):` URLs and bare `#hash` links stay
// plain `<a>`. Hrefs arrive as free strings from data/*, so the typed-routes cast is
// centralised here instead of every call site (mirrors the `r()` helper in Footer.tsx).
export function Anchor({ href, children, ...rest }: AnchorProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href as Route} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
