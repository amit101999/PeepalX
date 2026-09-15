# Company Website

The marketing website for a technology services company: web and mobile
development, AI systems, automation and integrations, data tooling and Zoho
solutions.

It is a Next.js application. Almost every page is static HTML generated at build
time, so it loads fast and can be hosted anywhere that runs Node or serves
static files from a CDN. The only server-side piece is the contact form
endpoint.

---

## Contents

1. [Before you launch](#1-before-you-launch)
2. [Tech stack](#2-tech-stack)
3. [Folder structure](#3-folder-structure)
4. [Install and run](#4-install-and-run)
5. [Build and deploy](#5-build-and-deploy)
6. [Environment variables](#6-environment-variables)
7. [Adding and editing content](#7-adding-and-editing-content)
8. [SEO](#8-seo)
9. [How the contact form works](#9-how-the-contact-form-works)
10. [Component reference](#10-component-reference)
11. [Design system](#11-design-system)
12. [Accessibility](#12-accessibility)
13. [Performance](#13-performance)
14. [Security](#14-security)
15. [Testing, linting and formatting](#15-testing-linting-and-formatting)
16. [Growing the site later](#16-growing-the-site-later)

---

## 1. Before you launch

Four things ship as placeholders on purpose. Each one is a single, obvious edit.

| What              | Where                                 | Why it is a placeholder                                                                                                                                                                           |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company name**  | `src/config/site.ts` → `COMPANY_NAME` | The final brand name was not set when the site was built. Currently `"Northbound"`. Changing this one value updates the logo, page titles, footer, structured data and copyright line everywhere. |
| **Email address** | `src/config/site.ts` → `site.email`   | Currently `hello@example.com`.                                                                                                                                                                    |
| **Social links**  | `src/config/site.ts` → `socialLinks`  | All empty. Empty links are never rendered, so the footer simply shows no icons until you fill them in.                                                                                            |
| **Testimonials**  | `src/data/testimonials.ts`            | No real client quotes yet, so entries are labelled in the UI as example content. Projects are real delivered work only — see [Adding and editing content](#7-adding-and-editing-content).         |

Also worth doing before launch:

- Set `NEXT_PUBLIC_SITE_URL` to the real domain, or canonical URLs and the
  sitemap will point at `localhost`.
- Configure a real contact form provider (`CONTACT_PROVIDER=resend`), otherwise
  enquiries are only written to the server log.
- Replace the placeholder legal copy in `src/app/legal/*` with reviewed text.
- Add real team photos to `public/team/` and real bios in `src/data/team.ts`.

---

## 2. Tech stack

| Layer      | Choice                      | Why                                                                                                |
| ---------- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| Framework  | **Next.js 15** (App Router) | Static rendering by default, which gives good SEO and fast loads without a separate CMS or server. |
| Language   | **TypeScript** (strict)     | Content is typed, so a malformed project or team entry fails at build rather than in production.   |
| Styling    | **Tailwind CSS v4**         | Design tokens are declared once in `src/styles/globals.css` and used as utilities everywhere.      |
| Icons      | **lucide-react**            | One consistent icon set; only the icons actually imported are bundled.                             |
| Validation | **zod**                     | One schema shared by the browser, the API route and the tests.                                     |
| Tests      | **Vitest**                  | Fast, no configuration beyond one small file.                                                      |

**Four dependencies in total.** There is deliberately no animation library, no
component library, no form library and no `clsx`/`tailwind-merge`:

- Scroll and entrance animations are CSS plus a ~40-line
  `IntersectionObserver` component (`src/components/ui/Reveal.tsx`). An
  animation library would have cost roughly 35 KB for the same result.
- The accordion is native `<details>`/`<summary>`, which is accessible without
  any JavaScript or ARIA.
- The contact form uses the platform's `FormData` plus the zod schema.

---

## 3. Folder structure

```text
src/
  app/                      Routes. Each folder is a URL.
    page.tsx                Home page
    layout.tsx              Shell: fonts, header, footer, site-wide metadata
    services/               /services
    work/                   /work and /work/[slug] (case studies)
    about/  team/  contact/ /about, /team, /contact
    blog/                   /blog placeholder route
    legal/                  Privacy, terms and cookie pages
    api/contact/route.ts    Contact form endpoint
    sitemap.ts robots.ts    Generated sitemap.xml and robots.txt
    opengraph-image.tsx     Generated social sharing card
    icon.svg                Favicon
    not-found.tsx error.tsx 404 page and error boundary

  components/
    layout/     Navbar, Footer, Logo, PageHeader, SocialLinks, LegalDocument
    sections/   One file per page section (Hero, Services, Process, FAQ, …)
    ui/         Reusable primitives (Button, Section, Badge, Accordion, cards)
    forms/      ContactForm
    projects/   ProjectCard

  data/         All editable content — see section 7
  lib/
    validation/ Contact form schema (+ tests)
    seo/        Metadata helper and structured data builders
    email/      Contact provider abstraction (console, Resend)
    hooks/      useActiveSection
    utils/      cn class-name helper
    rate-limit.ts, analytics.ts
  config/site.ts  Company name, email, social links
  styles/globals.css  Design tokens and base styles
  types/index.ts      Shared content types

public/
  projects/   Project images
  team/       Team photos
  brand/      Logo file
```

The rule: **content lives in `src/data`, presentation lives in
`src/components`.** Editing the site's text should almost never mean editing a
component.

---

## 4. Install and run

Requirements: Node.js 18.18 or newer (Node 22 recommended) and npm.

```bash
npm install          # install dependencies
cp .env.example .env.local   # optional — the site runs without it
npm run dev          # start at http://localhost:3000
```

The site runs with no environment file at all. Without one it uses
`http://localhost:3000` as the site URL and logs contact form submissions to the
terminal instead of emailing them.

All scripts:

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # TypeScript, no emit
npm run lint         # ESLint
npm run test         # Vitest once
npm run test:watch   # Vitest in watch mode
npm run format       # Prettier write
npm run check        # typecheck + lint + test
```

---

## 5. Build and deploy

```bash
npm run build
npm run start
```

`npm run build` produces static HTML for every page except `/api/contact`.

**Vercel** — import the repository, add the environment variables from section
6, deploy. No configuration file is needed.

**Anywhere else** (Cloudflare, AWS, a container, your own server) — run
`npm run build` then `npm run start` behind a reverse proxy. The application
makes no assumptions about the host: there are no platform-specific APIs and no
hard-coded URLs. Everything under `/_next/static` and `/public` is
content-hashed and safe to cache aggressively on a CDN.

Security headers, including a Content Security Policy, are set in
`next.config.ts`. If your host applies its own headers, make sure they do not
conflict.

---

## 6. Environment variables

Copy `.env.example` to `.env.local`. Nothing here is required for the site to
run; each variable turns something on.

| Variable                         | Purpose                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Public origin, no trailing slash. Used for canonical URLs, the sitemap and social cards. **Set this in production.** |
| `CONTACT_PROVIDER`               | `console` (default, logs to the server) or `resend` (sends email).                                                   |
| `RESEND_API_KEY`                 | Resend API key. Server-only — never exposed to the browser.                                                          |
| `CONTACT_FROM_EMAIL`             | Verified sender address on your Resend domain.                                                                       |
| `CONTACT_TO_EMAIL`               | Where enquiries are delivered.                                                                                       |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Blank by default, which means no analytics scripts load at all.                                                      |
| `NEXT_PUBLIC_ANALYTICS_ID`       | The measurement or project id for that provider.                                                                     |

Only variables prefixed `NEXT_PUBLIC_` reach the browser. Anything else stays on
the server. `.env.local` is git-ignored — never commit real keys.

---

## 7. Adding and editing content

Everything in this section is a data file. No component changes are required.

### Add a project

Edit `src/data/projects.ts` and add an entry to the `projects` array. Only
publish real, delivered work, and name a client only with their permission.
The existing PMS portfolio accounting project is the full worked example.

```ts
{
  slug: "acme-portal",              // becomes /work/acme-portal
  title: "Acme Customer Portal",    // ≤ 60 characters (page title)
  category: "Web Application",
  description: "One sentence for the listing.", // ≤ 155 characters (meta description)
  technologies: ["Next.js", "Node.js", "PostgreSQL"],
  image: "/projects/acme-portal/cover.png",
  imageAlt: "Customer portal dashboard showing open orders and invoices",
  imageWidth: 1600,                 // the file's real pixel size
  imageHeight: 1000,
  year: "2026",
  client: "Logistics company, India", // optional; anonymous is fine
  role: "Design and full-stack development", // optional
  updatedAt: "2026-09-15",          // optional; used by the sitemap
  caseStudy: { /* optional, see below */ },
}
```

Put the images in `public/projects/<slug>/`. For screenshots, PNG keeps text
sharp; on Vercel they are served as AVIF/WebP automatically. If a screenshot
arrives as a JPEG (for example, shared over WhatsApp), keep it as a JPEG —
converting it to PNG makes the file bigger without making it sharper.

Things to know:

- **Always give screenshots their real `width`/`height`.** They then render
  uncropped and never wider than the file, and reserve their space so the page
  does not jump. `npm test` fails if a declared size does not match the file.
- **`caseStudy` is optional.** Include it and `/work/<slug>` renders the full
  write-up; omit it and the page shows the summary only.
- **`caseStudy.stages`** describes how the system works, in order, each with its
  capabilities and screenshots (with captions). Mark planned work
  `status: "next-phase"` and it is labelled "Next phase" on the page. If a
  screenshot uses demo figures, say "Shown with sample data" in its caption.
- **`stage.flow`** (optional) lists the steps work passes through inside a
  stage, in order — e.g. `["Dyeing", "Blend advice", "Spinning", …]`. It renders
  as a connected sequence under the stage heading. Use it only for a real
  order of steps, with at least two unique names.
- **`caseStudy.stack`** lists the products the system runs on and the job each
  does. Projects without `stages`/`stack` can use the simpler `features` and
  `architecture` lists instead.

The project page, the sitemap entry and the home page listing are all generated
from this array.

### Add or edit a service

Edit `src/data/services.ts`. Each service needs a `slug`, `title`, `summary`
(card text), `description` (services page text), `capabilities`, `technologies`
and an `icon` imported from `lucide-react`. Services appear on the home page,
the services page and in the footer menu automatically.

### Add or edit a team member

Edit `src/data/team.ts`. Add a square photo to `public/team/` (800×800 or
larger) and point `image` at it. Social links with an empty string are not
rendered, so an incomplete profile shows fewer icons rather than dead links.

### Add a testimonial

Edit `src/data/testimonials.ts`. Replace a placeholder entry with the real
quote, name, role and company — with that person's permission — and set
`isPlaceholder: false`. The "placeholder content" notice disappears once no
entry is marked as placeholder. Emptying the array removes the whole section.

### Other content files

| File                       | Controls                                               |
| -------------------------- | ------------------------------------------------------ |
| `src/data/faq.ts`          | FAQ questions. Also generates the FAQ structured data. |
| `src/data/domains.ts`      | The "Domains we can build for" list.                   |
| `src/data/technologies.ts` | The technology section groupings.                      |
| `src/data/process.ts`      | The six process stages.                                |
| `src/data/values.ts`       | Core values.                                           |
| `src/data/navigation.ts`   | Header links, footer columns, legal links.             |

### Update social links

Edit `socialLinks` in `src/config/site.ts`:

```ts
export const socialLinks = {
  linkedin: "https://linkedin.com/company/your-company",
  github: "", // empty = icon not shown anywhere
  twitter: "",
  instagram: "",
  youtube: "",
};
```

They are used by the footer and by the Organization structured data. This is the
only place they are defined.

---

## 8. SEO

Already in place:

- Per-page titles, descriptions and canonical URLs via `createMetadata()` in
  `src/lib/seo/metadata.ts`.
- Open Graph and Twitter card tags, with a social image generated at build time
  by `src/app/opengraph-image.tsx`.
- `sitemap.xml` and `robots.txt`, generated from real routes.
- Structured data (`src/lib/seo/structured-data.ts`): Organization, WebSite,
  Service, BreadcrumbList and FAQPage. Nothing is emitted that the page does not
  actually show.
- Semantic headings — one `<h1>` per page — and breadcrumbs on inner pages.

**To change a page's title or description**, edit the `createMetadata({ … })`
call at the top of that page file:

```ts
export const metadata = createMetadata({
  title: "Services",
  description: "…",
  path: "/services",
});
```

The title template (`Page — Company`) and the site defaults live in
`src/app/layout.tsx`.

---

## 9. How the contact form works

```text
ContactForm (browser)
   └─ validates with the zod schema, for immediate feedback
   └─ POST /api/contact
        ├─ 1. rate limit by IP           src/lib/rate-limit.ts
        ├─ 2. parse the JSON body
        ├─ 3. re-validate with the SAME schema (incl. honeypot)
        └─ 4. hand off to the configured provider   src/lib/email/
                ├─ console  → writes to the server log (default)
                └─ resend   → sends email via the Resend API
```

Key points:

- **The server never trusts the browser.** Client validation only makes the form
  pleasant to use; `src/app/api/contact/route.ts` re-validates everything.
- **One schema** (`src/lib/validation/contact.ts`) is used by the form, the API
  route and the tests, so they cannot disagree.
- **Spam handling is layered**: a hidden honeypot field that real users never
  fill in, plus per-IP rate limiting (5 submissions per 10 minutes).
- **Errors never leak.** Provider failures are logged server-side; the visitor
  sees a generic message.

### Switching email provider

Set `CONTACT_PROVIDER=resend` and provide `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`.

To add a different provider (SendGrid, SMTP, a CRM, a database), create a file
in `src/lib/email/` exporting an object that satisfies the `ContactProvider`
interface, then register it in the `providers` record in
`src/lib/email/index.ts`. Nothing else changes — the API route only ever talks
to the interface.

### A note on rate limiting

The limiter is an in-memory counter, which is right for a marketing site on a
single instance. On a multi-instance or serverless deployment each instance
keeps its own count. If you need a shared limit, swap the `Map` in
`src/lib/rate-limit.ts` for Redis or Vercel KV — `checkRateLimit()` is the only
function any caller uses.

---

## 10. Component reference

Only the components you are likely to need to change.

**Navbar** — `src/components/layout/Navbar.tsx`
Sticky site header. Edit the links in `src/data/navigation.ts` (`mainNav`), not
in the component. Handles the mobile menu, Escape to close, focus management,
scroll locking, and highlighting the section you are currently reading.

**Footer** — `src/components/layout/Footer.tsx`
Link columns come from `footerNav` and `legalNav` in `src/data/navigation.ts`.
Social icons come from `src/config/site.ts`.

**PageHeader** — `src/components/layout/PageHeader.tsx`
The title block at the top of every inner page. Pass `eyebrow`, `title`,
`description` and `breadcrumbs`.

**Section** — `src/components/ui/Section.tsx`
Wrapper for every page section: sets the background tone (`canvas`, `elevated`,
`ink`), vertical spacing, optional top border and the container. Use it for new
sections so spacing stays consistent.

**SectionHeading** — `src/components/ui/SectionHeading.tsx`
Eyebrow + heading + supporting line, with an `onDark` variant.

**Button** — `src/components/ui/Button.tsx`
Pass `href` to render a link styled as a button; omit it for a real `<button>`.
Variants: `primary`, `secondary`, `ghost`. External URLs get `rel="noopener
noreferrer"` automatically.

**Reveal** — `src/components/ui/Reveal.tsx`
Wraps content to fade it in on scroll. `delay` staggers a row of cards. Content
is visible by default and only hidden once it is confirmed to be below the fold,
so nothing disappears if JavaScript fails.

**Accordion** — `src/components/ui/Accordion.tsx`
Native `<details>`-based accordion. Takes `items: FaqItem[]`.

**ContactForm** — `src/components/forms/ContactForm.tsx`
See section 9. To change the form fields, edit the schema in
`src/lib/validation/contact.ts` first — the dropdown options are defined there.

**ServiceCard / ProjectCard / TeamMemberCard**
`src/components/ui/` and `src/components/projects/`. Each takes one item from
the matching data file.

---

## 11. Design system

All tokens are defined once, in the `@theme` block at the top of
`src/styles/globals.css`, and are available as Tailwind utilities.

| Token              | Value                    | Utility                    |
| ------------------ | ------------------------ | -------------------------- |
| `--color-canvas`   | `#fbfaf9` warm off-white | `bg-canvas`                |
| `--color-elevated` | `#f5f3f1`                | `bg-elevated`              |
| `--color-ink`      | `#17161a` near-black     | `text-ink`                 |
| `--color-muted`    | `#5e5d64`                | `text-muted`               |
| `--color-line`     | `#e6e2df`                | `border-line`              |
| `--color-accent`   | `#a54d27` copper         | `bg-accent`, `text-accent` |

Type scale (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead`,
`text-label`) is fluid: each size uses `clamp()` so it scales with the viewport
rather than jumping at breakpoints.

**To change the brand colour**, edit `--color-accent` and `--color-accent-hover`
(and `--color-accent-soft`, its tint) in that one block. Everything follows.

Typeface: Inter, loaded through `next/font`, which downloads it at build time
and serves it from your own domain — no runtime request to Google, and no
font-related layout shift.

---

## 12. Accessibility

- Semantic HTML throughout; interactive controls are real `<button>` and `<a>`
  elements, never clickable `<div>`s.
- A "Skip to main content" link is the first tab stop on every page.
- One visible focus ring style, defined once in `globals.css`.
- The mobile menu manages focus, closes on Escape, and locks page scroll.
- Form fields have real `<label>` elements, `aria-invalid`, error text linked
  by `aria-describedby`, and focus moves to the first invalid field on submit.
- The accordion uses native `<details>`, which is keyboard accessible by
  default.
- Every image has meaningful alt text; decorative SVGs are `aria-hidden`.
- `prefers-reduced-motion` is respected globally, and scroll-reveal elements are
  explicitly forced to their visible state so reduced motion never hides
  content.
- Every text colour token meets WCAG AA (4.5:1) on the light backgrounds, and
  light text on the dark sections is kept at 55% opacity or higher for the same
  reason. The values are checked in a comment in `globals.css`.

Worth doing before launch: a pass with a screen reader and a Lighthouse
accessibility audit on the deployed site.

---

## 13. Performance

- Pages are statically generated; the home page ships no page-level JavaScript
  beyond the header and the reveal wrapper.
- Four runtime dependencies, no animation or component library.
- Fonts are self-hosted with `display: swap`.
- Images use `next/image` with explicit `sizes`, so the browser never downloads
  an oversized file. The first project image is marked `priority`; the rest are
  lazy.
- No layout shift: the header has a fixed height and every image sits in a
  fixed-ratio container.
- The hero background is two CSS gradients rather than an image.

---

## 14. Security

- Security headers in `next.config.ts`: Content Security Policy, HSTS,
  `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy` and a
  restrictive `Permissions-Policy`.
- Every contact submission is validated server-side against the zod schema.
- Rate limiting and a honeypot field on the contact endpoint.
- User-supplied text is escaped before being interpolated into the notification
  email (`src/lib/email/format.ts`).
- No secrets in the repository. `.env.local` is git-ignored and only
  `NEXT_PUBLIC_`-prefixed variables reach the browser.
- Error responses are generic; provider errors and stack traces stay in the
  server log.
- `poweredByHeader` is disabled.

If you enable analytics or embed a third-party widget, you must widen
`script-src` and `connect-src` in the CSP in `next.config.ts` — otherwise the
script is silently blocked.

---

## 15. Testing, linting and formatting

```bash
npm run test    # Vitest
npm run lint    # ESLint (next/core-web-vitals + TypeScript rules)
npm run format  # Prettier, including Tailwind class sorting
npm run check   # all three, in the order CI should run them
```

Tests cover the places where a bug would be a security problem, a lost lead or a
broken page:

- **Contact API route** (`src/app/api/contact/route.test.ts`) — valid enquiries
  are delivered, invalid input and filled honeypots are rejected, repeat
  submissions are rate limited, and provider failures return a generic message
  without leaking configuration.
- **Contact form schema** — valid and invalid submissions, trimming, optional
  fields and unanswered dropdowns, the honeypot.
- **Rate limiter** — limits, windows, per-client isolation, proxy headers.
- **Content files** (`src/data/content.test.ts`) — unique slugs, every image path
  exists, footer links point at real services.

Presentational components are not snapshot-tested — that would add maintenance
without catching much.

---

## 16. Growing the site later

The structure is ready for these; none of them are built, on purpose.

**A blog** — `/blog` exists as a placeholder. Add `src/data/posts.ts` and a
`src/app/blog/[slug]/page.tsx` route following the pattern in
`src/app/work/[slug]/page.tsx`, then remove `noIndex` from the blog page
metadata and add the posts to `sitemap.ts`.

**A CMS** — components read from `src/data/*`. Replace those modules with
functions that fetch from your CMS, keep the types in `src/types/index.ts`, and
nothing in the components has to change.

**Analytics** — set the two environment variables and render the provider
script from a new `src/components/layout/Analytics.tsx`, using
`getAnalyticsConfig()` in `src/lib/analytics.ts`. Remember the CSP.

**More pages** — copy an existing page. The pattern is always: `createMetadata`
export, `PageHeader`, some `Section`s, a `CtaSection`, and a `JsonLd` breadcrumb.

Keep the guiding rule: **content in `src/data`, presentation in
`src/components`, one design system in `globals.css`.**
