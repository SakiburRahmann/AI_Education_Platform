"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { LubbLogo } from "@/components/ui/lubb-logo";
import { TextScramble } from "@/components/animations/text-scramble";
import { WordCycle } from "@/components/animations/word-cycle";

const stats = [
  { value: "100%", label: "Free to learn" },
  { value: "Any", label: "Subject, any level" },
  { value: "AI", label: "Powered by Lubb" },
  { value: "XP", label: "Rewards & leagues" },
];

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const logo = section.querySelector(".hero-logo");
    const heading = section.querySelector(".hero-heading");
    const subtitle = section.querySelector(".hero-subtitle");
    const wordCycle = section.querySelector(".hero-word-cycle");
    const desc = section.querySelector(".hero-desc");
    const cta = section.querySelector(".hero-cta");
    const statsEl = section.querySelector(".hero-stats");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(logo, { opacity: 0, scale: 0.6, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 0.2)
      .fromTo(subtitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, ">-=0.2")
      .fromTo(wordCycle, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, ">-=0.1")
      .fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, ">-=0.1")
      .fromTo(cta, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, ">-=0.1")
      .fromTo(statsEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, ">-=0.1");

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_60%)] opacity-[0.07] animate-gradient-drift" />
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float-gentle hidden sm:block" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-float-gentle-delayed hidden sm:block" />
      <div className="container mx-auto px-4 sm:px-6 text-center relative">
        <div className="hero-logo mb-6 sm:mb-8 flex justify-center">
          <div className="hover:rotate-3 transition-transform duration-500">
            <LubbLogo className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          </div>
        </div>

        <h1 className="hero-heading font-heading text-3xl font-bold tracking-tight sm:text-5xl md:text-7xl text-foreground px-2 sm:px-0">
          <TextScramble
            text="Ulul Albab"
            duration={2}
            revealDelay={0.5}
            delay={400}
            as="span"
            className="text-gradient-primary"
          />
          <br />
          <span className="hero-subtitle mt-2 block text-xl sm:text-2xl md:text-3xl font-semibold text-muted-foreground">
            Learn Anything with{" "}
            <span className="text-gradient-warm">Lubb AI</span>
          </span>
        </h1>

        <div className="hero-word-cycle mt-3 sm:mt-4 min-h-[2rem]">
          <span className="text-sm sm:text-base text-muted-foreground/80 font-medium">
            <WordCycle
              words={[
                "Upload your books and notes",
                "Chat with your personal AI tutor",
                "Master any subject, any level",
                "Earn XP and climb the leaderboard",
                "100% free, no credit card needed",
              ]}
              className="text-gradient-brand"
              interval={2800}
            />
          </span>
        </div>

        <p className="hero-desc mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-2 sm:px-0">
          <strong>Ulul Albab</strong> is an AI-powered learning platform for everyone.
          Upload your books and notes: or learn any subject from scratch.
          <strong> Lubb AI</strong>, your personal AI tutor, teaches you, quizzes you,
          and keeps you motivated with XP, streaks, and leagues.
          All <strong>100% free</strong>.
        </p>
        <p className="hero-desc mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
          Named from the Quranic term <strong>Ulul Albab</strong> (People of Intellect) and
          <strong> Lubb</strong> (inner essence), the platform is built around the idea that
          real learning comes from understanding, not memorization. Lubb adapts to your
          pace, explains concepts with clarity, and transforms how you engage with knowledge.
        </p>

        <div className="hero-cta mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 pb-4 sm:pb-0">
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

        <div className="hero-stats mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="font-bold text-foreground">{s.value}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
