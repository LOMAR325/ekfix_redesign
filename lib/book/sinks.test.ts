import { afterEach, describe, expect, it, vi } from "vitest";

// Seam 1 (lib/book): lead delivery. Covers the EmailLeadSink Resend call, the
// unified channel-failure handling, multi-channel fan-out, and enabled reacting
// to process.env. fetch and env are mocked — no real network, no real secrets.

const validInput = {
  name: "Jane Manager",
  phone: "(980) 555-0134",
  appliance: "Refrigerator",
  contactAs: "Property Manager",
  message: "Walk-in cooler not holding temp",
};

const RESEND_URL = "https://api.resend.com/emails";
const WEBHOOK_URL = "https://crm.example.com/hook";

function response(status = 200): Response {
  return new Response(null, { status });
}

/** Rebuild the module graph so the `sinks` array is constructed against the
 *  env stubbed in the current test. */
async function loadSubmit() {
  vi.resetModules();
  return (await import("./submit")).submitLead;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("lead delivery", () => {
  describe("fan-out via submitLead", () => {
    it("delivers a valid lead to Resend and to the webhook when both are configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      vi.stubEnv("BOOK_WEBHOOK_URL", WEBHOOK_URL);
      const fetchMock = vi.fn().mockResolvedValue(response());
      vi.stubGlobal("fetch", fetchMock);

      const submitLead = await loadSubmit();
      const result = await submitLead(validInput);

      expect(result).toEqual({ ok: true });
      const urls = fetchMock.mock.calls.map((c) => String(c[0]));
      expect(urls).toContain(RESEND_URL);
      expect(urls).toContain(WEBHOOK_URL);

      const resendCall = fetchMock.mock.calls.find((c) => String(c[0]) === RESEND_URL);
      expect(resendCall).toBeDefined();
      const init = resendCall![1] as RequestInit;
      expect(init.method).toBe("POST");
      expect((init.headers as Record<string, string>).Authorization).toBe(
        "Bearer re_test_fake",
      );
      expect(String(init.body)).toContain("Refrigerator");
    });

    it("makes no network call when the input is invalid", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      vi.stubEnv("BOOK_WEBHOOK_URL", WEBHOOK_URL);
      const fetchMock = vi.fn().mockResolvedValue(response());
      vi.stubGlobal("fetch", fetchMock);

      const submitLead = await loadSubmit();
      const result = await submitLead({ ...validInput, name: "" });

      expect(result.ok).toBe(false);
      if (result.ok === false) expect(result.errors.name).toBeTruthy();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("still returns {ok:true} and still calls the webhook when the email channel throws", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      vi.stubEnv("BOOK_WEBHOOK_URL", WEBHOOK_URL);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const fetchMock = vi.fn((url: string | URL | Request) =>
        String(url) === RESEND_URL
          ? Promise.reject(new Error("network down"))
          : Promise.resolve(response()),
      );
      vi.stubGlobal("fetch", fetchMock);

      const submitLead = await loadSubmit();
      const result = await submitLead(validInput);

      expect(result).toEqual({ ok: true });
      expect(fetchMock.mock.calls.map((c) => String(c[0]))).toContain(WEBHOOK_URL);
      expect(warn).toHaveBeenCalledWith(
        "[book] email sink delivery failed",
        expect.any(Error),
      );
    });

    it("treats a non-2xx Resend response as a failure and does not throw", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const fetchMock = vi.fn().mockResolvedValue(response(500));
      vi.stubGlobal("fetch", fetchMock);

      const submitLead = await loadSubmit();
      const result = await submitLead(validInput);

      expect(result).toEqual({ ok: true });
      expect(warn).toHaveBeenCalledWith(
        "[book] email sink delivery failed",
        expect.any(Error),
      );
    });

    it("makes zero network calls when no channel is configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "");
      vi.stubEnv("BOOK_WEBHOOK_URL", "");
      const fetchMock = vi.fn().mockResolvedValue(response());
      vi.stubGlobal("fetch", fetchMock);

      const submitLead = await loadSubmit();
      const result = await submitLead(validInput);

      expect(result).toEqual({ ok: true });
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("enabled follows process.env at construction", () => {
    it("EmailLeadSink.enabled is true only with both RESEND_API_KEY and BOOK_NOTIFY_EMAIL", async () => {
      const { EmailLeadSink } = await import("./sinks");

      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "");
      expect(new EmailLeadSink().enabled).toBe(false);

      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "");
      expect(new EmailLeadSink().enabled).toBe(false);

      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      expect(new EmailLeadSink().enabled).toBe(false);

      vi.stubEnv("RESEND_API_KEY", "re_test_fake");
      vi.stubEnv("BOOK_NOTIFY_EMAIL", "owner@example.com");
      expect(new EmailLeadSink().enabled).toBe(true);
    });

    it("WebhookLeadSink.enabled follows BOOK_WEBHOOK_URL", async () => {
      const { WebhookLeadSink } = await import("./sinks");

      vi.stubEnv("BOOK_WEBHOOK_URL", "");
      expect(new WebhookLeadSink().enabled).toBe(false);

      vi.stubEnv("BOOK_WEBHOOK_URL", WEBHOOK_URL);
      expect(new WebhookLeadSink().enabled).toBe(true);
    });
  });
});
