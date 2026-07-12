/**
 * Reusable ErrorCard component for displaying errors with consistent styling
 * and actionable next steps.
 */

import Link from "next/link";

export type ErrorSeverity = "critical" | "warning" | "info";

interface ErrorCardProps {
  /** The title of the error (e.g., "Something went wrong") */
  title: string;
  /** User-friendly description of what happened */
  message: string;
  /** Specific suggestion for what the user should do */
  action?: string;
  /** Severity changes the icon and color scheme */
  severity?: ErrorSeverity;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Optional back link */
  backHref?: string;
  /** Optional back label */
  backLabel?: string;
  /** Optional error code shown in subtle text */
  errorCode?: string;
}

const SEVERITY_STYLES: Record<ErrorSeverity, { icon: string; gradient: string; border: string }> = {
  critical: {
    icon: "❗",
    gradient: "from-red-500/10 to-orange-500/10",
    border: "border-red-500/20",
  },
  warning: {
    icon: "⚠️",
    gradient: "from-amber-500/10 to-yellow-500/10",
    border: "border-amber-500/20",
  },
  info: {
    icon: "ℹ️",
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20",
  },
};

export function ErrorCard({
  title,
  message,
  action,
  severity = "critical",
  onRetry,
  backHref,
  backLabel,
  errorCode,
}: ErrorCardProps) {
  const styles = SEVERITY_STYLES[severity];

  return (
    <div
      className={`mx-auto max-w-md rounded-2xl border bg-gradient-to-b ${styles.gradient} ${styles.border} p-8 text-center shadow-sm`}
    >
      <div className="mb-4 text-4xl">{styles.icon}</div>
      <h2 className="font-heading text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-1">{message}</p>
      {action && (
        <p className="text-xs text-muted-foreground/70 mb-6">{action}</p>
      )}
      {errorCode && (
        <p className="text-[10px] text-muted-foreground/40 mb-4 font-mono">
          Error code: {errorCode}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        )}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {backLabel || "Go back"}
          </Link>
        )}
      </div>
    </div>
  );
}
