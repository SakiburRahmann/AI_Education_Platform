import Link from "next/link";
import { LubbLogo } from "@/components/ui/lubb-logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const stats = [
  { value: "100%", label: "Free to learn" },
  { value: "Any", label: "Subject, any level" },
  { value: "AI", label: "Powered by Lubb" },
  { value: "XP", label: "Rewards & leagues" },
];

const features = [
  {
    title: "Learn Anything, Any Way",
    desc: "Upload your textbooks, lecture slides, and notes — or just ask Lubb about any topic from scratch. No materials needed. Lubb teaches you like a personal tutor.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Chat with Lubb AI",
    desc: "Your personal AI tutor that never gets tired. Ask anything, get clear explanations, dive deeper, and learn at your own pace. Lubb adapts to how you learn best.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Interactive Lessons & Quizzes",
    desc: "Lubb transforms any topic into interactive lessons with adaptive quizzes that test your understanding. Not just memorization — real comprehension that sticks.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Gamified Progress",
    desc: "Earn XP for every lesson, maintain your streak, unlock achievements, and climb the leaderboard. Learning becomes a rewarding journey you'll actually look forward to.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "Community & Collaboration",
    desc: "Join a community of learners. Share knowledge, ask questions, discuss topics, and learn together. Because the best learning happens when we learn from each other.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Always Free",
    desc: "No hidden fees, no paywalls, no credit card required. World-class AI-powered education should be accessible to everyone. That's the Ulul Albab promise.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const techStack = [
  { name: "Google AI", desc: "Powered by Gemini and Gemma models" },
  { name: "Next.js", desc: "Built on the latest React framework" },
  { name: "Supabase", desc: "Secure and scalable infrastructure" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm animate-fade-in-gentle">
        <div className="container mx-auto flex min-h-14 sm:min-h-16 items-center justify-between gap-1 px-4">
          <Link href="/" className="shrink-0">
            <LubbLogo showText />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeSwitcher />
            <Link
              href="/issb"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              ISSB Prep
            </Link>
            <Link
              href="/blog"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Blog
            </Link>
            <Link
              href="/auth"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
            <Link href="/auth" className="btn-primary inline-block px-3 sm:px-4 py-1.5 text-xs sm:text-sm whitespace-nowrap">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.07] animate-gradient-drift" />
          <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float-gentle hidden sm:block" />
          <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-float-gentle-delayed hidden sm:block" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative">
            <ScrollReveal direction="up" duration={1400}>
              <div className="mb-6 sm:mb-8 flex justify-center">
                <div className="animate-zoom-in-slow hover:rotate-3">
                  <LubbLogo className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300} duration={1400}>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl md:text-7xl text-foreground px-2 sm:px-0">
                <span className="text-gradient-primary">Ulul Albab</span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
                  Learn Anything with{" "}
                  <span className="text-gradient-warm">Lubb AI</span>
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={600} duration={1200}>
              <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-2 sm:px-0">
                <strong>Ulul Albab</strong> is an AI-powered learning platform for everyone.
                Upload your books and notes — or learn any subject from scratch.
                <strong> Lubb AI</strong> teaches you, quizzes you, and keeps you motivated
                with XP, streaks, and leagues. All <strong>100% free</strong>.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={900} duration={1000}>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 pb-4 sm:pb-0">
                <Link href="/auth" className="w-full sm:w-auto">
                  <span className="btn-primary inline-block w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-center">
                    Start Learning Free
                  </span>
                </Link>
                <Link href="/dashboard/chat" className="w-full sm:w-auto">
                  <span className="btn-outline inline-block w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg transition-all duration-500 hover:scale-105 hover:shadow-lg text-center">
                    Try the Chat
                  </span>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={1100} duration={1000}>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground">{s.value}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF / STATS ═══ */}
        <section className="py-12 sm:py-16 bg-muted/30 border-y">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { value: "Free Forever", label: "No paywalls. No trials. Just learning." },
                { value: "AI-Powered", label: "Powered by advanced AI models from Google" },
                { value: "Any Subject", label: "From algebra to zoology, Lubb teaches it all" },
                { value: "Your Pace", label: "Learn fast or take your time. You decide." },
              ].map((item, i) => (
                <ScrollReveal key={item.value} direction="up" delay={i * 150} duration={800}>
                  <div className="space-y-1">
                    <p className="font-heading text-lg sm:text-xl font-bold text-gradient-brand">
                      {item.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ MEET LUBB ═══ */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <ScrollReveal direction="up" duration={1200}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-primary tracking-wider uppercase">
                    Meet Your AI Tutor
                  </span>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200} duration={1200}>
                <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">
                  Hi, I'm{" "}
                  <span className="text-gradient-warm">Lubb</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={400} duration={1000}>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
                  I'm your personal AI learning companion. Think of me as the tutor who's always
                  available — patient, knowledgeable, and adaptive. I can teach you anything from
                  scratch, help you master your course materials, create practice quizzes, and make
                  sure you truly understand before moving on.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={600} duration={1000}>
                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
                  {[
                    { title: "Ask Me Anything", desc: "Stuck on a concept? Just ask. I'll explain it clearly, with examples you'll actually understand." },
                    { title: "I Adapt to You", desc: "If you're struggling, I slow down. If you're ready, I speed up. I track what you know and fill the gaps." },
                    { title: "I Make It Fun", desc: "Lessons, quizzes, XP, streaks — I turn learning into a journey you'll look forward to every day." },
                  ].map((item, i) => (
                    <div key={item.title} className="rounded-xl border bg-card p-5 sm:p-6 hover:shadow-md transition-shadow">
                      <h3 className="font-heading font-bold text-sm sm:text-base mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up" duration={1200}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4 text-center">
                Everything You Need to Master Any Subject
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-xl mx-auto">
                Whether you have your own materials or want to learn something new from the ground up, Ulul Albab has you covered.
              </p>
            </ScrollReveal>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {features.map((item, i) => (
                <ScrollReveal key={item.title} direction="up" delay={i * 200} duration={1000}>
                  <div className="card-hover p-6 sm:p-8 group transition-all duration-700 hover:-translate-y-3 hover:shadow-xl">
                    <div className="mb-4 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      {item.icon}
                    </div>
                    <h3 className="mb-2 text-lg sm:text-xl font-heading font-bold transition-colors duration-500 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal direction="up" duration={1200}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Start Learning in Minutes</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12 max-w-xl mx-auto">
                No setup. No credit card. Just you and Lubb, ready to learn.
              </p>
            </ScrollReveal>
            <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4 text-center">
              {[
                { step: "1", title: "Sign Up Free", desc: "Create your account in seconds" },
                { step: "2", title: "Choose or Upload", desc: "Pick a topic or upload your materials" },
                { step: "3", title: "Learn with Lubb", desc: "Chat, practice, and master concepts" },
                { step: "4", title: "Level Up", desc: "Earn XP, keep streaks, climb leagues" },
              ].map((item, i) => (
                <ScrollReveal key={item.step} direction="up" delay={i * 300} duration={1000}>
                  <div className="card-hover p-5 sm:p-6 group transition-all duration-700 hover:-translate-y-3 hover:shadow-xl">
                    <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-lg sm:text-xl font-bold transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                      {item.step}
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-lg mb-1 transition-colors duration-500 group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BUILT WITH ═══ */}
        <section className="py-16 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <ScrollReveal direction="up" duration={1200}>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4 text-center">
                Built with Modern Technology
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-xl mx-auto">
                Ulul Albab is powered by industry-leading AI models and infrastructure — all
                delivered free to every learner.
              </p>
            </ScrollReveal>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {techStack.map((t, i) => (
                <ScrollReveal key={t.name} direction="up" delay={i * 300} duration={1000}>
                  <div className="rounded-xl border bg-card p-6 sm:p-8 text-center hover:shadow-md transition-shadow">
                    <h3 className="font-heading font-bold text-lg sm:text-xl mb-2">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BETA / EARLY ACCESS ═══ */}
        <section className="py-12 sm:py-16 border-y">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal direction="up" duration={1000}>
              <div className="mx-auto max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-primary tracking-wider uppercase">
                    Early Access
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold mb-2">
                  Be Among the First
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ulul Albab is in active development. You can use the platform right now, and
                  every week brings new features, better AI responses, and an improved learning
                  experience. Your feedback shapes what comes next.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ CRUCIBLE BOARD PROMO ═══ */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0A0F1A] to-[#131B2E]">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal direction="up">
              <div className="mx-auto max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 sm:px-4 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A84B] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium tracking-wider text-[#D4A84B] uppercase">
                    NEW — Crucible Board
                  </span>
                </div>
                <h2
                  className="text-2xl sm:text-4xl font-bold text-[#F0F4F8] px-2 sm:px-0"
                  style={{ fontFamily: "'var(--font-playfair)', serif" }}
                >
                  Preparing for the{" "}
                  <span className="text-[#D4A84B]">ISSB</span>?
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-[#8899B4] px-2 sm:px-0">
                  Crucible Board is our dedicated ISSB practice platform for Bangladesh Defense officer candidates.
                  Master TAT, WAT, SRT, and interview preparation with AI-powered simulations.
                </p>
                <div className="mt-6 sm:mt-8">
                  <Link
                    href="/issb"
                    className="inline-flex items-center gap-2 rounded-lg px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
                    style={{ backgroundColor: "#D4A84B" }}
                  >
                    Explore Crucible Board
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent animate-gradient-drift" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative">
            <div className="mx-auto max-w-2xl">
              <ScrollReveal direction="up" duration={1200}>
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className="animate-zoom-in-slow hover:-rotate-6">
                    <LubbLogo className="h-12 w-12 sm:h-14 sm:w-14" />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={300} duration={1200}>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2 sm:px-0">
                  Your AI Tutor Is Waiting
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={600} duration={1000}>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-lg px-2 sm:px-0">
                  Start learning with Lubb AI — your personal AI tutor. Master new subjects, ace your exams, and fall in love with learning.
                  No credit card. No commitment. Just pure learning.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={900} duration={1000}>
                <Link href="/auth" className="inline-block w-full sm:w-auto">
                  <span className="btn-primary inline-block w-full sm:w-auto px-8 sm:px-10 py-3 text-base sm:text-lg transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 animate-glow-pulse text-center">
                    Get Started Free
                  </span>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <footer className="border-t py-10 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <LubbLogo className="h-6 w-6" />
                <span className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} Ulul Albab. Learn with Understanding.
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
