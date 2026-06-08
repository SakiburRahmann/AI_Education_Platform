"use client";

import { useEffect, useState } from "react";

export function XPFloat({ amount, reason }: { amount: number; reason: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed top-1/4 left-1/2 z-50 -translate-x-1/2 animate-floatUp text-center">
      <p className="text-lg font-bold text-ulul-albab-xp drop-shadow-lg">
        +{amount} XP
      </p>
      <p className="text-xs text-ulul-albab-xp/70">{reason}</p>
    </div>
  );
}
