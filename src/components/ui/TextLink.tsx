import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A quiet onward link, e.g. "All services" beside a section heading. Lighter
 * than a button so it never competes with the page's primary action.
 */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start text-sm font-medium text-ink underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent sm:self-auto",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
