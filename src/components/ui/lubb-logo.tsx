import type { ComponentProps } from "react";

type LubbLogoProps = ComponentProps<"svg"> & {
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  variant?: "neutral" | "cozy";
};

const textSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function LubbLogo({
  showText = false,
  textSize = "md",
  variant,
  className,
  ...props
}: LubbLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-8 w-8 shrink-0"
        aria-label="Ulul Albab logo"
        {...props}
      >
        <circle cx="20" cy="20" r="18" className="fill-current" opacity="0.08" />
        <path
          d="M20 2L28 12L38 20L28 28L20 38L12 28L2 20L12 12Z"
          className="fill-current"
        />
        <circle cx="20" cy="20" r="5" fill="white" opacity={0.9} />
        <circle cx="20" cy="20" r="3" className="fill-current" />
        <path
          d="M12 12L28 28M28 12L12 28"
          stroke="white"
          strokeWidth="0.75"
          opacity={0.2}
        />
      </svg>
      {showText && (
        <span
          className={`font-heading font-bold tracking-tight ${textSizes[textSize]}`}
        >
          Lubb <span className="text-current opacity-80">AI</span>
        </span>
      )}
    </div>
  );
}
