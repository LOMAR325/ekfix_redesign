import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { business } from "@/data/business";
import { reviewCategories, reviewsPageCopy } from "@/data/reviews";
import { businessNode, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { getReviews } from "@/lib/google-reviews";
import { GoogleReviewLinks } from "@/components/ui/google-review-links";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { CtaBand } from "@/components/ui/cta-band";
import { BranchCtas } from "@/components/ui/ctas";

// /reviews — the site's reviews grouped by topic (stories 76–77). Categories and their
// rules live in data/reviews.reviewCategories(), which already drops an empty category;
// a review may appear in several. Review texts are rendered as-is. The page shows every
// review, so the business node carries the aggregateRating built from them, and the first
// section head shows the same `.rating-badge` as the home page with both of its numbers
// (rating + review count, story 82).
// Sections alternate light / light-2 after the dark hero; the cta-band closes dark.

const copy = reviewsPageCopy(business.name);

export const metadata: Metadata = pageMetadata({ ...copy.meta, path: "/reviews" });

export default async function ReviewsPage() {
  const data = await getReviews();
  const google = data.source === "google";
  // Google reviews come as one list; the site's own are grouped by appliance / commercial work.
  const categories = google
    ? [{ id: "google", label: copy.googleSection.h2, reviews: data.reviews }]
    : reviewCategories();
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: copy.breadcrumb.home, path: "/" },
    { name: copy.breadcrumb.self, path: "/reviews" },
  ]);

  return (
    <>
      <JsonLd data={graph(businessNode({ aggregateRating: !google }), jsonLd)} />

      <PageHero
        breadcrumb={crumbs}
        h1={copy.hero.h1}
        lede={google ? copy.hero.googleLede : copy.hero.lede}
        ctas={<BranchCtas />}
      />

      {categories.map((category, i) => (
        <section
          key={category.id}
          id={category.id}
          className={`section ${i % 2 === 0 ? "section-light" : "section-light-2"}`}
        >
          <SectionHead
            tone="light"
            eyebrow={google ? copy.googleSection.eyebrow : copy.countLabel(category.reviews.length)}
            h2={category.label}
            ratingBadge={i === 0 ? data : undefined}
          />
          <ReviewsGrid reviews={category.reviews} />
          {i === categories.length - 1 && <GoogleReviewLinks data={data} />}
        </section>
      ))}

      <CtaBand h2={copy.cta.h2} body={copy.cta.body} ctas={<BranchCtas />} />
    </>
  );
}
