"use client";

import { useRef, useEffect, type ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      gsap.from(ref.current, { opacity: 0, y: 40, duration: 1, ease: "power3.out" });
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}
