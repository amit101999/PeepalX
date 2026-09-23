# Changelog

## 2026-09-17: production hardening

### Security

- The console contact provider is refused in production, so enquiries can no
  longer be logged instead of emailed while the visitor is told they were sent.
- `/api/contact` requires `Content-Type: application/json` and caps bodies at
  16 KB.
- A filled honeypot now gets the normal success response instead of a field
  error that reveals the trap.
- Resend error bodies are truncated before logging.
- HSTS no longer sends `preload`.

### SEO

- A Vercel production build fails without an https `NEXT_PUBLIC_SITE_URL`.
- Placeholder legal pages are noindex and left out of the sitemap until
  `site.legalCopyReviewed` is set.
- The sitemap no longer stamps static pages with the build date.
- Removed the non-standard `host` field from `robots.txt`.

### Reliability and structure

- Added `src/app/global-error.tsx` for failures in the root layout.
- `LegalDocument` owns the shared Contact section.
- Removed the unused `src/lib/analytics.ts` and its environment variables.
- Tests keep the contact form's service options and the footer's service links
  in step with `src/data/services.ts`.
- `npm run check` now includes `format:check`.
