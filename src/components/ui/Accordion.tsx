import { Plus } from "lucide-react";
import type { FaqItem } from "@/types";

/**
 * Accordion built on native `<details>` / `<summary>`.
 *
 * This gives correct keyboard behaviour (Enter and Space), correct screen
 * reader semantics and correct expanded state for free, with no JavaScript and
 * no ARIA to keep in sync. A custom div-based accordion would need all three
 * hand-written and is easy to get subtly wrong.
 *
 * `data-accordion` opts the panel into the open/close height transition in
 * globals.css. Browsers without `interpolate-size` simply open instantly.
 */
export function AccordionItem({ question, answer }: FaqItem) {
  return (
    <details data-accordion className="group border-b border-line">
      <summary
        className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-medium text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden"
        // The marker is removed above; this keeps the row a comfortable target.
      >
        <span className="text-[1.0625rem] leading-snug">{question}</span>
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-line-strong text-muted transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-canvas"
        >
          <Plus className="size-3.5" />
        </span>
      </summary>
      <p className="max-w-2xl pb-6 leading-relaxed text-muted">{answer}</p>
    </details>
  );
}

export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <AccordionItem key={item.question} {...item} />
      ))}
    </div>
  );
}
