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
  outline: "border border-line text-muted",
} as const;

/** Small pill label. Used for categories, statuses and disclosures. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
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
    <span className="inline-flex items-center rounded-sm border border-line px-2 py-1 text-xs text-muted">
      {children}
    </span>
  );
}
