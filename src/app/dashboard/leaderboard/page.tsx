"use client";

import { useGamification } from "@/hooks/use-gamification";
import { LevelBadge } from "@/components/gamification/level-badge";
import { Trophy, Zap, Flame, TrendingUp, Medal, Crown } from "lucide-react";

export default function LeaderboardPage() {
  const { xp, level, streakCount, longestStreak, achievements, progress, xpToNextLevel } = useGamification();

  const stats = [
    { label: "Total XP", value: xp.toLocaleString(), icon: Zap, color: "text-eduai-xp" },
    { label: "Level", value: level.toString(), icon: TrendingUp, color: "text-eduai-accent" },
    { label: "Streak", value: `${streakCount} days`, icon: Flame, color: "text-eduai-streak" },
    { label: "Achievements", value: achievements.length.toString(), icon: Medal, color: "text-eduai-primary" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your learning stats and ranking progress
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      <LevelBadge level={level} xp={xp} nextXp={xpToNextLevel} progress={progress.progress} />

      <div className="rounded-xl border bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Crown className="h-4 w-4 text-eduai-accent" />
          <h2 className="font-heading text-sm font-semibold">Rankings</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-eduai-accent/10 text-eduai-accent">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">You</p>
              <p className="text-xs text-muted-foreground">Level {level} · {xp} XP</p>
            </div>
            <span className="shrink-0 text-xs font-bold text-eduai-accent">#1</span>
          </div>
          <p className="mt-4 text-center text-[10px] text-muted-foreground">
            Multi-user leaderboard coming soon with Supabase sync
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-eduai-streak" />
          <h2 className="font-heading text-sm font-semibold">Streak History</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-eduai-streak">{streakCount} days</p>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{longestStreak} days</p>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
