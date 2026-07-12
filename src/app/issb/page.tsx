"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal, StaggerGrid } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

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
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section
      const sections = ["hero", "stats", "about", "modules", "how-it-works", "benefits", "cta"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/issb" className="flex items-center gap-3 group">
            {/* Animated crest badge */}
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D4A84B]/20" />
              <div className="absolute inset-0 rounded-full bg-[#D4A84B]/10 animate-pulse" style={{ animationDuration: "3s" }} />
              <svg className="relative h-4 w-4 text-[#D4A84B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span
              className="text-lg font-bold tracking-wider text-[#F0F4F8]"
              style={{ fontFamily: "'var(--font-playfair)', serif" }}
            >
              CRUCIBLE<span className="text-[#D4A84B]"> BOARD</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "#modules", label: "Modules" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#about", label: "About ISSB" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-[#8899B4] transition-colors hover:text-[#D4A84B] crucible-link"
              >
                {item.label}
              </a>
            ))}
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
              className="crucible-btn-gold relative rounded-lg px-5 py-2 text-sm font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
              style={{ backgroundColor: GOLD }}
            >
              Start Free
            </Link>
          </div>
        </div>

        {/* Bottom border indicator on scroll */}
        <div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#D4A84B]/50 to-transparent transition-all duration-700"
          style={{ opacity: scrolled ? 1 : 0 }}
        />
      </header>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 crucible-gradient bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(212,168,75,0.05)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(212,168,75,0.05)_0%,transparent_40%)]" />

        {/* Floating geometric elements */}
        <div className="absolute right-[15%] top-[20%] crucible-float">
          <div className="h-24 w-24 rounded-full border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>
        <div className="absolute left-[10%] top-[30%] crucible-float-delayed">
          <div className="h-16 w-16 rotate-45 border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>
        <div className="absolute right-[10%] bottom-[25%] crucible-float" style={{ animationDelay: "3s" }}>
          <div className="h-12 w-12 rounded-full border border-[#D4A84B]/10" />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,168,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,75,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Animated badge */}
            <ScrollReveal direction="up" delay={0}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A84B] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4A84B]" />
                </span>
                <span className="text-xs font-medium tracking-wider text-[#D4A84B] uppercase">
                  Powered by Ulul Albab & Lubb AI
                </span>
              </div>
            </ScrollReveal>

            {/* Main title with staggered reveal */}
            <ScrollReveal direction="up" delay={200}>
              <h1
                className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                <span className="inline-block crucible-reveal">CRUCIBLE</span>
                <br />
                <span className="inline-block text-[#D4A84B] crucible-reveal crucible-reveal-delay-2">BOARD</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <p
                className="mt-4 text-lg font-medium tracking-[0.2em] text-[#8899B4] uppercase sm:text-xl"
                style={{ fontFamily: "'var(--font-inter)', sans-serif" }}
              >
                <span className="inline-block crucible-reveal crucible-reveal-delay-3">Forge Your Commission</span>
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#8899B4] sm:text-lg">
                The premier AI-powered ISSB practice platform for Bangladesh Defense officer candidates.
                Master every stage of the selection board — from psychological tests to the final interview —
                with realistic simulations and intelligent AI feedback.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={800}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/issb/auth"
                  className="crucible-btn-gold inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
                  style={{ backgroundColor: GOLD }}
                >
                  Begin Free Practice
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="#modules"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1E2A45] px-8 py-3.5 text-base font-medium text-[#F0F4F8] transition-all hover:border-[#D4A84B]/30 hover:bg-[#D4A84B]/5 hover:shadow-lg hover:shadow-[#D4A84B]/5"
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
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { to: 1200, suffix: "+", label: "Practice Tests Completed" },
              { to: 98, suffix: "%", label: "User Satisfaction Rate" },
              { to: 4.9, decimals: 1, suffix: "★", label: "Average App Rating" },
              { to: 247, suffix: "", label: "AI-Powered Feedback" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} direction="up" delay={i * 100}>
                <div className="text-center group">
                  <div className="relative inline-block">
                    <p className="text-3xl font-bold text-[#D4A84B] sm:text-4xl transition-all duration-300 group-hover:scale-110">
                      <AnimatedCounter to={stat.to} suffix={stat.suffix} duration={2000 + i * 200} />
                    </p>
                    <div className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4A84B]/0 transition-all duration-300 group-hover:bg-[#D4A84B]/30" />
                  </div>
                  <p className="mt-2 text-xs text-[#8899B4] transition-colors duration-300 group-hover:text-[#F0F4F8]/70">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ISSB ═══ */}
      <section id="about" className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(212,168,75,0.04)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image with parallax feel */}
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-[#D4A84B]/5 blur-3xl transition-all duration-500 hover:bg-[#D4A84B]/10" />
                <div className="relative overflow-hidden rounded-xl border border-[#1E2A45] group">
                  <img
                    src="/issb/formation.jpg"
                    alt="Military personnel in formation"
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                    style={{ minHeight: "360px" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#D4A84B] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#F0F4F8]/60">ISSB Preparation</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal direction="right">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                  <span className="text-xs font-medium text-[#D4A84B]">UNDERSTAND THE CHALLENGE</span>
                </div>
                <h2
                  className="text-3xl font-bold leading-tight sm:text-4xl"
                  style={{ fontFamily: "'var(--font-playfair)', serif" }}
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
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    { label: "Psychological Tests", value: "TAT · WAT · SRT" },
                    { label: "Group Tasks", value: "GTO · GD · Command" },
                    { label: "Personal Interview", value: "Board Panel" },
                    { label: "Assessment Duration", value: "4 Days" },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="group rounded-lg border border-[#1E2A45] bg-[#131B2E]/50 px-4 py-3 transition-all duration-300 hover:border-[#D4A84B]/20 hover:bg-[#131B2E]"
                    >
                      <p className="text-[10px] font-medium tracking-wider text-[#8899B4] uppercase">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[#D4A84B] transition-all duration-300 group-hover:text-[#F0D78C]">
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
      <section id="modules" className="relative py-24">
        <div className="absolute inset-0 bg-[#131B2E]/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-xs font-medium text-[#D4A84B]">PRACTICE MODULES</span>
              </div>
              <h2
                className="text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                Every Test.{" "}
                <span className="text-[#D4A84B]">One Platform.</span>
              </h2>
              <p className="mt-3 text-[#8899B4]">
                Our AI-driven modules replicate the actual ISSB experience, giving you the
                confidence to walk into the board room prepared for anything.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} direction="up" delay={i * 150}>
                <div className="group relative overflow-hidden rounded-xl border border-[#1E2A45] bg-[#131B2E]/80 p-6 transition-all duration-500 hover:border-[#D4A84B]/30 hover:shadow-xl hover:shadow-[#D4A84B]/5 crucible-card">
                  {/* Animated gold border accent */}
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-[#D4A84B]/0 transition-all duration-500 group-hover:bg-[#D4A84B]/60" />
                  <div className="absolute left-0 top-0 h-0.5 w-0 bg-[#D4A84B]/0 transition-all duration-500 group-hover:w-full group-hover:bg-[#D4A84B]/20" />

                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 crucible-shimmer" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#1E2A45] bg-[#0A0F1A] text-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5 group-hover:shadow-lg group-hover:shadow-[#D4A84B]/10">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(212,168,75,0.04)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-xs font-medium text-[#D4A84B]">YOUR PATH TO COMMISSION</span>
              </div>
              <h2
                className="text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                How It Works
              </h2>
              <p className="mt-3 text-[#8899B4]">
                Four simple steps from sign-up to board-ready.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} direction="up" delay={i * 150}>
                <div className="group relative text-center">
                  {/* Animated connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[60%] top-8 hidden h-px overflow-hidden md:block">
                      <div
                        className="h-full w-full bg-gradient-to-r from-[#D4A84B]/30 to-transparent"
                      />
                    </div>
                  )}

                  {/* Number with glow */}
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#D4A84B]/30 bg-[#131B2E] transition-all duration-500 group-hover:border-[#D4A84B] group-hover:shadow-lg group-hover:shadow-[#D4A84B]/20" />
                    <div className="absolute inset-0 rounded-full bg-[#D4A84B]/0 transition-all duration-500 group-hover:bg-[#D4A84B]/5" />
                    <span
                      className="relative text-lg font-bold text-[#D4A84B] transition-all duration-500 group-hover:scale-110"
                      style={{ fontFamily: "'var(--font-playfair)', serif" }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-[#F0F4F8] transition-colors duration-300 group-hover:text-[#D4A84B]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8899B4]">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CRUCIBLE BOARD ═══ */}
      <section id="benefits" className="relative border-y border-[#1E2A45]/60 bg-[#131B2E] py-24">
        <div className="absolute inset-0 crucible-shimmer opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4A84B]/20 bg-[#D4A84B]/5 px-3 py-1">
                <span className="text-xs font-medium text-[#D4A84B]">WHY CHOOSE US</span>
              </div>
              <h2
                className="text-3xl font-bold sm:text-4xl"
                style={{ fontFamily: "'var(--font-playfair)', serif" }}
              >
                Built for the{" "}
                <span className="text-[#D4A84B]">Elite</span>
              </h2>
              <p className="mt-3 text-[#8899B4]">
                Every feature is designed to push you beyond your limits —
                because that's exactly what the ISSB will do.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {benefits.map((item, i) => (
              <ScrollReveal key={item.title} direction="up" delay={i * 150}>
                <div className="group rounded-xl border border-[#1E2A45] bg-[#0A0F1A]/50 p-6 transition-all duration-500 hover:border-[#D4A84B]/20 hover:shadow-xl hover:shadow-[#D4A84B]/5 crucible-card">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#1E2A45] text-[#D4A84B] transition-all duration-300 group-hover:scale-110 group-hover:border-[#D4A84B]/30 group-hover:bg-[#D4A84B]/5 group-hover:shadow-lg group-hover:shadow-[#D4A84B]/10">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#F0F4F8] transition-colors duration-300 group-hover:text-[#D4A84B]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8899B4]">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMAGE BANNER ═══ */}
      <section className="relative overflow-hidden">
        <div className="relative h-80 overflow-hidden md:h-96">
          <img
            src="/issb/soldiers.jpg"
            alt="Military personnel"
            className="h-full w-full object-cover transition-all duration-[10000ms] hover:scale-110"
            style={{ 
              objectPosition: "center 30%",
              transform: "scale(1)",
            }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1A] via-[#0A0F1A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-[#0A0F1A]/30" />

          {/* Animated quote overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-4xl px-8">
              <ScrollReveal direction="up">
                <div className="relative">
                  {/* Decorative quote mark */}
                  <div className="absolute -top-8 -left-4 text-6xl leading-none text-[#D4A84B]/10" style={{ fontFamily: "'var(--font-playfair)', serif" }}>
                    &ldquo;
                  </div>
                  <blockquote
                    className="relative text-2xl font-bold italic leading-tight text-[#F0F4F8] sm:text-3xl md:text-4xl"
                    style={{ fontFamily: "'var(--font-playfair)', serif" }}
                  >
                    The crucible is not about breaking you down.
                    <br />
                    It's about forging what was always there.
                  </blockquote>
                  <p className="mt-4 text-sm text-[#8899B4] tracking-wider">
                    — Preparation is the key to commission
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="cta" className="relative py-24">
        <div className="absolute inset-0 crucible-gradient bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.08)_0%,transparent_60%)]" />

        {/* Floating elements */}
        <div className="absolute left-[10%] top-[20%] crucible-float">
          <div className="h-20 w-20 rounded-full border border-[#D4A84B]/10" />
        </div>
        <div className="absolute right-[15%] bottom-[20%] crucible-float-delayed">
          <div className="h-12 w-12 rotate-45 border border-[#D4A84B]/10 bg-[#D4A84B]/5" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h2
              className="text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ fontFamily: "'var(--font-playfair)', serif" }}
            >
              Ready to Forge{" "}
              <span className="text-[#D4A84B]">Your Commission</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={150}>
            <p className="mx-auto mt-4 max-w-2xl text-[#8899B4]">
              Join hundreds of Bangladesh Defense aspirants who are preparing with Crucible Board.
              Your journey to the ISSB board room starts here.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/issb/auth"
                className="crucible-btn-gold inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-[#0A0F1A] transition-all hover:brightness-110"
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
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#1E2A45]/60 bg-[#0A0F1A]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <Link href="/issb" className="flex items-center gap-2 group">
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
              <p className="mt-3 text-xs leading-relaxed text-[#8899B4]">
                Powered by{" "}
                <Link href="/" className="font-medium text-[#F0F4F8] crucible-link">
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
              <p className="mb-4 text-xs font-bold tracking-wider text-[#8899B4] uppercase">Quick Links</p>
              <div className="space-y-2.5">
                {[
                  { href: "#modules", label: "Practice Modules" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-[#8899B4] crucible-link transition-colors hover:text-[#D4A84B]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* About Ulul Albab */}
            <div>
              <p className="mb-4 text-xs font-bold tracking-wider text-[#8899B4] uppercase">About Ulul Albab</p>
              <p className="text-sm leading-relaxed text-[#8899B4]">
                Ulul Albab is a general-purpose AI-powered learning platform. Crucible Board is our
                specialized module for Bangladesh Defense officer candidates preparing for the ISSB
                selection process.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1 text-sm text-[#D4A84B] crucible-link transition-colors hover:text-[#F0F4F8]"
              >
                Visit Ulul Albab
                <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
