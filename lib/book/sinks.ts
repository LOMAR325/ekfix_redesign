import type { LeadInput, LeadSink } from "@/data/types";

// Delivery adapters behind one interface. The owner turns real delivery on by
// filling .env — the route and the form never change (see docs/adr/0010).
//
// ConsoleLeadSink is always on (writes the lead to the server log).
// EmailLeadSink posts to the Resend REST API once RESEND_API_KEY and
// BOOK_NOTIFY_EMAIL are set. WebhookLeadSink posts the raw lead JSON once
// BOOK_WEBHOOK_URL is set. A channel that fails is logged and swallowed — a
// failed delivery must never fail the lead (submitLead also isolates each sink
// via Promise.allSettled).

// One place for "try to deliver, never throw, leave a trace on failure" so every
// sink handles its own failure identically.
async function deliver(name: string, run: () => Promise<void>): Promise<void> {
  try {
    await run();
  } catch (error) {
    console.warn(`[book] ${name} sink delivery failed`, error);
  }
}

// Email copy per branch. A business lead is tagged "[BUSINESS]" so it stands
// out in the inbox; an empty message reads as "—".
const orDash = (value: string | undefined) => value || "—";

export function emailSubject(lead: LeadInput): string {
  return lead.branch === "business"
    ? `[BUSINESS] Commercial service request — ${lead.name}, ${lead.address}`
    : `New home repair request — ${lead.name}, ${lead.address}`;
}

export function emailLines(lead: LeadInput): string[] {
  return [
    `Branch: ${lead.branch}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Address: ${lead.address}`,
    `Message: ${orDash(lead.message)}`,
  ];
}

export class ConsoleLeadSink implements LeadSink {
  readonly name = "console";
  readonly enabled = true;

  async send(lead: LeadInput): Promise<void> {
    // Every field, an absent message as "" — the log shape is stable.
    console.info("[book] new lead", {
      branch: lead.branch,
      name: lead.name,
      phone: lead.phone,
      address: lead.address,
      message: lead.message ?? "",
    });
  }
}

export class EmailLeadSink implements LeadSink {
  readonly name = "email";
  readonly enabled =
    Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.BOOK_NOTIFY_EMAIL);

  async send(lead: LeadInput): Promise<void> {
    await deliver(this.name, async () => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          // onboarding@resend.dev works for test sends to your own address.
          // TODO: владелец — подтверждённый домен-отправитель в Resend.
          from: "EK Global <onboarding@resend.dev>",
          to: [process.env.BOOK_NOTIFY_EMAIL],
          subject: emailSubject(lead),
          text: emailLines(lead).join("\n"),
        }),
      });
      if (!response.ok) {
        throw new Error(`Resend responded ${response.status}`);
      }
    });
  }
}

export class WebhookLeadSink implements LeadSink {
  readonly name = "webhook";
  readonly enabled = Boolean(process.env.BOOK_WEBHOOK_URL);

  async send(lead: LeadInput): Promise<void> {
    const url = process.env.BOOK_WEBHOOK_URL;
    if (!url) return;
    await deliver(this.name, async () => {
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
    });
  }
}

// Instantiated once. submitLead() iterates the enabled ones.
export const sinks: LeadSink[] = [
  new ConsoleLeadSink(),
  new EmailLeadSink(),
  new WebhookLeadSink(),
];
