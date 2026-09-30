"use client";

import { useEffect, useRef } from "react";
import { homeFormCopy as copy } from "@/data/booking";
import { homeApplianceOptions } from "@/lib/book/options";
import { track } from "@/lib/analytics";
import { readHomePreset } from "./booking-link";
import { errorTextStyle, formValues, netErrorStyle, useLeadSubmit } from "./lead-submit";

// The residential form (ADR 0023): DOM ported 1:1 from index.html `#book .book-card` /
// `form#book-form` — name, phone, appliance, description. No "contacting you as" field: the
// branch already says who is asking. `?appliance=` (a service page's CTA) presets the select.

const FIELDS = ["name", "phone", "appliance", "message"] as const;

export function HomeBookForm({ phone }: { phone: string }) {
  const { status, fieldErrors, formError, submit } = useLeadSubmit(FIELDS);
  const applianceRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const { appliance } = readHomePreset(window.location.search);
    if (appliance && applianceRef.current) applianceRef.current.value = appliance;
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = formValues(event.currentTarget, FIELDS);
    if (await submit({ branch: "home", ...values })) {
      track({ name: "residential_form_submit", params: { appliance: values.appliance } });
    }
  }

  return (
    <div className="book-card">
      <h3>{copy.title}</h3>
      <div className="sub">{copy.sub}</div>

      <div id="book-thanks" className={status === "success" ? "book-thanks" : "book-thanks hidden"}>
        <strong>{copy.thanks}</strong>
        <p>{copy.thanksCall(phone)}</p>
      </div>

      <form
        id="book-form"
        className={status === "success" ? "book-form hidden" : "book-form"}
        onSubmit={handleSubmit}
      >
        <div className="row-2">
          <input type="text" name="name" placeholder="Your name" aria-label="Your name" required />
          <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" required />
        </div>
        {fieldErrors.name && <span style={errorTextStyle}>{fieldErrors.name}</span>}
        {fieldErrors.phone && <span style={errorTextStyle}>{fieldErrors.phone}</span>}

        <select id="appliance" name="appliance" ref={applianceRef} defaultValue="" aria-label="Appliance" required>
          <option value="" disabled>
            {copy.appliancePlaceholder}
          </option>
          {homeApplianceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {fieldErrors.appliance && <span style={errorTextStyle}>{fieldErrors.appliance}</span>}

        <textarea name="message" placeholder="Describe the issue (optional)" aria-label="Describe the issue" rows={4} />

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? copy.submitting : copy.submit}
        </button>

        {formError && (
          <span style={errorTextStyle} role="alert">
            {formError}
          </span>
        )}
        {status === "netError" && (
          <div style={netErrorStyle} role="alert">
            {copy.netError(phone)}
          </div>
        )}

        <div className="fine-print">
          {copy.finePrint.map((item) => (
            <span key={item}>
              <span className="tick">✓</span> {item}
            </span>
          ))}
        </div>
      </form>
    </div>
  );
}
