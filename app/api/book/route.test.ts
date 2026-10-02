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
  address: "123 Main St, Charlotte, NC",
  message: "Fridge not cooling",
};

const businessLead = {
  branch: "business",
  name: "Jane Manager",
  phone: "980-555-1234",
  address: "500 Trade St, Charlotte, NC",
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

  it("returns 200 {ok:true} for a valid business lead with an empty message", async () => {
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

  it("returns 400 errors.address for a home lead without an address", async () => {
    const { address: _omit, ...rest } = homeLead;
    expect(await post(rest)).toEqual({
      status: 400,
      json: { ok: false, errors: { address: "Please enter the address" } },
    });
  });

  it("returns 400 with errors keyed on each invalid field", async () => {
    expect(
      await post({ ...businessLead, name: "", phone: " ", address: "x".repeat(301) }),
    ).toEqual({
      status: 400,
      json: {
        ok: false,
        errors: {
          name: "Please enter your name",
          phone: "Please enter a phone number",
          address: "Please keep the address under 300 characters",
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
