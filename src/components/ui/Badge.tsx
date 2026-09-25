import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "accent" | "outline";
  className?: string;
}

const tones = {
  neutral: "bg-elevated text-muted",
  accent: "bg-accent-soft text-accent",
  /* A chamfer clips borders, so the quiet badge is a pale tint rather than an
     outline; it stays visible on canvas and elevated alike. */
  outline: "bg-tint text-muted",
} as const;

/** Small label. Used for categories, statuses and disclosures. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium chamfer cut-sm",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A technology name. Visually quieter than `Badge` because these appear in
 * groups of four or five and should read as a list, not as buttons.
 */
export function TechnologyBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center bg-elevated px-2 py-1 text-xs text-ink-soft chamfer cut-sm">
      {children}
    </span>
  );
}
