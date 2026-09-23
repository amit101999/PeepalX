import { describe, expect, it } from "vitest";
import { TYPEWRITER_TIMING, typewriterSteps } from "./typewriter";

const phrases = ["web apps", "AI agents", "Zoho systems"] as const;

describe("typewriterSteps", () => {
  it("starts on the first phrase, complete, so it matches the server render", () => {
    const steps = typewriterSteps(phrases, 2);
    expect(steps[0]).toEqual({ text: "web apps", waitMs: TYPEWRITER_TIMING.holdMs });
  });

  it("ends on the last phrase, complete, instead of looping forever", () => {
    const steps = typewriterSteps(phrases, 2);
    expect(steps.at(-1)?.text).toBe("Zoho systems");
  });

  it("only ever shows a prefix of one of the phrases", () => {
    for (const { text } of typewriterSteps(phrases, 2)) {
      expect(phrases.some((phrase) => phrase.startsWith(text))).toBe(true);
    }
  });

  it("passes through every phrase once per cycle", () => {
    const shown = typewriterSteps(phrases, 2)
      .filter(({ waitMs }) => waitMs === TYPEWRITER_TIMING.holdMs)
      .map(({ text }) => text);
    expect(shown).toEqual([...phrases, ...phrases]);
  });

  it("clears the line between phrases, with a short beat on the empty line", () => {
    const empty = typewriterSteps(phrases, 1).filter(({ text }) => text === "");
    expect(empty).toHaveLength(phrases.length - 1);
    for (const step of empty) expect(step.waitMs).toBe(TYPEWRITER_TIMING.gapMs);
  });

  it("returns nothing to animate for no phrases or no cycles", () => {
    expect(typewriterSteps([], 2)).toEqual([]);
    expect(typewriterSteps(phrases, 0)).toEqual([]);
  });

  it("never waits zero or less between frames", () => {
    for (const { waitMs } of typewriterSteps(phrases, 2)) {
      expect(waitMs).toBeGreaterThan(0);
    }
  });
});
