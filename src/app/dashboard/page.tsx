"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useGamification, ACHIEVEMENT_DEFS } from "@/hooks/use-gamification";
import { LevelBadge } from "@/components/gamification/level-badge";
import { AchievementCard } from "@/components/gamification/achievement-card";
import {
  MessageSquare, BookOpen, HelpCircle, TrendingUp, Zap, Flame,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

type LocalConv = {
  id: string;
  title: string;
  createdAt: string;
  messages: { role: string }[];
};

function loadStats(): { conversations: number; lessons: number; quizzes: number } {
  try {
    const convs = JSON.parse(localStorage.getItem("ulul-albab-conversations") || "[]");
    const lessons = JSON.parse(localStorage.getItem("ulul-albab-lessons") || "[]");
    const quizzes = JSON.parse(localStorage.getItem("ulul-albab-quizzes") || "[]");
    return {
      conversations: convs.length,
      lessons: lessons.length,
      quizzes: quizzes.length,
    };
  } catch {
    return { conversations: 0, lessons: 0, quizzes: 0 };
  }
}

function loadRecentConversations(): LocalConv[] {
  try {
    const raw = localStorage.getItem("ulul-albab-conversations");
    const all: LocalConv[] = raw ? JSON.parse(raw) : [];
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  } catch {
    return [];
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { xp, level, streakCount, longestStreak, achievements, progress, xpToNextLevel } = useGamification();
  const [stats, setStats] = useState({ conversations: 0, lessons: 0, quizzes: 0 });
  const [recent, setRecent] = useState<LocalConv[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    setStats(loadStats());
    setRecent(loadRecentConversations());
  }, []);

  const statCards = [
    { label: "Conversations", value: stats.conversations.toString(), icon: MessageSquare, color: "text-ulul-albab-primary" },
    { label: "XP Earned", value: xp.toString(), icon: Zap, color: "text-ulul-albab-xp" },
    { label: "Day Streak", value: streakCount.toString(), icon: Flame, color: "text-ulul-albab-streak" },
    { label: "Level", value: level.toString(), icon: TrendingUp, color: "text-ulul-albab-accent" },
  ];

  const quickActions = [
    { href: "/dashboard/chat", label: "New Chat", desc: "Chat with Lubb AI", icon: MessageSquare },
    { href: "/dashboard/lessons", label: "Lessons", desc: "Browse interactive lessons", icon: BookOpen },
    { href: "/dashboard/quizzes", label: "Quizzes", desc: "Test your knowledge", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Continue your learning journey with Lubb AI
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => {
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

      <div className="grid md:grid-cols-3 gap-3">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <div className="rounded-xl border bg-card p-4 hover:bg-accent transition-colors cursor-pointer">
                <Icon className="h-5 w-5 text-ulul-albab-primary mb-2" />
                <p className="font-medium text-sm">{a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <LevelBadge level={level} xp={xp} nextXp={xpToNextLevel} progress={progress.progress} />
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-ulul-albab-streak" />
            <span className="text-xs font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold text-ulul-albab-streak">{streakCount} days</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Longest: {longestStreak} days
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold mb-3">
          Achievements ({achievements.length}/{Object.keys(ACHIEVEMENT_DEFS).length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Object.keys(ACHIEVEMENT_DEFS).map((id) => (
            <AchievementCard key={id} id={id} earned={achievements.includes(id)} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold mb-3">Recent Conversations</h2>
        {recent.length === 0 ? (
          <div className="rounded-xl border bg-card p-6 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              No conversations yet.{" "}
              <Link href="/dashboard/chat" className="text-ulul-albab-primary hover:underline">
                Start chatting with Lubb
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((c) => (
              <Link key={c.id} href="/dashboard/chat">
                <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:bg-accent transition-colors">
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.messages.length} message{c.messages.length !== 1 ? "s" : ""}
                      {" · "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
