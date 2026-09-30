import { z } from "zod";
import type { BusinessLeadInput, HomeLeadInput, LeadInput } from "@/data/types";
import {
  businessEquipmentOptions,
  businessTypeOptions,
  homeApplianceOptions,
  urgencyOptions,
} from "./options";

// Prototype validation, one schema per lead form, discriminated by `branch`.
// Intentionally loose: names/phone just non-empty, phone gets light whitespace
// normalisation only (no format enforcement), selects must be one of the shared
// option lists. Optional business fields treat "" (an untouched input/select)
// as absent.

const required = (message: string) =>
  z.string({ message }).trim().min(1, message);

const oneOf = (options: readonly string[], message: string) =>
  required(message).refine((value) => options.includes(value), message);

/** "" or whitespace-only → undefined, otherwise the trimmed string. */
const blankToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const optionalBlank = <T extends z.ZodType>(schema: T) =>
  z.preprocess(blankToUndefined, schema.optional());

const phone = required("Please enter a phone number").transform((value) =>
  value.replace(/\s+/g, " "),
);

const message = z.string().trim().optional();

export const homeLeadSchema = z.object({
  branch: z.literal("home"),
  name: required("Please enter your name"),
  phone,
  appliance: oneOf(homeApplianceOptions, "Please choose the appliance"),
  message,
});

export const businessLeadSchema = z.object({
  branch: z.literal("business"),
  company: required("Please enter the company name"),
  contactName: required("Please enter your name"),
  phone,
  email: optionalBlank(z.email({ message: "Please enter a valid email" })),
  businessType: oneOf(businessTypeOptions, "Please choose the type of business"),
  equipment: optionalBlank(
    oneOf(businessEquipmentOptions, "Please choose the equipment"),
  ),
  units: z
    .string({ message: "Please describe the units in text" })
    .trim()
    .max(200, "Please keep this under 200 characters")
    .optional(),
  urgency: optionalBlank(oneOf(urgencyOptions, "Please choose the urgency")),
  message,
});

export const leadSchema = z.discriminatedUnion("branch", [
  homeLeadSchema,
  businessLeadSchema,
]);

export type HomeLead = z.infer<typeof homeLeadSchema>;
export type BusinessLead = z.infer<typeof businessLeadSchema>;
export type LeadParsed = z.infer<typeof leadSchema>;

// Compile-time guard: the zod output must stay assignable to the zod-free
// LeadInput in data/types.ts that the sinks consume.
type Assignable<From, To> = [From] extends [To] ? true : false;
type Expect<T extends true> = T;
export type LeadTypeChecks = [
  Expect<Assignable<HomeLead, HomeLeadInput>>,
  Expect<Assignable<BusinessLead, BusinessLeadInput>>,
  Expect<Assignable<LeadParsed, LeadInput>>,
];
