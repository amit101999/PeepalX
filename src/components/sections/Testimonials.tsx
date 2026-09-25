import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProjectBySlug } from "@/data/projects";
import { publishedTestimonials } from "@/data/testimonials";

/**
 * Client reviews, each linked to the project it is about.
 *
 * Only reviews the client has approved are rendered, and the section renders
 * nothing until at least one exists, so the site never appears to quote
 * clients it does not have. Drafts live in `src/data/testimonials.ts`.
 */
export function Testimonials() {
  if (publishedTestimonials.length === 0) return null;

  return (
    <Section>
      <SectionHeading title="What clients say" />

      <ul className="mt-12 grid gap-12 md:grid-cols-2">
        {publishedTestimonials.map((testimonial) => {
          const project = getProjectBySlug(testimonial.project);

          return (
            <li key={testimonial.project} data-reveal>
              <figure className="flex h-full flex-col border-l-2 border-accent pl-6">
                <blockquote className="text-lead text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 text-sm">
                  {testimonial.name && (
                    <span className="block font-medium text-ink">{testimonial.name}</span>
                  )}
                  <span className="block text-muted">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(" · ")}
                  </span>
                  {project && (
                    <Link
                      href={`/work/${project.slug}`}
                      className="mt-2 inline-block text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                    >
                      {project.title}
                    </Link>
                  )}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
