import { inquiryHtml, inquirySubject, inquiryText } from "./format";
import type { ContactProvider, DeliveryResult, Inquiry } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Delivers enquiries by email through Resend.
 *
 * Uses `fetch` against the REST API rather than the Resend SDK — one HTTP call
 * does not justify a dependency.
 *
 * Required environment variables:
 *   RESEND_API_KEY      server-only secret, never exposed to the browser
 *   CONTACT_FROM_EMAIL  a verified sender on your Resend domain
 *   CONTACT_TO_EMAIL    where enquiries are delivered
 */
export const resendProvider: ContactProvider = {
  name: "resend",

  async deliver(inquiry: Inquiry): Promise<DeliveryResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !from || !to) {
      return {
        ok: false,
        error:
          "Resend is not configured. Set RESEND_API_KEY, CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL.",
      };
    }

    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          // Lets us reply straight to the sender from the notification email.
          reply_to: inquiry.email,
          subject: inquirySubject(inquiry),
          text: inquiryText(inquiry),
          html: inquiryHtml(inquiry),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        return { ok: false, error: `Resend responded ${response.status}: ${detail}` };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown transport error",
      };
    }
  },
};
