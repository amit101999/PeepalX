# Changelog

## 2026-09-26: smooth inner curve on the logo's bowl

- The inner edge of the P's blue-to-cyan ribbon was three joined curves that
  ran straight up, then cut across, leaving an S-shaped wobble and a pinched
  tip at the twist. It is now one quarter ellipse (centre 326,285; radii
  146 x 173), so the ribbon narrows evenly from the top of the bowl to the
  twist, as in the supplied logo. Changed once in `BRAND_MARK_PATHS.bowl`,
  so every logo follows, plus the static `icon.svg` and `public/brand/logo.svg`.

## 2026-09-26: one navy in the logo, plainer /team header

- **Logo:** the ribbon's reverse side (the `back` piece under the curve of the
  P) was a separate deep blue (`#0B3070`) that read as an extra shade. It is
  now the same navy as the stem and leg in every copy of the mark: header,
  footer, hero, /about 3D assembly, service map, share image, favicon and
  `public/brand/logo.svg`. `BRAND_COLORS.navyBack` is removed.
- **/team:** the founder constellation in the header is removed (it did not
  read well), along with `team/FounderConstellation.tsx`. The header is now
  the title and intro alone, like /services and /contact. The founder columns,
  tilting portraits and reading rail below are unchanged.

## 2026-09-26: the header logo everywhere

- **Hero:** the mark is now exactly the header logo (`BRAND_MARK_PATHS` on
  the 514 x 556 viewBox). It used to draw a longer X stroke that ran down to
  the baseline. It is also larger (up to 520px wide; the hero columns are now
  even). Its position, the words scrolling inside it, the registration marks,
  the piece-by-piece entrance and the pause button are unchanged.
- **/about:** the 3D assembly still flies the six plates in and leans towards
  the mouse, but it now settles face on with the plates flush, and each
  plate's face is painted from the logo's own fills (canvas textures with the
  same multi-stop gradients) instead of lighting. Assembled, it is the header
  logo. The layers no longer breathe apart after assembling, since that
  pulled the logo out of shape.

## 2026-09-26: cross-page design consistency pass

Every page was checked at 1440px and 390px, with and without reduced motion,
against the shared design system (README §11).

- **Fixed a hydration error on the home page.** `Magnetic` (the hero's main
  button) rendered a wrapper on the server but not on a reduced-motion client.
  It now always renders the wrapper and simply does not move. `Magnetic` and
  `StackList` read the preference through the hydration-safe
  `usePrefersReducedMotion` hook.
- **One two-tone headline.** The green accent phrase was on five other
  headings with no rule (/about and /work headers, three home sections). It
  is now only in the home hero.
- **Every page ends on the logo's diagonal.** Contact, legal and 404 met the
  footer with a flat edge; the footer now takes the slanted edge when a page
  has no closing block, and drops its redundant divider there.
- **404 and error pages** open on the same drafting grid as every other page
  (`HeaderGrid`, exported from `PageHeader`).
- **Legal notice** uses a chamfered `Frame` instead of a rounded box.
- **Footer on phones:** link groups sit in two columns instead of one long
  stack, and footer links have a 24px minimum tap height.
- The logo was confirmed identical everywhere (one `BRAND_MARK_PATHS`
  source, same 24px header and footer mark on every page).

## 2026-09-26: same closing block and footer on every page

- The animated wave behind the dark closing block (`SignalField`) was home
  only. It now shows on every page that ends with `<CtaSection />`, so the end
  of the site (closing block plus footer) looks the same everywhere. The
  `field` prop is removed. Three.js still loads lazily, only as the block
  nears the viewport, and the wave still respects reduced motion.

## 2026-09-26: team page motion pass (tasteskill.dev direction)

- The `/team` header now has a visual: the three founders as linked nodes
  around a "You" node, each joined to you by a direct line with pulses
  travelling both ways (`team/FounderConstellation.tsx`, Three.js). The
  figure turns slowly and leans towards the mouse. The name chips are server
  HTML projected onto the 3D points, so they stay crisp. Same cost rules as
  the Work deck: `lg` only, Three.js imported only once on screen, loop paused
  offscreen, one still frame under reduced motion, nothing without WebGL.
- The founders list is no longer three identical cards: the columns start at
  different heights and settle level as you scroll (`team/StaggeredFounders.tsx`,
  Motion `useScroll` into a CSS variable, `lg` and motion-safe only), and each
  portrait leans towards the mouse with a soft sheen (`team/TiltPortrait.tsx`,
  mouse only, off under reduced motion). `TeamMemberCard` gained a `tilt` prop;
  the home page teaser is unchanged.
- "A small team on purpose" became a sticky heading beside the three points,
  with an accent rail that fills as you read (`team/ReadingRail.tsx`).
- Copy is unchanged. Portraits are still the placeholder until real photos
  arrive.

## 2026-09-26: about page motion pass (tasteskill.dev direction)

- The `/about` header now has a visual: the PeepalX mark as an exploded
  drawing that assembles itself in 3D (`about/MarkAssembly.tsx`, Three.js).
  The six logo pieces start pulled apart in depth, slide together, then turn
  slightly towards the mouse and breathe their layers apart. Large screens
  only; decorative. Three.js loads only once the mark is on screen; the loop
  pauses offscreen; reduced motion gets one still frame; without WebGL (or if
  the scene fails to build) the flat SVG mark shows instead.
- Our story (`about/StoryScroll.tsx`): from `lg` the heading pins beside the
  text with a rail that fills through the story, and each paragraph comes to
  full strength as it crosses the reading line. Pure CSS scroll timelines
  (`data-story`, `data-story-rail`, `data-focus` in `globals.css`): a Motion
  version cost ~40 KB gzip of initial JS, so it was replaced. /about initial
  JS is 183.2 KB gzip, the same as before the pass.
- How we work: the six values are an uneven bento (4+2, 2+4, 3+3 on large
  screens) of chamfered tiles in varied tones, with the mouse spotlight from
  `SpotlightTile`. `tokens.test.ts` now also checks text on the white tile.
- Mission and vision: joined by a connector that draws from one to the other
  as the band scrolls in (reuses `data-grow`; vertical below `xl`).
- Page title is two-tone, like /work. Copy, headings and anchors unchanged.

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
