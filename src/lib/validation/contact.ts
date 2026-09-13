import { z } from "zod";

/**
 * Contact form schema.
 *
 * This one schema is used in three places:
 *   - the browser, for inline validation messages,
 *   - the API route, which re-validates every submission server-side,
 *   - the tests in `contact.test.ts`.
 *
 * Client-side validation is a convenience only. The API route never trusts it.
 */

/** Service options offered in the contact form dropdown. */
export const serviceOptions = [
  "Web Development",
  "Mobile Development",
  "AI & Intelligent Systems",
  "Automation & Integrations",
  "Data & Scripting",
  "Zoho Solutions",
  "Not sure yet",
] as const;

export const budgetOptions = [
  "Under $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "Over $50,000",
  "Not decided",
] as const;

export const timelineOptions = [
  "As soon as possible",
  "1 - 3 months",
  "3 - 6 months",
  "Flexible",
] as const;

/** Trims input and converts an empty optional field to `undefined`. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

/**
 * An optional dropdown. An unanswered `<select>` can arrive as "" (for example
 * from a direct API call, or a browser that submits the placeholder option), so
 * "" is accepted and normalised to `undefined` rather than rejected as an
 * invalid choice.
 */
const optionalChoice = <T extends readonly [string, ...string[]]>(options: T) =>
  z
    .union([z.enum(options), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined));

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Please keep your name under 100 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .max(200, "Please keep your email under 200 characters.")
    .pipe(z.email("Please enter a valid email address.")),

  company: optionalText(120),

  // Permissive on purpose: phone formats vary by country and a strict pattern
  // rejects more valid numbers than it catches bad ones.
  phone: z
    .string()
    .trim()
    .max(40, "Please keep your phone number under 40 characters.")
    .refine(
      (value) => value.length === 0 || /^[\d\s()+.-]{6,40}$/.test(value),
      "Please enter a valid phone number.",
    )
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),

  service: z.enum(serviceOptions, "Please select a service."),

  budget: optionalChoice(budgetOptions),

  timeline: optionalChoice(timelineOptions),

  message: z
    .string()
    .trim()
    .min(20, "Please give us at least a sentence or two (20 characters).")
    .max(4000, "Please keep your message under 4000 characters."),

  /**
   * Honeypot field. It is hidden from users and from assistive technology, so
   * a human never fills it in. Anything non-empty is treated as spam.
   */
  website: z.string().max(0, "This submission was rejected.").optional().default(""),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** The shape the API route returns for both success and failure. */
export interface ContactApiResponse {
  ok: boolean;
  message: string;
  /** Field-level errors, keyed by form field name. */
  errors?: Partial<Record<keyof ContactFormValues, string>>;
}

/**
 * Flattens a Zod error into the `{ field: message }` shape the form renders.
 * Only the first error per field is kept — showing three messages under one
 * input is noise.
 */
export function toFieldErrors(
  error: z.ZodError<ContactFormValues>,
): Partial<Record<keyof ContactFormValues, string>> {
  const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof ContactFormValues] = issue.message;
    }
  }

  return fieldErrors;
}
