import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ululalbab.vercel.app"),
  applicationName: "Ulul Albab",
  title: {
    default: "Ulul Albab | Learn with Lubb AI",
    template: "%s | Ulul Albab",
  },
  description:
    "Ulul Albab is an AI-powered learning platform with Lubb AI: your personal AI tutor. Upload PDFs, slides, and notes. Chat with Lubb, generate interactive lessons and quizzes, earn XP, and climb leagues. The smartest way to learn with AI.",
  keywords: [
    "Ulul Albab",
    "Lubb AI",
    "AI learning platform",
    "AI education",
    "AI tutor",
    "study with AI",
    "interactive lessons",
    "AI quiz generator",
    "gamified learning",
    "online education",
    "personalized learning",
    "AI study assistant",
    "Lubb",
    "Ulul Albab platform",
  ],
  authors: [{ name: "Ulul Albab" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ulul Albab",
    title: "Ulul Albab | Learn with Lubb AI",
    description:
      "Ulul Albab is an AI-powered learning platform with Lubb AI: your personal AI tutor. Upload PDFs, slides, and notes. Chat with Lubb, generate interactive lessons and quizzes, earn XP, and climb leagues.",
    url: "https://ululalbab.vercel.app",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulul Albab | Learn with Lubb AI",
    description:
      "AI-powered learning platform with Lubb AI. Upload materials, generate lessons & quizzes, earn XP, and climb leagues.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ululalbab.vercel.app",
    languages: {
      "x-default": "https://ululalbab.vercel.app",
      en: "https://ululalbab.vercel.app",
    },
  },
  verification: {
    google: "LDxHDWNF7ouKXdXc2MUgxgmeBKkH9lMHz_HuOVTuAtE",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
                "@graph": [
                  {
                    "@type": "Organization",
                    name: "Ulul Albab",
                    alternateName: "Ulul Albab | Learn with Lubb AI",
                    url: "https://ululalbab.vercel.app",
                    logo: "https://ululalbab.vercel.app/logo.png",
                    description:
                      "AI-powered learning platform with Lubb AI. Upload PDFs, slides, and notes. Chat with Lubb, generate interactive lessons and quizzes, earn XP, and climb leagues.",
                    sameAs: [
                      "https://ululalbab.vercel.app",
                    ],
                  },
                  {
                    "@type": "WebSite",
                    name: "Ulul Albab",
                    alternateName: "Lubb AI",
                    url: "https://ululalbab.vercel.app",
                    description:
                      "AI-powered learning platform with Lubb AI: your personal AI tutor. Upload PDFs, slides, and notes. Chat with Lubb, generate interactive lessons and quizzes, earn XP, and climb leagues.",
                  },
                  {
                    "@type": "WebApplication",
                    name: "Ulul Albab",
                    applicationCategory: "EducationalApplication",
                    operatingSystem: "Web",
                    browserRequirements: "Requires JavaScript",
                    description:
                      "AI-powered learning platform with Lubb AI. Upload materials, chat with your AI tutor, generate interactive lessons and quizzes, earn XP, and climb leagues.",
                    url: "https://ululalbab.vercel.app",
                    author: { "@type": "Organization", name: "Ulul Albab" },
                    offers: {
                      "@type": "Offer",
                      price: "0",
                      priceCurrency: "USD",
                    },
                  },
                  {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "Home", item: "https://ululalbab.vercel.app" },
                      { "@type": "ListItem", position: 2, name: "AI Chat", item: "https://ululalbab.vercel.app/dashboard/chat" },
                      { "@type": "ListItem", position: 3, name: "Blog", item: "https://ululalbab.vercel.app/blog" },
                    ],
                  },
                ],
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
