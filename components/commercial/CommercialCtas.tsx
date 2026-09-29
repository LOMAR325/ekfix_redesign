import type { ContactAsOption } from "@/data/types";
import { business } from "@/data/business";
import { commercialCta } from "@/data/commercial";
import { Anchor } from "@/components/ui/anchor";
import { bookingHref } from "./booking-link";

// The commercial counterpart of ui/BookCallCtas (story 53): same two buttons and classes,
// but the primary one reads "Request Service or a Quote" and opens the home form with
// "I'm contacting you as a…" (and, on equipment pages, the appliance) preselected.
export function CommercialCtas({
  contactAs,
  appliance,
}: {
  contactAs: ContactAsOption;
  appliance?: string;
}) {
  return (
    <>
      <Anchor href={bookingHref({ contactAs, appliance })} className="btn btn-accent">
        {commercialCta.label}
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        {commercialCta.call}
      </a>
    </>
  );
}
