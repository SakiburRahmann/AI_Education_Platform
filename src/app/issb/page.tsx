"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const GOLD = "#D4A84B";

const features = [
  {
    title: "TAT Simulator",
    subtitle: "Thematic Apperception Test",
    desc: "View realistic scenarios with timed exposure. Write compelling stories and receive AI-powered analysis on plot structure, originality, and officer-like qualities — just like the real ISSB board.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" />
      </svg>
    ),
  },
  {
    title: "WAT Practice",
    subtitle: "Word Association Test",
    desc: "Rapid-fire word association drills with timed responses. Build speed and accuracy under pressure — just like the real ISSB board. Train your mind to respond with precision.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "SRT Training",
    subtitle: "Situation Reaction Test",
    desc: "Navigate real-world military scenarios and evaluate your decision-making. AI-driven feedback based on actual ISSB rubrics helps you develop the mindset of a commissioned officer.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "AI Interview",
    subtitle: "Mock Board Interview",
    desc: "Practice with an AI that roleplays as an ISSB selection board. Get grilled on your motivation, leadership philosophy, and situational judgment — then receive detailed, rubric-based feedback.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Sign Up Free", desc: "Create your account in seconds. No credit card needed. Start practicing immediately." },
  { num: "02", title: "Choose Your Module", desc: "Select from TAT, WAT, SRT, or Interview. Each module mirrors the real ISSB experience with timed, pressure-based scenarios." },
  { num: "03", title: "Practice Under Pressure", desc: "Timed sessions with realistic scenarios. Build the mental endurance and rapid decision-making required for the actual board." },
  { num: "04", title: "Track Progress", desc: "AI-powered analytics identify your strengths and weaknesses. Watch your scores improve over time with targeted practice." },
];

const benefits = [
  {
    title: "AI-Powered Analysis",
    desc: "Lubb AI evaluates your responses against actual ISSB marking rubrics. Get instant, detailed feedback on your TAT stories, WAT associations, and SRT reactions.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Realistic Simulation",
    desc: "Every detail is designed to match the actual ISSB board — from 30-second TAT image exposure to rapid-fire WAT word associations. We replicate the pressure so you can conquer it.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Track & Improve",
    desc: "Comprehensive analytics track your performance across every module. Identify weak areas, monitor improvement trends, and enter the board room with data-driven confidence.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function CrucibleBoardLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSheet = () => setSheetOpen(false);

  const navLinks = [
    { href: "#modules", label: "Modules" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#about", label: "About ISSB" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1A] text-[#F0F4F8]">
      {/* ═══ HEADER ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-[#1E2A45]/60 bg-[#0A0F1A]/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-8">
          <Link href="/issb" className="flex items-center gap-2 sm:gap-3 group min-h-[44px]">
            <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4A84B]/20" />
              <div className="absolute inset-0 rounded-full bg-[#D4A84B]/10 animate-pulse" style={{ animationDuration: "3s" }} />
              <svg className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D4A84B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span
              className="text-base sm:text-lg font-bold tracking-wider text-[#F0F4F8]"
              style={{ fontFamily: "'var(--font-playfair)', serif" }}
            >
              CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B] crucible-link min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger className="text-[#8899B4] hover:text-[#F0F4F8] hover:bg-[#1E2A45]/50 rounded-lg p-2 transition-colors">
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 border-[#1E2A45] bg-[#0A0F1A] p-0"
                  showCloseButton={false}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b border-[#1E2A45]/60 px-5 py-4">
                      <span
                        className="text-sm font-bold tracking-wider text-[#F0F4F8]"
                        style={{ fontFamily: "'var(--font-playfair)', serif" }}
                      >
                        CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
                      </span>
                      <button
                        onClick={closeSheet}
                        className="rounded-lg p-2 text-[#8899B4] hover:text-[#F0F4F8] hover:bg-[#1E2A45]/50 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4">
                      {navLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeSheet}
                          className="block rounded-lg px-4 py-3 text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B] hover:bg-[#1E2A45]/30 min-h-[44px] flex items-center"
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>
                    <div className="border-t border-[#1E2A45]/60 px-5 py-4 space-y-3">
                      <Link
                        href="/auth"
                        onClick={closeSheet}
                        className="block w-full rounded-lg border border-[#1E2A45] px-4 py-3 text-sm text-center text-[#8899B4] transition-colors hover:border-[#D4A84B]/30 hover:text-[#F0F4F8] min-h-[44px] flex items-center justify-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/issb/auth"
                        onClick={closeSheet}
                        className="block w-full rounded-lg px-4 py-3 text-sm font-semibold text-center text-[#0A0F1A] transition-all hover:brightness-110 min-h-[44px] flex items-center justify-center"
                        style={{ backgroundColor: GOLD }}
                      >
                        Start Free
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Link
              href="/auth"
              className="hidden sm:inline-block rounded-lg border border-[#1E2A45] px-4 py-2 text-sm text-[#8899B4] transition-all hover:border-[#D4A84B]/30 hover:text-[#F0F4F8] min-h-[44px] flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/issb/auth"
              className="hidden sm:inline-flex crucible-btn-gold relative rounded-lg px-5 py-2 text-sm font-semibold text-[#0A0F1A] transition-all hover:brightness-110 min-h-[44px] items-center"
              style={{ backgroundColor: GOLD }}
            >
              Start Free
            </Link>
          </div>
        </div>

        <div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#D4A84B]/50 to-transparent transition-all duration-700"
          style={{ opacity: scrolled ? 1 : 0 }}
        />
      </header>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-16">
        <div className="absolute inset-0 crucible-gradient bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.15)_0%,transparent_50%)]" />

        {/* Floating elements — hidden on mobile */}
        <div className="hidden md:block absolute right-[15%] top-[20%] crucible-float">
          <div className="h-24 w-24 rounded-full border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>
        <div className="hidden md:block absolute left-[10%] top-[30%] crucible-float-delayed">
          <div className="h-16 w-16 rotate-45 border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>
        <div className="hidden md:block absolute right-[10%] bottom-[25%] crucible-float" style={{ animationDelay: "3s" }}>
          <div className="h-12 w-12 rounded-full border border-[#D4A84B]/10" />
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,168,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,75,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0}>
              <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A84B] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
                </span>
                <span className="text-[10px] sm:text-xs font-medium tracking-wider text-[#D4A84B] uppercase">
                  Powered by Ulul Albab & Lubb AI
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                CRUCIBLE<br className="sm:hidden" />
                <span className="text-[#D4A84B]">BOARD</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <p
                className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium tracking-[0.15em] sm:tracking-[0.2em] text-[#8899B4] uppercase"
              >
                Forge Your Commission
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-[#8899B4] px-2 sm:px-0">
                The premier AI-powered ISSB practice platform for Bangladesh Defense officer candidates.
                Master every stage of the selection board — from psychological tests to the final interview.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={800}>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/issb/auth"
                  className="crucible-btn-gold inline-flex items-center justify-center gap-2 rounded-lg w-full sm:w-auto px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110 min-h-[48px]"
                  style={{ backgroundColor: GOLD }}
                >
                  Begin Free Practice
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="#modules"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E2A45] w-full sm:w-auto px-6 sm:px-8 py-3.5 text-sm sm:text-base font-medium text-[#F0F4F8] transition-all hover:border-[#D4A84B]/30 hover:bg-[#D4A84B]/5 min-h-[48px]"
                >
                  Explore Modules
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section id="stats" className="relative border-y border-[#1E2A45]/60 bg-[#131B2E]">
        <div className="absolute inset-0 crucible-shimmer opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {[
              { to: 1200, suffix: "+", label: "Practice Tests" },
              { to: 98, suffix: "%", label: "Satisfaction" },
              { to: 4.9, decimals: 1, suffix: "★", label: "Rating" },
              { to: 247, suffix: "", label: "AI Feedback" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} direction="up" delay={i * 200}>
                <div className="text-center group py-2">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#D4A84B] transition-all duration-300 group-hover:scale-110">
                    <AnimatedCounter to={stat.to} suffix={stat.suffix} decimals={stat.decimals} duration={2500 + i * 300} />
                  </p>
                  <p className="mt-1 text-[10px] sm:text-xs text-[#8899B4] transition-colors duration-300 group-hover:text-[#F0F4F8]/70">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ISSB ═══ */}
      <section id="about" className="relative py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -inset-3 sm:-inset-4 rounded-2xl bg-[#D4A84B]/5 blur-3xl" />
                <div className="relative overflow-hidden rounded-xl border border-[#1E2A45] group">
                  <img
                    src="/issb/formation.jpg"
                    alt="Military personnel in formation"
                    className="w-full object-cover transition-all duration-700 group-hover:scale-105"
                    style={{ minHeight: "220px", maxHeight: "400px" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#D4A84B] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#F0F4F8]/60">ISSB Preparation</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                  <span className="text-[10px] sm:text-xs font-medium text-[#D4A84B]">UNDERSTAND THE CHALLENGE</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
                  style={{ fontFamily: "'var(--font-playfair)', serif" }}
                >
                  What Is the <span className="text-[#D4A84B]">ISSB</span>?
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-[#8899B4]">
                  The Inter Services Selection Board (ISSB) is the gateway to becoming an officer in the
                  Bangladesh Army, Navy, and Air Force — a grueling multi-day assessment of leadership,
                  mental agility, and character under pressure.
                </p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-[#8899B4]">
                  The selection rate is fierce. Those who succeed share one thing in common:{" "}
                  <span className="font-semibold text-[#F0F4F8]">preparation that matches the rigor of the board itself.</span>
                </p>
                <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { label: "Psych Tests", value: "TAT · WAT · SRT" },
                    { label: "Group Tasks", value: "GTO · GD" },
                    { label: "Interview", value: "Board Panel" },
                    { label: "Duration", value: "4 Days" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="group rounded-lg border border-[#1E2A45] bg-[#131B2E]/50 px-3 py-2.5 sm:px-4 sm:py-3 transition-all duration-300 hover:border-[#D4A84B]/20 hover:bg-[#131B2E]"
                    >
                      <p className="text-[10px] font-medium tracking-wider text-[#8899B4] uppercase">{item.label}</p>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#D4A84B] transition-all duration-300 group-hover:text-[#F0D78C]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ PRACTICE MODULES ═══ */}
      <section id="modules" className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-[#131B2E]/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-[10px] sm:text-xs font-medium text-[#D4A84B]">PRACTICE MODULES</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                Every Test. <span className="text-[#D4A84B]">One Platform.</span>
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#8899B4] px-4">
                AI-driven modules that replicate the actual ISSB experience.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 sm:mt-16 grid gap-4 sm:gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} direction="up" delay={i * 250}>
                <div className="group relative overflow-hidden rounded-xl border border-[#1E2A45] bg-[#131B2E]/80 p-4 sm:p-6 transition-all duration-500 hover:border-[#D4A84B]/30 hover:shadow-xl hover:shadow-[#D4A84B]/5 crucible-card">
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-[#D4A84B]/0 transition-all duration-500 group-hover:bg-[#D4A84B]/60" />
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg border border-[#1E2A45] bg-[#0A0F1A] text-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5">
                      {feature.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-wider text-[#D4A84B]/70 uppercase">{feature.subtitle}</p>
                      <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#F0F4F8]">{feature.title}</h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-[#8899B4]">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-[10px] sm:text-xs font-medium text-[#D4A84B]">YOUR PATH TO COMMISSION</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                How It Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-10 sm:mt-16 grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} direction="up" delay={i * 250}>
                <div className="group relative text-center">
                  {i < steps.length - 1 && (
                    <div className="absolute left-[60%] top-8 hidden h-px overflow-hidden md:block">
                      <div className="h-full w-full bg-gradient-to-r from-[#D4A84B]/30 to-transparent" />
                    </div>
                  )}
                  <div className="relative mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#D4A84B]/30 bg-[#131B2E] transition-all duration-500 group-hover:border-[#D4A84B] group-hover:shadow-lg group-hover:shadow-[#D4A84B]/20" />
                    <span
                      className="relative text-base sm:text-lg font-bold text-[#D4A84B] transition-all duration-500 group-hover:scale-110"
                      style={{ fontFamily: "'var(--font-playfair)', serif" }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-bold text-[#F0F4F8] transition-colors duration-300 group-hover:text-[#D4A84B]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm leading-relaxed text-[#8899B4]">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CRUCIBLE BOARD ═══ */}
      <section id="benefits" className="relative border-y border-[#1E2A45]/60 bg-[#131B2E] py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16">
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-[10px] sm:text-xs font-medium text-[#D4A84B]">WHY CHOOSE US</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                Built for the <span className="text-[#D4A84B]">Elite</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {benefits.map((item, i) => (
              <ScrollReveal key={item.title} direction="up" delay={i * 250}>
                <div className="group rounded-xl border border-[#1E2A45] bg-[#0A0F1A]/50 p-5 sm:p-6 transition-all duration-500 hover:border-[#D4A84B]/20 hover:shadow-xl hover:shadow-[#D4A84B]/5 crucible-card">
                  <div className="mb-3 sm:mb-4 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-[#1E2A45] text-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F0F4F8] transition-colors duration-300 group-hover:text-[#D4A84B]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-[#8899B4]">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMAGE BANNER ═══ */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src="/issb/soldiers.jpg"
            alt="Military personnel"
            className="h-full w-full object-cover transition-all duration-[10000ms] hover:scale-110"
            style={{ objectPosition: "center 30%" }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1A] via-[#0A0F1A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-[#0A0F1A]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-4xl px-6 sm:px-8">
              <ScrollReveal direction="up">
                <div className="relative">
                  <blockquote
                    className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold italic leading-tight text-[#F0F4F8]"
                    style={{ fontFamily: "'var(--font-playfair)', serif" }}
                  >
                    The crucible is not about breaking you down.
                    <br className="hidden sm:block" />
                    {" "}It's about forging what was always there.
                  </blockquote>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#8899B4] tracking-wider">
                    — Preparation is the key to commission
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="cta" className="relative py-16 sm:py-24">
        <div className="absolute inset-0 crucible-gradient bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.08)_0%,transparent_60%)]" />
        
        {/* Floating elements hidden on mobile */}
        <div className="hidden md:block absolute left-[10%] top-[20%] crucible-float">
          <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full border border-[#D4A84B]/10" />
        </div>
        <div className="hidden md:block absolute right-[15%] bottom-[20%] crucible-float-delayed">
          <div className="h-10 sm:h-12 w-10 sm:w-12 rotate-45 border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ fontFamily: "'var(--font-playfair)', serif" }}
            >
              Ready to Forge <span className="text-[#D4A84B]">Your Commission</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-[#8899B4]">
              Join hundreds of Bangladesh Defense aspirants preparing with Crucible Board.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/issb/auth"
                className="crucible-btn-gold inline-flex items-center justify-center gap-2 rounded-lg w-full sm:w-auto px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110 min-h-[48px]"
                style={{ backgroundColor: GOLD }}
              >
                Start Free Practice
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/issb/auth"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E2A45] w-full sm:w-auto px-6 sm:px-8 py-3.5 text-sm sm:text-base font-medium text-[#F0F4F8] transition-all hover:border-[#D4A84B]/30 hover:bg-[#D4A84B]/5 min-h-[48px]"
              >
                Learn More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#1E2A45]/60 bg-[#0A0F1A]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/issb" className="flex items-center gap-2 group min-h-[44px]">
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#D4A84B]/30" />
                  <div className="absolute inset-0 rounded-full bg-[#D4A84B]/10 transition-all duration-300 group-hover:bg-[#D4A84B]/20" />
                  <svg className="relative h-3.5 w-3.5 text-[#D4A84B]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span
                  className="text-sm font-bold tracking-wider text-[#F0F4F8]"
                  style={{ fontFamily: "'var(--font-playfair)', serif" }}
                >
                  CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
                </span>
              </Link>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#8899B4]">
                Powered by{" "}
                <Link href="/" className="font-medium text-[#F0F4F8] crucible-link">
                  Ulul Albab
                </Link>{" "}
                and <span className="font-medium text-[#F0F4F8]">Lubb AI</span>.
                AI-powered ISSB preparation for Bangladesh Defense officer candidates.
              </p>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 text-xs font-bold tracking-wider text-[#8899B4] uppercase">Quick Links</p>
              <div className="space-y-2 sm:space-y-2.5">
                {[
                  { href: "#modules", label: "Practice Modules" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-xs sm:text-sm text-[#8899B4] crucible-link transition-colors hover:text-[#D4A84B] min-h-[36px] flex items-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 sm:mb-4 text-xs font-bold tracking-wider text-[#8899B4] uppercase">About</p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#8899B4]">
                Ulul Albab's specialized module for Bangladesh Defense officer candidates preparing for the ISSB selection process.
              </p>
              <Link
                href="/"
                className="mt-2 sm:mt-3 inline-flex items-center gap-1 text-xs sm:text-sm text-[#D4A84B] crucible-link transition-colors hover:text-[#F0F4F8] min-h-[36px]"
              >
                Visit Ulul Albab
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 border-t border-[#1E2A45]/40 pt-6 sm:pt-6 text-center">
            <p className="text-[10px] sm:text-xs text-[#8899B4]">
              &copy; {new Date().getFullYear()} Ulul Albab. All rights reserved.
            </p>
            <p className="mt-1 text-[9px] sm:text-[10px] text-[#556677] px-4">
              Independent preparation tool — not affiliated with or endorsed by the Bangladesh Armed Forces, ISSB, or any government agency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
