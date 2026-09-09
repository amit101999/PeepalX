import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hasPlaceholderTestimonials, testimonials } from "@/data/testimonials";

/**
 * Client testimonials.
 *
 * Two safeguards, both driven by the data file:
 *  - the whole section disappears if `testimonials` is empty,
 *  - a visible notice is shown while any entry is still placeholder content,
 *    so the site never appears to be quoting clients it does not have.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section bordered>
      <SectionHeading
        eyebrow="Testimonials"
        title="What clients say"
        description={
          hasPlaceholderTestimonials
            ? "This section is ready for real client feedback. The cards below are formatting examples, not quotes from clients."
            : undefined
        }
      />

      {hasPlaceholderTestimonials ? (
        <p className="mt-8 rounded-lg border border-line bg-elevated px-4 py-3 text-sm text-muted">
          <span className="font-medium text-ink">Placeholder content:</span> no client
          quotes have been published yet. Nothing below is attributed to a real person or
          company.
        </p>
      ) : null}

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal
            as="li"
            key={`${testimonial.name}-${index}`}
            delay={(index % 3) * 70}
            className="h-full"
          >
            <figure className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
              <blockquote className="leading-relaxed text-ink-soft">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-auto border-t border-line pt-5 text-sm">
                <span className="block font-medium text-ink">{testimonial.name}</span>
                <span className="text-muted">
                  {testimonial.role}, {testimonial.company}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
