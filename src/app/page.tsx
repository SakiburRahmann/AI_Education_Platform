import Link from "next/link";
import { LubbLogo } from "@/components/ui/lubb-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
              href="/issb"
              className="rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              ISSB Prep
            </Link>
            <Link
              href="/blog"
              className="rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Blog
            </Link>
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
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.07] crucible-gradient" />
          <div className="container mx-auto px-4 text-center relative">
            <ScrollReveal direction="up">
              <div className="mb-8 flex justify-center">
                <div className="transition-all duration-500 hover:scale-110 hover:rotate-3">
                  <LubbLogo className="h-16 w-16 md:h-20 md:w-20" />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground">
                Ulul Albab
                <br />
                <span className="text-gradient-primary">Learn with Understanding</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Ulul Albab is an AI-powered learning platform. Upload your books, lecture slides,
                and notes. Chat with <strong>Lubb AI</strong>, generate interactive lessons and
                quizzes, earn XP, and climb the leaderboard.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/auth">
                  <span className="btn-primary inline-block px-8 py-3 text-lg transition-all duration-300 hover:scale-105">
                    Start Learning Free
                  </span>
                </Link>
                <Link href="/auth" className="btn-outline inline-block px-8 py-3 text-lg transition-all duration-300 hover:scale-105">
                  Watch Demo
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up">
              <h2 className="font-heading text-3xl font-bold mb-12 text-center">
                Everything You Need to Learn
              </h2>
            </ScrollReveal>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Upload Anything",
                  desc: "PDFs, slides, documents — Lubb AI extracts and understands your materials instantly.",
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  ),
                },
                {
                  title: "AI-Powered Learning",
                  desc: "Chat with Lubb AI about your materials. Generate interactive lessons and quizzes on demand.",
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  title: "Gamified & Social",
                  desc: "Earn XP, climb leagues, unlock achievements, and share knowledge with the community.",
                  icon: (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <ScrollReveal key={item.title} direction="up" delay={i * 250}>
                  <div className="card-hover p-8 group transition-all duration-500 hover:-translate-y-2">
                    <div className="mb-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {item.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-heading font-bold transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="up">
              <h2 className="font-heading text-3xl font-bold mb-12">How It Works</h2>
            </ScrollReveal>
            <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4 text-center">
              {[
                { step: "1", title: "Upload", desc: "Drop your study materials for Lubb AI" },
                { step: "2", title: "Learn", desc: "Chat with Lubb AI about your content" },
                { step: "3", title: "Practice", desc: "Take AI-generated quizzes from Lubb" },
                { step: "4", title: "Compete", desc: "Earn XP & climb leagues" },
              ].map((item, i) => (
                <ScrollReveal key={item.step} direction="up" delay={i * 250}>
                  <div className="card-hover p-5 sm:p-6 group transition-all duration-500 hover:-translate-y-2">
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-lg sm:text-xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                      {item.step}
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-lg mb-1 transition-colors duration-300 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CRUCIBLE BOARD PROMO ═══ */}
        <section className="py-20 bg-gradient-to-r from-[#0A0F1A] to-[#131B2E]">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-4 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A84B] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
                  </span>
                  <span className="text-xs font-medium tracking-wider text-[#D4A84B] uppercase">
                    NEW — Crucible Board
                  </span>
                </div>
                <h2
                  className="text-3xl font-bold text-[#F0F4F8] sm:text-4xl"
                  style={{ fontFamily: "'var(--font-playfair)', serif" }}
                >
                  Preparing for the{" "}
                  <span className="text-[#D4A84B]">ISSB</span>?
                </h2>
                <p className="mt-4 text-lg text-[#8899B4]">
                  Crucible Board is our dedicated ISSB practice platform for Bangladesh Defense officer candidates.
                  Master TAT, WAT, SRT, and interview preparation with AI-powered simulations.
                </p>
                <div className="mt-8">
                  <Link
                    href="/issb"
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
                    style={{ backgroundColor: "#D4A84B" }}
                  >
                    Explore Crucible Board
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-2xl">
              <ScrollReveal direction="up">
                <div className="mb-6 flex justify-center">
                  <div className="transition-all duration-500 hover:scale-110 hover:-rotate-6">
                    <LubbLogo className="h-14 w-14" />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={150}>
                <h2 className="font-heading text-3xl font-bold mb-4">
                  Ready to learn with Ulul Albab?
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={300}>
                <p className="text-muted-foreground mb-8 text-lg">
                  Join thousands of learners using Lubb AI to accelerate their education.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={450}>
                <Link href="/auth">
                  <span className="btn-primary inline-block px-10 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                    Get Started Free
                  </span>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <footer className="border-t py-8 bg-muted">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ulul Albab. Built with Next.js & Supabase.
          </div>
        </footer>
      </main>
    </div>
  );
}
