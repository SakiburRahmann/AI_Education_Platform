import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageWrapper } from "@/components/animations/page-wrapper";
import { blogPosts } from "@/content/blog";
import { sanitizeHtml } from "@/lib/sanitize";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://ululalbab.vercel.app/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const sanitizedContent = await sanitizeHtml(post.content);

  return (
    <PageWrapper><article className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 inline-flex items-center gap-1"
      >
        &larr; Back to Blog
      </Link>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
        {post.title}
      </h1>
      <div className="text-sm text-muted-foreground mb-6 sm:mb-8">
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {" | "}
        {post.author}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: new Date(post.date).toISOString(),
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: "Ulul Albab", url: "https://ululalbab.vercel.app" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://ululalbab.vercel.app/blog/${post.slug}` },
          }),
        }}
      />
      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-sm sm:prose-base"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article></PageWrapper>
  );
}
