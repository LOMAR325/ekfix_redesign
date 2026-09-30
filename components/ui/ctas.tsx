import { business } from "@/data/business";
import { branchPaths, site } from "@/data/site";
import { Anchor } from "./anchor";

type BookCallCtasProps = {
  /**
   * Primary-button label. Defaults to the "Book Online — Save 10%" pair the current
   * HTML repeats in `.page-hero .ctas` / `.cta-band .ctas`; about.html overrides it
   * with "Book a Repair" and for-business.html with "Request a Quote".
   */
  bookLabel?: string;
  /** Primary-button target; defaults to the residential form (`/appliance-repair#book`). */
  href?: string;
};

// The two-button pair the current HTML repeats verbatim in `.page-hero .ctas` and
// `.cta-band .ctas` on brands.html, refrigerator.html, charlotte.html, etc.
// Primary -> the residential form (ADR 0022: the form left `/` for /appliance-repair#book),
// "Call (980) 371-4319" -> tel: from data/business.
export function BookCallCtas({
  bookLabel = "Book Online — Save 10%",
  href = branchPaths.home.book,
}: BookCallCtasProps) {
  return (
    <>
      <Anchor href={href} className="btn btn-accent">
        {bookLabel}
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        Call {business.phone}
      </a>
    </>
  );
}

// The shared pages' pair (ADR 0022): /about, /reviews and /brands belong to both branches, so
// their buttons lead to both forms — the business one first (accent), the home one second.
export function BranchCtas() {
  const { business: toBusiness, home } = site.branchCtas;
  return (
    <>
      <Anchor href={toBusiness.href} className="btn btn-accent">
        {toBusiness.label}
      </Anchor>
      <Anchor href={home.href} className="btn btn-ghost-dark">
        {home.label}
      </Anchor>
    </>
  );
}
