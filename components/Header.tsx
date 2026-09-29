import { business } from "@/data/business";
import { site } from "@/data/site";
import { mainNav } from "@/lib/nav";
import { HeaderBar, type HeaderCopy } from "./HeaderBar";

// Server half: the menu (published items only, spec §8), the phone and the header labels are
// read from data/ here and handed to the interactive client half as props — the content
// modules (data/business pulls data/reviews) never ship to the browser.
export function Header() {
  const copy: HeaderCopy = {
    brandBadge: site.brandBadge,
    brandName: business.name,
    brandSubtitle: site.header.brandSubtitle,
    menuToggleLabel: site.header.menuToggleLabel,
    bookCta: site.header.bookCta,
    phone: business.phone,
    phoneHref: business.phoneHref,
  };
  return <HeaderBar nav={mainNav()} copy={copy} />;
}
