import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { business } from "@/data/business";
import { reviewsPageCopy } from "@/data/reviews";
import { businessNode, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbTrail } from "@/lib/breadcrumb";
import { getReviews } from "@/lib/google-reviews";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { ReviewsGrid } from "@/components/ui/review-card";
import { GoogleReviewLinks } from "@/components/ui/google-review-links";
import { CtaBand } from "@/components/ui/cta-band";
import { BranchCtas } from "@/components/ui/ctas";
import { richProps } from "@/components/ui/rich-text";

// /reviews — built around the Google Business Profile (owner, 2026-09-30: the site's "6 reviews"
// understated the real count). The hero leads to all reviews on Google and to leaving one; below,
// the latest Google reviews with the real rating and count when lib/google-reviews has them live,
// otherwise a few of the site's reviews with no number at all. Then a "leave a review" band.
// Tones: hero D → list L → leave D2 → cta-band D.

const copy = reviewsPageCopy(business.name);

export const metadata: Metadata = pageMetadata({ ...copy.meta, path: "/reviews" });

const external = { target: "_blank", rel: "noopener" } as const;

export default async function ReviewsPage() {
  const data = await getReviews();
  const google = data.source === "google";
  const { crumbs, jsonLd } = breadcrumbTrail([
    { name: copy.breadcrumb.home, path: "/" },
    { name: copy.breadcrumb.self, path: "/reviews" },
  ]);

  return (
    <>
      <JsonLd data={graph(businessNode(), jsonLd)} />

      <PageHero
        breadcrumb={crumbs}
        h1={copy.hero.h1}
        lede={google ? copy.hero.googleLede : copy.hero.siteLede}
        ctas={
          <>
            <a href={business.social.google} className="btn btn-accent" {...external}>
              {copy.hero.readAll} <span aria-hidden="true">→</span>
            </a>
            <a href={business.google.writeReviewUrl} className="btn btn-ghost-dark" {...external}>
              {copy.hero.leave}
            </a>
          </>
        }
      />

      <section id="latest" className="section section-light">
        <SectionHead
          tone="light"
          eyebrow={google ? copy.list.googleEyebrow : copy.list.siteEyebrow}
          h2={copy.list.h2}
          ratingBadge={data}
        />
        <ReviewsGrid reviews={data.reviews} />
        <GoogleReviewLinks data={data} />
      </section>

      <section id="leave-a-review" className="section section-dark-2">
        <div style={{ maxWidth: 760 }}>
          <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 20 }}>
            {copy.leave.eyebrow}
          </div>
          <h2
            style={{ margin: 0, fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-1.8px" }}
            {...richProps(copy.leave.h2)}
          />
          <p style={{ margin: "18px 0 28px", fontSize: 17, lineHeight: 1.6, color: "var(--text-light-60)" }}>
            {copy.leave.body}
          </p>
          <a href={business.google.writeReviewUrl} className="btn btn-accent" {...external}>
            {copy.leave.button}
          </a>
        </div>
      </section>

      <CtaBand h2={copy.cta.h2} body={copy.cta.body} ctas={<BranchCtas />} />
    </>
  );
}
