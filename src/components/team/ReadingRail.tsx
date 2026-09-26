"use client";

import { LazyMotion, domMin, m, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * A column of text with an accent rail beside it that fills as the reader
 * scrolls through, so a short run of points reads as one argument with a
 * visible end. Scrubbed by scroll position, so it reverses on the way back.
 *
 * The fill is written to a CSS variable and only applied under
 * `motion-safe`, so server and client markup match; without motion (or
 * before hydration) the rail is simply full.
 */
export function ReadingRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.55"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <LazyMotion features={domMin}>
      <div ref={ref} className="relative pl-8 sm:pl-10">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line-strong">
          <m.div
            style={{ "--fill": fill } as unknown as CSSProperties}
            className="h-full w-[3px] origin-top -translate-x-px bg-accent motion-safe:scale-y-(--fill)"
          />
        </div>
        {children}
      </div>
    </LazyMotion>
  );
}
