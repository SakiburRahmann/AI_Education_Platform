import type { NextConfig } from "next";

const SITE_URL = "https://ululalbab.vercel.app";
const SUPABASE_PROJECT = "hymttvgdutdmodvomehq";

const csp = [
  "default-src 'self'",
  // script-src: removed 'unsafe-eval'. 'unsafe-inline' kept for Next.js hydration scripts.
  "script-src 'self' 'unsafe-inline' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.supabase.co",
  "font-src 'self' data:",
  // Tightened connect-src from *.supabase.co to specific project
  `connect-src 'self' https://${SUPABASE_PROJECT}.supabase.co wss://${SUPABASE_PROJECT}.supabase.co https://accounts.google.com https://www.googleapis.com`,
  "frame-src 'self' https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Explicit CORS: override any wildcard from Vercel platform
  { key: "Access-Control-Allow-Origin", value: SITE_URL },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  { key: "Access-Control-Allow-Credentials", value: "true" },
];

const nextConfig: NextConfig = {
  // Suppress Next.js build ID disclosure in production
  generateBuildId: async () => {
    if (process.env.VERCEL_ENV === "production") {
      return "production";
    }
    return null; // Use default build ID for non-production
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
