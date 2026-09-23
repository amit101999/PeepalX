import { useId } from "react";
import type { ContactFormValues } from "@/lib/validation/contact";
import { cn } from "@/lib/utils/cn";

/**
 * Accessible form fields for the contact form.
 *
 * Each field wires its label, control and error message together, so the form
 * itself only decides which fields exist and what their errors are.
 */

const fieldClasses =
  "w-full rounded-md border bg-surface px-3.5 py-3 text-[0.95rem] text-ink " +
  "transition-[border-color,box-shadow] placeholder:text-faint focus:outline-hidden disabled:opacity-60";

/** Border colour depends on whether the field currently has an error. */
function borderFor(hasError: boolean) {
  // Focus adds a ring on top of the 1px border: 2px of accent green normally, 3px
  // of red on a field in error. `outline-hidden` keeps a transparent outline, which
  // forced-colors mode turns visible when box-shadow rings are dropped.
  return hasError
    ? "border-danger focus:ring-2 focus:ring-danger"
    : "border-control focus:border-accent focus:ring-1 focus:ring-accent";
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
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        ) : null}
        {optional ? <span className="ml-1.5 text-faint">(optional)</span> : null}
      </label>

      {children}

      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
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

export function TextAreaField({
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

export function SelectField({
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
 * and the API route then answers with a normal success without delivering
 * it (see `isHoneypotFilled`).
 */
export function HoneypotField() {
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
