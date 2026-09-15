import { cn } from "@/lib/utils/cn";

interface CaseStudyFlowProps {
  /** Step names in the order work passes through them. Must be unique. */
  steps: string[];
  /** Accessible name, unique on the page, e.g. "Production floor: steps in order". */
  label: string;
  className?: string;
}

/**
 * A stage's internal route — e.g. dyeing through to dispatch — as one thread.
 *
 * The order is carried by the list itself and by the line joining each step to
 * the next, so there are no numbers. On small screens the steps stack
 * vertically; from `sm` up they run in a row and wrap. The final step is the
 * route's outcome, so it alone takes the accent.
 */
export function CaseStudyFlow({ steps, label, className }: CaseStudyFlowProps) {
  return (
    <ol
      aria-label={label}
      className={cn(
        "flex flex-col items-start sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-3",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step}
            className="flex flex-col items-start sm:flex-row sm:items-center"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="ml-5 h-3 w-px bg-line-strong sm:ml-0 sm:h-px sm:w-5"
              />
            ) : null}
            <span
              className={cn(
                "inline-flex min-h-8 items-center rounded-full border px-3.5 text-sm",
                isLast
                  ? "border-accent bg-accent-soft font-medium text-ink"
                  : "border-line-strong bg-surface text-ink-soft",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
