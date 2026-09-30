import type { LeadResult } from "@/data/types";
import { leadBranches } from "./options";
import { leadSchema } from "./schema";
import { sinks } from "./sinks";

const BRANCH_ERROR = "Please choose home or business";

const hasKnownBranch = (input: unknown): boolean =>
  typeof input === "object" &&
  input !== null &&
  (leadBranches as readonly unknown[]).includes(
    (input as { branch?: unknown }).branch,
  );

// Validate the input against its form's schema (picked by `branch`), then fan
// out to every enabled delivery sink. A sink that throws does not fail the lead —
// once validation passes, the lead is "accepted".
export async function submitLead(input: unknown): Promise<LeadResult> {
  // Checked up front so zod's generic discriminator message never reaches the UI.
  if (!hasKnownBranch(input)) {
    return { ok: false, errors: { branch: BRANCH_ERROR } };
  }

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

  const lead = parsed.data;
  await Promise.allSettled(
    sinks.filter((sink) => sink.enabled).map((sink) => sink.send(lead)),
  );
  return { ok: true };
}
