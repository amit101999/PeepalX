/**
 * Stable in-page anchor for a case study stage, e.g.
 * "stage-daily-data-in-and-checks".
 *
 * It lives here rather than in the component because four things depend on
 * the same id: the stage heading's anchor, the mobile jump list, the sticky
 * rail's links and its "you are here" highlight. `content.test.ts` also uses it to check that no two
 * stage titles collapse to the same id.
 *
 * It assumes ASCII titles: accented characters are dropped rather than
 * transliterated ("Qualité" becomes "stage-qualit"), which is fine while the
 * case studies are in English but would need a normalise step otherwise.
 */
export function stageId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `stage-${slug}`;
}
