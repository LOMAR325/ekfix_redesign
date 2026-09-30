import { business } from "@/data/business";
import { commercialCta } from "@/data/commercial";
import { Anchor } from "@/components/ui/anchor";
import { businessRequestHref } from "@/components/booking-link";

// The commercial counterpart of ui/BookCallCtas (story 53): same two buttons and classes; the
// primary one opens the business form on the commercial home with the page's "Type of business"
// (industry pages) or equipment (equipment pages) preselected (components/booking-link).
export function CommercialCtas({
  businessType,
  equipment,
}: {
  businessType?: string;
  equipment?: string;
}) {
  return (
    <>
      <Anchor href={businessRequestHref({ businessType, equipment })} className="btn btn-accent">
        {commercialCta.label}
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        {commercialCta.call}
      </a>
    </>
  );
}
