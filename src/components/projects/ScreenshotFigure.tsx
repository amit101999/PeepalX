import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { ImageAsset } from "@/types";

interface ScreenshotFigureProps {
  image: ImageAsset;
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 830px, 100vw". */
  sizes: string;
  /** Load eagerly. Only for an image that is the page's largest above-the-fold element. */
  priority?: boolean;
  className?: string;
}

/**
 * A screenshot with its caption and a link to the full-size file.
 *
 * Screenshots are mostly text, so they are never cropped and never stretched:
 * when the intrinsic size is known the frame is capped at that width, and on
 * smaller screens it scales down proportionally. The "Open full size" link lets
 * anyone read the detail without a lightbox script.
 */
export function ScreenshotFigure({
  image,
  sizes,
  priority = false,
  className,
}: ScreenshotFigureProps) {
  const { src, alt, width, height, caption } = image;
  const hasSize = Boolean(width && height);

  return (
    <figure className={cn("flex min-w-0 flex-col gap-3", className)}>
      {/*
        `maxWidth`, not `width`: a fixed pixel width would become the element's
        minimum size inside grid and flex layouts and push past the screen on
        mobile. Full width, capped at the file's own width, scales down freely.
      */}
      <div
        className="w-full overflow-hidden rounded-lg border border-line bg-elevated"
        style={hasSize ? { maxWidth: width } : undefined}
      >
        {hasSize ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            className="h-auto w-full"
          />
        ) : (
          <div className="relative aspect-16/10">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-contain"
            />
          </div>
        )}
      </div>

      <figcaption
        className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-1 text-sm leading-relaxed text-muted"
        style={hasSize ? { maxWidth: width } : undefined}
      >
        {caption ? <span className="max-w-prose">{caption}</span> : null}
        <a
          href={src}
          target="_blank"
          rel="noopener"
          // min-h-6 keeps the link a 24px target (WCAG 2.2 target size).
          className="inline-flex min-h-6 shrink-0 items-center font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Open full size
          <span className="sr-only">: {alt} (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
