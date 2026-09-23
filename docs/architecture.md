# Architecture

A Next.js 16 App Router site (React 19, TypeScript strict, Tailwind v4). It is a
modular monolith with no database and no login: pages are pre-rendered at build
time, and the only runtime backend is `POST /api/contact`.

```text
Browser ──► pre-rendered pages, /_next/static, /public
        └─► POST /api/contact ──► rate limit ──► body checks ──► zod schema
                                                                   │
                                                          ContactProvider
                                                           ├─ resend  (production)
                                                           └─ console (development only)
```

## Modules

| Module                                | Interface callers use                       | Hides                                                           |
| ------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `src/data/*`                          | Typed arrays and `getXBySlug()` helpers     | All site copy; checked by `src/data/content.test.ts`            |
| `src/config/site.ts`                  | `site`, `siteUrl`, `activeSocialLinks`      | Company details and content switches (`legalCopyReviewed`)      |
| `src/config/env.ts`                   | `parseServerEnv()`                          | Server env validation; production refuses the console provider  |
| `src/lib/email`                       | `getContactProvider().deliver(inquiry)`     | Provider choice, the Resend HTTP call, timeouts, email escaping |
| `src/lib/rate-limit.ts`               | `checkRateLimit()`, `getClientIdentifier()` | Counter storage (in memory today)                               |
| `src/lib/validation/contact.ts`       | `contactFormSchema`, `toFieldErrors()`      | Field rules, shared by the browser, the route and the tests     |
| `src/lib/seo`                         | `createMetadata()`, schema builders         | Canonical URLs, Open Graph/Twitter tags, JSON-LD shapes         |
| `src/components/layout/LegalDocument` | `sections`, `contactSubject`, `lastUpdated` | The placeholder notice and the shared Contact section           |

## Rules

- **Content in `src/data`, presentation in `src/components`.** Editing copy
  should not mean editing a component.
- **Server Components by default.** Client JavaScript is limited to `Navbar`,
  `ContactForm`, `StageRail`, `use-active-section` and the error boundaries.
  Anything those files import ships to the browser. That is why
  `src/data/navigation.ts` and the contact schema keep their own copies of the
  service titles; `content.test.ts` keeps those copies equal to
  `src/data/services.ts`.
- **One seam per external dependency.** Email delivery goes through
  `ContactProvider`, and the rate-limit store sits behind `checkRateLimit`.
  Swapping either does not touch the route.

## Known follow-ups

Deliberately not done yet:

- `PageHeader` could emit the breadcrumb JSON-LD itself, removing the copy each
  page renders (the legal pages currently emit none).
- `src/app/work/[slug]/page.tsx` and `src/components/forms/ContactForm.tsx` each
  hold several components and should be split.
- `ContactForm` treats any non-JSON response (for example a platform 413 or 504
  page) as "could not reach the server".
- `src/data/projects.ts` (about 1,250 lines) could become one file per project.
- Type fields marked "not rendered yet" in `src/types/index.ts` should be wired
  up or removed.
