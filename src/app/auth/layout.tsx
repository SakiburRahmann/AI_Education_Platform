import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Ulul Albab and start learning with Lubb AI — your personal AI tutor. Upload materials, generate lessons and quizzes, earn XP.",
  openGraph: {
    title: "Sign In | Ulul Albab",
    description:
      "Sign in to Ulul Albab and learn with Lubb AI. Upload PDFs, slides, and notes. Generate interactive lessons and quizzes.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Ulul Albab",
    description:
      "Sign in to Ulul Albab and start learning with Lubb AI.",
  },
  alternates: {
    canonical: "https://ululalbab.vercel.app/auth",
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
