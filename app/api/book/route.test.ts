import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function bookRequest(body: string) {
  return new Request("http://localhost/api/book", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

type BookResponse = { ok: boolean; errors?: Record<string, string> };

async function post(body: unknown): Promise<{ status: number; json: BookResponse }> {
  const res = await POST(bookRequest(JSON.stringify(body)));
  return { status: res.status, json: (await res.json()) as BookResponse };
}

const homeLead = {
  branch: "home",
  name: "Jane Doe",
  phone: "980-555-1234",
  appliance: "Refrigerator",
  message: "Fridge not cooling",
};

const businessLead = {
  branch: "business",
  company: "Queen City Grill",
  contactName: "Jane Manager",
  phone: "980-555-1234",
  email: "",
  businessType: "Restaurant",
  equipment: "",
  units: "",
  urgency: "",
  message: "",
};

describe("POST /api/book", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 {ok:true} for a valid home lead", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    expect(await post(homeLead)).toEqual({ status: 200, json: { ok: true } });
  });

  it("returns 200 {ok:true} for a valid business lead with blank optional fields", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    expect(await post(businessLead)).toEqual({ status: 200, json: { ok: true } });
  });

  it("returns 400 errors.branch for an empty body", async () => {
    expect(await post({})).toEqual({
      status: 400,
      json: { ok: false, errors: { branch: "Please choose home or business" } },
    });
  });

  it("returns 400 errors.branch for an unknown branch", async () => {
    expect(await post({ ...homeLead, branch: "office" })).toEqual({
      status: 400,
      json: { ok: false, errors: { branch: "Please choose home or business" } },
    });
  });

  it("returns 400 errors.appliance for a home lead without an appliance", async () => {
    const { appliance: _omit, ...rest } = homeLead;
    expect(await post(rest)).toEqual({
      status: 400,
      json: { ok: false, errors: { appliance: "Please choose the appliance" } },
    });
  });

  it("returns 400 with errors keyed on the business fields", async () => {
    expect(
      await post({ ...businessLead, company: "", contactName: " ", businessType: "", email: "nope" }),
    ).toEqual({
      status: 400,
      json: {
        ok: false,
        errors: {
          company: "Please enter the company name",
          contactName: "Please enter your name",
          email: "Please enter a valid email",
          businessType: "Please choose the type of business",
        },
      },
    });
  });

  it("returns 400 {ok:false, errors:{form}} for a body that is not JSON", async () => {
    const res = await POST(bookRequest("not json"));
    expect(res.status).toBe(400);
    const json = (await res.json()) as BookResponse;
    expect(json.ok).toBe(false);
    expect(json.errors?.form).toBeTruthy();
  });
});
