"use client";

import { ACHIEVEMENT_DEFS } from "@/hooks/use-gamification";

export function AchievementCard({ id, earned }: { id: string; earned: boolean }) {
  const def = ACHIEVEMENT_DEFS[id];
  if (!def) return null;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        earned ? "bg-card" : "opacity-40 grayscale"
      }`}
    >
      <span className="text-2xl">{def.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{def.name}</p>
        <p className="text-[10px] text-muted-foreground">{def.desc}</p>
      </div>
      {!earned && (
        <span className="badge-circle flex h-6 w-6 items-center justify-center text-[10px] text-muted-foreground/50">
          ?
        </span>
      )}
    </div>
  );
}
