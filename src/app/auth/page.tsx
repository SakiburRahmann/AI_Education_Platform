"use client";

import { useCallback, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LubbLogo } from "@/components/ui/lubb-logo";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, { title: string; message: string; action?: string }> = {
  auth_failed: {
    title: "Sign in failed",
    message: "We couldn't complete the sign-in process.",
    action: "Please try signing in again. Make sure you allow pop-ups and cookies.",
  },
  too_many_attempts: {
    title: "Too many attempts",
    message: "You've made too many sign-in attempts.",
    action: "Please wait a minute before trying again.",
  },
};

const DEFAULT_ERROR = {
  title: "Something went wrong",
  message: "An unexpected error occurred during sign-in.",
  action: "Please try again.",
};

/**
 * Inner component that reads search params — wrapped in Suspense by parent.
 * Required because useSearchParams() needs a Suspense boundary in Next.js 15+.
 */
function AuthPageInner() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const errorInfo = errorParam ? (ERROR_MESSAGES[errorParam] || DEFAULT_ERROR) : null;

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.06]" />
      <Card
        className="w-full max-w-sm relative border-0 shadow-lg"
        style={{ borderRadius: "1.5rem" }}
      >
        <CardHeader className="text-center pt-8">
          <div className="mb-4 flex justify-center">
            <LubbLogo className="h-12 w-12" />
          </div>
          <CardTitle className="font-heading text-2xl">
            Welcome to Ulul Albab
          </CardTitle>
          <CardDescription>
            Sign in to start learning with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {/* Error banner */}
          {errorInfo && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                {errorInfo.title}
              </p>
              <p className="mt-1 text-[11px] text-red-500/70">
                {errorInfo.message}
              </p>
              {errorInfo.action && (
                <p className="mt-1 text-[10px] text-red-500/50">
                  {errorInfo.action}
                </p>
              )}
            </div>
          )}

          <button
            className="btn-primary w-full gap-2 text-base"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-5 w-5 inline" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * AuthPage wraps AuthPageInner in a Suspense boundary.
 * Required because useSearchParams() triggers static rendering warnings otherwise.
 */
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <AuthPageInner />
    </Suspense>
  );
}
