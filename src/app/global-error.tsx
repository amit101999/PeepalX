"use client";

import { useEffect } from "react";
import "@/styles/globals.css";

/**
 * Last-resort error boundary for failures in the root layout itself.
 *
 * `error.tsx` only catches errors below the layout. When the layout throws
 * (navbar, footer, fonts), Next renders this instead, and it replaces the whole
 * document, so it brings its own <html> and <body> and depends on nothing but
 * the stylesheet. Like `error.tsx`, it shows no internal detail: `digest` is
 * the id to match against server logs.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* Metadata exports do not apply here, so the tab title is set directly. */}
        <title>Something went wrong</title>
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
          <p className="text-label font-medium text-accent">Error</p>
          <h1 className="mt-4 text-h1 font-semibold text-ink">Something went wrong.</h1>
          <p className="mt-5 text-lead text-muted">
            The site failed to load. Trying again usually resolves it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {/* Plain elements: shared components may be what failed. */}
            <button
              type="button"
              onClick={() => retry()}
              className="rounded-lg bg-accent px-5 py-3 font-medium text-canvas hover:bg-accent-hover"
            >
              Try again
            </button>
            {/* A full page load, not client navigation: the app shell is broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="rounded-lg border border-control px-5 py-3 text-center font-medium text-ink hover:border-ink hover:bg-surface"
            >
              Back to home
            </a>
          </div>

          {error.digest ? (
            <p className="mt-10 font-mono text-xs text-faint">
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
