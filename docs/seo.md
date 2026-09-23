# SEO

## In place

- `createMetadata()` (`src/lib/seo/metadata.ts`) gives every page a title, a
  description, an absolute canonical URL, and Open Graph and Twitter tags.
- `src/app/opengraph-image.tsx` generates the default social card; project pages
  use their own cover image.
- `sitemap.xml` and `robots.txt` are generated from real routes, and `/api/` is
  disallowed.
- JSON-LD built in `src/lib/seo/structured-data.ts`: Organization, WebSite,
  Service, BreadcrumbList, CreativeWork (case studies) and FAQPage. Nothing is
  emitted that the page does not show.
- One `<h1>` per page. Alt text is required by the image type and checked by
  tests.

## Indexing rules

| Route                 | Indexed | In sitemap | Why                                                      |
| --------------------- | ------- | ---------- | -------------------------------------------------------- |
| Main pages, `/work/*` | yes     | yes        |                                                          |
| `/blog`               | no      | no         | No posts yet                                             |
| `/legal/*`            | no      | no         | Placeholder copy, until `site.legalCopyReviewed` is true |

A noindex page is never listed in the sitemap, because that sends search engines
contradictory instructions.

## Dates in the sitemap

Only project pages carry `lastModified`, taken from each project's `updatedAt`.
Static pages have none: a build date would claim every page changed on every
deploy, and search engines learn to ignore a `lastmod` that is always new.

## Site URL

Every absolute URL comes from `NEXT_PUBLIC_SITE_URL`. If it is missing, they all
point at `http://localhost:3000`. A Vercel production build therefore fails
without an https value, and any other production build prints a warning
(`next.config.ts`).

## Content still needed (not code)

A contact email, social profile links (they feed `sameAs` in the Organization
schema), real team photos, approved testimonials and reviewed legal copy.
