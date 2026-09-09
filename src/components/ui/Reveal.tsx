"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
  children: React.ReactNode;
  /** Stagger delay in milliseconds, for revealing a row of cards in sequence. */
  delay?: number;
  className?: string;
  /** Render as a list item instead of a div, so lists stay valid. */
  as?: "div" | "li";
}

/**
 * Fades and lifts its children into view on first scroll past.
 *
 * Three deliberate details:
 *
 * 1. No animation library. This is an IntersectionObserver plus a CSS
 *    transition, which costs about a kilobyte instead of tens of them.
 *
 * 2. Content is visible by default and only hidden once we have confirmed the
 *    element starts below the fold. If JavaScript never runs, nothing is
 *    hidden — the page still reads completely.
 *
 * 3. `prefers-reduced-motion` is handled in `globals.css`, which forces every
 *    `[data-reveal]` element to its final state. Reduced motion means no
 *    movement, never missing content.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Already on screen at mount: show it and skip the observer entirely.
    if (element.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return;
    }

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          observer.disconnect();
        }
      },
      // Trigger slightly before the element reaches the bottom edge.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Component = as;
  const isHidden = armed && !visible;

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      data-reveal=""
      className={cn(
        "transition-[opacity,transform] duration-[650ms] ease-[var(--ease-out-soft)] motion-reduce:transition-none",
        isHidden ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100",
        className,
      )}
      style={isHidden ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
