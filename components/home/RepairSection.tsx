"use client";

import { business } from "@/data/business";
import { services } from "@/data/services";
import { home } from "@/data/home";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";
import { RepairCard } from "@/components/ui/repair-card";
import { useBooking } from "@/components/BookingProvider";

// `#repair` — the 12 home-appliance cards from data/services, each linking to `#book`
// and presetting the booking form's appliance <select> on click (useBooking). The
// commercial cards moved to #commercial-equipment above (spec story 43).
export function RepairSection() {
  const { setAppliance } = useBooking();
  const copy = home.repair;

  return (
    <section id="repair" className="section section-light">
      <SectionHead tone="light" eyebrow={copy.eyebrow} h2={copy.h2} lede={copy.lede} />

      <RepairGrid>
        {services.map((service) => (
          <RepairCard
            key={service.slug}
            label={service.name}
            href="#book"
            tag={copy.tag}
            image={service.image}
            imageAlt={`${service.name} repair`}
            onSelect={() => setAppliance(service.formLabel)}
          />
        ))}
      </RepairGrid>

      <div className="not-listed">
        <strong>{copy.notListed.lead}</strong> {copy.notListed.text}{" "}
        <a href={business.phoneHref}>{copy.notListed.link}</a>.
      </div>
    </section>
  );
}
