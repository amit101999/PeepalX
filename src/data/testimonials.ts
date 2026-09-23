import type { Testimonial } from "@/types";

/**
 * Client reviews, one per project.
 *
 * Every entry below is a DRAFT: wording written from the project's own case
 * study, for the client to edit and approve. Drafts are never rendered.
 *
 * When a client approves a review: replace the quote with their final wording,
 * set `name`, `role` and `company` to what they agreed to be shown (a person's
 * name only with their permission), and set `approved: true`. For an anonymous
 * review, delete `name` and `role` and keep the project's client description
 * as `company`. Approved reviews
 * appear on the home page on their own; the section stays hidden while none
 * are approved. Never publish a review the client has not approved.
 */

/** Attribution text used by drafts until the client confirms their own. */
export const UNCONFIRMED = "To confirm with client";

export const testimonials: Testimonial[] = [
  {
    project: "codebeamer-docs-ai-dataset",
    quote:
      "We needed the Codebeamer Developer Guide as data our AI tools could actually use. PeepalX delivered a clean JSON dataset that kept the guide's structure, already chunked, and automated the whole extraction.",
    name: UNCONFIRMED,
    role: UNCONFIRMED,
    company: "Software company",
    approved: false,
  },
  {
    project: "real-estate-lead-management-crm",
    quote:
      "Leads used to come in from ads, events, cold calls and partners, and there was always a risk that one went unattended. Now every lead is captured in Zoho CRM, assigned fairly, and reassigned if an agent doesn't respond. Commissions are calculated by rule, not worked out by hand.",
    name: UNCONFIRMED,
    role: UNCONFIRMED,
    company: "Real estate sales company, UAE",
    approved: false,
  },
  {
    project: "zoho-travel-booking-crm",
    quote:
      "Putting a quotation together used to take hours. It now takes minutes, and our agents still review every one before it goes out. The customer emails from signup to the final itinerary run on their own, so follow-ups don't get missed.",
    name: UNCONFIRMED,
    role: UNCONFIRMED,
    company: "Travel and tourism booking business",
    approved: false,
  },
  {
    project: "zoho-spinning-mill-order-to-dispatch",
    quote:
      "Sales, accounts, stock, production and quality were all kept separately, and nobody could follow an order from start to finish. Now we can trace every order from the first enquiry to dispatch, and we see quality results while a lot is still being made.",
    name: UNCONFIRMED,
    role: UNCONFIRMED,
    company: "Spinning mill, India",
    approved: false,
  },
  {
    project: "zoho-portfolio-accounting-system",
    quote:
      "We used to send our trade files to an outside provider every day and could only log in to view the results. With the system PeepalX built, our fund accounting is in-house, our client and SEBI reports go out automatically, and every file we upload is kept for audit.",
    name: UNCONFIRMED,
    role: UNCONFIRMED,
    company: "Portfolio Management Services firm, India",
    approved: false,
  },
];

/** True when the client has supplied this attribution, not the draft default. */
function isConfirmed(value: string): boolean {
  const trimmed = value.trim();
  return trimmed !== "" && trimmed !== UNCONFIRMED;
}

/**
 * True when the attribution is ready to publish: a confirmed company, and a
 * name and role that are either confirmed or left out for an anonymous review.
 */
export function hasConfirmedAttribution(testimonial: Testimonial): boolean {
  const { name, role, company } = testimonial;
  return (
    [name, role].every((value) => value === undefined || isConfirmed(value)) &&
    isConfirmed(company)
  );
}

/**
 * True when a review may appear on the site: approved by the client and with
 * confirmed attribution. A half-edited draft marked approved is left out, so
 * it can never reach the page even if tests were not run.
 */
export function isPublishable(testimonial: Testimonial): boolean {
  return testimonial.approved && hasConfirmedAttribution(testimonial);
}

/** The only reviews the site renders. */
export const publishedTestimonials = testimonials.filter(isPublishable);
