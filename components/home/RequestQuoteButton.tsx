"use client";

import type { ContactAsOption } from "@/data/types";
import { useBooking } from "@/components/BookingProvider";

// The home page's commercial CTA (spec §9, stories 51/53): on the home page the form is
// right below, so the button presets "I'm contacting you as a…" through the booking
// context and scrolls to #book — no `/?as=` navigation.
export function RequestQuoteButton({
  label,
  contactAs,
}: {
  label: string;
  contactAs: ContactAsOption;
}) {
  const { setContactAs } = useBooking();
  return (
    <a href="#book" className="btn btn-accent" onClick={() => setContactAs(contactAs)}>
      {label}
    </a>
  );
}
