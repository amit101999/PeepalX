import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  /** Anchor target, e.g. "services" for /#services. */
  id?: string;
  /**
   * Background treatment. Alternating `canvas` and `elevated` between adjacent
   * sections is what keeps a long page from reading as one flat block.
   */
  tone?: "canvas" | "elevated" | "ink";
  /** Vertical rhythm. `tight` is for short strips such as the trust bar. */
  spacing?: "tight" | "default" | "loose";
  /** Draws a hairline rule at the top of the section. */
  bordered?: boolean;
  containerWidth?: "default" | "narrow";
  className?: string;
}

const tones = {
  canvas: "bg-canvas text-ink",
  elevated: "bg-elevated text-ink",
  ink: "bg-ink text-canvas",
} as const;

const spacings = {
  tight: "py-10 sm:py-14",
  default: "py-20 sm:py-28",
  loose: "py-24 sm:py-36",
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
