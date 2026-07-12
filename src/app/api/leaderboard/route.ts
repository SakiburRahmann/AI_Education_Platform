import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch top 100 users by XP from the leaderboard view
    const { data: leaderboard } = await supabase
      .from("leaderboard")
      .select("*")
      .order("xp", { ascending: false })
      .limit(100);

    // Get current user's rank
    const userRank = leaderboard?.findIndex((entry: any) => entry.id === user.id) ?? -1;

    return NextResponse.json({
      entries: leaderboard || [],
      currentUserRank: userRank >= 0 ? userRank + 1 : null,
    });
  } catch (error: any) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
