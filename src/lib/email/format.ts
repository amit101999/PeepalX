import type { Inquiry } from "./types";

/**
 * Escapes text for safe interpolation into an HTML email body.
 *
 * Inquiry fields are attacker-controlled. Without this, a submitted message
 * could inject markup into the email we send ourselves.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Field label / value pairs, omitting fields that were left blank. */
function inquiryFields(inquiry: Inquiry): [string, string][] {
  const fields: [string, string | undefined][] = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Company", inquiry.company],
    ["Phone", inquiry.phone],
    ["Service", inquiry.service],
    ["Budget", inquiry.budget],
    ["Timeline", inquiry.timeline],
    ["Received", inquiry.receivedAt],
  ];

  return fields.filter((entry): entry is [string, string] => Boolean(entry[1]));
}

export function inquirySubject(inquiry: Inquiry): string {
  return `New enquiry — ${inquiry.service} — ${inquiry.name}`;
}

export function inquiryText(inquiry: Inquiry): string {
  const details = inquiryFields(inquiry)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `${details}\n\nMessage:\n${inquiry.message}\n`;
}

export function inquiryHtml(inquiry: Inquiry): string {
  const rows = inquiryFields(inquiry)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b6a70;">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 0;color:#17161a;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  // `white-space: pre-wrap` preserves the line breaks the sender typed.
  const message = escapeHtml(inquiry.message);

  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;">
  <h2 style="margin:0 0 16px;font-size:16px;color:#17161a;">New project enquiry</h2>
  <table style="border-collapse:collapse;margin-bottom:20px;">${rows}</table>
  <div style="color:#6b6a70;margin-bottom:6px;">Message</div>
  <div style="white-space:pre-wrap;color:#17161a;">${message}</div>
</div>`;
}
