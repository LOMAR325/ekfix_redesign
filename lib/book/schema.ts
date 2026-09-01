import { z } from "zod";
import { applianceFormOptions, contactAsOptions } from "./options";

// Prototype validation. Intentionally loose: name/phone just non-empty, phone gets
// light whitespace normalisation only (no format enforcement), appliance and
// contactAs must be one of the shared option lists.

const oneOf = (options: readonly string[], message: string) =>
  z
    .string({ message })
    .trim()
    .min(1, message)
    .refine((value) => options.includes(value), message);

export const leadSchema = z.object({
  name: z
    .string({ message: "Please enter your name" })
    .trim()
    .min(1, "Please enter your name"),
  phone: z
    .string({ message: "Please enter a phone number" })
    .trim()
    .min(1, "Please enter a phone number")
    .transform((value) => value.replace(/\s+/g, " ")),
  appliance: oneOf(applianceFormOptions, "Please choose the appliance"),
  contactAs: oneOf(contactAsOptions, "Please tell us who's contacting us"),
  message: z.string().trim().optional(),
});

export type LeadParsed = z.infer<typeof leadSchema>;
