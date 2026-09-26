import { describe, expect, it } from "vitest";
import { RIBBONS, ribbonCopyLength } from "./ribbons";

describe("hero logo words", () => {
  it("has enough words on each ribbon to loop without a gap", () => {
    // One copy of the text must be at least as long as its path, or a blank
    // stretch scrolls through the logo at every wrap.
    for (const ribbon of RIBBONS) {
      expect(
        ribbonCopyLength(ribbon),
        `the ${ribbon.name} ribbon needs more words in heroMarkWords`,
      ).toBeGreaterThanOrEqual(ribbon.measuredLength);
    }
  });
});
