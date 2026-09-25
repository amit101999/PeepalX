"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { typewriterSteps } from "@/lib/utils/typewriter";
import { HERO_MARK_ID } from "./hero-mark-id";

/** Two passes through the list is enough to read all of it; then it stops. */
const CYCLES = 2;

/**
 * "We build ⟨phrase⟩", typed out one service at a time.
 *
 * Accessibility, because auto-moving text has rules:
 *  - It stops on its own after two passes, and never runs while the tab is
 *    hidden or when the visitor prefers reduced motion.
 *  - A pause button (WCAG 2.2.2) sits beside it; once finished it becomes a
 *    replay button rather than disappearing, so focus is never dropped. Its
 *    label names the action (pause, resume, replay); it is not an
 *    aria-pressed toggle, because replay is a third state.
 *  - The changing text is hidden from screen readers, which read one stable
 *    sentence listing every phrase instead of hearing a word spelled out.
 *
 * The server renders the first phrase, complete, which is also the first frame
 * of the animation, so there is no hydration flicker and the line reads fine
 * with JavaScript off.
 */
export function TypedServices({ phrases }: { phrases: readonly string[] }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const steps = useMemo(() => typewriterSteps(phrases, CYCLES), [phrases]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Read from the browser without an effect. The server snapshots (not hidden,
  // not mounted) keep the first client render identical to the server's.
  const hidden = useSyncExternalStore(
    subscribeToVisibility,
    isDocumentHidden,
    () => false,
  );
  // Controls appear only once on the client: the reduced-motion preference is
  // not known on the server, and rendering them there would mismatch.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const finished = index >= steps.length - 1;
  const running = mounted && !prefersReducedMotion && !paused && !hidden && !finished;

  useEffect(() => {
    if (!running) return;
    const step = steps[index];
    if (!step) return;
    const timer = window.setTimeout(
      () => setIndex((current) => current + 1),
      step.waitMs,
    );
    return () => window.clearTimeout(timer);
  }, [running, index, steps]);

  // The words scrolling inside the logo (HeroMark) move only while this line
  // types: same start, same pause, same stop. So this one button pauses every
  // moving word in the hero (WCAG 2.2.2), and nothing moves under reduced
  // motion or in a hidden tab.
  const ribbonsStarted = useRef(false);
  useEffect(() => {
    const mark = document.getElementById(HERO_MARK_ID);
    if (!(mark instanceof SVGSVGElement)) return;
    if (!running) {
      mark.pauseAnimations();
      return;
    }
    if (!ribbonsStarted.current) {
      ribbonsStarted.current = true;
      mark
        .querySelectorAll<SVGAnimationElement>("[data-marquee]")
        .forEach((animation) => animation.beginElement());
    }
    mark.unpauseAnimations();
  }, [running]);

  const text = prefersReducedMotion ? phrases[0] : (steps[index]?.text ?? phrases[0]);
  const showControls = mounted && !prefersReducedMotion;
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  const control = finished
    ? { label: "Replay the hero animation", Icon: RotateCcw }
    : paused
      ? { label: "Resume the hero animation", Icon: Play }
      : { label: "Pause the hero animation", Icon: Pause };

  const onControl = () => {
    if (finished) {
      setIndex(0);
      setPaused(false);
      return;
    }
    setPaused((current) => !current);
  };

  return (
    <div className="mt-6 flex items-center gap-3">
      <p className="font-display text-h3 font-medium text-ink">
        <span className="sr-only">We build {listSentence(phrases)}.</span>
        <span aria-hidden="true">
          <span className="text-muted">We build </span>
          {/* An invisible copy of the longest phrase holds the width, so the
              pause button beside the line never moves while it types. */}
          <span className="inline-grid">
            <span className="invisible pr-1.5 [grid-area:1/1]">{longest}</span>
            <span className="text-accent [grid-area:1/1]">
              {text}
              {running || paused ? (
                <span
                  data-caret={paused ? "still" : "blink"}
                  className="ml-0.5 inline-block h-[0.95em] w-[3px] translate-y-[0.12em] rounded-full bg-accent"
                />
              ) : null}
            </span>
          </span>
        </span>
      </p>

      {/* The slot is always there, so the button appearing causes no shift. */}
      <span className="inline-flex size-9 shrink-0">
        {showControls ? (
          <button
            type="button"
            onClick={onControl}
            aria-label={control.label}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-tint hover:text-ink"
          >
            <control.Icon aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </span>
    </div>
  );
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function isDocumentHidden() {
  return document.hidden;
}

function noopSubscribe() {
  return () => {};
}

/** "web apps, mobile apps and Zoho systems" */
function listSentence(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}
