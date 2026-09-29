import type { ContactAsOption } from "@/data/types";
import { applianceFormOptions, contactAsOptions } from "@/lib/book/options";

// The form preset carried in a URL (spec §9, story 51): commercial CTAs outside the home
// page link to `/?as=<contactAs>[&appliance=<formLabel>]#book`; BookingProvider reads the
// same two parameters on mount. Both sides live here so the parameter names can't drift.
// Plain module (no "use client") — server pages build hrefs, the client provider parses.

const AS = "as";
const APPLIANCE = "appliance";

/** `/?as=…[&appliance=…]#book` — the home booking form with the options preselected. */
export function bookingHref(preset: { contactAs: ContactAsOption; appliance?: string }): string {
  const params = new URLSearchParams({ [AS]: preset.contactAs });
  if (preset.appliance) params.set(APPLIANCE, preset.appliance);
  return `/?${params.toString()}#book`;
}

/** Reads a `location.search`; keeps only values that are real options of the form. */
export function bookingPreset(search: string): { contactAs: string | null; appliance: string | null } {
  const params = new URLSearchParams(search);
  const as = params.get(AS);
  const appliance = params.get(APPLIANCE);
  return {
    contactAs: as && (contactAsOptions as readonly string[]).includes(as) ? as : null,
    appliance: appliance && applianceFormOptions.includes(appliance) ? appliance : null,
  };
}
