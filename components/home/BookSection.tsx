import { business } from "@/data/business";
import { home } from "@/data/home";
import { BookForm } from "@/components/BookForm";
import { richProps } from "@/components/ui/rich-text";

// `#book` — `.book-grid` with the `.book-copy` column ported 1:1 from index.html (copy in
// data/home) and the form column rendered by <BookForm/>. Lives inside <BookingProvider>
// so the form picks up an appliance preset from a #repair card click and the
// "I'm contacting you as a…" preset from the #business-cta button.
export function BookSection() {
  const copy = home.book;
  return (
    <section id="book" className="section section-dark-2">
      <div className="book-grid">
        <div className="book-copy">
          <div
            className="eyebrow"
            style={{ color: "var(--accent)", marginBottom: 20 }}
          >
            {copy.eyebrow}
          </div>
          <h2 {...richProps(copy.h2)} />
          <p>{copy.body}</p>
          <a href={business.phoneHref} className="book-phone">
            {business.phone}
          </a>
          <div className="book-facts">
            {copy.facts.map((fact) => (
              <div key={fact.k} className="fact">
                <div className="k">{fact.k}</div>
                <div className="v">{fact.v}</div>
              </div>
            ))}
          </div>
        </div>

        <BookForm />
      </div>
    </section>
  );
}
