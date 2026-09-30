import { afterEach, describe, expect, it, vi } from "vitest";
import { submitLead } from "./submit";
import { ConsoleLeadSink, EmailLeadSink, WebhookLeadSink } from "./sinks";

const homeInput = {
  branch: "home",
  name: "Jane Doe",
  phone: "(980) 555-0134",
  appliance: "Refrigerator",
  message: "Fridge not cooling",
};

const businessInput = {
  branch: "business",
  company: "Queen City Grill",
  contactName: "Jane Manager",
  phone: "(980) 555-0134",
  email: "jane@example.com",
  businessType: "Restaurant",
  equipment: "Commercial Refrigeration",
  units: "2 walk-in coolers",
  urgency: "Emergency",
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

  describe("home", () => {
    it("accepts a valid home lead and passes the parsed lead to the console sink", async () => {
      const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
      const result = await submitLead({ ...homeInput, phone: "  (980)   555-0134 " });
      expect(result).toEqual({ ok: true });
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith({
        branch: "home",
        name: "Jane Doe",
        phone: "(980) 555-0134",
        appliance: "Refrigerator",
        message: "Fridge not cooling",
      });
    });

    it("accepts \"Other\" as the appliance", async () => {
      spyAllSinks();
      expect(await submitLead({ ...homeInput, appliance: "Other" })).toEqual({ ok: true });
    });

    it("rejects an empty name and calls no sink", async () => {
      const send = spyAllSinks();
      expect(await errorsFor({ ...homeInput, name: "" })).toEqual({
        name: "Please enter your name",
      });
      expect(send.console).not.toHaveBeenCalled();
      expect(send.email).not.toHaveBeenCalled();
      expect(send.webhook).not.toHaveBeenCalled();
    });

    it("rejects a blank phone", async () => {
      expect(await errorsFor({ ...homeInput, phone: "   " })).toEqual({
        phone: "Please enter a phone number",
      });
    });

    it("rejects a missing appliance", async () => {
      const { appliance: _omit, ...noAppliance } = homeInput;
      expect(await errorsFor(noAppliance)).toEqual({
        appliance: "Please choose the appliance",
      });
    });

    it("rejects an appliance that is not in the option list", async () => {
      expect(await errorsFor({ ...homeInput, appliance: "Toaster" })).toEqual({
        appliance: "Please choose the appliance",
      });
    });

    it("rejects a commercial appliance on the home branch", async () => {
      expect(
        await errorsFor({ ...homeInput, appliance: "Commercial Refrigeration" }),
      ).toEqual({ appliance: "Please choose the appliance" });
    });
  });

  describe("business", () => {
    it("accepts a valid business lead and passes the parsed lead to the console sink", async () => {
      const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
      const result = await submitLead(businessInput);
      expect(result).toEqual({ ok: true });
      expect(send).toHaveBeenCalledWith({
        branch: "business",
        company: "Queen City Grill",
        contactName: "Jane Manager",
        phone: "(980) 555-0134",
        email: "jane@example.com",
        businessType: "Restaurant",
        equipment: "Commercial Refrigeration",
        units: "2 walk-in coolers",
        urgency: "Emergency",
        message: "Walk-in cooler not holding temp",
      });
    });

    it("accepts empty-string optional fields and treats them as absent", async () => {
      const send = vi.spyOn(ConsoleLeadSink.prototype, "send").mockResolvedValue();
      const result = await submitLead({
        branch: "business",
        company: "Queen City Grill",
        contactName: "Jane Manager",
        phone: "980-555-0134",
        email: "",
        businessType: "Hotel",
        equipment: "",
        units: "",
        urgency: "",
        message: "",
      });
      expect(result).toEqual({ ok: true });
      const lead = send.mock.calls[0][0];
      expect(lead).toMatchObject({
        branch: "business",
        company: "Queen City Grill",
        businessType: "Hotel",
      });
      expect((lead as { email?: string }).email).toBeUndefined();
      expect((lead as { equipment?: string }).equipment).toBeUndefined();
      expect((lead as { urgency?: string }).urgency).toBeUndefined();
    });

    it("accepts a lead with the optional fields omitted", async () => {
      spyAllSinks();
      const result = await submitLead({
        branch: "business",
        company: "Queen City Grill",
        contactName: "Jane Manager",
        phone: "980-555-0134",
        businessType: "Other",
      });
      expect(result).toEqual({ ok: true });
    });

    it("rejects a missing company", async () => {
      const { company: _omit, ...rest } = businessInput;
      expect(await errorsFor(rest)).toEqual({
        company: "Please enter the company name",
      });
    });

    it("rejects a missing contactName", async () => {
      const { contactName: _omit, ...rest } = businessInput;
      expect(await errorsFor(rest)).toEqual({ contactName: "Please enter your name" });
    });

    it("rejects a missing businessType", async () => {
      const { businessType: _omit, ...rest } = businessInput;
      expect(await errorsFor(rest)).toEqual({
        businessType: "Please choose the type of business",
      });
    });

    it("rejects a businessType that is not in the option list", async () => {
      expect(await errorsFor({ ...businessInput, businessType: "School" })).toEqual({
        businessType: "Please choose the type of business",
      });
    });

    it("keys each missing required field separately", async () => {
      expect(
        await errorsFor({ branch: "business", phone: "", email: "", equipment: "" }),
      ).toEqual({
        company: "Please enter the company name",
        contactName: "Please enter your name",
        phone: "Please enter a phone number",
        businessType: "Please choose the type of business",
      });
    });

    it("rejects a malformed email", async () => {
      expect(await errorsFor({ ...businessInput, email: "jane@" })).toEqual({
        email: "Please enter a valid email",
      });
    });

    it("rejects equipment and urgency outside their option lists", async () => {
      const errors = await errorsFor({
        ...businessInput,
        equipment: "Refrigerator",
        urgency: "Tomorrow",
      });
      expect(Object.keys(errors).sort()).toEqual(["equipment", "urgency"]);
    });

    it("rejects units longer than 200 characters", async () => {
      const errors = await errorsFor({ ...businessInput, units: "x".repeat(201) });
      expect(Object.keys(errors)).toEqual(["units"]);
    });

    it("does not accept home fields on the business branch", async () => {
      const { company: _c, contactName: _n, businessType: _t, ...rest } = businessInput;
      const errors = await errorsFor({ ...rest, name: "Jane", appliance: "Refrigerator" });
      expect(Object.keys(errors).sort()).toEqual(["businessType", "company", "contactName"]);
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
