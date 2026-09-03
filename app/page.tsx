import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { businessJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { BookingProvider } from "@/components/BookingProvider";
import { Hero } from "@/components/home/Hero";
import { WhoWeServeGrid } from "@/components/home/WhoWeServeGrid";
import { RepairSection } from "@/components/home/RepairSection";
import { FamilySection } from "@/components/home/FamilySection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { TrustBand } from "@/components/home/TrustBand";
import { BrandsSection } from "@/components/home/BrandsSection";
import { BusinessCtaBand } from "@/components/home/BusinessCtaBand";
import { BookSection } from "@/components/home/BookSection";

// <title>/<meta description> unchanged from the current index.html (spec story 35);
// openGraph defaults are inherited from app/layout.tsx.
export const metadata: Metadata = pageMetadata({
  title: "EK Global — Same-Day Appliance Repair in Charlotte, NC",
  description:
    "Family-owned appliance repair in Charlotte, NC and surrounding towns. EPA 608 & OSHA certified technicians, same-day service, $75 diagnostic waived with repair.",
  path: "/",
});

// Home page. Static (SSG) — no dynamic/revalidate. Section order follows ticket 06:
// hero → #who-we-serve (new) → #repair → #family → #reviews → #trust-b2b (new) →
// #brands → #business-cta (new) → #book. Businesses appear before homeowners in
// every block where both segments show up (hero, #who-we-serve, #brands, the form).
export default function HomePage() {
  return (
    <>
      <JsonLd data={[businessJsonLd()]} />
      <BookingProvider>
        <Hero />
        <WhoWeServeGrid />
        <RepairSection />
        <FamilySection />
        <ReviewsSection />
        <TrustBand />
        <BrandsSection />
        <BusinessCtaBand />
        <BookSection />
      </BookingProvider>
    </>
  );
}
