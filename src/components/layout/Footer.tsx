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
 * It shares the forest background with the closing CTA above it, so the end of
 * every page reads as one dark block rather than two stacked bands. On pages
 * without that block (contact, legal, 404) the footer takes the block's
 * slanted top edge itself, so every page still ends on the logo's diagonal.
 *
 * Link columns come from `src/data/navigation.ts`; the email and social icons
 * render only when they are configured in `src/config/site.ts`.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer className="bg-forest text-on-dark on-dark">
      <Container>
        <div
          data-footer-rule
          className="grid gap-12 border-t border-on-dark-line py-16 sm:py-20 lg:grid-cols-[1.4fr_2.6fr] lg:gap-16"
        >
          <div className="flex flex-col gap-5">
            <Logo onDark className="self-start" />
            <p className="max-w-xs text-sm leading-relaxed text-on-dark-muted">
              {site.description}
            </p>

            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 self-start text-sm text-on-dark transition-colors hover:text-on-dark-accent"
              >
                <Mail aria-hidden="true" className="size-4" />
                {site.email}
              </a>
            ) : null}

            {site.location ? (
              <p className="text-sm text-on-dark-muted">{site.location}</p>
            ) : null}

            <SocialLinks className="-ml-2.5" />
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3"
          >
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="font-sans text-label font-medium text-on-dark-muted">
                  {column.title}
                </h2>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-6 items-center text-sm text-on-dark transition-colors hover:text-on-dark-accent"
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

        <div className="flex flex-col gap-4 border-t border-on-dark-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-dark-muted">
            © {year} {site.name}. All rights reserved.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-6 items-center text-sm text-on-dark-muted transition-colors hover:text-on-dark"
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
