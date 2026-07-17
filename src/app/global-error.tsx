"use client";

import { ErrorCard } from "@/components/error/error-card";

/**
 * Global error boundary: wraps the ENTIRE application.
 * Only renders when the root layout itself crashes.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background p-4">
        <ErrorCard
          title="Critical Error"
          message="We encountered an unexpected error and couldn't recover."
          action="Please try refreshing the page. If the problem persists, contact support."
          severity="critical"
          onRetry={reset}
          backHref="/"
          backLabel="Go to homepage"
          errorCode={error.digest}
        />
      </body>
    </html>
  );
}
