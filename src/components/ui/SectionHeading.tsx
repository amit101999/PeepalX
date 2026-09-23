import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  /**
   * Small sentence-case label above the title. Use sparingly: most sections
   * are clear from their heading alone, and a label on every section reads as
   * a template.
   */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level. Only one `h1` should exist per page. */
  as?: "h1" | "h2";
  align?: "left" | "center";
  /** Inverts colours for use on the dark closing block. */
  onDark?: boolean;
  className?: string;
}

/**
 * The heading block used at the top of a section: optional label, a title and
 * a supporting line, stacked. Keeping it in one component is what makes
 * section headings consistent from page to page.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
  onDark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-label font-medium",
            onDark ? "text-on-dark-accent" : "text-accent",
          )}
        >
          {eyebrow}
        </span>
      ) : null}

      <Heading
        className={cn(
          Heading === "h1" ? "text-h1" : "text-h2",
          "font-semibold",
          onDark ? "text-on-dark" : "text-ink",
        )}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            "max-w-2xl text-lead",
            onDark ? "text-on-dark-muted" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
