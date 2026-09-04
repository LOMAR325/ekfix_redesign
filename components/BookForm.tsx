"use client";

import { useEffect, useRef, useState } from "react";
import { business } from "@/data/business";
import { applianceFormOptions, contactAsOptions } from "@/lib/book/options";
import { useBooking } from "./BookingProvider";

// DOM ported 1:1 from index.html `#book .book-card` / `form#book-form`, plus the
// new "I'm contacting you as a…" <select> before the textarea (b2b §7 / story 27).
// The submit handler replaces the old js/main.js fake "thanks" with a real POST to
// /api/book. States: idle -> submitting -> success | fieldErrors | netError.

type Status = "idle" | "submitting" | "success" | "netError";

// Keys the form renders an inline error under. Anything else the API sends back in
// `errors` (a `form` key, a JSON-parse failure, an unexpected field) has no home
// next to an input, so it is surfaced as a single form-level message by the button
// instead of being dropped on the floor.
const FIELD_ERROR_KEYS = ["name", "phone", "appliance", "contactAs"] as const;

const errorTextStyle: React.CSSProperties = {
  color: "#ff9b9b",
  fontSize: "13px",
  lineHeight: 1.5,
  marginTop: "-6px",
};

const netErrorStyle: React.CSSProperties = {
  marginTop: "6px",
  padding: "16px 18px",
  borderRadius: "13px",
  background: "rgba(255, 120, 120, 0.1)",
  border: "1px solid rgba(255, 120, 120, 0.35)",
  fontSize: "14px",
  lineHeight: 1.6,
  color: "#ffb3b3",
};

export function BookForm() {
  const { appliance } = useBooking();
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const applianceRef = useRef<HTMLSelectElement>(null);

  // Preset the appliance <select> when a #repair card was clicked (BookingProvider).
  useEffect(() => {
    if (appliance && applianceRef.current) {
      applianceRef.current.value = appliance;
    }
  }, [appliance]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // ignore double-clicks / repeat submits

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      appliance: String(data.get("appliance") ?? ""),
      contactAs: String(data.get("contactAs") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    setStatus("submitting");
    setFieldErrors({});
    setFormError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      const body = (await res.json().catch(() => null)) as
        | { ok: false; errors?: Record<string, string> }
        | null;

      if (body && body.ok === false && body.errors) {
        const nextFieldErrors: Record<string, string> = {};
        const formMessages: string[] = [];
        for (const [key, message] of Object.entries(body.errors)) {
          if ((FIELD_ERROR_KEYS as readonly string[]).includes(key)) {
            nextFieldErrors[key] = message;
          } else {
            formMessages.push(message);
          }
        }
        setFieldErrors(nextFieldErrors);
        setFormError(formMessages.join(" "));
        setStatus("idle"); // keep the form, values are untouched (uncontrolled inputs)
        return;
      }

      setStatus("netError");
    } catch {
      setStatus("netError");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="book-card">
      <h3>Book your repair</h3>
      <div className="sub">Takes less than a minute. 10% off online bookings.</div>

      <div
        id="book-thanks"
        className={status === "success" ? "book-thanks" : "book-thanks hidden"}
      >
        <strong>Thank you! We&apos;ll be in touch shortly.</strong>
        <p>Need it sooner? Call {business.phone}.</p>
      </div>

      <form
        id="book-form"
        className={status === "success" ? "book-form hidden" : "book-form"}
        onSubmit={handleSubmit}
      >
        <div className="row-2">
          <input type="text" name="name" placeholder="Your name" required />
          <input type="tel" name="phone" placeholder="Phone number" required />
        </div>
        {fieldErrors.name && <span style={errorTextStyle}>{fieldErrors.name}</span>}
        {fieldErrors.phone && (
          <span style={errorTextStyle}>{fieldErrors.phone}</span>
        )}

        <select id="appliance" name="appliance" ref={applianceRef} defaultValue="" required>
          <option value="" disabled>
            Select appliance...
          </option>
          {applianceFormOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {fieldErrors.appliance && (
          <span style={errorTextStyle}>{fieldErrors.appliance}</span>
        )}

        <select id="contact-as" name="contactAs" defaultValue="" required>
          <option value="" disabled>
            I&apos;m contacting you as a…
          </option>
          {contactAsOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {fieldErrors.contactAs && (
          <span style={errorTextStyle}>{fieldErrors.contactAs}</span>
        )}

        <textarea
          name="message"
          placeholder="Describe the issue (optional)"
          rows={4}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send My Request →"}
        </button>

        {formError && (
          <span style={errorTextStyle} role="alert">
            {formError}
          </span>
        )}

        {status === "netError" && (
          <div style={netErrorStyle} role="alert">
            Couldn&apos;t send your request — please call {business.phone}.
          </div>
        )}

        <div className="fine-print">
          <span>
            <span className="tick">✓</span> No hidden fees
          </span>
          <span>
            <span className="tick">✓</span> Free estimate
          </span>
          <span>
            <span className="tick">✓</span> Same-day slots
          </span>
        </div>
      </form>
    </div>
  );
}
