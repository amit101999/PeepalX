"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently in view.
 *
 * Used by the header to highlight the nav link for the section you are reading
 * on the home page. Returns null when disabled or when nothing is in view.
 *
 * The observation band is the middle of the viewport, so the active link
 * changes when a section genuinely occupies the screen rather than the moment
 * its top edge appears.
 */
export function useActiveSection(
  sectionIds: readonly string[],
  enabled: boolean,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveId(null);
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (inView[0]) setActiveId(inView[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sectionIds, enabled]);

  return activeId;
}
