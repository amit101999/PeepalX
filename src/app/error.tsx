"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Route-level error boundary.
 *
 * Shows a recovery path rather than a stack trace. The error object is logged
 * to the console for local debugging, and `error.digest` is the id to match
 * against server logs in production — no internal detail is rendered to the
 * visitor.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col justify-center py-24">
        <p className="font-mono text-sm text-accent">Error</p>

        <h1 className="mt-4 text-h1 font-semibold text-ink">Something went wrong.</h1>

        <p className="mt-5 max-w-lg text-lead text-muted">
          The page failed to load. Trying again usually resolves it; if it keeps
          happening, let us know and we will look into it.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Button href="/" size="lg" variant="secondary">
            Return home
          </Button>
        </div>

        {error.digest ? (
          <p className="mt-10 font-mono text-xs text-faint">Reference: {error.digest}</p>
        ) : null}
      </div>
    </Container>
  );
}
