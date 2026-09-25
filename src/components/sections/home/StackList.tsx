"use client";

import {
  LazyMotion,
  domMin,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

/** How much each card behind the front one shrinks, per card. */
const STEP = 0.04;

/**
 * A sticky card stack. Each card pins a little lower than the one before it
 * (so the earlier cards' top edges stay visible, like a deck), and shrinks
 * back as the cards after it slide over, which makes the stack read as
 * physical layers rather than a list.
 *
 * Progress is measured on the whole list (a sticky element's own position
 * stops changing once it pins, so it cannot be its own scroll target) and
 * each card maps its share of that progress to a scale. Motion's `useScroll`
 * keeps this off React's render path. Under reduced motion the cards still
 * stack (plain CSS `position: sticky`) but never scale.
 */
export function StackList({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    // `m` elements only render motion values inside LazyMotion.
    <LazyMotion features={domMin}>
      <ul ref={ref} className={className}>
        {items.map((item, index) => (
          <StackCard
            key={index}
            index={index}
            count={items.length}
            progress={scrollYProgress}
            still={reduce ?? false}
          >
            {item}
          </StackCard>
        ))}
      </ul>
    </LazyMotion>
  );
}

function StackCard({
  children,
  index,
  count,
  progress,
  still,
}: {
  children: ReactNode;
  index: number;
  count: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const behind = count - 1 - index;
  const scale = useTransform(progress, [index / count, 1], [1, 1 - behind * STEP]);

  return (
    <li
      style={{ "--stack-i": index } as CSSProperties}
      className="sticky top-[calc(7rem+var(--stack-i)*1.25rem)] pb-8 last:pb-0"
    >
      <m.div style={still ? undefined : { scale }} className="origin-top">
        {children}
      </m.div>
    </li>
  );
}
