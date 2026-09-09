import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";

interface CtaSectionProps {
  title?: string;
  description?: string;
  /** Label and destination for the primary action. */
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/**
 * The closing conversion block, reused at the end of most pages.
 *
 * Defaults suit the home page; pass props to tailor it, for example a project
 * page ending with "Talk to us about something similar".
 */
export function CtaSection({
  title = "Have a project in mind?",
  description = "Tell us what you are building, what problem you are solving, or where you need help. We will come back with our reading of it and a suggested first step.",
  primary = { label: "Start a Project", href: "/contact" },
  secondary,
}: CtaSectionProps) {
  return (
    <Section tone="ink" spacing="loose">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 text-center">
        <h2 className="text-h2 font-semibold text-canvas">{title}</h2>
        <p className="text-lead text-canvas/70">{description}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={primary.href} size="lg">
            {primary.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>

          {secondary ? (
            <Button
              href={secondary.href}
              size="lg"
              variant="secondary"
              className="border-canvas/25 bg-transparent text-canvas hover:border-canvas hover:bg-canvas/10"
            >
              {secondary.label}
            </Button>
          ) : null}
        </div>

        {site.email ? (
          <p className="text-sm text-canvas/45">
            Or email us directly at{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-canvas/80 underline underline-offset-4 transition-colors hover:text-canvas"
            >
              {site.email}
            </a>
          </p>
        ) : null}
      </div>
    </Section>
  );
}
