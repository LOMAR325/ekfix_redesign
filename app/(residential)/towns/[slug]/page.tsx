import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  areaCopy,
  getTown,
  publishedAncestors,
  publishedDescendants,
  townPageCopy as copy,
  townSlugs,
} from "@/data/towns";
import type { Town } from "@/data/types";
import { reviews, reviewsByAuthors } from "@/data/reviews";
import { services } from "@/data/services";
import { owner } from "@/data/people";
import { branchPaths, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { isPublished, routable } from "@/lib/publish";
import { businessNode, faqNode, graph } from "@/lib/jsonld";
import { breadcrumbTrail, type BreadcrumbStep } from "@/lib/breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { DraftBanner } from "@/components/DraftBanner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { ChipRow, type ChipItem } from "@/components/ui/chip-row";
import { ReviewsGrid } from "@/components/ui/review-card";
import { LocalPhoto } from "@/components/ui/local-photo";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { CtaBand } from "@/components/ui/cta-band";

// One dynamic route for every town/area whose `page` is routable (lib/publish): the 5
// published city pages and the two areas of Charlotte (spec §3), plus — in `next dev` only —
// draft pages with the DRAFT banner. City pages are 1:1 with towns/<slug>.html
// (charlotte.html is the odd one out: map section + prose "also serving nearby"; the other 4
// use a "Nearby" chip section). Area pages are built from the same ui/* pieces, a section
// per filled field; draft blocks inside a page are never rendered. All copy: data/towns.
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

const townPath = (t: Town) => `/towns/${t.slug}`;
/** Cities read "Charlotte, NC"; areas are named bare ("Ballantyne"), as in the brief's trail. */
const placeName = (t: Town) => (t.kind === "city" ? `${t.name}, ${t.state}` : t.name);
const townLink = (t: Town): ChipItem => ({ label: placeName(t), href: townPath(t) });

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
  const path = townPath(town);
  const cityState = `${town.name}, ${town.state}`;
  const isArea = town.kind === "area";
  const isCharlotte = town.slug === "charlotte";

  // Trail from the parent chain; a draft level is skipped (story 61). charlotte.html leaves
  // "Service Area" unlinked in the visual trail; it stays linked in the JSON-LD either way.
  const { crumbs, jsonLd: breadcrumbJsonLd } = breadcrumbTrail([
    { name: "Home", path: "/" },
    { name: "Service Area", path: "/towns", unlinked: isCharlotte },
    ...publishedAncestors(town).map((t): BreadcrumbStep => ({ name: placeName(t), path: townPath(t) })),
    { name: placeName(town), path },
  ]);

  const faqs = (page.faqs ?? []).filter(isPublished);
  const notes = (page.applianceNotes ?? []).filter(isPublished);
  const areasBelow = publishedDescendants(town);
  const repairChips: ChipItem[] =
    page.repairChips ?? services.map((s) => ({ label: s.name, href: `/appliance-repair/${s.slug}` }));
  // A district chip links to its area page once that page is published; published areas
  // not named among the districts are appended.
  const districtChips: ChipItem[] = [
    ...(page.districts ?? []).map((d): ChipItem => {
      const area = areasBelow.find((a) => a.name === d);
      return area ? { label: d, href: townPath(area) } : d;
    }),
    ...areasBelow.filter((a) => !(page.districts ?? []).includes(a.name)).map(townLink),
  ];

  const jsonLd = (
    <JsonLd
      data={graph(
        // areaServed: this page's own zone, as named in its H1.
        businessNode({ areaServed: [{ name: cityState, kind: town.kind }] }),
        faqNode(path, faqs),
        breadcrumbJsonLd,
      )}
    />
  );
  const hero = (
    <PageHero breadcrumb={crumbs} h1={page.hero.h1 ?? copy.h1(cityState)} lede={page.hero.lede} />
  );
  const lineup = (eyebrow: string) => (
    <section className="section section-dark">
      <SectionHead tone="dark" eyebrow={eyebrow} h2={copy.lineupH2} h2Style={H2_CLAMP} />
      <ChipRow tone="dark" items={repairChips} />
    </section>
  );
  const cta = <CtaBand h2={copy.ctaH2(town.name)} body={copy.ctaBody} />;

  if (isArea) {
    const headings = areaCopy[town.slug];
    const coverage = page.coverage && isPublished(page.coverage) ? [page.coverage.body] : [];
    // The owner's portrait where he is based (owner.basedIn), the generic town photo elsewhere.
    const photo =
      owner.basedIn === town.name ? owner.photos.portrait : { src: copy.townPhoto, alt: cityState };
    const areaReviews = reviews.filter((r) => r.area === town.slug);
    const related = [...publishedAncestors(town).reverse(), ...areasBelow].map(townLink);

    return (
      <>
        <DraftBanner item={page} />
        {jsonLd}
        {hero}

        <section className="section section-light">
          <div className="two-col">
            <Prose heading={headings?.proseHeading} paragraphs={[...page.prose, ...coverage]}>
              {districtChips.length > 0 && <ChipRow items={districtChips} style={{ marginTop: 24 }} />}
              {headings?.commercialLink && (
                <ChipRow
                  items={[{ label: site.crossBranch.commercialInArea, href: branchPaths.business.serviceArea }]}
                  style={{ marginTop: 24 }}
                />
              )}
            </Prose>
            <LocalPhoto src={photo.src} alt={photo.alt} imgStyle={{ background: "var(--bg-light-2)" }} />
          </div>
        </section>

        {notes.length > 0 && (
          <section className="section section-light-2">
            <SectionHead tone="light" eyebrow={copy.notesEyebrow(town.name)} h2={headings?.notesH2 ?? ""} />
            <ProblemCardGrid
              variant="light"
              items={notes.map((n) => ({ title: n.heading, body: n.body }))}
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
            />
            <ChipRow
              items={notes.flatMap((n) => {
                const s = services.find((x) => x.slug === n.serviceSlug);
                return s ? [{ label: s.name, href: `/appliance-repair/${s.slug}` }] : [];
              })}
              style={{ marginTop: 24 }}
            />
          </section>
        )}

        {lineup(copy.areaLineupEyebrow)}

        {areaReviews.length > 0 && (
          <section className="section section-light-2">
            <SectionHead tone="light" eyebrow={copy.reviewsEyebrow} h2={copy.reviewsH2} />
            <ReviewsGrid reviews={areaReviews} />
          </section>
        )}

        {faqs.length > 0 && (
          <section className="section section-light">
            <SectionHead tone="light" eyebrow={copy.faqEyebrow} h2={copy.faqH2(town.name)} />
            <FaqAccordion items={faqs} style={{ maxWidth: 760 }} />
          </section>
        )}

        {related.length > 0 && (
          <section className="section section-dark-2">
            <SectionHead
              tone="dark"
              eyebrow={copy.relatedEyebrow}
              h2={copy.relatedH2}
              style={{ marginBottom: 24 }}
              h2Style={H2_CLAMP}
            />
            <ChipRow tone="dark" items={related} />
          </section>
        )}

        {cta}
      </>
    );
  }

  const cityPhoto = isCharlotte ? copy.charlottePhoto : { src: copy.townPhoto, alt: cityState };
  // Only reviews tied to this city (brief 7.2); a city without one shows no reviews section.
  const cityReviews = reviewsByAuthors(page.reviewAuthors ?? []);

  return (
    <>
      <DraftBanner item={page} />
      {jsonLd}
      {hero}

      <section className="section section-light">
        <div className="two-col">
          <Prose heading={copy.cityProseHeading} paragraphs={page.prose}>
            <ChipRow items={districtChips} style={{ marginTop: 24 }} />
            {page.termsLink && <ChipRow items={[copy.termsLink]} style={{ marginTop: 12 }} />}
          </Prose>
          <LocalPhoto src={cityPhoto.src} alt={cityPhoto.alt} />
        </div>
      </section>

      {lineup(copy.cityLineupEyebrow(town.name))}

      {cityReviews.length > 0 && (
        <section className="section section-light">
          <SectionHead
            tone="light"
            eyebrow={isCharlotte ? copy.charlotteReviewsEyebrow : copy.reviewsEyebrow}
            h2={copy.reviewsH2}
            ratingBadge
          />
          <ReviewsGrid reviews={cityReviews} />
        </section>
      )}

      {page.hasMap ? (
        <>
          <section className="section section-dark-2">
            <SectionHead
              tone="dark"
              eyebrow={copy.mapEyebrow}
              h2={`${cityState}.`}
              style={{ marginBottom: 24 }}
              h2Style={H2_CLAMP}
            />
            <LocalPhoto style={{ borderColor: "rgba(255,255,255,0.09)" }}>
              <iframe
                title={copy.mapTitle(cityState)}
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
              heading={copy.nearbyProseHeading}
              paragraphs={page.nearbyProse ? [page.nearbyProse] : []}
            />
          </section>
        </>
      ) : (
        <section className="section section-dark-2">
          <SectionHead
            tone="dark"
            eyebrow={copy.nearbyEyebrow}
            h2={copy.nearbyH2}
            style={{ marginBottom: 24 }}
            h2Style={H2_CLAMP}
          />
          <ChipRow tone="dark" items={page.nearby ?? []} />
        </section>
      )}

      {cta}
    </>
  );
}
