"use client";

import { useRef } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Glow strengths. 7% is the most the tile text can take and still meet WCAG AA
 * under the brightest point of the light; tokens.test.ts checks every tile's
 * text against these composites, so raise them only with that test.
 */
const GLOW = {
  /** For the dark tiles: a faint white light. */
  light: "rgb(255 255 255 / 0.07)",
  /** For the pale tiles: a faint light in the brand green. */
  dark: "color-mix(in oklab, var(--color-accent) 7%, transparent)",
} as const;

/**
 * A tile with a soft light that follows the mouse across it.
 *
 * Hover feedback only: it tells a mouse user which tile they are over and gives
 * the tonal grid some depth. The pointer position is written straight to two
 * CSS custom properties on the tile, so moving the mouse never re-renders
 * React and needs no animation library. The tile is measured once when the
 * pointer enters, not on every move. Touch and pen pointers are ignored, and
 * the light is hidden entirely for visitors who prefer reduced motion.
 */
export function SpotlightTile({
  children,
  className,
  glow = "light",
  as: Tag = "li",
  reveal = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: keyof typeof GLOW;
  /** `div` when the tile sits inside a list item of its own (the home stack). */
  as?: "li" | "div";
  /** Fade up on scroll. Off when something else already moves the tile. */
  reveal?: boolean;
}) {
  const bounds = useRef<DOMRect | null>(null);

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    bounds.current = event.currentTarget.getBoundingClientRect();
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !bounds.current) return;
    const tile = event.currentTarget;
    tile.style.setProperty("--spot-x", `${event.clientX - bounds.current.left}px`);
    tile.style.setProperty("--spot-y", `${event.clientY - bounds.current.top}px`);
  };

  return (
    <Tag
      data-reveal={reveal ? "" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      style={{ "--spot-colour": GLOW[glow] } as CSSProperties}
      className={cn("group/tile relative overflow-hidden", className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(280px_circle_at_var(--spot-x,-1000px)_var(--spot-y,-1000px),var(--spot-colour),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 motion-reduce:hidden"
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </Tag>
  );
}
