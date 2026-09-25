"use client";

import { LazyMotion, domMin, m, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/** How far (as a share of the pointer's offset from centre) the child follows. */
const PULL = 0.25;
const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

/**
 * Pulls its child a little towards a mouse pointer hovering over it, and
 * springs back on leave: a tactile cue that the page's main action is live.
 *
 * Mouse only (touch has no hover), off under reduced motion, and driven by
 * Motion values so pointer movement never re-renders React. The wrapper is a
 * flex box whose child grows to fill it (so a full-width mobile button stays
 * full width), and the transform is visual only, so layout and the child's
 * focus ring are unaffected.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  if (reduce) return <>{children}</>;

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * PULL);
    y.set((event.clientY - (box.top + box.height / 2)) * PULL);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    // `m` elements only render motion values inside LazyMotion.
    <LazyMotion features={domMin}>
      <m.span
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ x, y }}
        className="flex [&>*]:grow"
      >
        {children}
      </m.span>
    </LazyMotion>
  );
}
