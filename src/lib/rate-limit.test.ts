import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, getClientIdentifier, resetRateLimits } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit("1.2.3.4", { limit: 3 }).success).toBe(true);
    }
  });

  it("blocks the request that exceeds the limit", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("1.2.3.4", { limit: 3 });

    const blocked = checkRateLimit("1.2.3.4", { limit: 3 });
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("counts each identifier independently", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("1.2.3.4", { limit: 3 });

    expect(checkRateLimit("5.6.7.8", { limit: 3 }).success).toBe(true);
  });

  it("allows requests again once the window has passed", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("1.2.3.4", { limit: 3, windowMs: 1000 });
    expect(checkRateLimit("1.2.3.4", { limit: 3, windowMs: 1000 }).success).toBe(false);

    vi.advanceTimersByTime(1001);

    expect(checkRateLimit("1.2.3.4", { limit: 3, windowMs: 1000 }).success).toBe(true);
  });

  it("reports the remaining budget", () => {
    expect(checkRateLimit("9.9.9.9", { limit: 2 }).remaining).toBe(1);
    expect(checkRateLimit("9.9.9.9", { limit: 2 }).remaining).toBe(0);
  });
});

describe("getClientIdentifier", () => {
  it("uses the first entry of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 70.41.3.18" });
    expect(getClientIdentifier(headers)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "198.51.100.7" });
    expect(getClientIdentifier(headers)).toBe("198.51.100.7");
  });

  it("returns a stable value when no proxy headers are present", () => {
    expect(getClientIdentifier(new Headers())).toBe("unknown");
  });
});
