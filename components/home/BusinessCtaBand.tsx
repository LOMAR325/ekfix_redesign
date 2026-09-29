import { CtaBand } from "@/components/ui/cta-band";
import { business } from "@/data/business";
import { businessCta } from "@/data/b2b-segments";
import { commercialCta, commercialDefaultContactAs } from "@/data/commercial";
import { RequestQuoteButton } from "./RequestQuoteButton";

// `#business-cta` — the commercial `.cta-band` between `#brands` and `#book`. The primary
// button reads "Request Service or a Quote" (story 53) and opens the form below with the
// business default ("Other Business", story 52) preselected; the ghost button is a call.
// The `<section>` wrapper only carries the anchor id — `.cta-band` supplies the styling.
export function BusinessCtaBand() {
  return (
    <section id="business-cta">
      <CtaBand
        h2={businessCta.heading}
        body={businessCta.text}
        ctas={
          <>
            <RequestQuoteButton label={commercialCta.label} contactAs={commercialDefaultContactAs} />
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              {commercialCta.call}
            </a>
          </>
        }
      />
    </section>
  );
}
