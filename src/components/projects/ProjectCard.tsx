import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  /**
   * The first card in a grid is usually above the fold, so its image should
   * load eagerly instead of lazily. Everything else stays lazy.
   */
  priority?: boolean;
}

/**
 * A project as a compact entry for two-column grids: cover on top, summary
 * underneath, linking to its detail page at /work/<slug>. The whole entry is
 * clickable through the title link's `after:` overlay, so it stays one real
 * link for keyboard and screen reader users.
 */
export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col">
      <Frame innerClassName="aspect-16/10 bg-surface">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          // One column on mobile, two from md up: tells the browser the
          // rendered width so it never downloads an oversized file.
          sizes="(min-width: 1200px) 560px, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          // Screenshots carry their key content at the top, so crop from there.
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.02] group-has-[a:focus-visible]:scale-[1.02] motion-reduce:transform-none"
        />
      </Frame>
      {/* Keeps the cover's disclosure (e.g. "Shown with sample data.") with the image. */}
      {project.imageCaption ? (
        <p className="mt-2.5 text-xs leading-relaxed text-faint">
          {project.imageCaption}
        </p>
      ) : null}

      <p className="mt-6 text-label font-medium text-accent">{project.category}</p>

      <h3 className="mt-2 text-h3 font-semibold text-ink">
        <Link
          href={`/work/${project.slug}`}
          className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-line-strong group-has-[a:focus-visible]:decoration-line-strong after:absolute after:inset-0 after:content-['']"
        >
          {project.title}
        </Link>
      </h3>

      <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

      <p
        aria-hidden="true"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
      >
        Read the case study
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-has-[a:focus-visible]:translate-x-0.5" />
      </p>
    </article>
  );
}
