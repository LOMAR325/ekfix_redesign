import { business } from "@/data/business";
import { familyBusinessSentence } from "@/data/b2b-segments";
import { PhotoPair } from "@/components/ui/photo-pair";

// `#family` — ported 1:1 from index.html. The only B2B change (spec story 26) is the
// extra `.family-copy` sentence from data/b2b-segments.familyBusinessSentence,
// added after the existing paragraph.
export function FamilySection() {
  return (
    <section id="family" className="section section-dark">
      <div className="family-grid">
        <div className="family-copy">
          <div
            className="eyebrow"
            style={{ color: "var(--accent)", marginBottom: 20 }}
          >
            03 / Who we are
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(34px, 4vw, 58px)",
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-2.4px",
            }}
          >
            A family business,
            <br />
            not a call center.
          </h2>
          <p>
            EK Global is run by Konstantin and his family, right here in
            Charlotte. You talk to the person who does the repair — no ticket
            numbers, no dispatch queue. We show up at neighborhood fairs, and we
            see our customers again at the grocery store. That&apos;s the reason
            we do every job properly the first time.
          </p>
          <p>{familyBusinessSentence}</p>
          <div className="family-stats">
            <div>
              <div className="k">Certified</div>
              <div className="v">EPA 608 &amp; OSHA</div>
            </div>
            <div>
              <div className="k">Warranty</div>
              <div className="v">On every repair</div>
            </div>
            <div>
              <div className="k">Insured</div>
              <div className="v">Fully covered</div>
            </div>
            <div>
              <div className="k">Discounts</div>
              <div className="v">Veterans &amp; seniors</div>
            </div>
          </div>
          <div className="family-ctas">
            <a href="#book" className="btn btn-accent">
              Book a Repair
            </a>
            <a href={business.phoneHref} className="btn btn-ghost-dark">
              Talk to Konstantin
            </a>
          </div>
        </div>
        <div>
          <div className="quote-card">
            <div className="mark">&ldquo;</div>
            <p>
              I answer the phone, I do the diagnostic, and I&apos;m the one who
              comes back if something isn&apos;t right. That&apos;s the whole
              promise.
            </p>
            <div className="who">
              <div className="quote-avatar">K</div>
              <div>
                <strong>Konstantin</strong>
                <span>Owner · EPA 608 &amp; OSHA certified</span>
              </div>
            </div>
          </div>
          <PhotoPair
            photos={[
              {
                src: "/images/kostia_reast.webp",
                alt: "Konstantin on a service call in a restaurant kitchen",
                caption: "On a service call — restaurant kitchen",
              },
              {
                src: "/images/kostia-laundry.webp",
                alt: "Konstantin repairing commercial laundry equipment on a rooftop",
                caption: "Commercial laundry repair",
                objectPosition: "30% 75%",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
