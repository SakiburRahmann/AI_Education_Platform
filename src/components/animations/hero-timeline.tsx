"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";

interface HeroTimelineProps {
  children: ReactNode;
}

export function HeroTimeline({ children }: HeroTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;
    if (!items.length) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    Array.from(items).forEach((child, i) => {
      const el = child as HTMLElement;
      gsap.set(el, { opacity: 0, y: 30 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.7 }, i === 0 ? 0.2 : ">-=0.15");
    });

    return () => { tl.kill(); };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
