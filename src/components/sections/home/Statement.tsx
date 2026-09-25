import { Handshake, Ruler } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ScrubbedStatement } from "./ScrubbedStatement";
import type { StatementPart } from "./ScrubbedStatement";

const words = (text: string): StatementPart[] =>
  text.split(" ").map((word) => ({ word }));

const chipIcon = "size-[0.5em]";

/**
 * How we work, said once and large. The sentence is the company's own position
 * from the About story (`company.story`), condensed; it fills in word by word
 * as the reader scrolls, so the page slows down for the one idea it most wants
 * remembered. Two inline chips (scope, then agreement) break the type the way
 * inline images do in an editorial layout.
 */
const statement: StatementPart[] = [
  ...words("We are direct about scope."),
  { chip: <Ruler aria-hidden="true" className={chipIcon} /> },
  ...words("If a project is larger than its budget, we say so before the work starts,"),
  { chip: <Handshake aria-hidden="true" className={chipIcon} /> },
  ...words("not at the end of it."),
];

export function Statement() {
  return (
    <Section spacing="loose">
      <ScrubbedStatement parts={statement} />
    </Section>
  );
}
