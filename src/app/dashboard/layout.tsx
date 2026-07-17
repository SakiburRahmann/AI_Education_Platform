import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardClientLayout } from "./dashboard-client-layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Ulul Albab learning dashboard. Track XP, manage conversations, view lessons and quizzes, and compete on the leaderboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
