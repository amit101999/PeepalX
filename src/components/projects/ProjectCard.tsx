import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  /**
   * The first card in a grid is usually above the fold, so its image should
   * load eagerly instead of lazily. Everything else stays lazy.
   */
  priority?: boolean;
}

/** A project in a grid, linking to its detail page at /work/<slug>. */
export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-card">
      <div className="relative aspect-16/10 overflow-hidden bg-elevated">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          // Two columns on tablet, three on desktop — tells the browser the
          // rendered width so it never downloads an oversized file.
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{project.category}</Badge>
          {project.isPlaceholder ? <Badge tone="outline">Example</Badge> : null}
        </div>

        <h3 className="mt-4 text-h3 font-semibold text-ink">
          <Link
            href={`/work/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
          <p className="text-xs text-faint">
            {project.technologies.slice(0, 3).join(" · ")}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
            View
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
