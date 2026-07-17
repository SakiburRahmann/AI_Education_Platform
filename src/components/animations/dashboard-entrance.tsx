"use client";

import { useRef, useEffect, type ReactNode } from "react";

export function DashboardEntrance({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const items = el.children;
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
        });
      } else {
        gsap.from(el, { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" });
      }
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
