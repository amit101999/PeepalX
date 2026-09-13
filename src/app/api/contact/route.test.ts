import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimits } from "@/lib/rate-limit";
import { GET, POST } from "./route";

/**
 * Tests for the contact endpoint as a whole: the real handler, the real schema,
 * the real rate limiter and the real provider selection. These are the checks
 * that decide whether an enquiry is delivered, rejected, or leaks detail.
 */

let ipCounter = 0;

/** Builds a POST request. Each call gets a fresh IP unless one is given. */
function contactRequest(body: unknown, ip = `203.0.113.${++ipCounter}`) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Jordan Blake",
  email: "jordan@example.com",
  service: "Web Development",
  message: "We need an internal dashboard that pulls data from two systems.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimits();
    // The default console provider writes each enquiry to the log.
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("accepts a valid enquiry and hands it to the provider", async () => {
    const response = await POST(contactRequest(validBody));
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Jordan Blake"));
  });

  it("accepts optional dropdowns left unanswered as empty strings", async () => {
    const response = await POST(
      contactRequest({ ...validBody, budget: "", timeline: "", company: "", phone: "" }),
    );

    expect(response.status).toBe(200);
  });

  it("rejects invalid input with field-level errors", async () => {
    const response = await POST(contactRequest({ ...validBody, email: "nope" }));
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("rejects a submission with the honeypot filled in, without delivering it", async () => {
    const response = await POST(
      contactRequest({ ...validBody, website: "http://spam.example" }),
    );

    expect(response.status).toBe(400);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(contactRequest("{not json"));

    expect(response.status).toBe(400);
  });

  it("rate limits repeated submissions from one client", async () => {
    const ip = "198.51.100.99";

    for (let i = 0; i < 5; i++) {
      expect((await POST(contactRequest(validBody, ip))).status).toBe(200);
    }

    const blocked = await POST(contactRequest(validBody, ip));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("reports a provider failure generically, without leaking configuration", async () => {
    // Resend selected but not configured, so delivery fails.
    vi.stubEnv("CONTACT_PROVIDER", "resend");
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await POST(contactRequest(validBody));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toMatch(/resend|api[_ ]?key|CONTACT_/i);
    // The detail is still logged server-side for whoever operates the site.
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining("resend"));
  });
});

describe("GET /api/contact", () => {
  it("is not allowed", async () => {
    const response = GET();

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });
});
