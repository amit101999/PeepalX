# Performance

## In place

- Pages are pre-rendered at build time and served as static files.
- Mostly Server Components. Client JavaScript is limited to the navbar, the
  contact form, the case-study stage rail, the error boundaries, and on the home
  page the hero's typed line and the WhyUs pointer spotlight (about 1.6 KB gzip
  together, measured against the build before they were added).
- Two self-hosted variable fonts through `next/font`, with `display: swap`.
- `next/image` with explicit `sizes` and AVIF/WebP output; only the first
  above-the-fold image uses `priority`.
- CSS-only motion that respects `prefers-reduced-motion`, and
  IntersectionObserver instead of scroll listeners. Springy motion uses a
  `linear()` easing (`--ease-spring`) instead of an animation library.
- No third-party scripts.

## Not yet measured

No Lighthouse or Core Web Vitals baseline has been recorded. Before launch, test
a production build (`npm run build && npm run start`) or the preview deploy and
record the results here.

| Page           | LCP | CLS | INP / TBT | JS transferred | Date |
| -------------- | --- | --- | --------- | -------------- | ---- |
| `/`            |     |     |           |                |      |
| `/work/<slug>` |     |     |           |                |      |
| `/contact`     |     |     |           |                |      |

## Hypotheses to check with that measurement

- **zod in the browser.** `ContactForm` imports the full schema for inline
  validation. If the `/contact` bundle is heavy, try `zod/mini` on the client.
- **SVG covers through the image optimiser.** SVGs gain nothing from
  `/_next/image`. Marking them `unoptimized` would also let `next.config.ts`
  drop `dangerouslyAllowSVG`.
- **Case-study screenshots.** Each project page loads several 60–180 KB images.
  They are lazy-loaded, so check LCP on the cover rather than total weight.
