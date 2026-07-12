import { createClient } from "@/lib/supabase/client";

export async function syncPostToSupabase(post: {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("community_posts").upsert({
      id: post.id,
      user_id: user.id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
    }, { onConflict: "id" });
  } catch (e) {
    console.warn("Failed to sync post to Supabase:", e);
  }
}

export async function syncCommentToSupabase(comment: {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("post_comments").insert({
      id: comment.id,
      post_id: comment.postId,
      user_id: user.id,
      content: comment.content,
      created_at: comment.createdAt,
    });
  } catch (e) {
    console.warn("Failed to sync comment to Supabase:", e);
  }
}

/**
 * Sync a vote to Supabase.
 * Handles three cases based on `previousVote`:
 * 1. Toggle ON (no previous) → delete any stale row, insert new vote
 * 2. Toggle OFF (same type as current) → just delete, don't re-insert
 * 3. Switch vote (different type) → delete old, insert new
 */
export async function syncVoteToSupabase(
  postId: string,
  voteType: "up" | "down",
  previousVote: "up" | "down" | null,
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Always delete any existing vote first
    await supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", user.id);

    // Only re-insert if this is NOT a toggle-off (previousVote !== voteType)
    if (previousVote !== voteType) {
      await supabase.from("post_votes").insert({
        post_id: postId,
        user_id: user.id,
        vote_type: voteType,
      });
    }
  } catch (e) {
    console.warn("Failed to sync vote to Supabase:", e);
  }
}

export async function deletePostFromSupabase(id: string) {
  try {
    const supabase = createClient();
    await supabase.from("community_posts").delete().eq("id", id);
  } catch (e) {
    console.warn("Failed to delete post from Supabase:", e);
  }
}

export async function fetchPostsFromSupabase(): Promise<{
  id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
}[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select("id, title, content, upvotes, downvotes, comment_count, created_at")
      .order("created_at", { ascending: false });

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      author: "Community Member",
      upvotes: p.upvotes ?? 0,
      downvotes: p.downvotes ?? 0,
      commentCount: p.comment_count ?? 0,
      createdAt: p.created_at,
    }));
  } catch {
    return [];
  }
}

export async function fetchCommentsFromSupabase(postId: string): Promise<{
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
}[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("post_comments")
      .select("id, post_id, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    return (data || []).map((c: any) => ({
      id: c.id,
      postId: c.post_id,
      content: c.content,
      author: "Community Member",
      createdAt: c.created_at,
    }));
  } catch {
    return [];
  }
}
