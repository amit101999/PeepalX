# Changelog

## 2026-09-26: logo mark redrawn to match the official file

- The SVG mark (`BRAND_MARK_PATHS` in `Logo.tsx`) was checked against the
  supplied logo (`docs/WhatsApp Image ….jpeg`) by overlaying its outlines on
  the image, then redrawn from pixel measurements on a uniform grid. Fixes:
  - the bowl's blue-to-cyan ribbon now ends at a twist around 4 o'clock and
    shows its reverse side (a new `back` piece, `BRAND_COLORS.navyBack`) down
    to the X stroke, as in the original; before, the blue ran all the way round;
  - the X stroke and the stem are longer, matching the original;
  - the mark was about 4% too tall for its width; the viewBox is now
    `0 0 514 556`.
- Updated everywhere the mark appears: header and footer logo, hero mark
  (still with its stroke run down to the baseline, words re-routed along the
  new centre lines), services map, closing-block silhouette, social card,
  favicon and `public/brand/logo.svg`.

## 2026-09-26: work page motion pass (tasteskill.dev direction)

- The `/work` header now has a visual: the project covers as a 3D deck of
  chamfered plates (`projects/CoverDeck.tsx`, Three.js), receding at the
  logo's 45°, settling in one after another and turning slightly towards the
  mouse. Large screens only; decorative (every cover is in the list below).
  Textures are 640px images from the optimiser (SVG covers use their PNG
  share image). Three.js loads only once the deck is on screen, so phones and
  tablets never download it; the loop pauses offscreen; reduced motion gets
  one still frame; without WebGL the lead cover shows as a still image.
- Two-tone page title ("case studies" in the accent green). `PageHeader`
  accepts a `ReactNode` title and an optional `aside` slot; other pages are
  unchanged.
- The projects under the lead feature are a staggered two-column grid
  (`projects/ParallaxGrid.tsx`): the right column starts 112px lower and rises
  into line as the reader scrolls (Motion `useScroll`, `md` up, off under
  reduced motion via CSS so server and client markup match). Reading order is
  unchanged.
- Measured: /work initial JS 226.7 KB gzip vs 179.5 KB on /about (the Motion
  cost the home page already pays); Three.js is not in the initial load.

## 2026-09-25: home page motion pass (tasteskill.dev direction)

- Two-tone headings on the home page: the key words ("run on", "build",
  "work", "with us") in the accent green, same typeface.
- New scroll-scrubbed statement between Services and Selected work
  (`sections/home/Statement.tsx`): the company's position on scope, from the
  About story, fills in word by word as it is read, with two inline icon chips.
- Why-us is now a sticky card stack (`sections/home/StackList.tsx`): each card
  pins slightly lower than the last and scales back as the next slides over.
- The hero's primary action has a magnetic pull for mouse users
  (`ui/Magnetic.tsx`).
- The home closing block has a Three.js wave of points behind it
  (`sections/home/SignalField.tsx`, opt-in via `<CtaSection field />`). Three.js
  is imported only when the block is within 300px of the viewport, renders only
  while on screen, and draws a still frame under reduced motion.
- Dependencies added: `motion` (scroll-linked and spring motion, loaded with
  `LazyMotion` + `domMin`) and `three`. Home initial JS measured at 229.7 KB
  gzip vs 183.8 KB on /about (same layout and closing block), so Motion adds
  about 40-45 KB to the home page; Three.js is not in the initial load.
- Everything respects `prefers-reduced-motion`; text is fully visible before
  hydration and without JavaScript.

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
