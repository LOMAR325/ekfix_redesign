import { business } from "@/data/business";
import { services } from "@/data/services";
import { residentialHome } from "@/data/residential";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";

// `#repair` — the 12 home-appliance cards (data/services), each linking to its service page;
// a service page's own CTA opens the form below with that appliance preset (components/booking-link).
export function RepairSection() {
  const copy = residentialHome.repair;
  return (
    <section id="repair" className="section section-light">
      <SectionHead tone="light" eyebrow={copy.eyebrow} h2={copy.h2} lede={copy.lede} />
      <RepairGrid
        items={services.map((service) => ({
          label: service.name,
          href: `${residentialHome.path}/${service.slug}`,
          tag: copy.tag,
          image: service.image,
          imageAlt: `${service.name} repair`,
        }))}
      />
      <div className="not-listed">
        <strong>{copy.notListed.lead}</strong> {copy.notListed.text}{" "}
        <a href={business.phoneHref}>{copy.notListed.link}</a>.
      </div>
    </section>
  );
}
