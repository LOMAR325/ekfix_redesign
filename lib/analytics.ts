// GA4 events of the two-branch site (ADR 0023). `gtag` is defined by components/Analytics once
// the tag loads; before that (or with analytics blocked) an event is simply dropped — tracking
// never blocks a link or a form. Client-side only.

export type AnalyticsEvent =
  | { name: "branch_select"; params: { branch: "business" | "home" } }
  | { name: "commercial_form_submit"; params: { business_type: string } }
  | { name: "residential_form_submit"; params: { appliance: string } };

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  // transport_type beacon: the event survives the page navigating away (entry-page links).
  if (typeof gtag === "function") gtag("event", event.name, { ...event.params, transport_type: "beacon" });
}
