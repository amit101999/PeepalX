# Deployment

The site is expected to run on Vercel. Needs developer confirmation: nothing in
the repository pins the host. The code uses no platform-specific APIs, so any
host that runs `next build` and `next start` works.

## Environment variables

| Variable               | Required in production | Notes                                                                                                 |
| ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | yes                    | `https://` origin, no trailing slash. Read at build time; a Vercel production build fails without it. |
| `CONTACT_PROVIDER`     | yes                    | `resend`. The `console` default is refused when `NODE_ENV=production`.                                |
| `RESEND_API_KEY`       | yes                    | Server-only secret.                                                                                   |
| `CONTACT_FROM_EMAIL`   | yes                    | A sender on a domain verified in Resend. `Name <address>` is allowed.                                 |
| `CONTACT_TO_EMAIL`     | yes                    | Where enquiries are delivered.                                                                        |

Set production and preview values separately. Preview deploys also run with
`NODE_ENV=production`, so they need a Resend configuration too; a separate test
key and inbox is fine.

## Before launch

- [ ] Production domain decided and `NEXT_PUBLIC_SITE_URL` set to it.
- [ ] Resend sending domain verified, and a real test enquiry sent end to end.
- [ ] `npm run check` and `npm run build` pass.
- [ ] Legal copy reviewed, then `site.legalCopyReviewed` set to `true`.
- [ ] Contact email and social links filled in `src/config/site.ts`.
- [ ] Lighthouse baseline recorded in [performance.md](performance.md).
- [ ] Search Console property created and `sitemap.xml` submitted.
- [ ] Uptime check configured (see [monitoring.md](monitoring.md)).

## After each deploy

- `/`, `/work/<slug>` and `/contact` load, and `/sitemap.xml` and `/robots.txt`
  show the production domain, not localhost.
- Response headers include the CSP and HSTS.
- One test enquiry arrives in the inbox.

## CI

There is no CI pipeline yet, and the repository has no remote configured. Once
it is on GitHub, one workflow that runs `npm ci`, `npm run check` and
`npm run build` on pull requests is enough.

## Rollback and backups

There is no database; the repository holds all state. Roll back by promoting the
previous deployment (Vercel keeps them). Enquiries live only in the destination
inbox, so that mailbox's retention is the backup.
