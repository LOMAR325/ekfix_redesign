import { branchPaths } from "@/data/site";
import { businessEquipmentOptions, businessTypeOptions, homeApplianceOptions } from "@/lib/book/options";

// Form presets carried in a URL (ADR 0023). A page that sends a visitor to a form builds the
// link here; the form reads the same parameters on mount — both sides live in this module so
// the parameter names can't drift. Plain module (no "use client"): server pages build hrefs,
// the client forms parse. Only real options of the form are accepted; anything else is ignored.

const APPLIANCE = "appliance";
const TYPE = "type";
const EQUIPMENT = "equipment";

const withParams = (base: string, anchor: string, params: Record<string, string | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const query = q.toString();
  return `${base}${query ? `?${query}` : ""}${anchor}`;
};

/** `/appliance-repair[?appliance=…]#book` — the home form, the appliance preselected. */
export function homeBookingHref(preset: { appliance?: string } = {}): string {
  return withParams(branchPaths.home.root, "#book", { [APPLIANCE]: preset.appliance });
}

/** `/commercial-appliance-repair[?type=…&equipment=…]#request` — the business form, preset. */
export function businessRequestHref(preset: { businessType?: string; equipment?: string } = {}): string {
  return withParams(branchPaths.business.root, "#request", {
    [TYPE]: preset.businessType,
    [EQUIPMENT]: preset.equipment,
  });
}

const pick = (value: string | null, options: readonly string[]) =>
  value && options.includes(value) ? value : null;

export function readHomePreset(search: string): { appliance: string | null } {
  return { appliance: pick(new URLSearchParams(search).get(APPLIANCE), homeApplianceOptions) };
}

export function readBusinessPreset(search: string): { businessType: string | null; equipment: string | null } {
  const params = new URLSearchParams(search);
  return {
    businessType: pick(params.get(TYPE), businessTypeOptions),
    equipment: pick(params.get(EQUIPMENT), businessEquipmentOptions),
  };
}
