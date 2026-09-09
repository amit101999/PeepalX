/**
 * A small fixed-window rate limiter.
 *
 * Scope and limits, stated plainly: this counter lives in the memory of one
 * server instance. It stops casual form flooding from a single client, which
 * is what a marketing site actually needs. It does NOT survive a restart and
 * is NOT shared between instances, so on a multi-instance or serverless
 * deployment each instance enforces its own budget.
 *
 * If you outgrow that, replace the Map with a shared store (Redis, Upstash,
 * Vercel KV). `checkRateLimit` is the only function callers use, so swapping
 * the storage does not change any call site.
 */

interface Window {
  count: number;
  /** Epoch milliseconds at which this window expires. */
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Drop expired entries so the Map cannot grow without bound. */
function evictExpired(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  /** Requests still allowed in the current window. */
  remaining: number;
  /** Seconds until the window resets — sent as `Retry-After`. */
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Maximum requests allowed per window. */
  limit?: number;
  /** Window length in milliseconds. */
  windowMs?: number;
}

/**
 * Records a request against `identifier` and reports whether it is allowed.
 *
 * @param identifier Something stable per client, normally an IP address.
 */
export function checkRateLimit(
  identifier: string,
  { limit = 5, windowMs = 10 * 60 * 1000 }: RateLimitOptions = {},
): RateLimitResult {
  const now = Date.now();
  evictExpired(now);

  const existing = windows.get(identifier);

  if (!existing || existing.resetAt <= now) {
    windows.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > limit) {
    return { success: false, remaining: 0, retryAfterSeconds };
  }

  return {
    success: true,
    remaining: limit - existing.count,
    retryAfterSeconds,
  };
}

/** Clears all counters. Exists for tests. */
export function resetRateLimits(): void {
  windows.clear();
}

/**
 * Best-effort client IP from proxy headers.
 *
 * These headers are set by the hosting platform's proxy. A direct client can
 * spoof them, which is acceptable here: the limiter is a speed bump in front
 * of a contact form, not an authorisation control.
 */
export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}
