import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  /** Anchor target, e.g. "services" for /#services. */
  id?: string;
  /**
   * Background treatment. `ink` is reserved for the closing block that joins
   * the footer: it is the page's one dark moment, so don't use it mid-page.
   */
  tone?: "canvas" | "elevated" | "tint" | "ink";
  /** Vertical rhythm. `tight` is for short strips. */
  spacing?: "tight" | "default" | "loose";
  /** Draws a hairline rule at the top of the section. */
  bordered?: boolean;
  containerWidth?: "default" | "narrow";
  className?: string;
}

const tones = {
  canvas: "bg-canvas text-ink",
  elevated: "bg-elevated text-ink",
  /** A pale green band, for alternating with canvas on long pages. */
  tint: "bg-tint text-ink",
  /** The dark closing block. Named `ink` for its role; drawn in forest green. */
  ink: "on-dark bg-forest text-on-dark",
} as const;

const spacings = {
  tight: "py-12 sm:py-16",
  default: "py-20 sm:py-24",
  loose: "py-24 sm:py-32",
} as const;

/**
 * A page section: background tone, vertical spacing and container in one place.
 * Using this everywhere is what keeps section rhythm consistent across pages.
 */
export function Section({
  children,
  id,
  tone = "canvas",
  spacing = "default",
  bordered = false,
  containerWidth = "default",
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        tones[tone],
        spacings[spacing],
        bordered && "border-t border-line",
        className,
      )}
    >
      <Container width={containerWidth}>{children}</Container>
    </section>
  );
}
