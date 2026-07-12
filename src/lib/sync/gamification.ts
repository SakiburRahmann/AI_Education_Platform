import { createClient } from "@/lib/supabase/client";

export interface SyncGamificationData {
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  achievements: string[];
  recentTransactions: { amount: number; reason: string; timestamp: string }[];
}

export interface GamificationDTO {
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  achievements: string[];
  transactions: { amount: number; reason: string; timestamp: string }[];
}

interface ProfileRow {
  xp: number | null;
  level: number | null;
  streak_count: number | null;
}

interface AchievementRow {
  achievement_type: string;
}

interface TransactionRow {
  amount: number;
  reason: string;
  created_at: string;
}

export async function syncGamificationToSupabase(data: SyncGamificationData): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error syncing gamification:", authError.message);
      return;
    }
    if (!user) return;

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        xp: data.xp,
        level: data.level,
        streak_count: data.streakCount,
        last_active_date: data.lastActiveDate,
      })
      .eq("id", user.id);

    if (profileError) {
      // Profile doesn't exist — create it
      if (profileError.code === "PGRST116") {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          xp: data.xp,
          level: data.level,
          streak_count: data.streakCount,
          last_active_date: data.lastActiveDate,
        });
        if (insertError) {
          console.error("Failed to create profile:", insertError.message);
        }
      } else {
        console.error("Failed to sync profile:", profileError.message);
      }
    }

    // Sync XP transactions (recent only to avoid unbounded writes)
    for (const tx of data.recentTransactions) {
      const { error: txError } = await supabase.from("xp_transactions").insert({
        user_id: user.id,
        amount: tx.amount,
        reason: tx.reason,
        created_at: tx.timestamp,
      });
      if (txError) {
        console.error("Failed to sync transaction:", txError.message);
      }
    }

    // Sync new achievements
    const { data: existingAchievements, error: achError } = await supabase
      .from("achievements")
      .select("achievement_type")
      .eq("user_id", user.id);

    if (achError) {
      console.error("Failed to fetch existing achievements:", achError.message);
      return;
    }

    const existingTypes = new Set(
      (existingAchievements || []).map((a: AchievementRow) => a.achievement_type)
    );
    const newAchievements = data.achievements.filter((a) => !existingTypes.has(a));

    for (const achievementType of newAchievements) {
      const { error: insError } = await supabase.from("achievements").insert({
        user_id: user.id,
        achievement_type: achievementType,
      });
      if (insError) {
        console.error("Failed to sync achievement:", insError.message);
      }
    }
  } catch (e) {
    console.error(
      "Failed to sync gamification to Supabase:",
      e instanceof Error ? e.message : String(e)
    );
  }
}

export async function fetchGamificationFromSupabase(): Promise<GamificationDTO | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("xp, level, streak_count")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      if (profileError && profileError.code !== "PGRST116") {
        console.error("Failed to fetch profile:", profileError.message);
      }
      return null;
    }

    const [achievementsResult, transactionsResult] = await Promise.all([
      supabase
        .from("achievements")
        .select("achievement_type")
        .eq("user_id", user.id),
      supabase
        .from("xp_transactions")
        .select("amount, reason, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (achievementsResult.error) {
      console.error("Failed to fetch achievements:", achievementsResult.error.message);
    }
    if (transactionsResult.error) {
      console.error("Failed to fetch transactions:", transactionsResult.error.message);
    }

    const p = profile as ProfileRow;
    return {
      xp: p.xp ?? 0,
      level: p.level ?? 1,
      streakCount: p.streak_count ?? 0,
      longestStreak: p.streak_count ?? 0,
      achievements: (achievementsResult.data || []).map((a: AchievementRow) => a.achievement_type),
      transactions: (transactionsResult.data || [])
        .reverse()
        .map((t: TransactionRow) => ({
          amount: t.amount,
          reason: t.reason,
          timestamp: t.created_at,
        })),
    };
  } catch (e) {
    console.error(
      "Failed to fetch gamification from Supabase:",
      e instanceof Error ? e.message : String(e)
    );
    return null;
  }
}
