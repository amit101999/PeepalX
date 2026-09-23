import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverseSecondary";
type Size = "md" | "lg";

/*
 * `group` lets an icon inside the button react to hover, e.g. an arrow that
 * nudges forward (`group-hover:translate-x-0.5`). The press state scales the
 * button slightly so a tap feels acknowledged.
 */
const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out-soft)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-canvas hover:bg-accent-hover",
  secondary: "border border-control text-ink hover:border-ink hover:bg-surface",
  ghost: "text-ink hover:bg-elevated",
  /* For the dark closing block. */
  inverse: "bg-on-dark text-ink hover:bg-on-dark-accent",
  inverseSecondary:
    "border border-on-dark-muted text-on-dark hover:border-on-dark hover:bg-on-dark/10",
};

const sizes: Record<Size, string> = {
  // min-h keeps every button a comfortable touch target on mobile.
  md: "min-h-11 px-4 py-2.5 text-sm",
  lg: "min-h-12 px-6 py-3 text-[0.975rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonElementProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type LinkElementProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps | "href"> & {
    /** Rendering a link instead of a button. */
    href: string;
  };

export type ButtonProps = ButtonElementProps | LinkElementProps;

/**
 * The single button component used across the site.
 *
 * Pass `href` to render a Next.js `Link` styled as a button; omit it to render
 * a real `<button>`. External URLs open in a new tab with
 * `rel="noopener noreferrer"` and announce that to screen readers.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    const isExternal = /^https?:\/\//.test(href);

    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {isExternal ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type, ...rest } = props;

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
