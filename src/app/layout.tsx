import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Quicksand,
  Plus_Jakarta_Sans,
  DM_Sans,
  Nunito,
  Nunito_Sans,
  Oxanium,
  Rajdhani,
  Share_Tech_Mono,
  Orbitron,
  Exo_2,
  Space_Mono,
  Fredoka,
} from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: "400",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ulualalbab.vercel.app"),
  title: {
    default: "Ulu Al Albab — Learn with Lubb AI",
    template: "%s | Ulu Al Albab",
  },
  description:
    "Ulu Al Albab is an AI-powered learning platform. Upload PDFs, slides, and notes. Chat with Lubb AI, generate interactive lessons and quizzes, earn XP, and climb leagues.",
  keywords: [
    "Ulu Al Albab",
    "Lubb AI",
    "AI learning platform",
    "AI education",
    "study with AI",
    "interactive lessons",
    "AI quiz generator",
    "gamified learning",
    "online education",
    "AI tutor",
  ],
  authors: [{ name: "Ulu Al Albab" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ulu Al Albab",
    title: "Ulu Al Albab — Learn with Lubb AI",
    description:
      "Upload your materials, chat with Lubb AI, generate interactive lessons and quizzes, and compete with others in a gamified learning platform.",
    url: "https://ulualalbab.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulu Al Albab — Learn with Lubb AI",
    description:
      "AI-powered learning platform. Chat with Lubb AI, generate lessons & quizzes, earn XP.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} ${plusJakartaSans.variable} ${dmSans.variable} ${nunito.variable} ${nunitoSans.variable} ${oxanium.variable} ${rajdhani.variable} ${shareTechMono.variable} ${orbitron.variable} ${exo2.variable} ${spaceMono.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Ulu Al Albab",
                applicationCategory: "EducationalApplication",
                operatingSystem: "Web",
                description:
                  "AI-powered learning platform. Upload PDFs, slides, and notes. Chat with Lubb AI, generate interactive lessons and quizzes, earn XP, and climb leagues.",
                url: "https://ulualalbab.vercel.app",
                author: { "@type": "Organization", name: "Ulu Al Albab" },
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              }),
            }}
          />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
