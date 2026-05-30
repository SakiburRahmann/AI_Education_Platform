"use client";

import { Zap } from "lucide-react";

export function LevelBadge({ level, xp, nextXp, progress }: {
  level: number;
  xp: number;
  nextXp: number;
  progress: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-eduai-primary/10 text-eduai-primary">
        <Zap className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold">Level {level}</p>
          <p className="text-[10px] text-muted-foreground">{xp} / {nextXp} XP</p>
        </div>
        <div className="progress-bar mt-1">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
