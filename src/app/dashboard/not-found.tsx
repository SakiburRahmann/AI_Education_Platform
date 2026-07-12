import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-4 text-5xl">🔍</div>
        <h1 className="font-heading text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The dashboard section you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Dashboard home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Main site
          </Link>
        </div>
      </div>
    </div>
  );
}
