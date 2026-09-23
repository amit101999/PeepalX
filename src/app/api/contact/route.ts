import { NextResponse } from "next/server";
import { getContactProvider } from "@/lib/email";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import {
  CONTACT_SUCCESS_MESSAGE,
  contactFormSchema,
  isHoneypotFilled,
  toFieldErrors,
} from "@/lib/validation/contact";
import type { ContactApiResponse } from "@/lib/validation/contact";

/**
 * Contact form endpoint.
 *
 * Order of checks, each one cheap before the next:
 *   1. Rate limit by client IP.
 *   2. Require a JSON body no larger than MAX_BODY_BYTES.
 *   3. Silently accept (and drop) submissions with the honeypot filled in.
 *   4. Validate against the shared schema.
 *   5. Hand the validated enquiry to the configured provider.
 *
 * The response never leaks provider names, stack traces or configuration
 * detail. Failures are logged server-side and reported to the client as a
 * generic message.
 */

/** This route reads request headers, so it must not be statically rendered. */
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

/**
 * The largest valid enquiry is about 4.5 KB of text (see the schema's max
 * lengths), so 16 KB leaves room for multi-byte characters and JSON escaping
 * while refusing anything that is clearly not a form submission.
 */
export const MAX_BODY_BYTES = 16 * 1024;

function json(body: ContactApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

/**
 * Reads the body as text, giving up as soon as it passes `maxBytes`. Unlike
 * `request.text()`, a streamed body with no Content-Length is never buffered
 * past the limit. Returns null when the body is too large.
 */
async function readBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    // The client aborted mid-upload. An empty body fails JSON parsing (400).
    return "";
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function POST(request: Request): Promise<NextResponse> {
  const identifier = getClientIdentifier(request.headers);
  const rateLimit = checkRateLimit(identifier, RATE_LIMIT);

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many messages sent from this connection. Please try again shortly.",
      } satisfies ContactApiResponse,
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const mediaType = request.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return json({ ok: false, message: "Invalid request body." }, 415);
  }

  // The declared length rejects an honest oversized request without reading it;
  // the streamed read enforces the limit when the header is missing or wrong.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "Your message is too large to send." }, 413);
  }

  const body = await readBodyWithLimit(request, MAX_BODY_BYTES);
  if (body === null) {
    return json({ ok: false, message: "Your message is too large to send." }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
  }

  if (isHoneypotFilled(payload)) {
    // Counted, never logged with its contents.
    console.warn("[contact] Honeypot submission dropped");
    return json({ ok: true, message: CONTACT_SUCCESS_MESSAGE }, 200);
  }

  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Please correct the highlighted fields and try again.",
        errors: toFieldErrors(parsed.error),
      },
      400,
    );
  }

  const provider = getContactProvider();
  const result = await provider.deliver({
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  if (!result.ok) {
    // Logged for us; never returned to the client.
    console.error(`[contact] Delivery failed via ${provider.name}: ${result.error}`);

    return json(
      {
        ok: false,
        message:
          "We could not send your message right now. Please try again in a few minutes.",
      },
      502,
    );
  }

  return json({ ok: true, message: CONTACT_SUCCESS_MESSAGE }, 200);
}

/** Anything other than POST is not supported here. */
export function GET(): NextResponse {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    {
      status: 405,
      headers: { Allow: "POST" },
    },
  );
}
