"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const GLOW = {
  /** For the dark tiles: a faint white light. */
  light: "rgb(255 255 255 / 0.14)",
  /** For the pale tiles: a faint brand-green light. */
  dark: "rgb(20 107 69 / 0.12)",
} as const;

/**
 * A tile with a soft light that follows the mouse across it.
 *
 * Hover feedback only: it tells a mouse user which tile they are over and gives
 * the tonal grid some depth. The pointer position is written straight to two
 * CSS custom properties on the tile, so moving the mouse never re-renders
 * React and needs no animation library. Touch and pen pointers are ignored,
 * and the light is hidden entirely for visitors who prefer reduced motion.
 */
export function SpotlightTile({
  children,
  className,
  glow = "light",
}: {
  children: ReactNode;
  className?: string;
  glow?: keyof typeof GLOW;
}) {
  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return;
    const tile = event.currentTarget;
    const bounds = tile.getBoundingClientRect();
    tile.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    tile.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <li
      data-reveal
      onPointerMove={onPointerMove}
      style={{ "--spot-colour": GLOW[glow] } as CSSProperties}
      className={cn("group/tile relative overflow-hidden", className)}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(280px_circle_at_var(--spot-x,-1000px)_var(--spot-y,-1000px),var(--spot-colour),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 motion-reduce:hidden"
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </li>
  );
}
