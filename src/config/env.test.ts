import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

const resendConfig = {
  CONTACT_PROVIDER: "resend",
  RESEND_API_KEY: "re_test_key",
  CONTACT_FROM_EMAIL: "website@peepalx.example",
  CONTACT_TO_EMAIL: "hello@peepalx.example",
};

function issuesOf(source: Record<string, string | undefined>): string[] {
  const result = parseServerEnv(source);
  return result.ok ? [] : result.issues;
}

describe("parseServerEnv", () => {
  it("defaults to the console provider when nothing is configured", () => {
    const result = parseServerEnv({});

    expect(result.ok).toBe(true);
    expect(result.ok && result.env.CONTACT_PROVIDER).toBe("console");
  });

  it("treats blank values from an env file as unset", () => {
    const result = parseServerEnv({ CONTACT_PROVIDER: "  ", RESEND_API_KEY: "" });

    expect(result.ok && result.env.CONTACT_PROVIDER).toBe("console");
  });

  it("accepts a complete Resend configuration, ignoring case and whitespace", () => {
    const result = parseServerEnv({ ...resendConfig, CONTACT_PROVIDER: " Resend " });

    expect(result.ok).toBe(true);
    expect(result.ok && result.env.CONTACT_PROVIDER).toBe("resend");
  });

  it("names every missing variable when Resend is selected without its settings", () => {
    const issues = issuesOf({ CONTACT_PROVIDER: "resend", RESEND_API_KEY: "" });

    expect(issues).toHaveLength(3);
    expect(issues.join("\n")).toContain("RESEND_API_KEY");
    expect(issues.join("\n")).toContain("CONTACT_FROM_EMAIL");
    expect(issues.join("\n")).toContain("CONTACT_TO_EMAIL");
  });

  it("rejects an unknown provider instead of silently logging enquiries", () => {
    expect(issuesOf({ CONTACT_PROVIDER: "sendgrid" }).join("\n")).toContain(
      "CONTACT_PROVIDER",
    );
  });

  it('accepts a sender with a display name, as in "Name <address>"', () => {
    const result = parseServerEnv({
      ...resendConfig,
      CONTACT_FROM_EMAIL: "peepalX <website@peepalx.example>",
    });

    expect(result.ok).toBe(true);
  });

  it("rejects a display-name sender whose address is invalid", () => {
    const issues = issuesOf({ ...resendConfig, CONTACT_FROM_EMAIL: "peepalX <broken>" });

    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain("CONTACT_FROM_EMAIL");
    expect(issues[0]).not.toContain("broken");
  });

  it("rejects a malformed delivery address", () => {
    const issues = issuesOf({ ...resendConfig, CONTACT_TO_EMAIL: "not-an-email" });

    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain("CONTACT_TO_EMAIL");
  });

  it("never includes configured values in its messages", () => {
    const secret = "re_live_do_not_log_me";
    const issues = issuesOf({
      ...resendConfig,
      RESEND_API_KEY: secret,
      CONTACT_FROM_EMAIL: "broken",
    });

    expect(issues.length).toBeGreaterThan(0);
    expect(issues.join("\n")).not.toContain(secret);
  });
});
