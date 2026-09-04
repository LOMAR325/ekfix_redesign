import { business } from "@/data/business";
import { Anchor } from "./anchor";

type BookCallCtasProps = {
  /**
   * Primary-button label. Defaults to the "Book Online — Save 10%" pair the current
   * HTML repeats in `.page-hero .ctas` / `.cta-band .ctas`; about.html overrides it
   * with "Book a Repair" and for-business.html with "Request a Quote".
   */
  bookLabel?: string;
};

// The two-button pair the current HTML repeats verbatim in `.page-hero .ctas` and
// `.cta-band .ctas` on brands.html, refrigerator.html, charlotte.html, etc.
// Primary -> /#book, "Call (980) 371-4319" -> tel: from data/business.
export function BookCallCtas({
  bookLabel = "Book Online — Save 10%",
}: BookCallCtasProps) {
  return (
    <>
      <Anchor href="/#book" className="btn btn-accent">
        {bookLabel}
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        Call {business.phone}
      </a>
    </>
  );
}
