import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Crucible Board — ISSB Practice Platform | Powered by Ulul Albab",
  description:
    "Forge your commission with Crucible Board. AI-powered ISSB practice platform for Bangladesh Defense officer candidates. Master TAT, WAT, SRT, and interview preparation with realistic simulations.",
  openGraph: {
    title: "Crucible Board — Forge Your Commission",
    description:
      "AI-powered ISSB practice platform. Practice TAT, WAT, SRT, and mock interviews. Prepare for the Bangladesh Inter Services Selection Board with realistic AI-powered simulations.",
    url: "https://ululalbab.vercel.app/issb",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crucible Board — Forge Your Commission",
    description:
      "AI-powered ISSB practice platform. Master TAT, WAT, SRT, and interview preparation.",
  },
  keywords: [
    "ISSB Bangladesh",
    "ISSB practice",
    "Bangladesh Army preparation",
    "TAT test",
    "WAT test",
    "SRT practice",
    "military officer preparation",
    "Bangladesh defense",
    "officer candidate",
    "Crucible Board",
    "ISSB preparation online",
    "Bangladesh Army officer",
    "Bangladesh Navy officer",
    "Bangladesh Air Force officer",
    "Inter Services Selection Board",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ululalbab.vercel.app/issb",
  },
};

export default function IssbLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
