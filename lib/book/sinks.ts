import type { LeadInput, LeadSink } from "@/data/types";

// Delivery adapters behind one interface. The owner wires real delivery later by
// filling in .env — the route and the form never change.
//
// Prototype status (owner decision 2026-09-01): only ConsoleLeadSink is active.
// EmailLeadSink is a stub (no network). WebhookLeadSink posts for real but is off
// unless BOOK_WEBHOOK_URL is set.

export class ConsoleLeadSink implements LeadSink {
  readonly name = "console";
  readonly enabled = true;

  async send(lead: LeadInput): Promise<void> {
    console.info("[book] new lead", {
      name: lead.name,
      phone: lead.phone,
      appliance: lead.appliance,
      contactAs: lead.contactAs,
      message: lead.message ?? "",
    });
  }
}

export class EmailLeadSink implements LeadSink {
  readonly name = "email";
  readonly enabled =
    Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.BOOK_NOTIFY_EMAIL);

  async send(_lead: LeadInput): Promise<void> {
    // TODO: подключить Resend — send process.env.BOOK_NOTIFY_EMAIL a notification.
    // Intentionally a no-op stub for the prototype: makes no network calls.
  }
}

export class WebhookLeadSink implements LeadSink {
  readonly name = "webhook";
  readonly enabled = Boolean(process.env.BOOK_WEBHOOK_URL);

  async send(lead: LeadInput): Promise<void> {
    const url = process.env.BOOK_WEBHOOK_URL;
    if (!url) return;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      // A webhook failure must never fail the lead — but leave a trace so a
      // silently-broken delivery is diagnosable.
      console.warn(`[book] ${this.name} sink delivery failed`, error);
    }
  }
}

// Instantiated once. submitLead() iterates the enabled ones.
export const sinks: LeadSink[] = [
  new ConsoleLeadSink(),
  new EmailLeadSink(),
  new WebhookLeadSink(),
];
