import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTown, townSlugs } from "@/data/towns";
import { reviewsByAuthors } from "@/data/reviews";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { routable } from "@/lib/publish";
import { businessNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { ChipRow, type ChipItem } from "@/components/ui/chip-row";
import { ReviewsGrid } from "@/components/ui/review-card";
import { LocalPhoto } from "@/components/ui/local-photo";
import { CtaBand } from "@/components/ui/cta-band";

// One dynamic route for every town/area whose `page` is routable (lib/publish): the 5
// published city pages (charlotte, rock-hill, fort-mill, matthews, indian-trail) and, in
// `next dev` only, draft pages (with the DRAFT banner). Structure is 1:1 with
// towns/<slug>.html — charlotte.html is the odd one out (map section + prose "also
// serving nearby"; the other 4 use a "Nearby" chip section instead). All content,
// including <title>/<meta> and Charlotte's repair chips, comes from data/towns.
// towns/<slug>.html: h2 clamp on the dark sections.
const H2_CLAMP = {
  fontSize: "clamp(30px, 3.2vw, 44px)",
  letterSpacing: "-1.8px",
} as const;

// Only routable town pages render; any other slug is a 404 (spec story 2 / R07).
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
  if (!town?.page || !routable(town.page)) notFound();
  const { seo } = town.page;
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
  // Double guard (R07): getTown already returns only routable pages; re-check here so
  // no draft page is reachable in a production build.
  if (!town?.page || !routable(town.page)) notFound();
  const page = town.page;

  const isCharlotte = town.slug === "charlotte";
  const cityState = `${town.name}, ${town.state}`;
  const repairChips: ChipItem[] =
    page.repairChips ??
    services.map((s) => ({
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
      <DraftBanner item={page} />
      {/* areaServed: this page's own zone, as named in its H1. */}
      <JsonLd
        data={graph(
          businessNode({ areaServed: [{ name: cityState, kind: town.kind }] }),
          jsonLd,
        )}
      />

      <PageHero
        breadcrumb={crumbs}
        h1={`Appliance repair<br><span>in ${cityState}.</span>`}
        lede={page.hero.lede}
      />

      <section className="section section-light">
        <div className="two-col">
          <Prose
            heading="Local, not a dispatch center"
            paragraphs={page.prose}
          >
            <ChipRow items={page.districts ?? []} style={{ marginTop: 24 }} />
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
        <ReviewsGrid reviews={reviewsByAuthors(page.reviewAuthors ?? [])} />
      </section>

      {page.hasMap ? (
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
              paragraphs={page.nearbyProse ? [page.nearbyProse] : []}
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
          <ChipRow tone="dark" items={page.nearby ?? []} />
        </section>
      )}

      <CtaBand
        h2={`Same-day repair,<br>right here in ${town.name}.`}
        body="$75 diagnostic, waived if you book the repair."
      />
    </>
  );
}
