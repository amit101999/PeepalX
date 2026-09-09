import type { Testimonial } from "@/types";

/**
 * Client testimonials.
 *
 * There are no real testimonials yet. The entries below use generic wording,
 * generic attribution and `isPlaceholder: true`, which makes the section render
 * an explicit "example content" notice.
 *
 * When a real testimonial is available: replace an entry, use the person's
 * actual name, role and company with their permission, and set
 * `isPlaceholder: false`. Once every entry is real the notice disappears on
 * its own.
 *
 * If you would rather show nothing until then, empty this array — the whole
 * section removes itself.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "This is example placeholder text showing where a client quote about the engagement will appear once one is available.",
    name: "Client name",
    role: "Role",
    company: "Company",
    isPlaceholder: true,
  },
  {
    quote:
      "This is example placeholder text showing where a client quote about delivery and communication will appear once one is available.",
    name: "Client name",
    role: "Role",
    company: "Company",
    isPlaceholder: true,
  },
  {
    quote:
      "This is example placeholder text showing where a client quote about the finished system will appear once one is available.",
    name: "Client name",
    role: "Role",
    company: "Company",
    isPlaceholder: true,
  },
];

/** True while any displayed testimonial is still placeholder content. */
export const hasPlaceholderTestimonials = testimonials.some(
  (testimonial) => testimonial.isPlaceholder,
);
