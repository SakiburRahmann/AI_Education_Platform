import { AnimatedLogo } from "@/components/ui/animated-logo";

type LubbLogoProps = {
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  variant?: "neutral" | "cozy";
  className?: string;
  animate?: boolean;
};

export function LubbLogo({
  showText = false,
  textSize = "md",
  variant,
  className,
  animate = true,
}: LubbLogoProps) {
  return (
    <AnimatedLogo
      showText={showText}
      textSize={textSize}
      className={className}
      animate={animate}
    />
  );
}
