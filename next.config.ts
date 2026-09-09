import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * The CSP is intentionally strict. `unsafe-inline` is required for styles
 * because Next.js injects inline <style> tags for critical CSS; scripts do not
 * need it in production builds.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects a small inline bootstrap script; `unsafe-eval` is only
  // needed by the dev-mode React refresh runtime.
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Project placeholders are SVG. Next refuses to optimise SVG by default
    // because a hostile SVG can carry script. These three settings are the
    // documented safe combination: SVGs are served with their own restrictive
    // CSP and as a download rather than an inline document, so they cannot
    // execute in the site's origin. Only local files under /public are served
    // here — no remote patterns are configured.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
