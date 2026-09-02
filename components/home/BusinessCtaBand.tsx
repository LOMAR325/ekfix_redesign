import { CtaBand } from "@/components/ui/cta-band";
import { Anchor } from "@/components/ui/anchor";
import { business } from "@/data/business";
import { businessCta } from "@/data/b2b-segments";

// NEW section `#business-cta` — a second `.cta-band` between `#brands` and `#book`
// (spec story 26). Copy comes from data/b2b-segments.businessCta; the primary button
// points at `/for-business`, the ghost button is a phone call. The `<section>`
// wrapper only carries the anchor id — `.cta-band` supplies all of the styling.
export function BusinessCtaBand() {
  return (
    <section id="business-cta">
      <CtaBand
        h2={businessCta.heading}
        body={businessCta.text}
        ctas={
          <>
            <Anchor href={businessCta.primary.href} className="btn btn-accent">
              {businessCta.primary.label}
            </Anchor>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              Call {business.phone}
            </a>
          </>
        }
      />
    </section>
  );
}
