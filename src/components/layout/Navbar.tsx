"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { homeSectionIds, mainNav } from "@/data/navigation";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./Logo";

/**
 * Site header.
 *
 * Behaviour worth knowing about:
 *  - Fixed height (h-16), so the sticky header never shifts layout.
 *  - Gains a border and background blur only after the page is scrolled.
 *  - Highlights the current page, and on the home page the section in view.
 *  - The mobile menu closes on Escape, on any link tap, and on outside tap;
 *    focus moves into the panel when it opens and back to the toggle when it
 *    closes; page scroll is locked while it is open.
 */
export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  const activeSection = useActiveSection(homeSectionIds, isHome);

  // Header treatment follows scroll position.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes (e.g. browser back button).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
   * is not enough: tapping "Process" while already on the home page changes
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || menuOpen ? "border-line" : "border-transparent",
      )}
    >
      {/*
        The translucent blurred background lives on its own layer rather than
        on <header>. `backdrop-filter` makes an element the containing block
        for its `position: fixed` descendants, which would trap the fixed
        mobile menu inside the 64px header once the page is scrolled.
      */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 transition-colors duration-300",
          scrolled || menuOpen ? "bg-canvas/85 backdrop-blur-md" : "bg-transparent",
        )}
      />

      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors",
                      isActive(item.href)
                        ? "font-medium text-ink"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Button href="/contact" size="md">
              Start a Project
            </Button>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-elevated md:hidden"
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
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 md:hidden">
          {/* Tapping outside the panel closes the menu. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={closeMenu}
            className="absolute inset-0 cursor-default bg-ink/20"
          />

          <div
            ref={panelRef}
            id="mobile-menu"
            className="relative border-b border-line bg-canvas shadow-lifted"
          >
            <Container>
              <nav aria-label="Mobile" className="py-4">
                <ul className="flex flex-col">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center border-b border-line/70 text-[0.975rem]",
                          isActive(item.href) ? "font-medium text-ink" : "text-muted",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/contact"
                  size="lg"
                  onClick={closeMenu}
                  className="mt-5 w-full"
                >
                  Start a Project
                </Button>
              </nav>
            </Container>
          </div>
        </div>
      ) : null}
    </header>
  );
}
