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
    images: [{ url: "/issb/og.png", width: 1200, height: 630 }],
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Ulul Albab", item: "https://ululalbab.vercel.app" },
                  { "@type": "ListItem", position: 2, name: "Crucible Board", item: "https://ululalbab.vercel.app/issb" },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is Crucible Board?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Crucible Board is an AI-powered ISSB practice platform by Ulul Albab. It helps Bangladesh Defense officer candidates prepare for TAT, WAT, SRT, and interview stages with realistic simulations and AI feedback.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Crucible Board free?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Crucible Board offers free ISSB practice. Powered by Ulul Albab and Lubb AI, you can practice TAT, WAT, SRT, and mock interview scenarios at no cost.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does Crucible Board help with ISSB preparation?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Crucible Board provides AI-powered simulations of all ISSB stages including TAT (Thematic Apperception Test), WAT (Word Association Test), SRT (Situation Reaction Test), and mock interviews. You receive instant AI feedback to improve your responses.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
