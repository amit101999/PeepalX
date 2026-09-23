import { inquirySubject, inquiryText } from "./format";
import type { ContactProvider, DeliveryResult, Inquiry } from "./types";

/**
 * The default provider: writes the enquiry to the server console.
 *
 * This exists so the contact form works end to end in development with no
 * accounts, API keys or env file. It logs the visitor's personal details, so
 * `src/config/env.ts` refuses it when `NODE_ENV=production`: set
 * `CONTACT_PROVIDER=resend`, or add your own provider, before launch.
 */
export const consoleProvider: ContactProvider = {
  name: "console",

  async deliver(inquiry: Inquiry): Promise<DeliveryResult> {
    console.warn(
      `[contact] ${inquirySubject(inquiry)}\n${inquiryText(inquiry)}\n` +
        "[contact] CONTACT_PROVIDER is 'console' — this enquiry was logged, not emailed.",
    );

    return { ok: true };
  },
};
