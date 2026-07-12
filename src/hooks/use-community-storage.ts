"use client";

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
  authorId: string;
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

const POSTS_CACHE_KEY = "ulul-albab-community-posts-cache";
const COMMENTS_CACHE_KEY = "ulul-albab-community-comments-cache";
const VOTES_KEY = "ulul-albab-community-votes";

function loadCache<T>(key: string): T {
  if (typeof window === "undefined") return [] as any;
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? [] as any; } catch { return [] as any; }
}

function saveCache(key: string, data: any) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
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

  // On mount: fetch from Supabase as PRIMARY source, fall back to local cache
  useEffect(() => {
    fetchPostsFromSupabase().then((remotePosts) => {
      if (remotePosts.length > 0) {
        setPosts(remotePosts);
        saveCache(POSTS_CACHE_KEY, remotePosts);
      } else {
        // Fall back to local cache
        const cached = loadCache<CommunityPost[]>(POSTS_CACHE_KEY);
        if (cached.length > 0) setPosts(cached);
      }
    });

    // Load cached comments and votes for instant display
    const cachedComments = loadCache<Comment[]>(COMMENTS_CACHE_KEY);
    if (cachedComments.length > 0) setComments(cachedComments);
    setVotes(loadVotes());
    setLoaded(true);
  }, []);

  // Cache to localStorage whenever data changes
  useEffect(() => { if (loaded && posts.length > 0) saveCache(POSTS_CACHE_KEY, posts); }, [posts, loaded]);
  useEffect(() => { if (loaded && comments.length > 0) saveCache(COMMENTS_CACHE_KEY, comments); }, [comments, loaded]);
  useEffect(() => { if (loaded) saveVotes(votes); }, [votes, loaded]);

  const addPost = useCallback(async (title: string, content: string, author: string) => {
    const newPost: CommunityPost = {
      id: uid(),
      title, content, author,
      authorId: "",
      upvotes: 0, downvotes: 0, commentCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Optimistically add to UI
    setPosts((prev) => [newPost, ...prev]);

    // Sync to Supabase (await it)
    const success = await syncPostToSupabase(newPost);
    if (success) {
      // Refresh from Supabase to get the correct authorId and any server-side data
      fetchPostsFromSupabase().then((remote) => {
        if (remote.length > 0) setPosts(remote);
      });
    }

    return newPost.id;
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
    deletePostFromSupabase(id);

    // Refresh from Supabase
    fetchPostsFromSupabase().then((remote) => {
      if (remote.length > 0) setPosts(remote);
    });
  }, []);

  const addComment = useCallback(async (postId: string, content: string, author: string) => {
    const comment: Comment = {
      id: uid(), postId, content, author,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, comment]);
    setPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
    ));

    await syncCommentToSupabase(comment);

    // Fetch fresh comments from Supabase to get real author names
    fetchCommentsFromSupabase(postId).then((remote) => {
      if (remote.length > 0) {
        setComments((prev) => {
          const others = prev.filter((c) => c.postId !== postId);
          return [...others, ...remote];
        });
      }
    });

    return comment.id;
  }, []);

  const toggleVote = useCallback((postId: string, type: "up" | "down") => {
    const current = votes[postId];
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      let { upvotes, downvotes } = p;
      if (current === type) {
        if (type === "up") upvotes--;
        else downvotes--;
        return { ...p, upvotes, downvotes };
      }
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

    syncVoteToSupabase(postId, type, current ?? null);
  }, [votes]);

  const getPostComments = useCallback((postId: string) =>
    comments.filter((c) => c.postId === postId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
  [comments]);

  return { posts, votes, addPost, deletePost, addComment, getPostComments, toggleVote, loaded };
}
