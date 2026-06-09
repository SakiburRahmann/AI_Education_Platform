import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Ulul Albab — an AI-powered learning platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          Welcome to Ulul Albab. By using our platform, you agree to these terms.
          Please read them carefully.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
        <p>
          By accessing or using Ulul Albab, you agree to be bound by these Terms of Service.
          If you do not agree, do not use the platform.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">2. Use of Service</h2>
        <p>
          You may use Ulul Albab for lawful, educational purposes only. You agree not to
          misuse the platform or help anyone else do so.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">3. User Content</h2>
        <p>
          You retain ownership of content you upload. By uploading, you grant Ulul Albab
          a license to process and display your content solely for providing the service.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">4. Limitation of Liability</h2>
        <p>
          Ulul Albab is provided &quot;as is&quot; without warranties of any kind. We are not
          liable for damages arising from your use of the platform.
        </p>
        <h2 className="text-foreground font-heading text-xl font-semibold mt-8">5. Changes</h2>
        <p>
          We may update these terms at any time. Continued use after changes constitutes
          acceptance of the new terms.
        </p>
        <p className="mt-8 text-sm">Last updated: June 2026</p>
      </div>
    </div>
  );
}
