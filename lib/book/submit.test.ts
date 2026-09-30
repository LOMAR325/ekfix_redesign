import { afterEach, describe, expect, it, vi } from "vitest";
import { submitLead } from "./submit";
import { ConsoleLeadSink, EmailLeadSink, WebhookLeadSink } from "./sinks";

const homeInput = {
  branch: "home",
  name: "Jane Doe",
  phone: "(980) 555-0134",
  address: "123 Main St, Charlotte, NC",
  message: "Fridge not cooling",
};

const businessInput = {
  branch: "business",
  name: "Jane Manager",
  phone: "(980) 555-0134",
  address: "500 Trade St, Charlotte, NC",
  message: "Walk-in cooler not holding temp",
};

function spyAllSinks() {
  return {
    console: vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue(),
    email: vi.spyOn(EmailLeadSink.prototype, "send").mockResolvedValue(),
    webhook: vi.spyOn(WebhookLeadSink.prototype, "send").mockResolvedValue(),
  };
}

async function errorsFor(input: unknown): Promise<Record<string, string>> {
  const result = await submitLead(input);
  expect(result.ok).toBe(false);
  return result.ok === false ? result.errors : {};
}

describe("submitLead", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("branch", () => {
    it("rejects a lead without a branch, keyed on branch, and calls no sink", async () => {
      const send = spyAllSinks();
      const { branch: _omit, ...noBranch } = homeInput;
      expect(await errorsFor(noBranch)).toEqual({
        branch: "Please choose home or business",
      });
      expect(send.console).not.toHaveBeenCalled();
      expect(send.email).not.toHaveBeenCalled();
      expect(send.webhook).not.toHaveBeenCalled();
    });

    it("rejects an unknown branch with the same message", async () => {
      expect(await errorsFor({ ...homeInput, branch: "industrial" })).toEqual({
        branch: "Please choose home or business",
      });
    });

    it("rejects a non-object body with the branch message", async () => {
      expect(await errorsFor(null)).toEqual({
        branch: "Please choose home or business",
      });
      expect(await errorsFor("home")).toEqual({
        branch: "Please choose home or business",
      });
    });
  });

  describe.each([
    ["home", homeInput],
    ["business", businessInput],
  ] as const)("%s", (_branch, input) => {
    it("accepts a valid lead and passes the parsed lead to the console sink", async () => {
      const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
      const result = await submitLead({ ...input, phone: "  (980)   555-0134 " });
      expect(result).toEqual({ ok: true });
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(input);
    });

    it("accepts a lead without a message", async () => {
      const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
      const { message: _omit, ...noMessage } = input;
      expect(await submitLead(noMessage)).toEqual({ ok: true });
      expect(send.mock.calls[0][0].message).toBeUndefined();
    });

    it("accepts an empty message", async () => {
      spyAllSinks();
      expect(await submitLead({ ...input, message: "" })).toEqual({ ok: true });
    });

    it("rejects an empty name and calls no sink", async () => {
      const send = spyAllSinks();
      expect(await errorsFor({ ...input, name: "" })).toEqual({
        name: "Please enter your name",
      });
      expect(send.console).not.toHaveBeenCalled();
      expect(send.email).not.toHaveBeenCalled();
      expect(send.webhook).not.toHaveBeenCalled();
    });

    it("rejects a missing name", async () => {
      const { name: _omit, ...rest } = input;
      expect(await errorsFor(rest)).toEqual({ name: "Please enter your name" });
    });

    it("rejects a missing phone", async () => {
      const { phone: _omit, ...rest } = input;
      expect(await errorsFor(rest)).toEqual({ phone: "Please enter a phone number" });
    });

    it("rejects a blank phone", async () => {
      expect(await errorsFor({ ...input, phone: "   " })).toEqual({
        phone: "Please enter a phone number",
      });
    });

    it("rejects a missing address", async () => {
      const { address: _omit, ...rest } = input;
      expect(await errorsFor(rest)).toEqual({ address: "Please enter the address" });
    });

    it("rejects a whitespace-only address", async () => {
      expect(await errorsFor({ ...input, address: "   " })).toEqual({
        address: "Please enter the address",
      });
    });

    it("rejects an address longer than 300 characters", async () => {
      expect(await errorsFor({ ...input, address: "x".repeat(301) })).toEqual({
        address: "Please keep the address under 300 characters",
      });
    });

    it("rejects a message longer than 2000 characters", async () => {
      expect(await errorsFor({ ...input, message: "x".repeat(2001) })).toEqual({
        message: "Please keep the notes under 2000 characters",
      });
    });

    it("keys each missing required field separately", async () => {
      expect(await errorsFor({ branch: input.branch, phone: "" })).toEqual({
        name: "Please enter your name",
        phone: "Please enter a phone number",
        address: "Please enter the address",
      });
    });
  });

  it("still accepts the lead when a sink throws", async () => {
    vi.spyOn(ConsoleLeadSink.prototype, "send").mockRejectedValue(
      new Error("sink down"),
    );
    expect(await submitLead(homeInput)).toEqual({ ok: true });
    expect(await submitLead(businessInput)).toEqual({ ok: true });
  });
});
