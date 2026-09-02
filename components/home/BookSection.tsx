import { business } from "@/data/business";
import { BookForm } from "@/components/BookForm";

// `#book` — `.book-grid` with the `.book-copy` column ported 1:1 from index.html and
// the form column rendered by <BookForm/> (task 04), which already includes the new
// "I'm contacting you as a…" <select>. Lives inside <BookingProvider> so the form
// picks up an appliance preset from a #repair card click.
export function BookSection() {
  return (
    <section id="book" className="section section-dark">
      <div className="book-grid">
        <div className="book-copy">
          <div
            className="eyebrow"
            style={{ color: "var(--accent)", marginBottom: 20 }}
          >
            06 / Book
          </div>
          <h2>
            Back to what
            <br />
            matters most.
          </h2>
          <p>
            We handle the repair. You enjoy your day. Book online and save 10% —
            or call and talk to us directly.
          </p>
          <a href={business.phoneHref} className="book-phone">
            {business.phone}
          </a>
          <div className="book-facts">
            <div className="fact">
              <div className="k">$75</div>
              <div className="v">
                Diagnostic fee — waived completely if you proceed with the
                repair.
              </div>
            </div>
            <div className="fact">
              <div className="k">10%</div>
              <div className="v">
                Off when you book online instead of calling.
              </div>
            </div>
            <div className="fact">
              <div className="k">Same day</div>
              <div className="v">
                Slots available daily, 8AM – 8PM, weekends included.
              </div>
            </div>
          </div>
        </div>

        <BookForm />
      </div>
    </section>
  );
}
