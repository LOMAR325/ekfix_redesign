import { business } from "@/data/business";
import { commercialCta } from "@/data/commercial";
import { Anchor } from "@/components/ui/anchor";
import { branchPaths } from "@/data/site";

// The commercial counterpart of ui/BookCallCtas (story 53): same two buttons and classes; the
// primary one opens the business form on the commercial home (`#request`).
export function CommercialCtas() {
  return (
    <>
      <Anchor href={branchPaths.business.request} className="btn btn-accent">
        {commercialCta.label}
      </Anchor>
      <a href={business.phoneHref} className="btn btn-ghost-dark">
        {commercialCta.call}
      </a>
    </>
  );
}
