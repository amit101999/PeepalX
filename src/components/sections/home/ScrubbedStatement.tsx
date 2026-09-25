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
import { useRef, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

/* "Is this the hydrated client?" without an effect: React renders the server
   snapshot during SSR and hydration, then the client one. */
const noSubscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

/**
 * One piece of the statement: a word, or an inline chip (a small decorative
 * visual set into the sentence, like an inline image in an editorial layout,
 * hidden from assistive technology).
 */
export type StatementPart = { word: string } | { chip: ReactNode };

/** How faint a word is before the reader has scrolled to it. */
const RESTING_OPACITY = 0.16;

/**
 * A large statement whose words fill in as the reader scrolls through it.
 *
 * The scroll position drives the reveal directly (scrubbed, not triggered), so
 * the sentence reads at the reader's own pace and reverses if they scroll back.
 * Motion's `useScroll` runs on the browser's scroll timeline where available
 * and never re-renders React while scrolling.
 *
 * The full sentence is in the DOM from the first render, so screen readers and
 * search engines get the whole text regardless of scroll. With reduced motion
 * (or before hydration) every word is simply at full strength.
 */
export function ScrubbedStatement({ parts }: { parts: StatementPart[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  // Server HTML and the first client render show every word at full strength;
  // the scrub only takes over once hydrated.
  const hydrated = useSyncExternalStore(noSubscribe, isClient, isServer);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Start as the paragraph enters the lower part of the screen; finish when
    // it reaches the upper third, so the last word lands while still in view.
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    // `m` elements only render motion values inside LazyMotion; domMin is the
    // smallest feature set that includes the DOM renderer.
    <LazyMotion features={domMin}>
      <p
        ref={ref}
        className="max-w-5xl font-display text-h1 font-semibold text-balance text-ink"
      >
        {parts.map((part, index) => {
          const start = index / parts.length;
          const end = start + 1 / parts.length;
          const key = "word" in part ? `${part.word}-${index}` : `chip-${index}`;

          return (
            <Piece
              key={key}
              progress={scrollYProgress}
              range={[start, end]}
              still={!hydrated || (reduce ?? false)}
            >
              {"word" in part ? (
                part.word
              ) : (
                <span
                  aria-hidden="true"
                  className="mx-1 inline-flex h-[0.8em] w-[1.6em] translate-y-[0.06em] items-center justify-center bg-accent align-baseline text-canvas chamfer cut-sm"
                >
                  {part.chip}
                </span>
              )}
            </Piece>
          );
        })}
      </p>
    </LazyMotion>
  );
}

function Piece({
  children,
  progress,
  range,
  still,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [RESTING_OPACITY, 1]);

  return (
    <>
      <m.span style={still ? undefined : { opacity }}>{children}</m.span>{" "}
    </>
  );
}
