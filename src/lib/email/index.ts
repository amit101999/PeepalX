import { parseServerEnv } from "@/config/env";
import { consoleProvider } from "./console-provider";
import { createResendProvider } from "./resend-provider";
import type { ContactProvider } from "./types";

export type { ContactProvider, DeliveryResult, Inquiry } from "./types";

/**
 * Resolves the contact provider from validated server configuration.
 *
 * To add SMTP, SendGrid, a CRM or a database: write a module exporting a
 * `ContactProvider`, add its name to `CONTACT_PROVIDER` in `src/config/env.ts`
 * and return it here. The API route never changes.
 *
 * A broken configuration does not fall back to console logging. On a live site
 * that would report "message sent" while the enquiry went nowhere, so instead
 * delivery fails, the visitor sees a generic error, and the exact problem is
 * logged for whoever operates the site.
 */
export function getContactProvider(
  source: Record<string, string | undefined> = process.env,
): ContactProvider {
  const config = parseServerEnv(source);
  if (!config.ok) return unavailableProvider(config.issues);

  const { env } = config;

  if (env.CONTACT_PROVIDER === "resend") {
    // Presence is already guaranteed by the schema; this narrows the types.
    if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL) {
      return createResendProvider({
        apiKey: env.RESEND_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
      });
    }
  }

  return consoleProvider;
}

/** Stands in for a provider when configuration is invalid. Always fails. */
function unavailableProvider(issues: string[]): ContactProvider {
  return {
    name: "unconfigured",
    async deliver() {
      return {
        ok: false,
        error: `Contact delivery is misconfigured: ${issues.join("; ")}`,
      };
    },
  };
}
