import { commercialCategories } from "@/data/services";
import { home } from "@/data/home";
import { commercialCardHref } from "@/lib/links";
import { SectionHead } from "@/components/ui/section-head";
import { RepairGrid } from "@/components/ui/repair-grid";

// `#commercial-equipment` — the commercial equipment cards, before the home grid
// (spec §7, story 43). Same `.repair-grid` / `.repair-card` as #repair; each card
// links to the published child page for its category, else to the hub anchor
// (lib/links.commercialCardHref). `section-light`: between #who-we-serve (light-2)
// and #trust-b2b (dark).
export function CommercialEquipmentSection() {
  const copy = home.commercialEquipment;
  return (
    <section id="commercial-equipment" className="section section-light">
      <SectionHead tone="light" eyebrow={copy.eyebrow} h2={copy.h2} lede={copy.lede} />
      <RepairGrid
        items={commercialCategories.map((category) => ({
          label: category.label,
          href: commercialCardHref(category),
          tag: copy.tag,
          image: category.image,
          imageAlt: `${category.label} repair`,
        }))}
      />
    </section>
  );
}
