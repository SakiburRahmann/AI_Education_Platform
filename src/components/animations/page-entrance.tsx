"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { DURATION, EASE, DISTANCE } from "@/lib/motion";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export function PageEntrance({ children, className = "", delay = 0, direction = "up" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: DURATION.entrance,
      delay,
      ease: EASE.default,
    };

    if (direction === "up") fromVars.y = DISTANCE.xl;
    else if (direction === "down") fromVars.y = -DISTANCE.xl;
    else if (direction === "left") fromVars.x = DISTANCE.large;
    else if (direction === "right") fromVars.x = -DISTANCE.large;

    gsap.from(el, fromVars);
    return () => { gsap.killTweensOf(el); };
  }, [delay, direction]);

  return <div ref={ref} className={className}>{children}</div>;
}
