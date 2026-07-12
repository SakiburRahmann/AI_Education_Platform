import { createClient } from "@/lib/supabase/client";

/**
 * Sync gamification state to Supabase profiles, xp_transactions, and achievements tables.
 * Falls back silently — if the user is unauthenticated or the request fails, only localStorage is used.
 */
export type SyncGamificationData = {
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  achievements: string[];
  recentTransactions: { amount: number; reason: string; timestamp: string }[];
};

export async function syncGamificationToSupabase(data: SyncGamificationData) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return; // Not authenticated — skip

    // Update profile XP, level, streak
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
      // If profile doesn't exist yet (shouldn't happen but handle gracefully)
      if (profileError.code === "PGRST116") {
        await supabase.from("profiles").insert({
          id: user.id,
          xp: data.xp,
          level: data.level,
          streak_count: data.streakCount,
          last_active_date: data.lastActiveDate,
        });
      } else {
        console.warn("Failed to sync profile:", profileError);
      }
    }

    // Sync XP transactions (only recent ones to avoid unbounded writes)
    for (const tx of data.recentTransactions) {
      await supabase.from("xp_transactions").insert({
        user_id: user.id,
        amount: tx.amount,
        reason: tx.reason,
        created_at: tx.timestamp,
      });
    }

    // Sync achievements
    const { data: existingAchievements } = await supabase
      .from("achievements")
      .select("achievement_type")
      .eq("user_id", user.id);

    const existingTypes = new Set((existingAchievements || []).map((a: any) => a.achievement_type));
    const newAchievements = data.achievements.filter((a) => !existingTypes.has(a));

    for (const achievementType of newAchievements) {
      await supabase.from("achievements").insert({
        user_id: user.id,
        achievement_type: achievementType,
      });
    }
  } catch (e) {
    console.warn("Failed to sync gamification to Supabase:", e);
  }
}

export type GamificationDTO = {
  xp: number;
  level: number;
  streakCount: number;
  longestStreak: number;
  achievements: string[];
  transactions: { amount: number; reason: string; timestamp: string }[];
};

export async function fetchGamificationFromSupabase(): Promise<GamificationDTO | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, level, streak_count")
      .eq("id", user.id)
      .single();

    if (!profile) return null;

    const [achievementsResult, transactionsResult] = await Promise.all([
      supabase.from("achievements").select("achievement_type").eq("user_id", user.id),
      supabase.from("xp_transactions").select("amount, reason, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]);

    return {
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
      streakCount: profile.streak_count ?? 0,
      longestStreak: profile.longest_streak ?? profile.streak_count ?? 0,
      achievements: (achievementsResult.data || []).map((a: any) => a.achievement_type),
      transactions: (transactionsResult.data || []).reverse().map((t: any) => ({
        amount: t.amount,
        reason: t.reason,
        timestamp: t.created_at,
      })),
    };
  } catch {
    return null;
  }
}
