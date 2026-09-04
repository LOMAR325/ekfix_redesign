import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function bookRequest(body: string) {
  return new Request("http://localhost/api/book", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("POST /api/book", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 {ok:true} for a valid lead", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const res = await POST(
      bookRequest(
        JSON.stringify({
          name: "Jane Doe",
          phone: "980-555-1234",
          appliance: "Refrigerator",
          contactAs: "Property Manager",
          message: "Fridge not cooling",
        }),
      ),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 400 {ok:false, errors} for an empty body", async () => {
    const res = await POST(bookRequest("{}"));
    expect(res.status).toBe(400);
    const json = (await res.json()) as {
      ok: boolean;
      errors?: Record<string, string>;
    };
    expect(json.ok).toBe(false);
    expect(json.errors && Object.keys(json.errors).length).toBeGreaterThan(0);
  });

  it("returns 400 {ok:false, errors:{form}} for a body that is not JSON", async () => {
    const res = await POST(bookRequest("not json"));
    expect(res.status).toBe(400);
    const json = (await res.json()) as {
      ok: boolean;
      errors?: Record<string, string>;
    };
    expect(json.ok).toBe(false);
    expect(json.errors?.form).toBeTruthy();
  });
});
