"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  distance?: number;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1000,
  className = "",
  once = true,
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const getTransform = (): string => {
    if (!visible) {
      switch (direction) {
        case "up": return `translateY(${distance}px)`;
        case "down": return `translateY(-${distance}px)`;
        case "left": return `translateX(${distance}px)`;
        case "right": return `translateX(-${distance}px)`;
        case "scale": return `scale(0.95)`;
        case "fade": return "none";
        default: return `translateY(${distance}px)`;
      }
    }
    return "translate(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggerGridProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
}

export function StaggerGrid({
  children,
  className = "",
  staggerDelay = 100,
  direction = "up",
}: StaggerGridProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <ScrollReveal
          key={i}
          direction={direction}
          delay={i * staggerDelay}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
