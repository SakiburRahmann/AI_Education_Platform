import { useState, useCallback, useEffect } from "react";
import {
  syncPostToSupabase,
  syncCommentToSupabase,
  syncVoteToSupabase,
  deletePostFromSupabase,
  fetchPostsFromSupabase,
  fetchCommentsFromSupabase,
} from "@/lib/sync/community";

function uid(): string {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
}

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
};

type VoteMap = Record<string, "up" | "down">;

const POSTS_KEY = "ulul-albab-community-posts";
const COMMENTS_KEY = "ulul-albab-community-comments";
const VOTES_KEY = "ulul-albab-community-votes";

function loadPosts(): CommunityPost[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]"); } catch { return []; }
}

function savePosts(posts: CommunityPost[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); } catch {}
}

function loadComments(): Comment[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(COMMENTS_KEY) || "[]"); } catch { return []; }
}

function saveComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments)); } catch {}
}

function loadVotes(): VoteMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}"); } catch { return {}; }
}

function saveVotes(votes: VoteMap) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(VOTES_KEY, JSON.stringify(votes)); } catch {}
}

export function useCommunityStorage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<VoteMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const localPosts = loadPosts();
    setPosts(localPosts);
    setComments(loadComments());
    setVotes(loadVotes());
    setLoaded(true);

    // Fetch posts from Supabase and merge
    fetchPostsFromSupabase().then((remotePosts) => {
      if (remotePosts.length > 0) {
        const localIds = new Set(localPosts.map((p) => p.id));
        const merged = [...localPosts];
        for (const rp of remotePosts) {
          if (!localIds.has(rp.id)) {
            merged.push(rp);
          } else {
            // Update existing post with remote data (upvotes/downvotes)
            const idx = merged.findIndex((m) => m.id === rp.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], upvotes: rp.upvotes, downvotes: rp.downvotes, commentCount: rp.commentCount };
            }
          }
        }
        setPosts(merged);
      }
    });
  }, []);

  useEffect(() => { if (loaded) savePosts(posts); }, [posts, loaded]);
  useEffect(() => { if (loaded) saveComments(comments); }, [comments, loaded]);
  useEffect(() => { if (loaded) saveVotes(votes); }, [votes, loaded]);

  const addPost = useCallback((title: string, content: string, author: string) => {
    const post: CommunityPost = {
      id: uid(),
      title, content, author,
      upvotes: 0, downvotes: 0, commentCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);

    // Sync to Supabase in background
    syncPostToSupabase(post);

    return post.id;
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));

    // Delete from Supabase in background
    deletePostFromSupabase(id);
  }, []);

  const addComment = useCallback((postId: string, content: string, author: string) => {
    const comment: Comment = {
      id: uid(), postId, content, author,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, comment]);
    setPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
    ));

    // Sync to Supabase in background
    syncCommentToSupabase(comment);

    return comment.id;
  }, []);

  const toggleVote = useCallback((postId: string, type: "up" | "down") => {
    const current = votes[postId];
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      let { upvotes, downvotes } = p;
      if (current === type) {
        // Toggle off
        if (type === "up") upvotes--;
        else downvotes--;
        return { ...p, upvotes, downvotes };
      }
      // Toggle to new type
      if (current === "up") upvotes--;
      if (current === "down") downvotes--;
      if (type === "up") upvotes++;
      else downvotes++;
      return { ...p, upvotes, downvotes };
    }));
    setVotes((prev) => {
      if (prev[postId] === type) {
        const { [postId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [postId]: type };
    });

    // Sync to Supabase in background (pass previous vote state for correct toggle-off handling)
    syncVoteToSupabase(postId, type, current ?? null);
  }, [votes]);

  const getPostComments = useCallback((postId: string) =>
    comments.filter((c) => c.postId === postId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
  [comments]);

  return { posts, votes, addPost, deletePost, addComment, getPostComments, toggleVote, loaded };
}
