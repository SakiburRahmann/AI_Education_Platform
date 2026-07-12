import { createClient } from "@/lib/supabase/client";

export interface SyncPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SyncComment {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
}

export interface FetchedPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
}

export interface FetchedComment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostRow {
  id: string;
  title: string;
  content: string;
  upvotes: number | null;
  downvotes: number | null;
  comment_count: number | null;
  created_at: string;
  user_id: string;
}

interface CommentRow {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface ProfileRow {
  id: string;
  display_name: string | null;
}

export async function syncPostToSupabase(post: SyncPost): Promise<boolean> {
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

    if (error) {
      console.error("Failed to sync post:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to sync post:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function syncCommentToSupabase(comment: SyncComment): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from("post_comments").insert({
      id: comment.id,
      post_id: comment.postId,
      user_id: user.id,
      content: comment.content,
      created_at: comment.createdAt,
    });

    if (error) {
      console.error("Failed to sync comment:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to sync comment:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function syncVoteToSupabase(
  postId: string,
  voteType: "up" | "down",
  previousVote: "up" | "down" | null,
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error: deleteError } = await supabase
      .from("post_votes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Failed to clear previous vote:", deleteError.message);
      return false;
    }

    if (previousVote !== voteType) {
      const { error: insertError } = await supabase.from("post_votes").insert({
        post_id: postId,
        user_id: user.id,
        vote_type: voteType,
      });

      if (insertError) {
        console.error("Failed to record vote:", insertError.message);
        return false;
      }
    }

    return true;
  } catch (e) {
    console.error("Failed to sync vote:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function deletePostFromSupabase(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("community_posts").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete post:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to delete post:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

async function buildProfilesMap(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();
  try {
    const supabase = createClient();
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    const map = new Map<string, string>();
    (profiles || []).forEach((p: ProfileRow) => {
      map.set(p.id, p.display_name || p.id.slice(0, 8));
    });
    return map;
  } catch {
    return new Map();
  }
}

export async function fetchPostsFromSupabase(): Promise<FetchedPost[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, title, content, upvotes, downvotes, comment_count, created_at, user_id")
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) console.error("Failed to fetch posts:", error.message);
      return [];
    }

    const userIds = [...new Set(data.map((p: PostRow) => p.user_id).filter(Boolean))];
    const profilesMap = await buildProfilesMap(userIds);

    return data.map((p: PostRow): FetchedPost => ({
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
  } catch (e) {
    console.error("Failed to fetch posts:", e instanceof Error ? e.message : String(e));
    return [];
  }
}

export async function fetchCommentsFromSupabase(postId: string): Promise<FetchedComment[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("post_comments")
      .select("id, post_id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error || !data) {
      if (error) console.error("Failed to fetch comments:", error.message);
      return [];
    }

    const userIds = [...new Set(data.map((c: CommentRow) => c.user_id).filter(Boolean))];
    const profilesMap = await buildProfilesMap(userIds);

    return data.map((c: CommentRow): FetchedComment => ({
      id: c.id,
      postId: c.post_id,
      content: c.content,
      author: profilesMap.get(c.user_id) || c.user_id?.slice(0, 8) || "Anonymous",
      createdAt: c.created_at,
    }));
  } catch (e) {
    console.error("Failed to fetch comments:", e instanceof Error ? e.message : String(e));
    return [];
  }
}
