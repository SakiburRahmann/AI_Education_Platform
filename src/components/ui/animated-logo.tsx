"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

type AnimatedLogoProps = {
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
};

const textSizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function AnimatedLogo({
  showText = false,
  textSize = "md",
  className,
  animate = true,
}: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const starRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!animate || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".logo-dome",
        { drawSVG: "0%", opacity: 0 },
        { drawSVG: "100%", opacity: 1, duration: 1.2 },
        0
      )
        .fromTo(
          ".logo-star",
          { scale: 0, rotation: -90, opacity: 0, transformOrigin: "50px 46px" },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(2)" },
          "-=0.3"
        )
        .fromTo(
          ".logo-pillar",
          { drawSVG: "0%", opacity: 0 },
          { drawSVG: "100%", opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          ".logo-book",
          { drawSVG: "0%", opacity: 0 },
          { drawSVG: "100%", opacity: 1, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          ".logo-text",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 },
          "-=0.3"
        );

      if (starRef.current) {
        tl.to(
          starRef.current,
          {
            scale: 1.08,
            rotation: 3,
            transformOrigin: "50px 46px",
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          "+=0.5"
        );
        tl.to(
          starRef.current,
          {
            filter: "drop-shadow(0 0 6px var(--color-eduai-primary, #6C3CE1))",
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          "+=0"
        );
      }

      tlRef.current = tl;
    }, svgRef);

    return () => ctx.revert();
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center gap-2 ${className ?? "h-8 w-8"}`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 130"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Ulul Albab logo"
        className="h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="logo-dome" opacity="0">
          <path
            d="M26,64 C26,32 35,12 50,7 C65,12 74,32 74,64 C74,56 66,44 50,40 C34,44 26,56 26,64Z"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        <g className="logo-star" opacity="0">
          <path
            ref={starRef}
            d="M61,46 L54.2,47.7 L57.8,53.8 L51.7,52.2 L50,58 L48.3,52.2 L42.2,53.8 L45.8,47.7 L39,46 L45.8,44.3 L42.2,38.2 L48.3,39.8 L50,34 L51.7,39.8 L57.8,38.2 L54.2,44.3Z"
            strokeWidth="2"
            fill="var(--color-eduai-primary, #6C3CE1)"
            fillOpacity="0.15"
          />
        </g>

        <g className="logo-pillar" opacity="0">
          <path
            d="M44,42 L44,64 L41,64 L41,44Z"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M50,38 L50,64 L47,64 L47,40Z"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M59,44 L59,64 L56,64 L56,42Z"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M41,64 L59,64"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        <g className="logo-book" opacity="0">
          <path
            d="M26,66 C32,70 40,76 44,82 L44,90 C38,84 32,78 26,74Z"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M74,66 C68,70 60,76 56,82 L56,90 C62,84 68,78 74,74Z"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M44,90 C46,92 48,93 50,93 C52,93 54,92 56,90"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {showText && (
          <g className="logo-text-group">
            {Array.from("ULUL ALBAB").map((char, i) => (
              <text
                key={i}
                className="logo-text"
                x={50 + (i - 5) * 7.8}
                y="118"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="10"
                fontFamily="var(--font-heading, sans-serif)"
                fontWeight="700"
                letterSpacing="2"
                opacity="0"
              >
                {char === "A" ? "Λ" : char}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
