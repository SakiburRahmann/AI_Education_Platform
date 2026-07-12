"use client";

import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.unobserve(el);

          const startTime = performance.now();

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * eased;
            setCount(current);

            if (progress < 1) {
              rafId.current = requestAnimationFrame(step);
            } else {
              setCount(to);
            }
          };

          rafId.current = requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [from, to, duration]);

  const formatted = count.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
