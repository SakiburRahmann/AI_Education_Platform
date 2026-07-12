import { useState, useCallback, useEffect, useRef } from "react";
import { syncGamificationToSupabase, fetchGamificationFromSupabase, type SyncGamificationData } from "@/lib/sync/gamification";

type XPTransaction = {
  amount: number;
  reason: string;
  timestamp: string;
};

export type GamificationState = {
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  achievements: string[];
  transactions: XPTransaction[];
};

const STORAGE_KEY = "ulul-albab-gamification";

export const ACHIEVEMENT_DEFS: Record<string, { name: string; desc: string; icon: string }> = {
  first_message: { name: "First Steps", desc: "Earn your first XP", icon: "💬" },
  five_messages: { name: "XP Collector", desc: "Earn XP 25 times", icon: "🗣️" },
  first_lesson: { name: "Knowledge Seeker", desc: "View your first lesson", icon: "📖" },
  five_lessons: { name: "Quick Learner", desc: "Complete 5 lessons", icon: "📚" },
  first_quiz: { name: "Quiz Rookie", desc: "Complete your first quiz", icon: "❓" },
  five_quizzes: { name: "Quiz Master", desc: "Complete 5 quizzes", icon: "🏆" },
  streak_3: { name: "Streak Starter", desc: "3-day streak", icon: "🔥" },
  streak_7: { name: "Dedicated", desc: "7-day streak", icon: "🔥🔥" },
  streak_30: { name: "Unstoppable", desc: "30-day streak", icon: "🔥🔥🔥" },
  xp_100: { name: "Century", desc: "Earn 100 XP", icon: "💯" },
  xp_500: { name: "Five Hundred", desc: "Earn 500 XP", icon: "⭐" },
  xp_1000: { name: "Millennium", desc: "Earn 1,000 XP", icon: "🌟" },
  first_save: { name: "Collector", desc: "Save your first lesson or quiz", icon: "💾" },
};

function defaultState(): GamificationState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    xp: 0,
    level: 1,
    streakCount: 0,
    longestStreak: 0,
    lastActiveDate: today,
    achievements: [],
    transactions: [],
  };
}

function load(): GamificationState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GamificationState;
    const today = new Date().toISOString().slice(0, 10);
    if (parsed.lastActiveDate && parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const diffDays = Math.floor(
        (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        parsed.streakCount += 1;
        if (parsed.streakCount > parsed.longestStreak) {
          parsed.longestStreak = parsed.streakCount;
        }
      } else if (diffDays > 1) {
        parsed.streakCount = 0;
      }
      parsed.lastActiveDate = today;
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

function save(state: GamificationState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save gamification:", e);
  }
}

function calcLevel(xp: number): number {
  let level = 1;
  while (xp >= 100 * level * (level + 1) / 2) level++;
  return level;
}

function xpToNextLevel(level: number): number {
  return 100 * level * (level + 1) / 2;
}

function levelProgress(xp: number): { current: number; next: number; progress: number } {
  const level = calcLevel(xp);
  const prev = level === 1 ? 0 : 100 * (level - 1) * level / 2;
  const next = 100 * level * (level + 1) / 2;
  return { current: xp - prev, next: next - prev, progress: (xp - prev) / (next - prev) };
}

function checkAchievements(state: GamificationState): string[] {
  const unlocked: string[] = [];
  if (state.transactions.length >= 1 && !state.achievements.includes("first_message")) unlocked.push("first_message");
  if (state.transactions.length >= 25 && !state.achievements.includes("five_messages")) unlocked.push("five_messages");
  if (state.xp >= 100 && !state.achievements.includes("xp_100")) unlocked.push("xp_100");
  if (state.xp >= 500 && !state.achievements.includes("xp_500")) unlocked.push("xp_500");
  if (state.xp >= 1000 && !state.achievements.includes("xp_1000")) unlocked.push("xp_1000");
  if (state.streakCount >= 3 && !state.achievements.includes("streak_3")) unlocked.push("streak_3");
  if (state.streakCount >= 7 && !state.achievements.includes("streak_7")) unlocked.push("streak_7");
  if (state.streakCount >= 30 && !state.achievements.includes("streak_30")) unlocked.push("streak_30");
  return unlocked;
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [lastXpEarned, setLastXpEarned] = useState<{ amount: number; reason: string } | null>(null);
  const xpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const s = load();
    const newAchievements = checkAchievements(s);
    if (newAchievements.length > 0) {
      s.achievements = [...new Set([...s.achievements, ...newAchievements])];
    }
    setState(s);
    setLoaded(true);

    // Try to merge with Supabase data (if authenticated)
    fetchGamificationFromSupabase().then((supabaseData) => {
      if (supabaseData) {
        setState((prev) => ({
          ...prev,
          xp: Math.max(prev.xp, supabaseData.xp),
          level: Math.max(prev.level, supabaseData.level),
          streakCount: Math.max(prev.streakCount, supabaseData.streakCount),
          longestStreak: Math.max(prev.longestStreak, supabaseData.longestStreak),
          achievements: [...new Set([...prev.achievements, ...supabaseData.achievements])],
        }));
      }
    });
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (loaded) {
      save(state);

      // Debounce Supabase sync
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        const syncData: SyncGamificationData = {
          xp: state.xp,
          level: state.level,
          streakCount: state.streakCount,
          longestStreak: state.longestStreak,
          lastActiveDate: state.lastActiveDate,
          achievements: state.achievements,
          recentTransactions: state.transactions.slice(-10), // Only sync last 10 to avoid unbounded writes
        };
        syncGamificationToSupabase(syncData);
      }, 2000);
    }
  }, [state, loaded]);

  const awardXP = useCallback((amount: number, reason: string) => {
    setLastXpEarned({ amount, reason });

    // Clear any existing timer
    if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
    xpTimerRef.current = setTimeout(() => setLastXpEarned(null), 2000);

    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const next: GamificationState = {
        ...prev,
        xp: prev.xp + amount,
        level: calcLevel(prev.xp + amount),
        lastActiveDate: today,
        transactions: [...prev.transactions, { amount, reason, timestamp: new Date().toISOString() }],
      };
      const newAchievements = checkAchievements(next);
      if (newAchievements.length > 0) {
        next.achievements = [...new Set([...next.achievements, ...newAchievements])];
      }
      return next;
    });
  }, []);

  const awardAchievement = useCallback((id: string) => {
    setState((prev) => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  }, []);

  const progress = levelProgress(state.xp);

  return {
    ...state,
    progress,
    loaded,
    lastXpEarned,
    awardXP,
    awardAchievement,
    xpToNextLevel: xpToNextLevel(state.level),
  };
}
