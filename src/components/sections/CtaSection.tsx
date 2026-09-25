import { BRAND_MARK_PATHS, BRAND_MARK_VIEWBOX } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { primaryCta } from "@/data/navigation";

interface CtaSectionProps {
  title?: string;
  description?: string;
  /** Label and destination for the primary action. Defaults to the site's contact CTA. */
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/**
 * The closing conversion block, reused at the end of most pages.
 *
 * It sits directly above the footer on the same forest background, so the two
 * read as one dark block: the page's single theme switch. Its top edge is cut
 * at the logo's diagonal, so the dark block starts like a stroke of the X. A large, faint
 * silhouette of the logo mark sits behind the content as the brand's signature.
 */
export function CtaSection({
  title = "Tell us what you need built.",
  description = "Describe the problem, rough detail is fine. We reply with our reading of it and a suggested first step.",
  primary = primaryCta,
  secondary,
}: CtaSectionProps) {
  return (
    <Section tone="ink" spacing="loose" slant="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        data-mesh
        className="pointer-events-none absolute -inset-1/4 bg-[radial-gradient(40%_50%_at_22%_30%,var(--color-green-700),transparent_70%),radial-gradient(35%_45%_at_78%_72%,var(--color-green-800),transparent_70%)] opacity-80"
      />
      <svg
        viewBox={BRAND_MARK_VIEWBOX}
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-40 hidden w-[480px] fill-green-800 md:block"
      >
        {Object.values(BRAND_MARK_PATHS).map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <h2 className="max-w-2xl text-h1 font-semibold text-on-dark">{title}</h2>
          <p className="mt-5 max-w-xl text-lead text-on-dark-muted">{description}</p>
        </div>

        <div className="flex flex-col gap-5 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={primary.href} size="lg" variant="inverse" arrow>
              {primary.label}
            </Button>

            {secondary ? (
              <Button href={secondary.href} size="lg" variant="inverseSecondary">
                {secondary.label}
              </Button>
            ) : null}
          </div>

          {site.email ? (
            <p className="text-sm text-on-dark-muted">
              Or email{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-on-dark underline underline-offset-4 transition-colors hover:text-on-dark-accent"
              >
                {site.email}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
