import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ulul Albab | Learn with Lubb AI",
    short_name: "Ulul Albab",
    description:
      "AI-powered learning platform with Lubb AI: your personal AI tutor. Upload materials, generate interactive lessons and quizzes, earn XP.",
    start_url: "/",
    scope: "/",
    lang: "en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C3CE1",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/logo.png", sizes: "1254x1254", type: "image/png" },
    ],
  };
}
