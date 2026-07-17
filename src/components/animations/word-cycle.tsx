"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface WordCycleProps {
  words: string[];
  className?: string;
  interval?: number;
  scrambleDuration?: number;
}

export function WordCycle({
  words,
  className = "",
  interval = 2500,
  scrambleDuration = 1.2,
}: WordCycleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2) return;

    const cycle = () => {
      const next = (index + 1) % words.length;
      const tl = gsap.timeline({
        onComplete: () => setIndex(next),
      });

      tl.to(el, {
        duration: 0.25,
        opacity: 0,
        y: -8,
        ease: "power2.in",
      })
      .call(() => {
        if (el) el.textContent = words[next];
      })
      .to(el, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power3.out",
      });
    };

    const timer = setInterval(cycle, interval);
    return () => clearInterval(timer);
  }, [words, interval, scrambleDuration, index]);

  return <span ref={ref} className={className}>{words[0]}</span>;
}
