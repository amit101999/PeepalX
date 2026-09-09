import { consoleProvider } from "./console-provider";
import { resendProvider } from "./resend-provider";
import type { ContactProvider } from "./types";

export type { ContactProvider, DeliveryResult, Inquiry } from "./types";

/**
 * Every provider the site knows how to use, keyed by the value of the
 * CONTACT_PROVIDER environment variable.
 *
 * To add SMTP, SendGrid, a CRM or a database: write a module exporting a
 * `ContactProvider` and add it to this record. Nothing else changes.
 */
const providers: Record<string, ContactProvider> = {
  console: consoleProvider,
  resend: resendProvider,
};

/**
 * Resolves the configured provider, falling back to the console provider when
 * the setting is missing or unrecognised so the form never hard-fails.
 */
export function getContactProvider(): ContactProvider {
  const configured = process.env.CONTACT_PROVIDER?.trim().toLowerCase();
  if (!configured) return consoleProvider;

  const provider = providers[configured];
  if (provider) return provider;

  console.warn(
    `[contact] Unknown CONTACT_PROVIDER "${configured}". Falling back to console logging.`,
  );
  return consoleProvider;
}
