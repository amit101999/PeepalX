"use client";

import { LazyMotion, domMin, m, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import type { ProcessStep } from "@/types";

/** Wide enough for a row of stages to be worth panning, and motion welcome. */
const PAN_QUERY = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PAN_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const panWanted = () => window.matchMedia(PAN_QUERY).matches;
const onServer = () => false;

/**
 * "How a project runs" as a pinned horizontal pan on wide screens: the section
 * holds still while the reader scrolls, the six stages slide past sideways,
 * and a line runs along them, lighting each stage as it arrives. The stages
 * are a real sequence, so reading them one after another in scroll order is
 * the point of the motion.
 *
 * Everywhere else (below 1280px, reduced motion, before hydration, no JS) the
 * section renders `timeline`, the plain vertical/grid timeline, so the content
 * never depends on the effect. Motion's `useScroll` drives the pan from the
 * browser's scroll position without re-rendering React.
 */
export function ProcessPan({
  id,
  heading,
  steps,
  timeline,
}: {
  id: string;
  heading: ReactNode;
  steps: ProcessStep[];
  timeline: ReactNode;
}) {
  const pan = useSyncExternalStore(subscribe, panWanted, onServer);

  if (!pan) {
    return (
      <section id={id} className="border-t border-line bg-canvas py-24 text-ink sm:py-32">
        <Container>
          {heading}
          {timeline}
        </Container>
      </section>
    );
  }

  return <PannedSteps id={id} heading={heading} steps={steps} />;
}

function PannedSteps({
  id,
  heading,
  steps,
}: {
  id: string;
  heading: ReactNode;
  steps: ProcessStep[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // How far the track has to travel for its last stage to line up with the
  // container's right edge. Measured, and re-measured only on resize.
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () =>
      setDistance(Math.max(track.offsetWidth - viewport.clientWidth, 0));
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    measure();
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <LazyMotion features={domMin}>
      <section
        ref={sectionRef}
        id={id}
        className="relative border-t border-line bg-canvas text-ink"
        // The section is as tall as the sideways travel plus one screen, so
        // the pinned view has exactly that much scroll to pan through.
        style={{ height: `calc(100dvh + ${distance}px)` }}
      >
        <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pt-20">
          <Container>
            {heading}

            <div ref={viewportRef} className="mt-14">
              <m.div ref={trackRef} style={{ x }} className="relative w-max">
                {/* The line through the stage markers, filled by scroll. Its tip
                  sweeps left to right across the screen as the track pans. */}
                <div
                  aria-hidden="true"
                  className="absolute top-[1.4375rem] right-0 left-0 h-0.5 bg-line"
                >
                  <m.div
                    style={{ scaleX: scrollYProgress }}
                    className="size-full origin-left bg-accent"
                  />
                </div>

                <ol className="relative flex gap-6">
                  {steps.map((step, index) => (
                    <Stage
                      key={step.number}
                      step={step}
                      // Each stage lights as the line's tip reaches it.
                      at={index / steps.length}
                      progress={scrollYProgress}
                    />
                  ))}
                </ol>
              </m.div>
            </div>
          </Container>
        </div>
      </section>
    </LazyMotion>
  );
}

function Stage({
  step,
  at,
  progress,
}: {
  step: ProcessStep;
  at: number;
  progress: MotionValue<number>;
}) {
  // Fully lit once the tip reaches the stage; the first stage starts lit.
  const lit = useTransform(progress, [at - 0.06, at], [0, 1]);
  const cardOpacity = useTransform(lit, [0, 1], [0.42, 1]);
  const markerScale = useTransform(lit, [0, 1], [0.8, 1]);
  // Chained off `lit` rather than bound to it directly: Motion hands opacity
  // straight from a scroll value to a scroll-timeline animation, which
  // ignored this range in testing and left every marker unfilled.
  const markerFill = useTransform(lit, [0, 1], [0, 1]);

  return (
    <li className="relative w-[min(25rem,34vw)] shrink-0">
      <m.span
        aria-hidden="true"
        style={{ scale: markerScale }}
        className="relative inline-flex size-12 items-center justify-center rounded-full border-2 border-accent bg-canvas text-sm font-semibold text-accent tabular-nums"
      >
        {Number(step.number)}
        <m.span
          style={{ opacity: markerFill }}
          className="absolute -inset-0.5 inline-flex items-center justify-center rounded-full bg-accent text-surface"
        >
          {Number(step.number)}
        </m.span>
      </m.span>

      <m.div style={{ opacity: cardOpacity }} className="mt-8">
        <Frame cut="lg" innerClassName="bg-surface p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 -right-2 font-display text-[9rem] leading-none font-semibold text-tint select-none"
          >
            {step.number}
          </span>
          <h3 className="relative text-h3 font-semibold text-ink">{step.title}</h3>
          <p className="relative mt-3 text-[0.9375rem] leading-relaxed text-muted">
            {step.description}
          </p>
        </Frame>
      </m.div>
    </li>
  );
}
