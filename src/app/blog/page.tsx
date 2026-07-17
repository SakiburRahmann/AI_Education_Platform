import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Learn about AI-powered education, study tips, and how Ulul Albab with Lubb AI is transforming the way students learn. Read our latest articles.",
  openGraph: {
    title: "Ulul Albab Blog | AI Learning Insights",
    description:
      "AI-powered education tips, study strategies, and insights from the Ulul Albab team.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ulul Albab Blog | AI Learning Insights",
    description:
      "AI-powered education tips, study strategies, and insights from the Ulul Albab team.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://ululalbab.vercel.app/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-12">
        Insights on AI-powered learning, study tips, and education technology.
      </p>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card-hover p-5 sm:p-6 group"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {post.description}
            </p>
            <div className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
