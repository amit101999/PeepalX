"use client";

import {
  LazyMotion,
  domMin,
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/** The largest lean, in degrees: enough to feel physical, not a gimmick. */
const MAX_TILT = 7;
const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

/**
 * A portrait that leans towards the mouse like a card held up to the light,
 * with a soft sheen that follows the pointer. It springs back when the
 * pointer leaves.
 *
 * Mouse only (touch and pen scroll as usual), and nothing moves under reduced
 * motion: that is checked when the pointer moves, not during render, so the
 * server and client markup never differ. The pointer position lives in motion
 * values, so React never re-renders while tilting.
 */
export function TiltPortrait({ children }: { children: ReactNode }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const x = useSpring(px, SPRING);
  const y = useSpring(py, SPRING);
  const rotateY = useTransform(x, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(y, [0, 1], [MAX_TILT, -MAX_TILT]);
  const sheenX = useTransform(x, (v) => `${v * 100}%`);
  const sheenY = useTransform(y, (v) => `${v * 100}%`);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <LazyMotion features={domMin}>
      <div
        className="perspective-[900px]"
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
      >
        <m.div
          style={{ rotateX, rotateY, "--sheen-x": sheenX, "--sheen-y": sheenY } as never}
          className="group/tilt relative transform-3d"
        >
          {children}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--sheen-x)_var(--sheen-y),rgb(255_255_255/0.28),transparent_55%)] opacity-0 transition-opacity duration-300 chamfer cut-lg group-hover/tilt:opacity-100 motion-reduce:hidden"
          />
        </m.div>
      </div>
    </LazyMotion>
  );
}
