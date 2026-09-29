"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bookingPreset } from "./commercial/booking-link";

// Ports the old js/main.js `[data-appliance]` preset without a global DOM lookup:
// a #repair card calls setAppliance(name), BookForm reads `appliance` and presets
// its <select>. `contactAs` does the same for "I'm contacting you as a…" (spec §9,
// story 51). On mount the provider also reads `?as=` / `?appliance=` from the URL —
// on the client, so the home page stays SSG — and keeps only real form options;
// anything unknown is ignored.

type BookingContextValue = {
  appliance: string | null;
  setAppliance: (appliance: string | null) => void;
  contactAs: string | null;
  setContactAs: (contactAs: string | null) => void;
};

const BookingContext = createContext<BookingContextValue>({
  appliance: null,
  setAppliance: () => {},
  contactAs: null,
  setContactAs: () => {},
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appliance, setAppliance] = useState<string | null>(null);
  const [contactAs, setContactAs] = useState<string | null>(null);

  useEffect(() => {
    const preset = bookingPreset(window.location.search);
    if (preset.appliance) setAppliance(preset.appliance);
    if (preset.contactAs) setContactAs(preset.contactAs);
  }, []);

  const value = useMemo(
    () => ({ appliance, setAppliance, contactAs, setContactAs }),
    [appliance, contactAs],
  );
  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  return useContext(BookingContext);
}
