"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useGamification } from "@/hooks/use-gamification";
import { LevelBadge } from "@/components/gamification/level-badge";
import { AchievementCard } from "@/components/gamification/achievement-card";
import { ACHIEVEMENT_DEFS } from "@/hooks/use-gamification";
import type { User } from "@supabase/supabase-js";
import { UserCircle, Zap, Flame, BookOpen, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { xp, level, streakCount, longestStreak, achievements, progress, xpToNextLevel, transactions } = useGamification();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-primary-foreground">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">
            {user?.email?.split("@")[0] || "User"}
          </h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <LevelBadge level={level} xp={xp} nextXp={xpToNextLevel} progress={progress.progress} />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-ulul-albab-streak" />
            <span className="text-xs font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold text-ulul-albab-streak">{streakCount} days</p>
          <p className="text-[10px] text-muted-foreground">Longest: {longestStreak} days</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-ulul-albab-xp" />
            <span className="text-xs font-medium text-muted-foreground">Total XP</span>
          </div>
          <p className="text-2xl font-bold text-ulul-albab-xp">{xp.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">{transactions.length} interactions</p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold mb-3">
          Achievements ({achievements.length}/{Object.keys(ACHIEVEMENT_DEFS).length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.keys(ACHIEVEMENT_DEFS).map((id) => (
            <AchievementCard key={id} id={id} earned={achievements.includes(id)} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold mb-3">Recent Activity</h2>
        {transactions.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <UserCircle className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No activity yet. Start learning!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {[...transactions].reverse().slice(0, 20).map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-ulul-albab-xp" />
                  <span className="text-xs truncate">{t.reason}</span>
                </div>
                <span className="shrink-0 text-xs font-medium text-ulul-albab-xp">+{t.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
