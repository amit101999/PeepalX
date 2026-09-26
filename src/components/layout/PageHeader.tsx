import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  /**
   * Optional label above the title. Only for information the breadcrumb does
   * not already give, e.g. a project's category.
   */
  eyebrow?: string;
  /**
   * Plain text. The two-tone headline is kept for the home hero alone, so it
   * stays the site's one signature line rather than a pattern on every page.
   */
  title: ReactNode;
  description?: string;
  /**
   * Breadcrumb trail. The current page is the last entry. It is rendered both
   * as the visible trail and as BreadcrumbList structured data, so the two can
   * never disagree and no page has to emit the schema itself.
   */
  breadcrumbs?: Crumb[];
  /**
   * A visual beside the heading from `lg` up (hidden below). Decorative only:
   * everything it shows must also be on the page in accessible form.
   */
  aside?: ReactNode;
}

/**
 * The heading block at the top of every inner page.
 *
 * Keeping it in one component is what makes /services, /work, /about and the
 * rest feel like the same site rather than five separately designed pages.
 * The drafting grid behind it repeats the home hero's, so every page opens on
 * the same sheet.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  aside,
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <HeaderGrid />
      <Container
        className={cn(
          Boolean(aside) &&
            "lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10",
        )}
      >
        <div className="max-w-3xl pt-12 pb-14 sm:pt-16 sm:pb-20">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav aria-label="Breadcrumb" className="mb-8">
              <JsonLd data={breadcrumbSchema(breadcrumbs)} />
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      {isLast ? (
                        <span aria-current="page" className="text-ink">
                          {crumb.name}
                        </span>
                      ) : (
                        <>
                          <Link
                            href={crumb.path}
                            className="inline-flex min-h-6 items-center underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-line-strong pointer-coarse:-my-3 pointer-coarse:py-3"
                          >
                            {crumb.name}
                          </Link>
                          <span aria-hidden="true" className="text-faint">
                            /
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <p data-enter className="mb-4 text-label font-medium text-accent">
              {eyebrow}
            </p>
          ) : null}

          <h1
            data-enter
            style={{ "--enter-delay": "70ms" } as React.CSSProperties}
            className="text-h1 font-semibold text-ink"
          >
            {title}
          </h1>

          {description ? (
            <p
              data-enter
              style={{ "--enter-delay": "140ms" } as React.CSSProperties}
              className="mt-5 max-w-2xl text-lead text-muted"
            >
              {description}
            </p>
          ) : null}
        </div>

        {aside ? <div className="relative hidden lg:block">{aside}</div> : null}
      </Container>
    </section>
  );
}

/**
 * The hero's drafting grid, carried onto every inner page, strongest at the
 * top right and fading out behind the title. Exported for the pages that open
 * without a PageHeader (404, error) so they start on the same sheet. The
 * parent needs `relative isolate`.
 */
export function HeaderGrid() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 blueprint [mask-image:radial-gradient(ellipse_55%_90%_at_88%_0%,#000_15%,transparent_75%)]"
    />
  );
}
