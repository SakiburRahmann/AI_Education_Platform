"use client";

import { useEffect, useState } from "react";
import { useGamification } from "@/hooks/use-gamification";
import { LevelBadge } from "@/components/gamification/level-badge";
import { Trophy, Zap, Flame, TrendingUp, Medal, Crown, Loader2 } from "lucide-react";

type LeaderboardEntry = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
  league_id: string | null;
};

export default function LeaderboardPage() {
  const { xp, level, streakCount, longestStreak, achievements, progress, xpToNextLevel } = useGamification();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.entries) {
          setEntries(data.entries);
          setCurrentUserRank(data.currentUserRank);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total XP", value: xp.toLocaleString(), icon: Zap, color: "text-ulul-albab-xp" },
    { label: "Level", value: level.toString(), icon: TrendingUp, color: "text-ulul-albab-accent" },
    { label: "Streak", value: `${streakCount} days`, icon: Flame, color: "text-ulul-albab-streak" },
    { label: "Achievements", value: achievements.length.toString(), icon: Medal, color: "text-ulul-albab-primary" },
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
          <Crown className="h-4 w-4 text-ulul-albab-accent" />
          <h2 className="font-heading text-sm font-semibold">Global Rankings</h2>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">
                No rankings available yet. Start learning to appear on the leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 50).map((entry, i) => {
                const isYou = currentUserRank === i + 1;
                const rank = i + 1;
                const displayName = entry.display_name || entry.id.slice(0, 8);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${
                      isYou ? "bg-primary/5 border-primary/20" : "bg-card"
                    }`}
                  >
                    <span className={`w-6 text-center text-xs font-bold ${
                      rank <= 3 ? "text-ulul-albab-accent" : "text-muted-foreground"
                    }`}>
                      {rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `#${rank}`}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {displayName}
                        {isYou && <span className="ml-1.5 text-[10px] text-primary">(you)</span>}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Level {entry.level} · Streak: {entry.streak_count}d
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-ulul-albab-xp">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {currentUserRank && currentUserRank > 50 && (
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              You are ranked #{currentUserRank} overall
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-ulul-albab-streak" />
          <h2 className="font-heading text-sm font-semibold">Streak History</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-ulul-albab-streak">{streakCount} days</p>
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
