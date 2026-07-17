"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  distance?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function CinematicReveal({
  children,
  className = "",
  direction = "up",
  distance = 60,
  delay = 0,
  duration = 1,
  stagger = 0,
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    };

    switch (direction) {
      case "up":
        fromVars.y = distance;
        break;
      case "down":
        fromVars.y = -distance;
        break;
      case "left":
        fromVars.x = distance;
        break;
      case "right":
        fromVars.x = -distance;
        break;
      case "scale":
        fromVars.scale = 0.9;
        break;
    }

    if (stagger > 0) {
      gsap.from(el.children, { ...fromVars, stagger });
    } else {
      gsap.from(el, fromVars);
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [direction, distance, delay, duration, stagger]);

  return <div ref={ref} className={className}>{children}</div>;
}
