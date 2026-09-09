import { describe, expect, it } from "vitest";
import { contactFormSchema, toFieldErrors } from "./contact";

/** A submission with every required field valid. */
function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jordan Blake",
    email: "jordan@example.com",
    service: "Web Development",
    message: "We need an internal dashboard that pulls data from two systems.",
    ...overrides,
  };
}

describe("contactFormSchema", () => {
  it("accepts a minimal valid submission", () => {
    const result = contactFormSchema.safeParse(validPayload());
    expect(result.success).toBe(true);
  });

  it("trims whitespace and drops empty optional fields", () => {
    const result = contactFormSchema.safeParse(
      validPayload({ name: "  Jordan Blake  ", company: "   ", phone: "" }),
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.name).toBe("Jordan Blake");
    expect(result.data.company).toBeUndefined();
    expect(result.data.phone).toBeUndefined();
  });

  it("rejects an invalid email address", () => {
    const result = contactFormSchema.safeParse(validPayload({ email: "not-an-email" }));

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(toFieldErrors(result.error).email).toBeDefined();
  });

  it("rejects a message that is too short to act on", () => {
    const result = contactFormSchema.safeParse(validPayload({ message: "hi" }));

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(toFieldErrors(result.error).message).toBeDefined();
  });

  it("rejects a service that is not one of the offered options", () => {
    const result = contactFormSchema.safeParse(
      validPayload({ service: "Quantum Consulting" }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects a submission where the honeypot field was filled in", () => {
    const result = contactFormSchema.safeParse(
      validPayload({ website: "http://spam.example" }),
    );

    expect(result.success).toBe(false);
  });

  it("accepts optional budget, timeline and phone when provided", () => {
    const result = contactFormSchema.safeParse(
      validPayload({
        company: "Blake Logistics",
        phone: "+44 20 7946 0000",
        budget: "$15,000 - $50,000",
        timeline: "1 - 3 months",
      }),
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.phone).toBe("+44 20 7946 0000");
    expect(result.data.budget).toBe("$15,000 - $50,000");
  });

  it("rejects a phone number containing letters", () => {
    const result = contactFormSchema.safeParse(validPayload({ phone: "call me maybe" }));

    expect(result.success).toBe(false);
  });

  it("rejects an oversized message rather than truncating it", () => {
    const result = contactFormSchema.safeParse(
      validPayload({ message: "a".repeat(4001) }),
    );

    expect(result.success).toBe(false);
  });
});

describe("toFieldErrors", () => {
  it("keeps only the first error for each field", () => {
    const result = contactFormSchema.safeParse({
      name: "",
      email: "",
      service: "Web Development",
      message: "",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = toFieldErrors(result.error);
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
    expect(typeof errors.name).toBe("string");
  });
});
