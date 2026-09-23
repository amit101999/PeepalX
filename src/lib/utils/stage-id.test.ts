import { describe, expect, it } from "vitest";
import { stageId } from "./stage-id";

/**
 * The stage anchors, the mobile jump list, the rail links and the rail's
 * active state all key off this function, so the properties that keep those
 * working are pinned here: the prefix, the character set, and a defined result
 * for input that slugs to nothing.
 *
 * A digit-leading id is valid HTML but an invalid CSS selector, so the prefix
 * is what keeps `#id` usable in `querySelector` and namespaces stage ids
 * against everything else on the page.
 */
describe("stageId", () => {
  it("slugs a title", () => {
    expect(stageId("Daily data in and checks")).toBe("stage-daily-data-in-and-checks");
  });

  it("prefixes a title that starts with a digit", () => {
    expect(stageId("3D pipeline")).toBe("stage-3d-pipeline");
  });

  it("collapses punctuation and trims stray hyphens", () => {
    expect(stageId("Orders, finance and stock")).toBe("stage-orders-finance-and-stock");
    expect(stageId("  Quality control!  ")).toBe("stage-quality-control");
    // Titles are assumed ASCII: accents are dropped, not transliterated.
    expect(stageId("Qualité control")).toBe("stage-qualit-control");
  });

  it("collapses titles that differ only in punctuation to one id", () => {
    // Why src/data/content.test.ts checks stage ids for duplicates per project.
    expect(stageId("Orders, finance")).toBe(stageId("Orders finance"));
  });

  it("still returns a usable id when nothing survives slugging", () => {
    expect(stageId("")).toBe("stage-");
    expect(stageId("!!!")).toBe("stage-");
  });
});
