import { useState, useCallback, useEffect } from "react";

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

const STORAGE_KEY = "ulu-al-albab-gamification";

export const ACHIEVEMENT_DEFS: Record<string, { name: string; desc: string; icon: string }> = {
  first_message: { name: "First Steps", desc: "Send your first message", icon: "💬" },
  five_messages: { name: "Chatter", desc: "Send 25 messages", icon: "🗣️" },
  first_lesson: { name: "Knowledge Seeker", desc: "Complete your first lesson", icon: "📖" },
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

  useEffect(() => {
    const s = load();
    const newAchievements = checkAchievements(s);
    if (newAchievements.length > 0) {
      s.achievements = [...new Set([...s.achievements, ...newAchievements])];
    }
    setState(s);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save(state);
  }, [state, loaded]);

  const awardXP = useCallback((amount: number, reason: string) => {
    setLastXpEarned({ amount, reason });
    const timer = setTimeout(() => setLastXpEarned(null), 2000);
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
    return () => clearTimeout(timer);
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
