import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { EntryLink } from "@/components/EntryLink";
import { EntryPanelsFx } from "@/components/EntryPanelsFx";
import { ChipRow } from "@/components/ui/chip-row";
import { Stars } from "@/components/ui/stars";
import { businessNode, graph, websiteNode } from "@/lib/jsonld";
import { getReviews } from "@/lib/google-reviews";
import { pageMetadata } from "@/lib/seo";
import { entryPage, entryPanels } from "@/data/entry";
import { site } from "@/data/site";
import { richProps } from "@/components/ui/rich-text";

// openGraph defaults are inherited from app/layout.tsx.
export const metadata: Metadata = pageMetadata({ ...entryPage.seo, path: "/" });

// The entry page (ADR 0022): one H1 and two panels — For Business (left / on top, primary,
// accent button) and For Homes. Plain server HTML: every choice is an <a>, nothing redirects,
// nothing waits for JS; EntryLink only adds the GA4 `branch_select` event on click.
// Layout variant: `.branch-entry--split` (60/40, chosen by the owner) — see ADR 0022.
// "Night / day" (2026-11-01, ADR 0002): the business panel is the night — a full-bleed photo under a
// dark scrim, a checklist of facts (`proof`) before the accent button; the home panel is the day —
// `--bg-light`, the owner's photo in a rounded frame without a scrim, dark text and a dark button.
// The rating next to the H1 is Google's only (ADR 0024): `getReviews()` — live with
// GOOGLE_PLACES_API_KEY, otherwise the dated snapshot; no rating → no block, and no
// `aggregateRating` in the JSON-LD.
export default async function EntryPage() {
  const reviews = await getReviews();
  return (
    <>
      {/* image: the owner's photo in the For Homes panel; the business as in the shared graph. */}
      <JsonLd data={graph(businessNode({ image: true }), websiteNode())} />
      <main className="branch-entry branch-entry--split">
        <div className="branch-entry-top">
          <h1 className="branch-entry-h1" {...richProps(entryPage.h1)} />
          {reviews.rating && (
            <div className="branch-entry-rating">
              <span className="num">{reviews.rating.value.toFixed(1)}</span>
              <span>
                <Stars as="span" />
                <small>
                  {site.ratingBadgeCountLabel(reviews.rating.count)} · {entryPage.trustNote}
                </small>
              </span>
            </div>
          )}
        </div>
        <EntryPanelsFx>
          {entryPanels().map((panel, i) => {
            const isBusiness = panel.branch === "business";
            const photo = (
              <Image
                className="branch-panel-photo"
                src={panel.photo.src}
                alt={panel.photo.alt}
                fill
                priority={i === 0}
                sizes={isBusiness ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 40vw"}
              />
            );
            return (
              <section
                key={panel.branch}
                className={`branch-panel branch-panel--${panel.branch}`}
                aria-labelledby={`branch-${panel.branch}`}
              >
                {isBusiness ? (
                  <>
                    {photo}
                    <div className="branch-panel-scrim" />
                  </>
                ) : (
                  <div className="branch-panel-frame">{photo}</div>
                )}
                <div className="branch-panel-content">
                  <div className="eyebrow" style={isBusiness ? { color: "var(--accent)" } : undefined}>
                    {panel.eyebrow}
                  </div>
                  <h2 id={`branch-${panel.branch}`} {...richProps(panel.h2)} />
                  <p className="branch-panel-text">{panel.text}</p>
                  {panel.proof && <ChipRow items={panel.proof} tone="dark" />}
                  <EntryLink
                    branch={panel.branch}
                    href={panel.cta.href}
                    className={isBusiness ? "btn btn-accent" : "btn branch-btn-dark"}
                  >
                    {panel.cta.label} <span className="branch-arrow" aria-hidden="true">→</span>
                  </EntryLink>
                  <div className="branch-panel-links">
                    <span className="branch-panel-links-label">{entryPage.linksLabel}</span>
                    {panel.links.map((link) => (
                      <EntryLink key={link.href} branch={panel.branch} href={link.href}>
                        {link.label}
                      </EntryLink>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </EntryPanelsFx>
      </main>
    </>
  );
}
