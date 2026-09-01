"use client";

import { createContext, useContext, useMemo, useState } from "react";

// Ports the old js/main.js `[data-appliance]` preset without a global DOM lookup:
// a #repair card calls setAppliance(name), BookForm reads `appliance` and presets
// its <select>. Task 06 wraps the relevant home sections in <BookingProvider>.

type BookingContextValue = {
  appliance: string | null;
  setAppliance: (appliance: string | null) => void;
};

const BookingContext = createContext<BookingContextValue>({
  appliance: null,
  setAppliance: () => {},
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [appliance, setAppliance] = useState<string | null>(null);
  const value = useMemo(() => ({ appliance, setAppliance }), [appliance]);
  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  return useContext(BookingContext);
}
