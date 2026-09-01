import { business } from "@/data/business";
import { Anchor } from "./anchor";

// The two-button pair the current HTML repeats verbatim in `.page-hero .ctas` and
// `.cta-band .ctas` on brands.html, refrigerator.html, charlotte.html, etc.
// "Book Online — Save 10%" -> /#book, "Call (980) 371-4319" -> tel: from data/business.
export function BookCallCtas() {
  return (
    <>
      <Anchor href="/#book" className="btn btn-accent">
        Book Online — Save 10%
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        Call {business.phone}
      </a>
    </>
  );
}
