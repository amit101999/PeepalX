"use client";

import { LazyMotion, domMin, m, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * How far each column starts below its resting place, in px, from `lg` up.
 * The middle column drops furthest, so the three founders read as a staggered
 * row rather than three identical cards.
 */
const DROPS = [0, 128, 56];

/**
 * The founders in a three-column row whose columns start at different heights
 * and settle level as the reader scrolls through them, each at its own pace.
 *
 * Items stay in one list in reading order, so the offset is visual only:
 * keyboard, screen reader and the stacked mobile order are unchanged. Motion's
 * `useScroll` writes each offset to a CSS variable, off React's render path,
 * and CSS decides whether to use it (only from `lg` up, only without reduced
 * motion), so server and client render identical markup. Same approach as the
 * Work page's `ParallaxGrid`.
 */
export function StaggeredFounders({
  items,
}: {
  items: { key: string; node: ReactNode }[];
}) {
  const ref = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.6"],
  });

  return (
    <LazyMotion features={domMin}>
      <ul
        ref={ref}
        className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:motion-safe:pb-32"
      >
        {items.map((item, index) => (
          <li key={item.key} data-reveal className="h-full">
            <Settling progress={scrollYProgress} drop={DROPS[index % DROPS.length] ?? 0}>
              {item.node}
            </Settling>
          </li>
        ))}
      </ul>
    </LazyMotion>
  );
}

function Settling({
  children,
  progress,
  drop,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  drop: number;
}) {
  const lift = useTransform(progress, [0, 1], [`${drop}px`, "0px"]);

  return (
    <m.div
      style={{ "--lift": lift } as unknown as CSSProperties}
      className="h-full lg:motion-safe:translate-y-(--lift)"
    >
      {children}
    </m.div>
  );
}
