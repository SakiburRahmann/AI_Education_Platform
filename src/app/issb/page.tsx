import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crucible Board — ISSB Practice Platform | Powered by Ulul Albab",
  description:
    "Forge your commission with Crucible Board. AI-powered ISSB practice platform for Bangladesh Defense officer candidates. Master TAT, WAT, SRT, and interview preparation.",
  openGraph: {
    title: "Crucible Board — Forge Your Commission",
    description:
      "AI-powered ISSB practice platform. Practice TAT, WAT, SRT, and mock interviews. Prepare for the Bangladesh Inter Services Selection Board with realistic simulations.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crucible Board — Forge Your Commission",
    description:
      "AI-powered ISSB practice platform. Master TAT, WAT, SRT, and interview preparation.",
  },
  keywords: [
    "ISSB Bangladesh",
    "ISSB practice",
    "Bangladesh Army preparation",
    "TAT test",
    "WAT test",
    "SRT practice",
    "military officer preparation",
    "Bangladesh defense",
    "officer candidate",
    "Crucible Board",
  ],
};

const GOLD = "#D4A84B";
const NAVY = "#0A0F1A";
const SURFACE = "#131B2E";

const features = [
  {
    title: "TAT Simulator",
    subtitle: "Thematic Apperception Test",
    desc: "View realistic scenarios with timed exposure. Write compelling stories and receive AI-powered analysis on plot structure, originality, and officer-like qualities.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" />
      </svg>
    ),
  },
  {
    title: "WAT Practice",
    subtitle: "Word Association Test",
    desc: "Rapid-fire word association drills with timed responses. Build speed and accuracy under pressure — just like the real ISSB board.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "SRT Training",
    subtitle: "Situation Reaction Test",
    desc: "Navigate real-world military scenarios and evaluate your decision-making. AI-driven feedback helps you develop the mindset of a commissioned officer.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "AI Interview",
    subtitle: "Mock Board Interview",
    desc: "Practice with an AI that roleplays as an ISSB selection board. Get grilled on your motivation, leadership philosophy, and situational judgment — then receive detailed feedback.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds. No commitments, no hidden fees." },
  { num: "02", title: "Choose Your Module", desc: "Select from TAT, WAT, SRT, or Interview practice. Each module is designed to mirror the real ISSB experience." },
  { num: "03", title: "Practice Under Pressure", desc: "Timed sessions with realistic scenarios. Build the mental endurance required for the actual board." },
  { num: "04", title: "Track Your Progress", desc: "AI-powered analytics identify your strengths and areas for improvement. Watch your scores rise." },
];

export default function CrucibleBoardLanding() {
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-[#F0F4F8] font-['var(--font-inter)']">
      {/* ════════════════════════════════════ */}
      {/* HEADER */}
      {/* ════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E2A45]/60 bg-[#0A0F1A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Crest Badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D4A84B] bg-[#D4A84B]/10">
              <svg className="h-5 w-5 text-[#D4A84B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>              <span
              className="text-lg font-bold tracking-wider text-[#F0F4F8]"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#modules" className="text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
              Modules
            </a>
            <a href="#how-it-works" className="text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
              How It Works
            </a>
            <a href="#about" className="text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
              About ISSB
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-lg border border-[#1E2A45] px-4 py-2 text-sm text-[#8899B4] transition-all hover:border-[#D4A84B]/30 hover:text-[#F0F4F8] sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/issb/auth"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
              style={{ backgroundColor: GOLD }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════ */}
      {/* HERO */}
      {/* ════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.12)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />

        {/* Geometric accent lines */}
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-[#D4A84B]/20 via-transparent to-transparent" />
        <div className="absolute bottom-1/4 left-0 h-px w-1/3 bg-gradient-to-r from-[#D4A84B]/10 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
              <span className="text-xs font-medium tracking-wider text-[#D4A84B] uppercase">
                Powered by Ulul Albab & Lubb AI
              </span>
            </div>

            <h1
              className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              CRUCIBLE
              <br />
              <span className="text-[#D4A84B]">BOARD</span>
            </h1>
            <p
              className="mt-4 text-lg font-medium tracking-[0.2em] text-[#8899B4] uppercase sm:text-xl"
              style={{ fontFamily: "'var(--font-inter)', sans-serif" }}
            >
              Forge Your Commission
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#8899B4] sm:text-lg">
              The premier AI-powered ISSB practice platform for Bangladesh Defense officer candidates.
              Master every stage of the selection board — from psychological tests to the final interview —
              with realistic simulations and intelligent feedback.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/issb/auth"
                className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
                style={{ backgroundColor: GOLD }}
              >
                Begin Free Practice
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-lg border border-[#1E2A45] px-8 py-3.5 text-base font-medium text-[#F0F4F8] transition-all hover:border-[#D4A84B]/30 hover:bg-[#D4A84B]/5"
              >
                Explore Modules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ════════════════════════════════════ */}
      <section className="relative border-y border-[#1E2A45]/60 bg-[#131B2E]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "1,200+", label: "Practice Tests" },
              { value: "98%", label: "User Satisfaction" },
              { value: "4.9★", label: "App Rating" },
              { value: "24/7", label: "AI Feedback" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-[#D4A84B] sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-[#8899B4]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* ABOUT ISSB */}
      {/* ════════════════════════════════════ */}
      <section id="about" className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(212,168,75,0.04)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-[#D4A84B]/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-xl border border-[#1E2A45]">
                <img
                  src="https://images.unsplash.com/photo-1549449346-17b5f583e78f?w=800&q=80"
                  alt="Military personnel in formation"
                  className="h-full w-full object-cover"
                  style={{ minHeight: "320px" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-xs font-medium text-[#D4A84B]">UNDERSTAND THE CHALLENGE</span>
              </div>
              <h2
                className="text-3xl font-bold leading-tight sm:text-4xl"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                What Is the{" "}
                <span className="text-[#D4A84B]">ISSB</span>?
              </h2>
              <p className="mt-4 leading-relaxed text-[#8899B4]">
                The Inter Services Selection Board (ISSB) is the gateway to becoming an officer in the
                Bangladesh Army, Navy, and Air Force. It is a grueling multi-day assessment designed to
                measure not just knowledge, but character — your leadership potential, moral courage,
                mental agility, and ability to perform under pressure.
              </p>
              <p className="mt-4 leading-relaxed text-[#8899B4]">
                The selection rate is fierce. Thousands of aspirants compete for every commission.
                Those who succeed share one thing in common:{" "}
                <span className="font-semibold text-[#F0F4F8]">preparation that matches the rigor of the board itself.</span>
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Psychological Tests", value: "TAT · WAT · SRT" },
                  { label: "Group Tasks", value: "GTO · GD · Command" },
                  { label: "Personal Interview", value: "Board Panel" },
                  { label: "Duration", value: "4 Days" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-[#1E2A45] bg-[#131B2E]/50 px-4 py-3">
                    <p className="text-[10px] font-medium tracking-wider text-[#8899B4] uppercase">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#D4A84B]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* PRACTICE MODULES */}
      {/* ════════════════════════════════════ */}
      <section id="modules" className="relative py-24">
        <div className="absolute inset-0 bg-[#131B2E]/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
              <span className="text-xs font-medium text-[#D4A84B]">PRACTICE MODULES</span>
            </div>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Every Test. One Platform.
            </h2>
            <p className="mt-3 text-[#8899B4]">
              Our AI-driven modules replicate the actual ISSB experience, giving you the
              confidence to walk into the board room prepared for anything.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border border-[#1E2A45] bg-[#131B2E]/80 p-6 transition-all duration-300 hover:border-[#D4A84B]/30 hover:shadow-lg hover:shadow-[#D4A84B]/5"
              >
                {/* Gold left border accent */}
                <div className="absolute left-0 top-0 h-full w-0.5 bg-[#D4A84B]/0 transition-all duration-300 group-hover:bg-[#D4A84B]/60" />

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#1E2A45] bg-[#0A0F1A] text-[#D4A84B] transition-colors group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium tracking-wider text-[#D4A84B]/70 uppercase">
                      {feature.subtitle}
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold text-[#F0F4F8]">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#8899B4]">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* HOW IT WORKS */}
      {/* ════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(212,168,75,0.04)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
              <span className="text-xs font-medium text-[#D4A84B]">YOUR PATH TO COMMISSION</span>
            </div>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              How It Works
            </h2>
            <p className="mt-3 text-[#8899B4]">
              Four simple steps from sign-up to board-ready.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                {/* Connector line (desktop) */}
                <div className="absolute left-[60%] top-8 hidden h-px w-[80%] bg-gradient-to-r from-[#D4A84B]/30 to-transparent md:block" />

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#D4A84B]/30 bg-[#131B2E]">
                  <span className="text-lg font-bold text-[#D4A84B]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#F0F4F8]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8899B4]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* WHY CRUCIBLE BOARD */}
      {/* ════════════════════════════════════ */}
      <section className="relative border-y border-[#1E2A45]/60 bg-[#131B2E] py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
              <span className="text-xs font-medium text-[#D4A84B]">WHY CHOOSE US</span>
            </div>
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Built for the{" "}
              <span className="text-[#D4A84B]">Elite</span>
            </h2>
            <p className="mt-3 text-[#8899B4]">
              Every feature of Crucible Board is designed to push you beyond your limits —
              because that's exactly what the ISSB will do.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "AI-Powered Analysis",
                desc: "Our Lubb AI engine evaluates your responses against ISSB rubrics. Get detailed feedback on your TAT stories, WAT associations, SRT reactions, and interview answers — instantly.",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: "Realistic Simulation",
                desc: "Timed scenarios that mirror the actual ISSB board experience. From 30-second TAT image exposure to rapid-fire WAT word associations — we replicate the pressure.",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Track & Improve",
                desc: "Comprehensive analytics track your progress across every module. Identify weak areas, monitor improvement over time, and enter the board room with data-driven confidence.",
                icon: (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-[#1E2A45] bg-[#0A0F1A]/50 p-6 transition-all duration-300 hover:border-[#D4A84B]/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2A45] text-[#D4A84B] transition-colors group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F0F4F8]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8899B4]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* IMAGE BANNER */}
      {/* ════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="relative h-80 overflow-hidden md:h-96">
          <img
            src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=1500&q=80"
            alt="Military parade formation"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1A] via-[#0A0F1A]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-[#0A0F1A]/30" />
          <div className="absolute bottom-8 left-8 right-8 max-w-2xl md:left-16">
            <p
              className="text-2xl font-bold italic leading-tight text-[#F0F4F8] sm:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              "The crucible is not about breaking you down. It's about forging what was always there."
            </p>
            <p className="mt-3 text-sm text-[#8899B4]">— Preparation is the key to commission</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* FINAL CTA */}
      {/* ════════════════════════════════════ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.08)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Ready to Forge{" "}
            <span className="text-[#D4A84B]">Your Commission</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#8899B4]">
            Join hundreds of Bangladesh Defense aspirants who are preparing with Crucible Board.
            Your journey to the ISSB board room starts here.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/issb/auth"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
              style={{ backgroundColor: GOLD }}
            >
              Start Free Practice
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/issb/auth"
              className="inline-flex items-center gap-2 rounded-lg border border-[#1E2A45] px-8 py-3.5 text-base font-medium text-[#F0F4F8] transition-all hover:border-[#D4A84B]/30 hover:bg-[#D4A84B]/5"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ════════════════════════════════════ */}
      <footer className="border-t border-[#1E2A45]/60 bg-[#0A0F1A]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4A84B]/30 bg-[#D4A84B]/10">
                  <svg className="h-4 w-4 text-[#D4A84B]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span
                  className="text-sm font-bold tracking-wider text-[#F0F4F8]"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#8899B4]">
                Powered by{" "}
                <Link href="/" className="font-medium text-[#F0F4F8] hover:text-[#D4A84B] transition-colors">
                  Ulul Albab
                </Link>{" "}
                and{" "}
                <span className="font-medium text-[#F0F4F8]">Lubb AI</span>.
                <br />
                AI-powered ISSB preparation for Bangladesh Defense officer candidates.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="mb-3 text-xs font-bold tracking-wider text-[#8899B4] uppercase">Quick Links</p>
              <div className="space-y-2">
                <a href="#modules" className="block text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
                  Practice Modules
                </a>
                <a href="#how-it-works" className="block text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
                  How It Works
                </a>
                <Link href="/privacy" className="block text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B]">
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* About Ulul Albab */}
            <div>
              <p className="mb-3 text-xs font-bold tracking-wider text-[#8899B4] uppercase">About Ulul Albab</p>
              <p className="text-sm leading-relaxed text-[#8899B4]">
                Ulul Albab is a general-purpose AI-powered learning platform. Crucible Board is our
                specialized module for Bangladesh Defense officer candidates preparing for the ISSB
                selection process.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1 text-sm text-[#D4A84B] transition-colors hover:text-[#F0F4F8]"
              >
                Visit Ulul Albab
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-10 border-t border-[#1E2A45]/40 pt-6 text-center">
            <p className="text-xs text-[#8899B4]">
              &copy; {new Date().getFullYear()} Ulul Albab. All rights reserved. Crucible Board is a trademark of Ulul Albab.
            </p>
            <p className="mt-1 text-[10px] text-[#556677]">
              Disclaimer: This platform is an independent preparation tool and is not affiliated with or endorsed by
              the Bangladesh Armed Forces, ISSB, or any government agency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
