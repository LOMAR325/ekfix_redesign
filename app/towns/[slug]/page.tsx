import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTown, townSlugs } from "@/data/towns";
import { reviewsByAuthors } from "@/data/reviews";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { businessJsonLd } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { ChipRow, type ChipItem } from "@/components/ui/chip-row";
import { ReviewsGrid } from "@/components/ui/review-card";
import { LocalPhoto } from "@/components/ui/local-photo";
import { CtaBand } from "@/components/ui/cta-band";

// One dynamic route for the 5 service-area towns with isFullPage: true
// (charlotte, rock-hill, fort-mill, matthews, indian-trail). Structure is 1:1 with
// towns/<slug>.html — charlotte.html is the odd one out (map section + prose "also
// serving nearby"; the other 4 use a "Nearby" chip section instead). Content comes
// from data/towns; only the per-page <title>/<meta> live here (data/towns owns the
// hero/prose/districts/reviews/nearby, not the SEO strings) — transcribed verbatim
// from each static file, keyed by slug so a diff against the HTML is trivial.
const TOWN_SEO: Record<string, { title: string; description: string }> = {
  charlotte: {
    title: "Appliance Repair in Charlotte, NC | Same-Day | EK Global",
    description:
      "Same-day appliance repair in Charlotte, NC — Ballantyne, Dilworth, SouthPark, South End, Myers Park & NoDa. EPA 608 & OSHA certified, warranty on every repair.",
  },
  "rock-hill": {
    title: "Appliance Repair in Rock Hill, SC | Same-Day | EK Global",
    description:
      "Same-day appliance repair in Rock Hill, SC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
  },
  "fort-mill": {
    title: "Appliance Repair in Fort Mill, SC | Same-Day | EK Global",
    description:
      "Same-day appliance repair in Fort Mill, SC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
  },
  matthews: {
    title: "Appliance Repair in Matthews, NC | Same-Day | EK Global",
    description:
      "Same-day appliance repair in Matthews, NC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
  },
  "indian-trail": {
    title: "Appliance Repair in Indian Trail, NC | Same-Day | EK Global",
    description:
      "Same-day appliance repair in Indian Trail, NC. EPA 608 & OSHA certified technicians, original parts, warranty on every repair, $75 diagnostic waived with repair.",
  },
};

// towns/<slug>.html: h2 clamp on the dark sections.
const H2_CLAMP = {
  fontSize: "clamp(30px, 3.2vw, 44px)",
  letterSpacing: "-1.8px",
} as const;

// charlotte.html "What we repair" — 11 chips, only Refrigerator deep-links; the rest
// point at the home #repair grid, and Stove / Range is a single chip. The other 4
// town pages link all 12 services individually (derived from data/services below).
const CHARLOTTE_REPAIR_CHIPS: ChipItem[] = [
  { label: "Refrigerator", href: "/appliance-repair/refrigerator" },
  { label: "Washer", href: "/#repair" },
  { label: "Dryer", href: "/#repair" },
  { label: "Dishwasher", href: "/#repair" },
  { label: "Stove / Range", href: "/#repair" },
  { label: "Cooktop", href: "/#repair" },
  { label: "Microwave", href: "/#repair" },
  { label: "Freezer", href: "/#repair" },
  { label: "Ice Maker", href: "/#repair" },
  { label: "Wine Cooler", href: "/#repair" },
  { label: "Garbage Disposal", href: "/#repair" },
];

// Only the 5 isFullPage slugs render; any other slug is a 404 (spec story 15 / R16).
export const dynamicParams = false;

export function generateStaticParams() {
  return townSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const town = getTown(slug);
  if (!town || !town.isFullPage) notFound();
  const seo = TOWN_SEO[slug];
  return pageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/towns/${slug}`,
  });
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const town = getTown(slug);
  // Double guard (R16): getTown only looks inside fullPageTowns, and we re-check the
  // flag — no town page is reachable without isFullPage: true.
  if (!town || !town.isFullPage) notFound();

  const isCharlotte = town.slug === "charlotte";
  const cityState = `${town.name}, ${town.state}`;
  const repairChips: ChipItem[] = isCharlotte
    ? CHARLOTTE_REPAIR_CHIPS
    : services.map((s) => ({
        label: s.name,
        href: `/appliance-repair/${s.slug}`,
      }));

  // charlotte.html leaves "Service Area" unlinked in the visual trail; it stays
  // linked in the JSON-LD either way.
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: "Service Area", path: "/towns", unlinked: isCharlotte },
    { name: cityState, path: `/towns/${town.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[businessJsonLd(), jsonLd]} />

      <PageHero
        breadcrumb={crumbs}
        h1={`Appliance repair<br><span>in ${cityState}.</span>`}
        lede={town.hero?.lede}
      />

      <section className="section section-light">
        <div className="two-col">
          <Prose
            heading="Local, not a dispatch center"
            paragraphs={town.prose ?? []}
          >
            <ChipRow items={town.districts ?? []} style={{ marginTop: 24 }} />
          </Prose>
          <LocalPhoto
            src={isCharlotte ? "/images/charlotte.webp" : "/images/town.webp"}
            alt={isCharlotte ? "Charlotte, NC skyline" : cityState}
          />
        </div>
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow={`What we repair in ${town.name}`}
          h2="The full lineup."
          h2Style={H2_CLAMP}
        />
        <ChipRow tone="dark" items={repairChips} />
      </section>

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={isCharlotte ? "Charlotte customers" : "Local customers"}
          h2="What they say."
          ratingBadge
        />
        <ReviewsGrid reviews={reviewsByAuthors(town.reviewAuthors ?? [])} />
      </section>

      {town.hasMap ? (
        <>
          <section className="section section-dark-2">
            <SectionHead
              tone="dark"
              eyebrow="Find us"
              h2={`${town.name}, ${town.state}.`}
              style={{ marginBottom: 24 }}
              h2Style={H2_CLAMP}
            />
            <LocalPhoto style={{ borderColor: "rgba(255,255,255,0.09)" }}>
              <iframe
                title={`${town.name}, ${town.state} map`}
                src="https://www.google.com/maps?q=Charlotte,NC&output=embed"
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </LocalPhoto>
          </section>

          <section className="section section-light">
            <Prose
              heading="Also serving nearby"
              paragraphs={town.nearbyProse ? [town.nearbyProse] : []}
            />
          </section>
        </>
      ) : (
        <section className="section section-dark-2">
          <SectionHead
            tone="dark"
            eyebrow="Nearby"
            h2="Also serving."
            style={{ marginBottom: 24 }}
            h2Style={H2_CLAMP}
          />
          <ChipRow tone="dark" items={town.nearby ?? []} />
        </section>
      )}

      <CtaBand
        h2={`Same-day repair,<br>right here in ${town.name}.`}
        body="$75 diagnostic, waived if you book the repair."
      />
    </>
  );
}
