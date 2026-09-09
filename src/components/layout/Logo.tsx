import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * The brand mark and wordmark.
 *
 * The mark is inline SVG rather than an image file: it is a few hundred bytes,
 * needs no extra request, and inherits the current text colour, which is what
 * lets the same component sit on both the light header and the dark footer.
 *
 * The wordmark text comes from `site.name` — change the company name in
 * `src/config/site.ts` and it updates everywhere.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-sm font-semibold tracking-tight",
        onDark ? "text-canvas" : "text-ink",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-[22px] shrink-0"
        fill="none"
      >
        <rect
          x="1.25"
          y="1.25"
          width="21.5"
          height="21.5"
          rx="5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <path
          d="M7 16.5V7.5L17 16.5V7.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="17" cy="7.5" r="1.9" className="fill-accent" />
      </svg>
      <span className="text-[1.0625rem]">{site.name}</span>
    </Link>
  );
}
