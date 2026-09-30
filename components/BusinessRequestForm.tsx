"use client";

import { useEffect, useRef } from "react";
import { businessFormCopy as copy } from "@/data/booking";
import { businessEquipmentOptions, businessTypeOptions, urgencyOptions } from "@/lib/book/options";
import { track } from "@/lib/analytics";
import { readBusinessPreset } from "./booking-link";
import { errorTextStyle, formValues, netErrorStyle, useLeadSubmit } from "./lead-submit";

// The commercial form (ADR 0023): company, contact, phone, email, type of business, equipment,
// number of locations/units, urgency, description. Required: company, contact name, phone, type
// of business. Same `.book-card` / `.book-form` markup and classes as the home form; the pairs
// share a `.row-2`. `?type=` / `?equipment=` (a segment card or a child page CTA) preset the selects.

const FIELDS = [
  "company",
  "contactName",
  "phone",
  "email",
  "businessType",
  "equipment",
  "units",
  "urgency",
  "message",
] as const;

function FieldError({ message }: { message?: string }) {
  return message ? <span style={errorTextStyle}>{message}</span> : null;
}

export function BusinessRequestForm({ phone }: { phone: string }) {
  const { status, fieldErrors, formError, submit } = useLeadSubmit(FIELDS);
  const typeRef = useRef<HTMLSelectElement>(null);
  const equipmentRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const preset = readBusinessPreset(window.location.search);
    if (preset.businessType && typeRef.current) typeRef.current.value = preset.businessType;
    if (preset.equipment && equipmentRef.current) equipmentRef.current.value = preset.equipment;
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = formValues(event.currentTarget, FIELDS);
    if (await submit({ branch: "business", ...values })) {
      track({ name: "commercial_form_submit", params: { business_type: values.businessType } });
    }
  }

  return (
    <div className="book-card">
      <h3>{copy.title}</h3>
      <div className="sub">{copy.sub}</div>

      <div id="request-thanks" className={status === "success" ? "book-thanks" : "book-thanks hidden"}>
        <strong>{copy.thanks}</strong>
        <p>{copy.thanksCall(phone)}</p>
      </div>

      <form
        id="request-form"
        className={status === "success" ? "book-form hidden" : "book-form"}
        onSubmit={handleSubmit}
      >
        <div className="row-2">
          <input type="text" name="company" placeholder="Company" aria-label="Company" required />
          <input type="text" name="contactName" placeholder="Your name" aria-label="Your name" required />
        </div>
        <FieldError message={fieldErrors.company} />
        <FieldError message={fieldErrors.contactName} />

        <div className="row-2">
          <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" required />
          <input type="email" name="email" placeholder="Email (optional)" aria-label="Email" />
        </div>
        <FieldError message={fieldErrors.phone} />
        <FieldError message={fieldErrors.email} />

        <div className="row-2">
          <select name="businessType" ref={typeRef} defaultValue="" aria-label="Type of business" required>
            <option value="" disabled>
              {copy.businessTypePlaceholder}
            </option>
            {businessTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select name="equipment" ref={equipmentRef} defaultValue="" aria-label="Equipment">
            <option value="">{copy.equipmentPlaceholder}</option>
            {businessEquipmentOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <FieldError message={fieldErrors.businessType} />
        <FieldError message={fieldErrors.equipment} />

        <div className="row-2">
          <input
            type="text"
            name="units"
            placeholder="Locations / units (optional)"
            aria-label="Number of locations or units"
            maxLength={200}
          />
          <select name="urgency" defaultValue="" aria-label="Urgency">
            <option value="">{copy.urgencyPlaceholder}</option>
            {urgencyOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <FieldError message={fieldErrors.units} />
        <FieldError message={fieldErrors.urgency} />

        <textarea
          name="message"
          placeholder="Address and what is wrong (optional)"
          aria-label="Describe the request"
          rows={4}
        />

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
