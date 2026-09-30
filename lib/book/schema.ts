import { z } from "zod";
import type { LeadInput } from "@/data/types";

// Prototype validation, discriminated by `branch`. Both forms (home and
// business) send the same four fields, so both branches share one field set.
// Intentionally loose: name/phone/address just non-empty, phone gets light
// whitespace normalisation only (no format enforcement), message is optional.

const required = (message: string) =>
  z.string({ message }).trim().min(1, message);

const leadFields = {
  name: required("Please enter your name"),
  phone: required("Please enter a phone number").transform((value) =>
    value.replace(/\s+/g, " "),
  ),
  address: required("Please enter the address").max(
    300,
    "Please keep the address under 300 characters",
  ),
  message: z
    .string()
    .trim()
    .max(2000, "Please keep the notes under 2000 characters")
    .optional(),
};

export const homeLeadSchema = z.object({
  branch: z.literal("home"),
  ...leadFields,
});

export const businessLeadSchema = z.object({
  branch: z.literal("business"),
  ...leadFields,
});

export const leadSchema = z.discriminatedUnion("branch", [
  homeLeadSchema,
  businessLeadSchema,
]);

export type LeadParsed = z.infer<typeof leadSchema>;

// Compile-time guard: the zod output must stay assignable to the zod-free
// LeadInput in data/types.ts that the sinks consume.
type Assignable<From, To> = [From] extends [To] ? true : false;
type Expect<T extends true> = T;
export type LeadTypeChecks = [Expect<Assignable<LeadParsed, LeadInput>>];
