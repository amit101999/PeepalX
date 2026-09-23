/**
 * Timing for the hero's typed services line.
 *
 * Values follow the `typewriter` spec in the animate-text skill: one character
 * every 46ms on the way in, a quicker delete, and a short beat before the next
 * phrase. The hold is long enough to read a two-word phrase comfortably.
 */
export const TYPEWRITER_TIMING = {
  /** Delay between typed characters. */
  typeMs: 46,
  /** Delay between deleted characters. */
  deleteMs: 24,
  /** How long a finished phrase stays before it is deleted. */
  holdMs: 1600,
  /** Pause on the empty line before the next phrase starts typing. */
  gapMs: 85,
} as const;

export type TypewriterTiming = { [K in keyof typeof TYPEWRITER_TIMING]: number };

/** One frame of the animation: what to show, and how long to show it for. */
export interface TypeStep {
  text: string;
  waitMs: number;
}

/**
 * Every frame of the typed line, in order.
 *
 * It starts on the first phrase already complete, because that is what the
 * server renders, so hydration never flickers. It then deletes and types its
 * way through `cycles` passes of the phrases and ends on the last phrase,
 * complete. Ending is deliberate: auto-moving content has to stop, and a
 * finished list reads better than an endless loop.
 *
 * Pure and deterministic, so the sequence is unit-tested rather than trusted.
 */
export function typewriterSteps(
  phrases: readonly string[],
  cycles: number,
  timing: TypewriterTiming = TYPEWRITER_TIMING,
): TypeStep[] {
  if (phrases.length === 0 || cycles < 1) return [];

  const sequence = Array.from(
    { length: phrases.length * Math.floor(cycles) },
    (_, index) => phrases[index % phrases.length]!,
  );

  const steps: TypeStep[] = [{ text: sequence[0]!, waitMs: timing.holdMs }];

  for (let index = 1; index < sequence.length; index++) {
    const previous = sequence[index - 1]!;
    const next = sequence[index]!;

    for (let length = previous.length - 1; length >= 0; length--) {
      steps.push({
        text: previous.slice(0, length),
        waitMs: length === 0 ? timing.gapMs : timing.deleteMs,
      });
    }

    for (let length = 1; length <= next.length; length++) {
      steps.push({
        text: next.slice(0, length),
        waitMs: length === next.length ? timing.holdMs : timing.typeMs,
      });
    }
  }

  return steps;
}
