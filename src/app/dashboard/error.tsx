"use client";

import { ErrorCard } from "@/components/error/error-card";

/**
 * Dashboard-specific error boundary.
 * Preserves the dashboard sidebar layout via the parent dashboard layout.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <ErrorCard
        title="Dashboard error"
        message="Something went wrong while loading this dashboard section."
        action="Try again, or navigate to a different section."
        severity="warning"
        onRetry={reset}
        backHref="/dashboard"
        backLabel="Dashboard home"
        errorCode={error.digest}
      />
    </div>
  );
}
