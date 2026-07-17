"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  duration?: number;
  revealDelay?: number;
  delay?: number;
  chars?: string;
}

export function TextScramble({
  text,
  className = "",
  as: Tag = "span",
  duration = 1.8,
  revealDelay = 0.4,
  delay = 0,
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()",
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const timeout = setTimeout(() => {
      gsap.to(el, {
        duration,
        scrambleText: {
          text,
          chars,
          revealDelay,
          speed: 0.6,
        },
        ease: "power2.out",
      });
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (el) gsap.killTweensOf(el);
    };
  }, [text, duration, revealDelay, delay, chars]);

  return <Tag ref={ref as any} className={className}>{text}</Tag>;
}
