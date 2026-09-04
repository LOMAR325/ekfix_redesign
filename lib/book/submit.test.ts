import { afterEach, describe, expect, it, vi } from "vitest";
import { submitLead } from "./submit";
import { ConsoleLeadSink, EmailLeadSink, WebhookLeadSink } from "./sinks";

const validInput = {
  name: "Jane Manager",
  phone: "(980) 555-0134",
  appliance: "Refrigerator",
  contactAs: "Property Manager",
  message: "Walk-in cooler not holding temp",
};

describe("submitLead", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("accepts a valid lead and calls the console sink", async () => {
    const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
    const result = await submitLead(validInput);
    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("rejects an empty name and calls no sink", async () => {
    const consoleSend = vi
      .spyOn(ConsoleLeadSink.prototype, "send")
      .mockResolvedValue();
    const emailSend = vi.spyOn(EmailLeadSink.prototype, "send").mockResolvedValue();
    const webhookSend = vi
      .spyOn(WebhookLeadSink.prototype, "send")
      .mockResolvedValue();

    const result = await submitLead({ ...validInput, name: "" });

    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.errors.name).toBeTruthy();
    expect(consoleSend).not.toHaveBeenCalled();
    expect(emailSend).not.toHaveBeenCalled();
    expect(webhookSend).not.toHaveBeenCalled();
  });

  it("rejects a blank phone", async () => {
    const result = await submitLead({ ...validInput, phone: "   " });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.errors.phone).toBeTruthy();
  });

  it("rejects an appliance that is not in the option list", async () => {
    const result = await submitLead({ ...validInput, appliance: "Toaster" });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.errors.appliance).toBeTruthy();
  });

  it("still accepts the lead when a sink throws", async () => {
    vi.spyOn(ConsoleLeadSink.prototype, "send").mockRejectedValue(
      new Error("sink down"),
    );
    const result = await submitLead(validInput);
    expect(result).toEqual({ ok: true });
  });
});
