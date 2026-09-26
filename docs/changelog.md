# Changelog

## 2026-09-26: services page motion pass (tasteskill.dev direction)

- The service map's diagram is now a slowly turning 3D orbit
  (`services/ServiceOrbit.tsx`, Three.js): the six services circle the PeepalX
  core, with work pulsing out along each spoke. Pointing at or tabbing to a
  service in the index turns the orbit to bring it to the front and lights its
  spoke. The service chips are HTML (Lucide icons, text) placed over their 3D
  positions each frame.
- It is a progressive enhancement over the existing SVG diagram, which is
  still the server HTML and stays in place below 640px, under reduced motion,
  without WebGL, and until Three.js has loaded. Three.js is imported only when
  the diagram is within 200px of the viewport, and renders only while on screen.
- "How a project runs" is a pinned horizontal pan from 1280px up
  (`sections/ProcessPan.tsx`, Motion `useScroll`): the section holds while the
  six stages slide past, and a line fills along them, lighting each stage as it
  arrives. Smaller screens, reduced motion and pre-hydration keep the existing
  timeline.
- Gotcha: Motion hands `opacity` bound directly to a scroll-derived value to a
  scroll-timeline animation, and in testing that animation ignored the input
  range, so the stage markers never filled. Chaining one more `useTransform`
  keeps it on Motion's own path.

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
