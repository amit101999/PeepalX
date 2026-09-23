"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HoneypotField, SelectField, TextAreaField, TextField } from "./fields";
import {
  budgetOptions,
  contactFormSchema,
  serviceOptions,
  timelineOptions,
  toFieldErrors,
} from "@/lib/validation/contact";
import type { ContactApiResponse, ContactFormValues } from "@/lib/validation/contact";

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;
type Status = "idle" | "submitting" | "success" | "error";

/**
 * Project enquiry form.
 *
 * How it works:
 *  - Validates with the same Zod schema the API route uses, so the browser and
 *    the server never disagree about what is valid.
 *  - Client validation is for feedback only. `POST /api/contact` re-validates
 *    every submission and is the actual gate.
 *  - Spam handling is layered: a hidden honeypot field here, plus IP rate
 *    limiting on the server.
 *  - Status changes are announced to screen readers through a live region, and
 *    focus moves to the first field with an error.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState("");

  /*
   * On success the form is replaced by the confirmation, which would leave
   * keyboard focus on nothing (the focused submit button has just unmounted).
   * Moving focus to the confirmation heading also makes screen readers read it.
   */
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  /** Moves focus to the first invalid field so keyboard users are not stranded. */
  const focusFirstError = (fieldErrors: FieldErrors) => {
    const firstField = Object.keys(fieldErrors)[0];
    if (!firstField) return;

    formRef.current?.querySelector<HTMLInputElement>(`[name="${firstField}"]`)?.focus();
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());

    const parsed = contactFormSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus("error");
      setFormMessage("Please correct the highlighted fields and try again.");
      focusFirstError(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setFormMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The schema discards the honeypot, so its raw value is sent alongside:
        // the API answers a filled one like a success and logs that it did.
        body: JSON.stringify({ ...parsed.data, website: values.website }),
      });

      const result = await readApiResponse(response);

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setStatus("error");
        setFormMessage(result.message || GENERIC_FAILURE);
        if (result.errors) focusFirstError(result.errors);
        return;
      }

      setStatus("success");
      setFormMessage(result.message);
      formRef.current?.reset();
    } catch {
      // `fetch` itself failed: the request never reached the server.
      setStatus("error");
      setFormMessage(
        "We could not reach the server. Check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        // No live region: focus moves to the heading below, which announces the
        // confirmation once. Both together stutter in several screen readers.
        data-enter
        className="flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-8"
      >
        <CheckCircle2 aria-hidden="true" className="size-7 text-accent" />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="text-h3 font-semibold text-ink outline-none"
        >
          Message sent
        </h3>
        <p className="leading-relaxed text-muted">{formMessage}</p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label="Name"
          required
          autoComplete="name"
          error={errors.name}
          disabled={isSubmitting}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          spellCheck={false}
          autoComplete="email"
          error={errors.email}
          disabled={isSubmitting}
        />
        <TextField
          name="company"
          label="Company"
          autoComplete="organization"
          error={errors.company}
          disabled={isSubmitting}
        />
        <TextField
          name="phone"
          label="Phone"
          type="tel"
          optional
          autoComplete="tel"
          error={errors.phone}
          disabled={isSubmitting}
        />
      </div>

      <SelectField
        name="service"
        label="What do you need help with?"
        required
        options={serviceOptions}
        error={errors.service}
        disabled={isSubmitting}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="budget"
          label="Budget range"
          optional
          options={budgetOptions}
          error={errors.budget}
          disabled={isSubmitting}
        />
        <SelectField
          name="timeline"
          label="Timeline"
          optional
          options={timelineOptions}
          error={errors.timeline}
          disabled={isSubmitting}
        />
      </div>

      <TextAreaField
        name="message"
        label="Project description"
        required
        rows={6}
        placeholder="What are you building, or what problem needs solving? Rough detail is fine…"
        error={errors.message}
        disabled={isSubmitting}
      />

      <HoneypotField />

      {status === "error" && formMessage ? (
        <p
          role="alert"
          data-enter
          className="flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {formMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>

        <p className="text-xs text-faint">
          We use your details only to reply to this enquiry.
        </p>
      </div>

      {/* Announces submission progress to screen readers without stealing focus. */}
      <p aria-live="polite" className="sr-only">
        {isSubmitting ? "Sending your message" : ""}
      </p>
    </form>
  );
}

const GENERIC_FAILURE = "Something went wrong. Please try again.";

/**
 * Reads the API's JSON reply. A response that is not our JSON (a platform error
 * page for an oversized request or a timeout, for example) still reached a
 * server, so it becomes a generic failure rather than a "could not reach the
 * server" message.
 */
async function readApiResponse(response: Response): Promise<ContactApiResponse> {
  try {
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "ok" in body && "message" in body) {
      return body as ContactApiResponse;
    }
  } catch {
    // Not JSON; fall through to the generic failure below.
  }

  return {
    ok: false,
    message:
      response.status === 413 ? "Your message is too large to send." : GENERIC_FAILURE,
  };
}
