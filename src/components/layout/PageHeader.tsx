import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Crumb } from "@/lib/seo/structured-data";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Visible breadcrumb trail. The current page is the last entry. */
  breadcrumbs?: Crumb[];
}

/**
 * The heading block at the top of every inner page.
 *
 * Keeping it in one component is what makes /services, /work, /about and the
 * rest feel like the same site rather than five separately designed pages.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <section className="border-b border-line">
      <Container>
        <div className="max-w-3xl py-16 sm:py-20">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav aria-label="Breadcrumb" className="mb-6">
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
                            className="transition-colors hover:text-ink"
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
            <p data-enter className="text-label font-medium text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}

          <h1
            data-enter
            style={{ "--enter-delay": "70ms" } as React.CSSProperties}
            className="mt-4 text-h1 font-semibold text-ink"
          >
            {title}
          </h1>

          {description ? (
            <p
              data-enter
              style={{ "--enter-delay": "140ms" } as React.CSSProperties}
              className="mt-5 text-lead text-muted"
            >
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
