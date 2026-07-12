import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateCsrfToken, extractCsrfToken } from "@/lib/csrf";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch top 100 users by XP from the leaderboard view
    const { data: leaderboard, error: lbError } = await supabase
      .from("leaderboard")
      .select("*")
      .order("xp", { ascending: false })
      .limit(100);

    if (lbError) {
      console.error("Leaderboard fetch error:", lbError.message);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Get current user's rank
    const userRank = leaderboard?.findIndex((entry: { id: string }) => entry.id === user.id) ?? -1;

    return NextResponse.json({
      entries: leaderboard || [],
      currentUserRank: userRank >= 0 ? userRank + 1 : null,
    });
  } catch (error) {
    console.error("Leaderboard error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
