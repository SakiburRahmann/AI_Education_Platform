import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Ulul Albab — an AI-powered learning platform.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground prose-sm sm:prose-base">
        <p>
          Your privacy matters to us. This policy explains how Ulul Albab collects,
          uses, and protects your information.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">1. Information We Collect</h2>
        <p>
          We collect information you provide when creating an account (email, name)
          and content you upload (documents, notes). We also collect basic usage data
          to improve the platform.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">2. How We Use Information</h2>
        <p>
          Your information is used to provide, maintain, and improve Ulul Albab. We
          use AI models to process your uploaded content for learning features.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">3. Data Sharing</h2>
        <p>
          We do not sell your personal data. We may share data with service providers
          (e.g., Supabase, Vercel, AI providers) strictly for platform operation.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">4. Data Security</h2>
        <p>
          We implement industry-standard security measures. However, no method of
          transmission is 100% secure.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">5. Contact</h2>
        <p>
          For privacy concerns, contact us through our platform.
        </p>
        <p className="mt-8 text-sm">Last updated: June 2026</p>
      </div>
    </div>
  );
}
