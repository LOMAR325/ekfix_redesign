import type { Metadata } from "next";
import { business } from "@/data/business";
import { owner } from "@/data/people";
import { publishedArticles } from "@/data/guides";
import { homeWhereWeWork, residentialHome as home } from "@/data/residential";
import { pageMetadata } from "@/lib/seo";
import { articlePath } from "@/lib/routes";
import { businessNode, faqNode, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/ui/hero";
import { SectionHead } from "@/components/ui/section-head";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { ChipRow } from "@/components/ui/chip-row";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { BookSection } from "@/components/ui/book-section";
import { HomeBookForm } from "@/components/HomeBookForm";
import { RepairSection } from "@/components/residential/RepairSection";
import { FamilySection } from "@/components/residential/FamilySection";
import { ReviewsSection } from "@/components/residential/ReviewsSection";
import { BrandsSection } from "@/components/residential/BrandsSection";

export const metadata: Metadata = pageMetadata({ ...home.seo, path: home.path });

const H2_CLAMP = { fontSize: "clamp(30px, 3.2vw, 44px)", letterSpacing: "-1.8px" } as const;

// The residential home (ADR 0022) — the household half of the former `/` and the former
// residential hub. Static (SSG); the form reads `?appliance=` on the client. Tones alternate:
// hero D → #repair L → #family D → #pricing L2 → #reviews L → #brands D2 → #areas L →
// [#guides L2] → #faq L2|L → #book D2.
export default function ResidentialHomePage() {
  const whereWeWork = homeWhereWeWork();
  const guides = publishedArticles();
  return (
    <>
      {/* image: the owner's hero photo; aggregateRating: the reviews and both numbers are shown;
          areaServed: exactly the places #areas links to; the FAQ is on the page. */}
      <JsonLd
        data={graph(
          businessNode({ image: true, aggregateRating: true, areaServed: whereWeWork.areaServed }),
          faqNode(home.path, home.faq.items),
        )}
      />

      <Hero
        photo={owner.photos.hero}
        eyebrow={home.hero.eyebrow}
        h1={home.hero.h1}
        lede={home.hero.lede}
        trust={home.hero.trust}
        ctas={
          <>
            <a href="#book" className="btn btn-accent">
              {home.hero.bookLabel} <span>→</span>
            </a>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              {home.hero.callLabel}
            </a>
          </>
        }
      />
      <RepairSection />
      <FamilySection />

      <section id="pricing" className="section section-light-2">
        <SectionHead tone="light" eyebrow={home.pricing.eyebrow} h2={home.pricing.h2} />
        <ProblemCardGrid variant="light" items={[...home.pricing.items]} />
      </section>

      <ReviewsSection />
      <BrandsSection />

      <section id="areas" className="section section-light">
        <SectionHead tone="light" eyebrow={home.areas.eyebrow} h2={home.areas.h2} h2Style={H2_CLAMP} />
        <ChipRow items={whereWeWork.chips} />
      </section>

      {guides.length > 0 && (
        <section id="guides" className="section section-light-2">
          <SectionHead tone="light" eyebrow={home.guides.eyebrow} h2={home.guides.h2} h2Style={H2_CLAMP} />
          <ChipRow items={guides.map((a) => ({ label: a.title, href: articlePath(a.slug) }))} />
        </section>
      )}

      <section id="faq" className={`section ${guides.length > 0 ? "section-light" : "section-light-2"}`}>
        <SectionHead tone="light" eyebrow={home.faq.eyebrow} h2={home.faq.h2} />
        <FaqAccordion items={[...home.faq.items]} style={{ maxWidth: 760 }} />
      </section>

      <BookSection id="book" eyebrow={home.book.eyebrow} h2={home.book.h2} body={home.book.body} facts={home.book.facts}>
        <HomeBookForm phone={business.phone} />
      </BookSection>
    </>
  );
}
