"use client";

import { ErrorCard } from "@/components/error/error-card";

/**
 * General error boundary: catches render errors in page segments.
 * Renders within the layout, preserving header/footer.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <ErrorCard
        title="Something went wrong"
        message="We hit an unexpected error loading this page."
        action="Try again, or go back to the previous page."
        severity="warning"
        onRetry={reset}
        backHref="/"
        backLabel="Go home"
        errorCode={error.digest}
      />
    </div>
  );
}
