import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TechnologyBadge } from "@/components/ui/Badge";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  /**
   * When true the whole card links through to the service on /services.
   * Turned off on the services page itself, where the card is the destination.
   */
  linkToDetail?: boolean;
}

/**
 * A single service.
 *
 * The card uses one link covering the whole surface (`after:absolute inset-0`)
 * rather than making a div clickable, so it stays a real link: keyboard
 * reachable, focusable, and openable in a new tab.
 */
export function ServiceCard({ service, linkToDetail = true }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Icon aria-hidden="true" className="size-5" />
        </span>

        {linkToDetail ? (
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-faint transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        ) : null}
      </div>

      <h3 className="mt-5 text-h3 font-semibold text-ink">
        {linkToDetail ? (
          <Link
            href={`/services#${service.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {service.title}
          </Link>
        ) : (
          service.title
        )}
      </h3>

      <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>

      <ul className="mt-5 flex flex-col gap-2 text-sm text-ink-soft">
        {service.capabilities.slice(0, 4).map((capability) => (
          <li key={capability} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-line-strong"
            />
            {capability}
          </li>
        ))}
      </ul>

      {/* mt-auto pins the technology row to the bottom, so cards of differing
          text length still line up across a row. */}
      <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
        {service.technologies.map((technology) => (
          <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
        ))}
      </div>
    </article>
  );
}
