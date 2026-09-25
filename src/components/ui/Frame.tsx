import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const CUTS = {
  md: "var(--chamfer-md)",
  lg: "var(--chamfer-lg)",
} as const;

/*
 * A 45° cut shrinks as it moves inward: to keep a hairline (or the bezel's
 * tray) the same thickness along the diagonal as along the straight edges,
 * each inner layer's cut is reduced by the inset times (2 − √2) ≈ 0.586.
 */
const HAIRLINE_INSET = "0.586px";
const TRAY_INSET = "4.1px"; // 1px hairline + 6px tray, times 0.586

interface FrameProps {
  children: ReactNode;
  /** Size of the chamfered corners. */
  cut?: keyof typeof CUTS;
  /**
   * Double bezel: the content sits in a white tray inside the hairline, like a
   * plate set into a mount. For project covers and screenshots.
   */
  bezel?: boolean;
  /** Classes for the outermost element (sizing, margins). */
  className?: string;
  /** Classes for the element that holds the content (background, padding, aspect). */
  innerClassName?: string;
}

/**
 * A chamfered surface with a hairline edge, the site's replacement for a
 * rounded, bordered box. The corners are cut at the logo's 45°, top left and
 * bottom right, the direction of the mark's X stroke.
 *
 * A clip-path cannot draw a border, so the hairline is the outer layer's
 * background showing through a 1px gap. Clip-paths also clip focus outlines:
 * keep focusable elements away from the edges, or put the link outside.
 */
export function Frame({
  children,
  cut = "lg",
  bezel = false,
  className,
  innerClassName,
}: FrameProps) {
  const size = CUTS[cut];

  return (
    <div
      className={cn("bg-line-strong p-px chamfer", className)}
      style={{ "--cut": size } as CSSProperties}
    >
      {bezel ? (
        <div
          className="bg-surface p-1.5 chamfer"
          style={{ "--cut": `calc(${size} - ${HAIRLINE_INSET})` } as CSSProperties}
        >
          <div
            className={cn("relative overflow-hidden chamfer", innerClassName)}
            style={{ "--cut": `calc(${size} - ${TRAY_INSET})` } as CSSProperties}
          >
            {children}
          </div>
        </div>
      ) : (
        <div
          className={cn("relative overflow-hidden chamfer", innerClassName)}
          style={{ "--cut": `calc(${size} - ${HAIRLINE_INSET})` } as CSSProperties}
        >
          {children}
        </div>
      )}
    </div>
  );
}
