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
    if (!user) return false;

    const { error } = await supabase.from("community_posts").upsert({
      id: post.id,
      user_id: user.id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
    }, { onConflict: "id" });

    return !error;
  } catch (e) {
    console.warn("Failed to sync post to Supabase:", e);
    return false;
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
    if (!user) return false;

    await supabase.from("post_comments").insert({
      id: comment.id,
      post_id: comment.postId,
      user_id: user.id,
      content: comment.content,
      created_at: comment.createdAt,
    });

    return true;
  } catch (e) {
    console.warn("Failed to sync comment to Supabase:", e);
    return false;
  }
}

export async function syncVoteToSupabase(
  postId: string,
  voteType: "up" | "down",
  previousVote: "up" | "down" | null,
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    await supabase.from("post_votes").delete().eq("post_id", postId).eq("user_id", user.id);

    if (previousVote !== voteType) {
      await supabase.from("post_votes").insert({
        post_id: postId,
        user_id: user.id,
        vote_type: voteType,
      });
    }

    return true;
  } catch (e) {
    console.warn("Failed to sync vote to Supabase:", e);
    return false;
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

/** Fetch all community posts with real author display names from profiles table */
export async function fetchPostsFromSupabase(): Promise<{
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
}[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("community_posts")
      .select(`
        id,
        title,
        content,
        upvotes,
        downvotes,
        comment_count,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false });

    if (!data) return [];

    // Get all unique user IDs to fetch profiles
    const userIds = [...new Set(data.map((p: any) => p.user_id).filter(Boolean))];
    
    // Fetch display names from profiles
    const profilesMap = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

      (profiles || []).forEach((p: any) => {
        profilesMap.set(p.id, p.display_name || p.id.slice(0, 8));
      });
    }

    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      author: profilesMap.get(p.user_id) || p.user_id?.slice(0, 8) || "Anonymous",
      authorId: p.user_id || "",
      upvotes: p.upvotes ?? 0,
      downvotes: p.downvotes ?? 0,
      commentCount: p.comment_count ?? 0,
      createdAt: p.created_at,
    }));
  } catch {
    return [];
  }
}

/** Fetch comments for a post with author names */
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
      .select(`
        id,
        post_id,
        content,
        created_at,
        user_id
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (!data) return [];

    // Get author names from profiles
    const userIds = [...new Set(data.map((c: any) => c.user_id).filter(Boolean))];
    const profilesMap = new Map<string, string>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

      (profiles || []).forEach((p: any) => {
        profilesMap.set(p.id, p.display_name || p.id.slice(0, 8));
      });
    }

    return data.map((c: any) => ({
      id: c.id,
      postId: c.post_id,
      content: c.content,
      author: profilesMap.get(c.user_id) || c.user_id?.slice(0, 8) || "Anonymous",
      createdAt: c.created_at,
    }));
  } catch {
    return [];
  }
}
