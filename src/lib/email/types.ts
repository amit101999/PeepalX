import type { ContactFormValues } from "@/lib/validation/contact";

/** A validated contact form submission, plus server-side context. */
export interface Inquiry extends ContactFormValues {
  /** When the submission was received, ISO 8601. */
  receivedAt: string;
}

export interface DeliveryResult {
  ok: boolean;
  /** Provider-side error detail. Logged on the server, never sent to the client. */
  error?: string;
}

/**
 * Anything that can deliver a contact form submission.
 *
 * The API route only ever talks to this interface, so swapping Resend for
 * SendGrid, SMTP, a CRM or a database is a new file plus one line in
 * `getContactProvider`.
 */
export interface ContactProvider {
  /** Used in server logs to identify which provider handled a submission. */
  readonly name: string;
  deliver(inquiry: Inquiry): Promise<DeliveryResult>;
}
