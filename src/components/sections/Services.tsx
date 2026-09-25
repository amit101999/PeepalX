import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { services } from "@/data/services";

/**
 * The six service areas as a typographic index rather than a card grid: large
 * rows that each link to the service on /services. On hover or keyboard focus
 * an accent rule draws along the bottom of the row, confirming which row the
 * pointer or focus is on.
 *
 * Only the title is the link (its `after:` overlay makes the whole row
 * clickable), so screen readers hear a short link name, not the summary too.
 */
export function Services() {
  return (
    <Section id="services" spacing="loose" bordered>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="What we build"
          description="Apps, AI and integrations from one team, so nothing gets lost between vendors."
        />
        <TextLink href="/services">All services</TextLink>
      </div>

      <ul className="mt-14 border-b border-line">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <li
              key={service.slug}
              data-reveal
              className="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-t border-line py-7 sm:py-8 md:grid-cols-[2.5rem_minmax(0,0.85fr)_minmax(0,1.15fr)_auto]"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-x-4 inset-y-0 -z-10 origin-bottom scale-y-0 bg-tint transition-transform duration-300 ease-[var(--ease-out-soft)] chamfer group-focus-within:scale-y-100 group-hover:scale-y-100 motion-reduce:transition-none"
              />
              <Icon
                aria-hidden="true"
                strokeWidth={1.75}
                className="hidden size-6 text-accent md:block"
              />
              <h3 className="text-h3 font-semibold text-ink transition-colors group-hover:text-accent">
                <Link
                  href={`/services#${service.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="col-span-full row-start-2 leading-relaxed text-muted md:col-span-1 md:row-start-auto">
                {service.summary}
              </p>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 text-muted transition-[color,transform] duration-300 group-focus-within:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-soft)] group-focus-within:scale-x-100 group-hover:scale-x-100"
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
