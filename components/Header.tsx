import { business } from "@/data/business";
import { site, type SiteVariant } from "@/data/site";
import { navFor } from "@/lib/nav";
import { HeaderBar, type HeaderCopy } from "./HeaderBar";

// Server half of the three branch headers (ADR 0022): the menu of the variant (published
// items only), the phone, the accent button and the switch to the other branch are read from
// data/ here and handed to the interactive client half as props — the content modules never
// ship to the browser. The entry page `/` has its own minimal header (EntryHeader).
export function Header({ variant }: { variant: SiteVariant }) {
  const h = site.header[variant];
  const copy: HeaderCopy = {
    brandBadge: site.brandBadge,
    brandName: business.name,
    brandSubtitle: h.brandSubtitle,
    brandHref: h.brandHref,
    menuToggleLabel: site.menuToggleLabel,
    cta: h.cta,
    switchTo: h.switchTo,
    phone: business.phone,
    phoneHref: business.phoneHref,
  };
  return <HeaderBar nav={navFor(variant)} copy={copy} />;
}
