"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  budgetOptions,
  contactFormSchema,
  serviceOptions,
  timelineOptions,
  toFieldErrors,
} from "@/lib/validation/contact";
import type { ContactApiResponse, ContactFormValues } from "@/lib/validation/contact";
import { cn } from "@/lib/utils/cn";

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
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState("");

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
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.errors ?? {});
        setStatus("error");
        setFormMessage(result.message || "Something went wrong. Please try again.");
        if (result.errors) focusFirstError(result.errors);
        return;
      }

      setStatus("success");
      setFormMessage(result.message);
      formRef.current?.reset();
    } catch {
      // Network-level failure: the request never reached the server.
      setStatus("error");
      setFormMessage(
        "We could not reach the server. Check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-8"
      >
        <CheckCircle2 aria-hidden="true" className="size-7 text-accent" />
        <h3 className="text-h3 font-semibold text-ink">Thank you — message sent</h3>
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
        placeholder="What are you building, or what problem needs solving? Rough detail is fine."
        error={errors.message}
        disabled={isSubmitting}
      />

      <HoneypotField />

      {status === "error" && formMessage ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent"
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
            "Send Inquiry"
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

/* -------------------------------------------------------------------------- */
/* Field primitives                                                            */
/* -------------------------------------------------------------------------- */

const fieldClasses =
  "w-full rounded-md border bg-surface px-3.5 py-3 text-[0.95rem] text-ink " +
  "transition-colors placeholder:text-faint focus:outline-none disabled:opacity-60";

/** Border colour depends on whether the field currently has an error. */
function borderFor(hasError: boolean) {
  return hasError ? "border-accent" : "border-line-strong focus:border-ink";
}

interface BaseFieldProps {
  name: keyof ContactFormValues;
  label: string;
  required?: boolean;
  /** Adds a visible "(optional)" hint next to the label. */
  optional?: boolean;
  error?: string;
  disabled?: boolean;
}

/**
 * Label, control and error message wired together.
 *
 * `aria-describedby` points at the error text and `aria-invalid` marks the
 * control, so a screen reader announces the problem when focus lands on it.
 */
function FieldShell({
  label,
  id,
  errorId,
  error,
  required,
  optional,
  children,
}: {
  label: string;
  id: string;
  errorId: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-accent">
            *
          </span>
        ) : null}
        {optional ? <span className="ml-1.5 text-faint">(optional)</span> : null}
      </label>

      {children}

      {error ? (
        <p id={errorId} className="text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextField({
  name,
  label,
  required,
  optional,
  error,
  disabled,
  type = "text",
  ...rest
}: BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <FieldShell
      label={label}
      id={id}
      errorId={errorId}
      error={error}
      required={required}
      optional={optional}
    >
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClasses, borderFor(Boolean(error)))}
        {...rest}
      />
    </FieldShell>
  );
}

function TextAreaField({
  name,
  label,
  required,
  optional,
  error,
  disabled,
  ...rest
}: BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <FieldShell
      label={label}
      id={id}
      errorId={errorId}
      error={error}
      required={required}
      optional={optional}
    >
      <textarea
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClasses, borderFor(Boolean(error)), "resize-y")}
        {...rest}
      />
    </FieldShell>
  );
}

function SelectField({
  name,
  label,
  required,
  optional,
  error,
  disabled,
  options,
}: BaseFieldProps & { options: readonly string[] }) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <FieldShell
      label={label}
      id={id}
      errorId={errorId}
      error={error}
      required={required}
      optional={optional}
    >
      <select
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClasses, borderFor(Boolean(error)), "min-h-12")}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * Honeypot.
 *
 * Hidden from sight and from assistive technology, and excluded from tab
 * order, so no real user ever fills it in. Automated form fillers usually do,
 * and the schema rejects any submission where it is not empty.
 */
function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input
        id="website-field"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
