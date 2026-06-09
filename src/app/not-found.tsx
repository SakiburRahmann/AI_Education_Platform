import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-6xl font-bold text-gradient-primary">404</h1>
        <h2 className="mt-4 font-heading text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-block px-6 py-3 text-base"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
