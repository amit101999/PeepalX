import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";

interface ProjectFeatureProps {
  project: Project;
  /** Puts the image on the right on large screens. */
  reverse?: boolean;
  /** Load the cover eagerly. Only for a row that is above the fold. */
  priority?: boolean;
  /**
   * Open the cover out from a slight inset as it scrolls into view. Only for a
   * cover that starts below the fold, or it would load visibly clipped.
   */
  settle?: boolean;
}

/**
 * A project as a wide row: the cover beside the summary.
 *
 * Used for the lead project in a listing, because a substantial system with a
 * real screenshot needs room to be legible. The whole row links to the case
 * study through the title link.
 */
export function ProjectFeature({
  project,
  reverse = false,
  priority = false,
  settle = false,
}: ProjectFeatureProps) {
  const hasSize = Boolean(project.imageWidth && project.imageHeight);

  return (
    <article className="group relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
      <div className={cn(reverse && "lg:order-last")}>
        {/* The settle clip lives on this wrapper, not the frame: its clip-path
            would otherwise replace the frame's chamfer. */}
        <div data-settle={settle ? "" : undefined}>
          <Frame bezel innerClassName="bg-elevated">
            {hasSize ? (
              <Image
                src={project.image}
                alt={project.imageAlt}
                width={project.imageWidth}
                height={project.imageHeight}
                sizes="(min-width: 1200px) 660px, (min-width: 1024px) 58vw, 100vw"
                priority={priority}
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015] group-has-[a:focus-visible]:scale-[1.015] motion-reduce:transform-none"
              />
            ) : (
              <div className="relative aspect-16/10">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 1200px) 660px, (min-width: 1024px) 58vw, 100vw"
                  priority={priority}
                  className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015] group-has-[a:focus-visible]:scale-[1.015] motion-reduce:transform-none"
                />
              </div>
            )}
          </Frame>
        </div>
        {/* Keeps the cover's disclosure (e.g. "Shown with sample data.") with the image. */}
        {project.imageCaption ? (
          <p className="mt-2.5 text-xs leading-relaxed text-faint">
            {project.imageCaption}
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-label font-medium text-accent">{project.category}</p>

        <h3 className="mt-3 text-h3 font-semibold text-ink lg:text-[1.875rem]">
          <Link
            href={`/work/${project.slug}`}
            className="underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-line-strong group-has-[a:focus-visible]:decoration-line-strong after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-4 leading-relaxed text-muted">{project.description}</p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {project.role ? (
            <div>
              <dt className="text-faint">Our role</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.role}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-faint">Year</dt>
            <dd className="mt-0.5 font-medium text-ink tabular-nums">{project.year}</dd>
          </div>
          <div>
            <dt className="text-faint">Built with</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {project.technologies.slice(0, 3).join(", ")}
            </dd>
          </div>
        </dl>

        <p
          aria-hidden="true"
          className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
        >
          Read the case study
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-has-[a:focus-visible]:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
