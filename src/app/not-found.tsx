import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { mainNav } from "@/data/navigation";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** 404 page. Kept minimal, with routes out rather than an apology. */
export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col justify-center py-24">
        <p className="text-label font-medium text-accent">Error 404</p>

        <h1 className="mt-4 text-h1 font-semibold text-ink">
          This page doesn&rsquo;t exist.
        </h1>

        <p className="mt-5 max-w-lg text-lead text-muted">
          The link may be out of date, or the page may have moved. Everything else is
          still where you left it.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href="/services" size="lg" variant="secondary">
            See our services
          </Button>
        </div>

        <nav aria-label="Site sections" className="mt-14 border-t border-line pt-8">
          <h2 className="font-sans text-sm font-semibold text-ink">
            Or try one of these
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center text-sm text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Container>
  );
}
