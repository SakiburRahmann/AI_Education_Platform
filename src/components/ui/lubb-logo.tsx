import Image from "next/image";

type LubbLogoProps = {
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  variant?: "neutral" | "cozy";
  className?: string;
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
}: LubbLogoProps) {
  const sizeClass = className ?? "h-8 w-8";

  return (
    <div className={`inline-flex items-center gap-2 ${sizeClass}`}>
      <div className="relative shrink-0 h-full w-full">
        <Image
          src="/logo.png"
          alt="Ulul Albab logo"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 64px, 80px"
          priority
        />
      </div>
      {showText && (
        <span
          className={`font-heading font-bold tracking-tight shrink-0 ${textSizes[textSize]}`}
        >
          Lubb <span className="text-current opacity-80">AI</span>
        </span>
      )}
    </div>
  );
}
