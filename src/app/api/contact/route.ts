import { NextResponse } from "next/server";
import { getContactProvider } from "@/lib/email";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { contactFormSchema, toFieldErrors } from "@/lib/validation/contact";
import type { ContactApiResponse } from "@/lib/validation/contact";

/**
 * Contact form endpoint.
 *
 * Order of checks, each one cheap before the next:
 *   1. Rate limit by client IP.
 *   2. Parse the JSON body.
 *   3. Validate against the shared schema — including the honeypot field.
 *   4. Hand the validated enquiry to the configured provider.
 *
 * The response never leaks provider names, stack traces or configuration
 * detail. Failures are logged server-side and reported to the client as a
 * generic message.
 */

/** This route reads request headers, so it must not be statically rendered. */
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

function json(body: ContactApiResponse, status: number) {
  return NextResponse.json(body, { status });
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request body." }, 400);
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

  // The honeypot has already been rejected by the schema. Anything that gets
  // here is a well-formed enquiry from a real form.
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

  return json(
    {
      ok: true,
      message:
        "We have your message and will get back to you, usually within one business day.",
    },
    200,
  );
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
