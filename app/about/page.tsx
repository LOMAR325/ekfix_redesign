import type { Metadata } from "next";
import { business } from "@/data/business";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { Anchor } from "@/components/ui/anchor";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHead } from "@/components/ui/section-head";
import { Prose } from "@/components/ui/prose";
import { StatRow } from "@/components/ui/stat-row";
import { LocalPhoto } from "@/components/ui/local-photo";
import { ProblemCardGrid } from "@/components/ui/problem-card-grid";
import { PhotoPair } from "@/components/ui/photo-pair";
import { CtaBand } from "@/components/ui/cta-band";

// /about — ported 1:1 from about.html. Editorial copy lives here (there is no
// data/about module and this page owns its own prose); NAP values still come
// from data/business via the shared components.
export const metadata: Metadata = pageMetadata({
  title: "Our Story — Meet Konstantin | EK Global Appliance Repair",
  description:
    "EK Global is run by Konstantin, a Charlotte-based, EPA Universal certified technician with 10+ years of experience. Family business, not a franchise.",
  path: "/about",
});

const meetKonstantin = [
  "Konstantin has spent more than 10 years repairing home and commercial appliances around Charlotte. He's an EPA Universal certified technician and OSHA certified, which means he's qualified to handle everything from a leaking dishwasher to a commercial walk-in compressor — the kind of certification most local outfits don't bother to hold.",
  "He lives in the Ballantyne area with his family, and EK Global is genuinely a family operation — not a lead-generation site that dispatches whoever's available. When you call, you're talking to the technician who shows up at your door, and the same person who comes back if something isn't right.",
  "That's the whole pitch: real diagnostics, original parts, honest pricing, and a warranty on every job — from a homeowner's refrigerator to a restaurant's walk-in freezer.",
];

const whatThatMeans = [
  {
    num: "01",
    title: "One technician, start to finish",
    body: "The person who diagnoses your appliance is the same person who repairs it and the same person you'd call back if anything felt off. No hand-offs.",
  },
  {
    num: "02",
    title: "Certified, not just experienced",
    body: "EPA Universal and OSHA certification means proper refrigerant handling and safety practices on every job — residential and commercial.",
  },
  {
    num: "03",
    title: "Local, and it shows",
    body: "Based in Ballantyne, working across Charlotte and the surrounding NC/SC towns. We show up at neighborhood events — we're not a call center in another state.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Our Story", url: "/about" },
        ])}
      />

      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Our Story" }]}
        h1="A family business,<br><span>not a franchise.</span>"
        lede="EK Global is run by Konstantin — the person who answers the phone, does the diagnostic, and comes back if something isn't right. No call center, no subcontractors, no ticket numbers."
        ctas={
          <>
            <Anchor href="/#book" className="btn btn-accent">
              Book a Repair
            </Anchor>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              Call {business.phone}
            </a>
          </>
        }
      />

      <section className="section section-light">
        <div className="two-col">
          <Prose heading="Meet Konstantin" paragraphs={meetKonstantin}>
            <StatRow
              stats={[
                { k: "10+ yrs", v: "Hands-on repair experience" },
                { k: "EPA Universal", v: "Certified technician" },
                { k: "OSHA", v: "Certified & fully insured" },
              ]}
            />
          </Prose>
          <LocalPhoto
            src="/images/konstantin_thermador.webp"
            alt="Konstantin, EK Global owner and lead technician"
            imgStyle={{ background: "var(--bg-light-2)" }}
          />
        </div>
      </section>

      <section className="section section-dark">
        <SectionHead
          tone="dark"
          eyebrow="Why it matters"
          h2="What that means<br>for your repair."
        />
        <ProblemCardGrid variant="dark" items={whatThatMeans} />
      </section>

      <section className="section section-light">
        <SectionHead
          tone="light"
          eyebrow="On the job"
          h2="Homes, restaurants,<br>and everything between."
          style={{ marginBottom: 30 }}
        />
        <PhotoPair
          style={{ marginTop: 0 }}
          photos={[
            {
              src: "/images/kostia_reast.webp",
              alt: "Konstantin repairing commercial kitchen equipment",
              caption: "Restaurant kitchen — commercial dishwasher",
              figureStyle: { height: 280 },
            },
            {
              src: "/images/kostia-laundry.webp",
              alt: "Konstantin repairing commercial laundry equipment on a rooftop unit",
              caption: "Commercial laundry — rooftop equipment",
              objectPosition: "30% 75%",
              figureStyle: { height: 280 },
            },
          ]}
        />
      </section>

      <CtaBand
        h2="Talk to the person<br>doing the repair."
        body="No dispatch queue. Call Konstantin directly, or book online in under a minute."
      />
    </>
  );
}
