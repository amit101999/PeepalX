"use client";

import { LazyMotion, domMin, m, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/** How far the right-hand column starts below the left one, in px. */
const DROP = 112;

/**
 * A two-column grid whose right-hand column starts lower and rises to meet
 * the left as the reader scrolls through it. The staggered start breaks the
 * even rows of a plain grid, and the slower column gives the list depth.
 *
 * Items stay in one list in reading order (1, 2 on the first row, and so on),
 * so the offset is visual only: keyboard, screen reader and single-column
 * mobile order are unchanged. Motion's `useScroll` writes the offset to a CSS
 * variable, off React's render path, and CSS decides whether to use it: only
 * from `md` up and only without reduced motion. Keeping that decision in CSS
 * means the server and client render identical markup (no hydration mismatch
 * from reading the motion preference in JavaScript).
 */
export function ParallaxGrid({
  items,
  className,
}: {
  items: { key: string; node: ReactNode }[];
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lift = useTransform(scrollYProgress, [0, 0.75], [`${DROP}px`, "0px"]);

  return (
    // `m` elements only render motion values inside LazyMotion.
    <LazyMotion features={domMin}>
      <ul ref={ref} className={className}>
        {items.map((item, index) => (
          <li key={item.key} data-reveal>
            {index % 2 === 1 ? <Lifted lift={lift}>{item.node}</Lifted> : item.node}
          </li>
        ))}
      </ul>
    </LazyMotion>
  );
}

function Lifted({ children, lift }: { children: ReactNode; lift: MotionValue<string> }) {
  return (
    <m.div
      style={{ "--lift": lift } as unknown as CSSProperties}
      className="h-full md:motion-safe:translate-y-(--lift)"
    >
      {children}
    </m.div>
  );
}
