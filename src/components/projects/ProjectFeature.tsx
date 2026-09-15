import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types";

interface ProjectFeatureProps {
  project: Project;
  /** Puts the image on the right on large screens, for alternating rows. */
  reverse?: boolean;
  /** Load the cover eagerly. Only for a row that is above the fold. */
  priority?: boolean;
}

/**
 * A project as a wide row: the cover beside the summary.
 *
 * Used instead of a card grid because each project is a substantial system
 * with a real screenshot, which needs room to be legible. The whole row links
 * to the case study through the title link.
 */
export function ProjectFeature({
  project,
  reverse = false,
  priority = false,
}: ProjectFeatureProps) {
  const hasSize = Boolean(project.imageWidth && project.imageHeight);

  return (
    <article className="group relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
      <div className={cn(reverse && "lg:order-last")}>
        <div className="overflow-hidden rounded-xl border border-line bg-elevated">
          {hasSize ? (
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(min-width: 1200px) 640px, (min-width: 1024px) 55vw, 100vw"
              priority={priority}
              className="h-auto w-full"
            />
          ) : (
            <div className="relative aspect-16/10">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1200px) 640px, (min-width: 1024px) 55vw, 100vw"
                priority={priority}
                className="object-cover object-top"
              />
            </div>
          )}
        </div>
        {/* Keeps the cover's disclosure (e.g. "Shown with sample data.") with the image. */}
        {project.imageCaption ? (
          <p className="mt-2.5 text-xs leading-relaxed text-faint">
            {project.imageCaption}
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium text-accent">{project.category}</p>

        <h3 className="mt-3 text-h3 font-semibold text-ink">
          <Link
            href={`/work/${project.slug}`}
            className="decoration-line-strong underline-offset-4 group-hover:underline after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {project.role ? (
            <div>
              <dt className="text-faint">Our role</dt>
              <dd className="mt-0.5 font-medium text-ink">{project.role}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-faint">Year</dt>
            <dd className="mt-0.5 font-medium text-ink">{project.year}</dd>
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
          className="mt-7 text-sm font-medium text-ink underline decoration-line-strong underline-offset-4"
        >
          Read the case study
        </p>
      </div>
    </article>
  );
}
