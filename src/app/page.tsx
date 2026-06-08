import Link from "next/link";
import { LubbLogo } from "@/components/ui/lubb-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-2 px-4 py-2 sm:py-0">
            <Link href="/">
              <LubbLogo showText />
            </Link>
            <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-end">
              <ThemeSwitcher />
              <Link
                href="/auth"
                className="rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Sign In
              </Link>
              <Link href="/auth" className="btn-primary inline-block px-3 sm:px-5 py-2 text-xs sm:text-sm">
                Get Started Free
              </Link>
            </div>
          </div>
        </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.07]" />
          <div className="container mx-auto px-4 text-center relative">
            <div className="mb-8 flex justify-center">
              <LubbLogo className="h-16 w-16 md:h-20 md:w-20" />
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground">
              Learn Smarter
              <br />
              <span className="text-gradient-primary">with AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Upload your books, lecture slides, and notes. Chat with AI, generate
              interactive lessons and quizzes, and track your progress.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth">
                <span className="btn-primary inline-block px-8 py-3 text-lg">
                  Start Learning Free
                </span>
              </Link>
              <Link href="/auth" className="btn-outline inline-block px-8 py-3 text-lg">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Upload Anything",
                  desc: "PDFs, slides, documents — AI extracts and understands your materials instantly.",
                },
                {
                  title: "AI-Powered Learning",
                  desc: "Chat with your materials. Generate interactive lessons and quizzes on demand.",
                },
                {
                  title: "Gamified & Social",
                  desc: "Earn XP, climb leagues, unlock achievements, and share knowledge with the community.",
                },
              ].map((item) => (
                <div key={item.title} className="card-hover p-8">
                  <h3 className="mb-2 text-xl font-heading font-bold">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-4 text-center">
              {[
                { step: "1", title: "Upload", desc: "Drop your study materials" },
                { step: "2", title: "Learn", desc: "Chat with AI about content" },
                { step: "3", title: "Practice", desc: "Take AI-generated quizzes" },
                { step: "4", title: "Compete", desc: "Earn XP & climb leagues" },
              ].map((item) => (
                <div key={item.step} className="card-hover p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 flex justify-center">
                <LubbLogo className="h-14 w-14" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4">
                Ready to learn smarter?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of learners using AI to accelerate their education.
              </p>
              <Link href="/auth">
                <span className="btn-primary inline-block px-10 py-3 text-lg">
                  Get Started Free
                </span>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 bg-muted">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ulu Al Albab. Built with Next.js & Supabase.
          </div>
        </footer>
      </main>
    </div>
  );
}
