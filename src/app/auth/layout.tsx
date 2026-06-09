import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Ulul Albab and start learning with Lubb AI. Upload your materials, generate interactive lessons and quizzes, earn XP, and climb the leaderboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
