# Security

## Response headers

Set for every route in `next.config.ts`:

- `Content-Security-Policy`: `default-src 'self'`, no third-party origins,
  `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains` (no `preload`).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin` and a restrictive
  `Permissions-Policy`. `X-Powered-By` is disabled.

### Accepted trade-offs

- **`script-src 'unsafe-inline'`.** Next.js injects inline bootstrap scripts. A
  nonce-based CSP would remove this, but it forces every page to render per
  request instead of being pre-rendered. The site renders no user-generated
  HTML, so the XSS surface it would protect is small. Revisit if that changes.
- **HSTS without `preload`.** Preloading hard-codes https for the domain and all
  its subdomains in browsers, and takes months to undo. Add it only after the
  domain owner decides to submit to hstspreload.org.

## Contact endpoint

`src/app/api/contact/route.ts` runs its checks cheapest first:

1. **Rate limit:** 5 requests per 10 minutes per client IP (429).
2. **Content type** must be `application/json` (415).
3. **Body size** at most 16 KB (413), checked from `Content-Length` and again
   after reading.
4. **Honeypot:** a filled hidden `website` field gets the normal success
   response and is dropped, so bots cannot tell which field is the trap.
5. **Schema:** zod validation with a length limit on every field (400).
6. **Delivery** through the configured provider. A failure logs the reason on
   the server and returns a generic 502.

User text is HTML-escaped before it goes into the notification email
(`src/lib/email/format.ts`).

### Limits of the rate limiter

The counter lives in memory, per server instance. On serverless hosting each
instance counts separately and counts reset on cold starts, so it slows casual
flooding but guarantees nothing. The client IP comes from `x-forwarded-for`,
which Vercel overwrites; behind any other proxy, make sure the proxy sets that
header itself.

If spam becomes a real problem, the options in order of effort are a shared
store (Upstash Redis or Vercel KV) behind `checkRateLimit`, then a challenge
such as Cloudflare Turnstile, which also needs a CSP change.

## Secrets and configuration

- `.env*` files are git-ignored; only `.env.example` is committed.
- Server secrets (`RESEND_API_KEY`) are read only through `src/config/env.ts`.
  Only `NEXT_PUBLIC_*` variables reach the browser.
- Configuration errors name the variable, never its value.
- When `NODE_ENV=production` the console provider is refused. It would tell
  visitors their message was sent while only writing their personal details to
  the log.

## Logging rules

Never log passwords, API keys or enquiry contents in production. Resend error
bodies are cut to 300 characters before they are logged.
