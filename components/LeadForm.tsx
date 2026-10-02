"use client";

import { leadFormCopy } from "@/data/booking";
import type { LeadBranch } from "@/data/types";
import { track } from "@/lib/analytics";
import { errorTextStyle, formValues, netErrorStyle, useLeadSubmit } from "./lead-submit";

// The lead form of both branches (ADR 0023): name, phone, address, problem / notes — the same
// four fields everywhere (owner, 2026-09-30); `branch` goes with the payload so /api/book tags a
// business lead. DOM and classes ported from index.html `#book .book-card` / `form#book-form`.

const FIELDS = ["name", "phone", "address", "message"] as const;

export function LeadForm({ branch, phone }: { branch: LeadBranch; phone: string }) {
  const copy = leadFormCopy[branch];
  const { status, fieldErrors, formError, submit } = useLeadSubmit(FIELDS);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await submit({ branch, ...formValues(event.currentTarget, FIELDS) })) {
      track({ name: branch === "business" ? "commercial_form_submit" : "residential_form_submit" });
    }
  }

  const error = (key: (typeof FIELDS)[number]) =>
    fieldErrors[key] ? <span style={errorTextStyle}>{fieldErrors[key]}</span> : null;

  return (
    <div className="book-card">
      <h3>{copy.title}</h3>
      <div className="sub">{copy.sub}</div>

      <div className={status === "success" ? "book-thanks" : "book-thanks hidden"}>
        <strong>{copy.thanks}</strong>
        <p>{copy.thanksCall(phone)}</p>
      </div>

      <form
        id={`${branch}-form`}
        className={status === "success" ? "book-form hidden" : "book-form"}
        onSubmit={handleSubmit}
      >
        <div className="row-2">
          <input type="text" name="name" placeholder="Your name" aria-label="Your name" autoComplete="name" required />
          <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" autoComplete="tel" required />
        </div>
        {error("name")}
        {error("phone")}

        <input
          type="text"
          name="address"
          placeholder={copy.addressPlaceholder}
          aria-label="Address"
          autoComplete="street-address"
          maxLength={300}
          required
        />
        {error("address")}

        <textarea name="message" placeholder={copy.notesPlaceholder} aria-label="Problem or notes" rows={4} maxLength={2000} />
        {error("message")}

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? leadFormCopy.submitting : copy.submit}
        </button>

        {formError && (
          <span style={errorTextStyle} role="alert">
            {formError}
          </span>
        )}
        {status === "netError" && (
          <div style={netErrorStyle} role="alert">
            {leadFormCopy.netError(phone)}
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
