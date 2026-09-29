import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { businessNode, graph, websiteNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { home, homeWhereWeWork } from "@/data/home";
import { BookingProvider } from "@/components/BookingProvider";
import { Hero } from "@/components/home/Hero";
import { WhoWeServeGrid } from "@/components/home/WhoWeServeGrid";
import { CommercialEquipmentSection } from "@/components/home/CommercialEquipmentSection";
import { TrustBand } from "@/components/home/TrustBand";
import { RepairSection } from "@/components/home/RepairSection";
import { FamilySection } from "@/components/home/FamilySection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { BusinessCtaBand } from "@/components/home/BusinessCtaBand";
import { BookSection } from "@/components/home/BookSection";

// openGraph defaults are inherited from app/layout.tsx.
export const metadata: Metadata = pageMetadata({ ...home.seo, path: "/" });

// Home page. Static (SSG) — no dynamic/revalidate; `?as=` / `?appliance=` are read on the
// client by BookingProvider. Commercial first (spec §7, story 43), tones alternate:
// hero (dark) → #who-we-serve (light-2) → #commercial-equipment (light) → #trust-b2b (dark)
// → #repair (light) → #family (dark) → #reviews (light) → #brands (dark-2) →
// #business-cta (cta-band, dark) → #book (dark-2).
export default function HomePage() {
  // One list for the "Where we work" chips and the business node's areaServed (story 43a).
  const whereWeWork = homeWhereWeWork();
  return (
    <>
      {/* image: the owner's hero photo; aggregateRating: the reviews are shown here;
          areaServed: exactly the places the "Where we work" block links to. */}
      <JsonLd
        data={graph(
          businessNode({ aggregateRating: true, image: true, areaServed: whereWeWork.areaServed }),
          websiteNode(),
        )}
      />
      <BookingProvider>
        <Hero />
        <WhoWeServeGrid />
        <CommercialEquipmentSection />
        <TrustBand />
        <RepairSection />
        <FamilySection areas={whereWeWork.chips} />
        <ReviewsSection />
        <BrandsSection />
        <BusinessCtaBand />
        <BookSection />
      </BookingProvider>
    </>
  );
}
