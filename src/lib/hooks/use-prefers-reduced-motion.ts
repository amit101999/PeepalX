"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked for less motion, kept live if they change it.
 *
 * A few lines of `matchMedia` instead of an animation library's hook, so
 * components that only need the preference do not pull in the library. The
 * server snapshot is `false`, which keeps the first client render identical to
 * the server's; the real value arrives straight after hydration.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
