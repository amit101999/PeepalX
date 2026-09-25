"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeSectionIds, mainNav, primaryCta } from "@/data/navigation";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils/cn";
import { DesktopNav } from "./DesktopNav";
import { Logo } from "./Logo";

/**
 * Site header.
 *
 * Behaviour worth knowing about:
 *  - A floating pill inside the page gutter, fixed height (a 12px gap plus
 *    h-14), so the sticky header never shifts layout.
 *  - Gains a border and background blur once the page is scrolled. That is
 *    detected by an IntersectionObserver on a tiny sentinel at the top of the
 *    document, not a scroll listener, so nothing runs on every scroll frame.
 *  - Highlights the current page, and on the home page the section in view.
 *    On desktop a shared pill follows the hovered link (see DesktopNav).
 *  - The mobile menu closes on Escape, on any link tap, and on outside tap;
 *    focus moves into the panel when it opens and back to the toggle when it
 *    closes; page scroll is locked while it is open.
 */
export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  const activeSection = useActiveSection(homeSectionIds, isHome);

  // Header treatment follows whether the top of the page is still in view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setScrolled(!entry.isIntersecting);
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close the menu whenever the route changes (e.g. browser back button).
  // Adjusting state during render, rather than in an effect, avoids a second
  // render pass with the stale menu still open.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  // While the menu is open: lock scroll, close on Escape, move focus in.
  useEffect(() => {
    if (!menuOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  /**
   * Links close the menu themselves. Relying on the route-change effect alone
   * is not enough: tapping a hash link for the page you are already on changes
   * only the hash, the pathname stays "/", and the menu would stay open with
   * page scroll still locked.
   */
  const closeMenu = () => setMenuOpen(false);

  /** A nav link is active for its own route, or for its section on the home page. */
  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return isHome && activeSection === href.slice(2);
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const raised = scrolled || menuOpen;

  return (
    <>
      {/* Sits at the very top of the document; when it leaves the viewport, the page is scrolled. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
      />

      <header className="sticky top-0 z-50 pt-3">
        <Container>
          <div className="relative flex h-14 items-center justify-between gap-6 pr-1.5 pl-5">
            {/*
              The header is a floating pill inside the page gutter. Its
              translucent, blurred background lives on its own layer rather than
              on an ancestor of the menu: `backdrop-filter` makes an element the
              containing block for its `position: fixed` descendants, which would
              trap the fixed mobile menu inside the pill.
            */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 -z-10 rounded-full border transition-[background-color,box-shadow,border-color] duration-300",
                raised
                  ? "border-line-strong bg-canvas/85 shadow-lifted backdrop-blur-md"
                  : "border-line bg-surface/60",
              )}
            />

            <Logo />

            <nav aria-label="Main" className="hidden md:block">
              <DesktopNav items={mainNav} isActive={isActive} />
            </nav>

            <div className="hidden md:block">
              <Button href={primaryCta.href} size="md">
                {primaryCta.label}
              </Button>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated md:hidden"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </Container>

        {menuOpen ? (
          // 4.25rem = the header's pt-3 + h-14; change them together.
          <div className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 md:hidden">
            {/* Tapping outside the panel closes the menu. */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={closeMenu}
              className="absolute inset-0 cursor-default bg-ink/25"
            />

            <Container>
              <div
                ref={panelRef}
                id="mobile-menu"
                className="relative mt-2 animate-menu-in overscroll-contain rounded-3xl border border-line bg-canvas px-5 shadow-lifted"
              >
                <nav aria-label="Mobile" className="py-3">
                  <ul className="flex flex-col">
                    {mainNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center border-b border-line text-base transition-colors hover:text-ink",
                            isActive(item.href) ? "font-medium text-ink" : "text-muted",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={primaryCta.href}
                    size="lg"
                    onClick={closeMenu}
                    className="mt-4 mb-2 w-full"
                  >
                    {primaryCta.label}
                  </Button>
                </nav>
              </div>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}
