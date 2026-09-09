import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Heading level. Only one `h1` should exist per page. */
  as?: "h1" | "h2";
  align?: "left" | "center";
  /** Inverts colours for use on a dark section. */
  onDark?: boolean;
  className?: string;
}

/**
 * The heading block used at the top of every section: optional eyebrow, a
 * title and a supporting line. Keeping it in one component is what makes
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
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-label font-medium uppercase",
            onDark ? "text-canvas/60" : "text-accent",
          )}
        >
          {eyebrow}
        </span>
      ) : null}

      <Heading
        className={cn(
          Heading === "h1" ? "text-h1" : "text-h2",
          "font-semibold",
          onDark ? "text-canvas" : "text-ink",
        )}
      >
        {title}
      </Heading>

      {description ? (
        <p
          className={cn(
            "max-w-2xl text-lead",
            onDark ? "text-canvas/70" : "text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
