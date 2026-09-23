import { z } from "zod";

/**
 * Server-side environment configuration, validated with zod.
 *
 * Server code only: this module reads secrets such as RESEND_API_KEY, which
 * must never end up in a browser bundle. Public values (`NEXT_PUBLIC_*`) are
 * read where they are used.
 *
 * Parsing runs on each call rather than once at import. That keeps tests able
 * to change `process.env` between cases, and it means a misconfiguration is
 * reported by the one feature that depends on it (the contact endpoint)
 * instead of breaking every statically generated page at build time.
 */

/** A blank line in an env file (`RESEND_API_KEY=`) means "not set". */
function blankToUndefined(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

const optionalString = z.preprocess(blankToUndefined, z.string().optional());

const optionalEmail = z.preprocess(blankToUndefined, z.email().optional());

/** `Name <address>`, the display-name form Resend accepts for the sender. */
const DISPLAY_NAME_SENDER = /^[^<>]*<([^<>]+)>$/;

/** A bare address, or `PeepalX <website@example.com>`. The address part must be valid. */
const optionalSender = z.preprocess(
  blankToUndefined,
  z
    .string()
    .refine((value) => {
      const address = DISPLAY_NAME_SENDER.exec(value)?.[1]?.trim() ?? value;
      return z.email().safeParse(address).success;
    }, 'must be an email address or "Name <address>"')
    .optional(),
);

const contactProvider = z.preprocess(
  (value) => {
    const normalised = blankToUndefined(value);
    return typeof normalised === "string" ? normalised.toLowerCase() : normalised;
  },
  z.enum(["console", "resend"]).default("console"),
);

/** Variables that must be present when email delivery goes through Resend. */
const RESEND_REQUIRED = [
  "RESEND_API_KEY",
  "CONTACT_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
] as const;

const serverEnvSchema = z
  .object({
    CONTACT_PROVIDER: contactProvider,
    RESEND_API_KEY: optionalString,
    CONTACT_FROM_EMAIL: optionalSender,
    CONTACT_TO_EMAIL: optionalEmail,
    NODE_ENV: optionalString,
  })
  .superRefine((env, context) => {
    // The console provider reports "message sent" while only logging the
    // enquiry, including the visitor's personal details. On a live site that
    // loses the lead and puts PII in the logs, so production refuses it.
    if (env.NODE_ENV === "production" && env.CONTACT_PROVIDER === "console") {
      context.addIssue({
        code: "custom",
        path: ["CONTACT_PROVIDER"],
        message: 'must be a real delivery provider (e.g. "resend") in production',
      });
      return;
    }

    if (env.CONTACT_PROVIDER !== "resend") return;

    for (const key of RESEND_REQUIRED) {
      if (env[key]) continue;
      context.addIssue({
        code: "custom",
        path: [key],
        message: 'is required when CONTACT_PROVIDER is "resend"',
      });
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export type ServerEnvResult =
  { ok: true; env: ServerEnv } | { ok: false; issues: string[] };

/**
 * Validates server configuration.
 *
 * Issues name the variable and the rule it broke, never the value, so they
 * are safe to write to server logs even when the value is a secret.
 */
export function parseServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnvResult {
  const result = serverEnvSchema.safeParse(source);
  if (result.success) return { ok: true, env: result.data };

  return {
    ok: false,
    issues: result.error.issues.map((issue) => {
      const variable = issue.path.join(".") || "environment";
      return `${variable} ${issue.message}`;
    }),
  };
}
