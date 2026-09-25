# Changelog

## 2026-09-25: services page redesign

- `/services` opens on a service map: the six services as a linked index
  beside a diagram of them around the PeepalX core. Pointing at a service
  lights up its node (CSS `:has()`, no JavaScript).
- Each service now has its own animated diagram of how that kind of system
  fits together (request path, phone and API, retrieval pipeline, integration
  loop, data to report, Zoho hub), drawn in `src/components/services/`.
- On wide screens in browsers with scroll-driven animation (Chromium, Safari
  26), the diagrams share one sticky plate that switches and builds as each
  service is read, with a progress rail. Elsewhere (small screens, Firefox,
  reduced motion, print) each service shows its own diagram inline.
- All motion is CSS (`globals.css`, "Services page"); no dependency added.
  Reduced motion shows every diagram fully drawn and hides the moving dots.
- Anchor ids (`/services#ai-systems` and the rest) are unchanged.

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
