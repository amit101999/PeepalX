"use client";

import { useMemo } from "react";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils/cn";

/**
 * The sticky jump list beside a case study, with the stage you are reading
 * marked as current.
 *
 * This is the one client component on a project page. It reuses the header's
 * IntersectionObserver hook rather than adding a scroll listener, and the
 * server has already rendered the links, so the list works with no JavaScript;
 * only the highlight needs it.
 */
export function StageRail({ stages }: { stages: { id: string; title: string }[] }) {
  // A stable array: the hook re-creates its observer whenever this changes.
  const ids = useMemo(() => stages.map((stage) => stage.id), [stages]);
  const activeId = useActiveSection(ids, true);

  return (
    <nav
      aria-label="Stages"
      className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
    >
      <ol className="relative flex flex-col gap-1 before:absolute before:top-4 before:bottom-4 before:left-[0.9375rem] before:w-px before:bg-line-strong">
        {stages.map((stage, index) => {
          const isActive = stage.id === activeId;

          return (
            <li key={stage.id} className="relative">
              <a
                href={`#${stage.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "group flex items-start gap-3 rounded-md py-2 pr-2 text-sm transition-colors",
                  isActive ? "font-medium text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors",
                    isActive
                      ? "border-accent bg-accent text-canvas"
                      : "border-line-strong bg-canvas text-ink group-hover:border-accent",
                  )}
                >
                  {index + 1}
                </span>
                <span className="pt-1.5 leading-snug">{stage.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
