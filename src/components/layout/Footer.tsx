import { Mail } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";
import { footerNav, legalNav } from "@/data/navigation";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

/**
 * Site footer.
 *
 * Link columns come from `src/data/navigation.ts`; social icons render only
 * for accounts configured in `src/config/site.ts`.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-canvas">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_2.6fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <Logo onDark />
            <p className="max-w-xs text-sm leading-relaxed text-canvas/60">
              {site.description}
            </p>

            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-sm text-canvas/80 transition-colors hover:text-canvas"
              >
                <Mail aria-hidden="true" className="size-4" />
                {site.email}
              </a>
            ) : null}

            {site.location ? (
              <p className="text-sm text-canvas/50">{site.location}</p>
            ) : null}

            <SocialLinks className="-ml-2.5" />
          </div>

          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="text-label font-medium text-canvas/45 uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-canvas/70 transition-colors hover:text-canvas"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-canvas/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-canvas/45">
            © {year} {site.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-canvas/45 transition-colors hover:text-canvas/80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
