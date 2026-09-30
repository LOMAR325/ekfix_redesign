"use client";

import { useState } from "react";

// The submit flow both lead forms share (ADR 0023): POST /api/book, then idle → submitting →
// success | field errors | network error. Errors keyed by a field the form renders go under
// that field; any other key (`form`, `branch`, …) becomes one form-level message.

export type LeadStatus = "idle" | "submitting" | "success" | "netError";

export function useLeadSubmit(fieldKeys: readonly string[]) {
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function submit(payload: Record<string, string>): Promise<boolean> {
    if (status === "submitting") return false; // ignore double-clicks / repeat submits
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
        return true;
      }
      const body = (await res.json().catch(() => null)) as
        | { ok: false; errors?: Record<string, string> }
        | null;
      if (body && body.ok === false && body.errors) {
        const next: Record<string, string> = {};
        const messages: string[] = [];
        for (const [key, message] of Object.entries(body.errors)) {
          if (fieldKeys.includes(key)) next[key] = message;
          else messages.push(message);
        }
        setFieldErrors(next);
        setFormError(messages.join(" "));
        setStatus("idle"); // keep the form, values are untouched (uncontrolled inputs)
        return false;
      }
      setStatus("netError");
    } catch {
      setStatus("netError");
    }
    return false;
  }

  return { status, fieldErrors, formError, submit };
}

/** Every named field of a form as a string ("" for an empty one). */
export function formValues(form: HTMLFormElement, names: readonly string[]): Record<string, string> {
  const data = new FormData(form);
  return Object.fromEntries(names.map((n) => [n, String(data.get(n) ?? "")]));
}

export const errorTextStyle: React.CSSProperties = {
  color: "#ff9b9b",
  fontSize: "13px",
  lineHeight: 1.5,
  marginTop: "-6px",
};

export const netErrorStyle: React.CSSProperties = {
  marginTop: "6px",
  padding: "16px 18px",
  borderRadius: "13px",
  background: "rgba(255, 120, 120, 0.1)",
  border: "1px solid rgba(255, 120, 120, 0.35)",
  fontSize: "14px",
  lineHeight: 1.6,
  color: "#ffb3b3",
};
