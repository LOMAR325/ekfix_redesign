import type { LeadResult } from "@/data/types";
import { leadSchema } from "./schema";
import { sinks } from "./sinks";

// Validate the input, then fan out to every enabled delivery sink. A sink that
// throws does not fail the lead — once validation passes, the lead is "accepted".
export async function submitLead(input: unknown): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && errors[field] === undefined) {
        errors[field] = issue.message;
      }
    }
    return { ok: false, errors };
  }

  await Promise.allSettled(
    sinks.filter((sink) => sink.enabled).map((sink) => sink.send(parsed.data)),
  );
  return { ok: true };
}
