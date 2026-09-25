import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverseSecondary";
type Size = "md" | "lg";

/*
 * Pill-shaped, so actions read as distinct from the chamfered surfaces around
 * them (and the focus ring, which follows the radius, is never clipped).
 * `group` lets the arrow react to hover. The press state scales the button
 * slightly so a tap feels acknowledged.
 */
const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
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
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-7 py-3 text-[0.975rem]",
};

/* With an arrow, the vertical and right padding shrink so the circle sits an
   even 6px from three edges and the button keeps its usual height. */
const arrowSizes: Record<Size, { button: string; circle: string }> = {
  md: { button: "py-1.5 pr-1.5", circle: "size-8" },
  lg: { button: "gap-3 py-1.5 pr-1.5", circle: "size-9" },
};

/* A tint of the button's own text colour, so the circle works on every variant. */
const arrowCircle =
  "inline-flex shrink-0 items-center justify-center rounded-full bg-current/12 " +
  "transition-transform duration-300 ease-[var(--ease-out-soft)] " +
  "group-hover:translate-x-0.5 group-hover:-translate-y-px motion-reduce:transform-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /**
   * A trailing arrow in its own circle. It points up-right for links that
   * leave the site, right for everything else.
   */
  arrow?: boolean;
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
  const { variant = "primary", size = "md", arrow = false, className, children } = props;
  const isExternal = props.href !== undefined && /^https?:\/\//.test(props.href);
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    arrow && arrowSizes[size].button,
    className,
  );

  const Arrow = isExternal ? ArrowUpRight : ArrowRight;
  const trailing = arrow ? (
    <span aria-hidden="true" className={cn(arrowCircle, arrowSizes[size].circle)}>
      <Arrow className="size-4" />
    </span>
  ) : null;

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      arrow: _a,
      className: _c,
      children: _ch,
      ...rest
    } = props;

    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {isExternal ? <span className="sr-only"> (opens in a new tab)</span> : null}
        {trailing}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    arrow: _a,
    className: _c,
    children: _ch,
    type,
    ...rest
  } = props;

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
      {trailing}
    </button>
  );
}
