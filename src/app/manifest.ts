import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ulul Albab — Learn with Lubb AI",
    short_name: "Ulul Albab",
    description:
      "AI-powered learning platform. Upload materials, chat with Lubb AI, generate lessons and quizzes, earn XP.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C3CE1",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
