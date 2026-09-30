import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { EntryLink } from "@/components/EntryLink";
import { EntryPanelsFx } from "@/components/EntryPanelsFx";
import { businessNode, graph, websiteNode } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { entryPage, entryPanels } from "@/data/entry";
import { richProps } from "@/components/ui/rich-text";

// openGraph defaults are inherited from app/layout.tsx.
export const metadata: Metadata = pageMetadata({ ...entryPage.seo, path: "/" });

// The entry page (ADR 0022): one H1 and two panels — For Business (left / on top, primary,
// accent button) and For Homes. Plain server HTML: every choice is an <a>, nothing redirects,
// nothing waits for JS; EntryLink only adds the GA4 `branch_select` event on click.
// Layout variant: `.branch-entry--split` (60/40, chosen by the owner) — see ADR 0022.
export default function EntryPage() {
  return (
    <>
      {/* image: the owner's photo in the For Homes panel; the business as in the shared graph. */}
      <JsonLd data={graph(businessNode({ image: true }), websiteNode())} />
      <main className="branch-entry branch-entry--split">
        <h1 className="branch-entry-h1" {...richProps(entryPage.h1)} />
        <EntryPanelsFx>
          {entryPanels().map((panel, i) => (
            <section
              key={panel.branch}
              className={`branch-panel branch-panel--${panel.branch}`}
              aria-labelledby={`branch-${panel.branch}`}
            >
              <Image
                className="branch-panel-photo"
                src={panel.photo.src}
                alt={panel.photo.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 900px) 100vw, 60vw"
              />
              <div className="branch-panel-scrim" />
              <div className="branch-panel-content">
                <div className="eyebrow" style={{ color: "var(--accent)" }}>
                  {panel.eyebrow}
                </div>
                <h2 id={`branch-${panel.branch}`} {...richProps(panel.h2)} />
                <p className="branch-panel-text">{panel.text}</p>
                <EntryLink
                  branch={panel.branch}
                  href={panel.cta.href}
                  className={panel.branch === "business" ? "btn btn-accent" : "btn btn-ghost-dark"}
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
          ))}
        </EntryPanelsFx>
      </main>
    </>
  );
}
