"use client";

import { business } from "@/data/business";
import { services, commercialCategories } from "@/data/services";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";
import { RepairCard } from "@/components/ui/repair-card";
import { useBooking } from "@/components/BookingProvider";

// `#repair` — ported 1:1 from index.html: the 12 residential appliance cards from
// data/services, each linking to `#book` and presetting the booking form's appliance
// <select> on click (useBooking). The 4 commercial-equipment cards from
// data/services.commercialCategories are appended (spec story 12), linking into
// sections of /for-business rather than `#book`. `.not-listed` line is unchanged.
export function RepairSection() {
  const { setAppliance } = useBooking();

  return (
    <section id="repair" className="section section-light">
      <SectionHead
        tone="light"
        eyebrow="02 / What we repair"
        h2="We get to<br>the core problem."
        lede="Diagnosed on the spot, fixed with original manufacturer-approved parts. Free estimate before any work begins."
      />

      <RepairGrid>
        {services.map((service) => (
          <RepairCard
            key={service.slug}
            label={service.name}
            href="#book"
            tag="Repair · Book online"
            image={service.image}
            imageAlt={`${service.name} repair`}
            onSelect={() => setAppliance(service.formLabel)}
          />
        ))}
        {commercialCategories.map((category) => (
          <RepairCard
            key={category.label}
            label={category.label}
            href={category.href}
            tag="Commercial · See services"
            image={category.image}
            imageAlt={`${category.label} repair`}
          />
        ))}
      </RepairGrid>

      <div className="not-listed">
        <strong>Not on the list?</strong> We service most major and commercial
        appliances — <a href={business.phoneHref}>just call us</a>.
      </div>
    </section>
  );
}
