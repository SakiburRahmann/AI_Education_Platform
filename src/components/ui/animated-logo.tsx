"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

gsap.registerPlugin(CSSRulePlugin);

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
  const starRef = useRef<SVGPathElement>(null);
  const emblemRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!animate || !svgRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        maskRef.current,
        { attr: { height: "0%", y: "100%" } },
        { attr: { height: "100%", y: "0%" }, duration: 1.4, ease: "power4.out" },
        0.2
      )
        .fromTo(
          starRef.current,
          { scale: 0, rotation: -120, opacity: 0, transformOrigin: "50px 32px" },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: "back.out(2.5)" },
          "-=0.5"
        )
        .fromTo(
          ".logo-label-text",
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 },
          "-=0.2"
        );

      tl.to(
        starRef.current,
        {
          keyframes: [
            { filter: "drop-shadow(0 0 2px var(--color-eduai-primary, #6C3CE1))", duration: 1.5 },
            { filter: "drop-shadow(0 0 6px var(--color-eduai-primary, #6C3CE1))", duration: 1.5 },
          ],
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "+=0.5"
      );

      tl.to(
        emblemRef.current,
        { opacity: 0.85, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" },
        "+=0"
      );
    }, svgRef);

    return () => ctx.revert();
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center gap-3 ${className ?? "h-8 w-8"}`}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 100 130"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Ulul Albab logo"
        className="h-full w-full shrink-0"
        fill="currentColor"
        stroke="none"
      >
        <defs>
          <clipPath id="logoReveal">
            <rect ref={maskRef} x="0" y="0" width="100" height="0" />
          </clipPath>
        </defs>

        <g clipPath="url(#logoReveal)">
          <path
            ref={emblemRef}
            d="M50,130 C45,115 30,115 15,110 L15,100 C30,105 45,105 48,90 L48,60 C45,60 30,75 29,85 L29,26 C35,15 45,10 50,10 C55,10 65,15 71,26 L71,85 C70,75 55,60 52,60 L52,90 C55,105 70,105 85,100 L85,110 C70,115 55,115 50,130 Z"
            fill="currentColor"
          />
        </g>

        <path
          ref={starRef}
          d="M50,26 L53,29 L57,29 L54,32 L55,36 L50,34 L45,36 L46,32 L43,29 L47,29 Z"
          fill="currentColor"
          opacity="0"
        />

        <g>
          {[
            { char: "U", x: 14 },
            { char: "L", x: 22 },
            { char: "U", x: 30 },
            { char: "L", x: 38 },
            { char: " ", x: 46 },
            { char: "A", x: 54 },
            { char: "L", x: 62 },
            { char: "B", x: 70 },
            { char: "A", x: 78 },
            { char: "B", x: 86 },
          ].map(({ char, x }) => (
            <text
              key={x}
              className="logo-label-text"
              x={x}
              y="118"
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize="8.5"
              fontFamily="var(--font-heading), 'Space Grotesk', sans-serif"
              fontWeight="700"
              letterSpacing="1.5"
              opacity="0"
            >
              {char}
            </text>
          ))}
        </g>
      </svg>

      {showText && (
        <span
          className={`font-heading font-bold tracking-tight shrink-0 ${textSizeMap[textSize]}`}
        >
          Lubb <span className="text-current opacity-80">AI</span>
        </span>
      )}
    </div>
  );
}
