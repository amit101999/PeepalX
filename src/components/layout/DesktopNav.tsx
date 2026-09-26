"use client";

import Link from "next/link";
import { useRef, useState, type FocusEvent, type PointerEvent } from "react";
import type { NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils/cn";

interface DesktopNavProps {
  items: NavItem[];
  isActive: (href: string) => boolean;
}

/** Where the pill sits, measured from the hovered or focused link. */
interface PillBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Desktop header links with a shared hover pill.
 *
 * One rounded pill sits behind the links and glides to whichever link the
 * pointer (or keyboard focus) is on, so moving along the nav reads as one
 * continuous motion instead of separate hover flashes.
 *
 *  - Two layers: the outer one moves and resizes on the site's spring curve;
 *    the inner one fades and scales. The first time the pill appears it jumps
 *    to the link without a transition and only fades in, so it never sweeps
 *    across the nav from wherever it was last hidden.
 *  - Touch is ignored: a tap is not a hover, and the pill would stick.
 *  - Reduced motion is covered by the global rule in globals.css, which makes
 *    every transition effectively instant.
 *  - The pill is decorative (aria-hidden). The active page keeps its accent
 *    rule, so the current page is never shown by the pill or colour alone.
 */
export function DesktopNav({ items, isActive }: DesktopNavProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<PillBox | null>(null);
  const [visible, setVisible] = useState(false);
  // True when the pill appears from hidden, so it lands without gliding.
  const [instant, setInstant] = useState(true);

  const moveTo = (link: HTMLElement) => {
    setPill({
      x: link.offsetLeft,
      y: link.offsetTop,
      width: link.offsetWidth,
      height: link.offsetHeight,
    });
    setInstant(!visible);
    setVisible(true);
  };

  const onLinkPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;
    moveTo(event.currentTarget);
  };

  const onListBlur = (event: FocusEvent<HTMLUListElement>) => {
    // Hide only when focus leaves the list, not when it moves between links.
    if (!listRef.current?.contains(event.relatedTarget as Node | null)) {
      setVisible(false);
    }
  };

  return (
    <ul
      ref={listRef}
      onPointerLeave={() => setVisible(false)}
      onBlur={onListBlur}
      className="relative flex items-center gap-1"
    >
      {pill ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0"
          style={{
            width: pill.width,
            height: pill.height,
            transform: `translate(${pill.x}px, ${pill.y}px)`,
            transition: instant
              ? "none"
              : "transform 300ms var(--ease-spring), width 300ms var(--ease-spring)",
          }}
        >
          <span
            className={cn(
              "block size-full rounded-full bg-accent-soft transition-[opacity,scale] duration-200 ease-(--ease-out-soft)",
              visible ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          />
        </span>
      ) : null}

      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            onPointerEnter={onLinkPointerEnter}
            onFocus={(event) => moveTo(event.currentTarget)}
            className={cn(
              // Taller on touch screens (tablets get this nav from `md`).
              "relative block rounded-full px-3.5 py-2 text-sm transition-colors pointer-coarse:py-3",
              // The active link carries a short accent rule, so the
              // state is not shown by colour alone.
              "after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300",
              isActive(item.href)
                ? "font-medium text-ink after:scale-x-100"
                : "text-muted after:scale-x-0 hover:text-ink focus-visible:text-ink",
            )}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
