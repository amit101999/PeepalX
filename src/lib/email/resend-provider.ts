import { inquiryHtml, inquirySubject, inquiryText } from "./format";
import type { ContactProvider, DeliveryResult, Inquiry } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * How long to wait for Resend before giving up. Keeps a slow upstream from
 * holding the serverless function (and the visitor) open indefinitely.
 */
const REQUEST_TIMEOUT_MS = 10_000;

/** Longest slice of an upstream error body kept for the server log. */
const MAX_ERROR_DETAIL_LENGTH = 300;

export interface ResendConfig {
  /** Server-only secret, never exposed to the browser. */
  apiKey: string;
  /** A verified sender on the Resend domain. */
  from: string;
  /** Where enquiries are delivered. */
  to: string;
}

/**
 * Delivers enquiries by email through Resend.
 *
 * Receives already-validated configuration (see `src/config/env.ts`) rather
 * than reading environment variables itself, so it cannot run half-configured.
 *
 * Uses `fetch` against the REST API rather than the Resend SDK — one HTTP call
 * does not justify a dependency.
 */
export function createResendProvider({
  apiKey,
  from,
  to,
}: ResendConfig): ContactProvider {
  return {
    name: "resend",

    async deliver(inquiry: Inquiry): Promise<DeliveryResult> {
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
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
          // Resend's error body names the problem (bad key, unverified domain).
          // Capped so an unexpected HTML error page cannot flood the logs.
          const detail = (await response.text()).slice(0, MAX_ERROR_DETAIL_LENGTH);
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
}
