import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ulualalbab.vercel.app";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/auth`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/dashboard/chat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/dashboard/lessons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/dashboard/quizzes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/dashboard/community`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/dashboard/leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/dashboard/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/dashboard/settings`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/dashboard/files`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];
}
