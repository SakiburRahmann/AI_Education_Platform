"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  syncPostToSupabase,
  syncCommentToSupabase,
  syncVoteToSupabase,
  deletePostFromSupabase,
  fetchPostsFromSupabase,
  fetchCommentsFromSupabase,
  type FetchedPost,
  type FetchedComment,
} from "@/lib/sync/community";
import { setSecurely, getSecurely } from "@/lib/crypto";

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

async function loadCache<T>(key: string, fallback: T): Promise<T> {
  if (typeof window === "undefined") return fallback;
  try {
    return await getSecurely<T>(key, fallback);
  } catch (e) {
    console.error("Failed to load cache:", e instanceof Error ? e.message : String(e));
    return fallback;
  }
}

function saveCache(key: string, data: unknown): void {
  if (typeof window === "undefined") return;
  setSecurely(key, data).catch((e) =>
    console.error("Failed to save cache:", e instanceof Error ? e.message : String(e))
  );
}

async function loadVotes(): Promise<VoteMap> {
  if (typeof window === "undefined") return {};
  try {
    return await getSecurely<VoteMap>(VOTES_KEY, {});
  } catch (e) {
    console.error("Failed to load votes:", e instanceof Error ? e.message : String(e));
    return {};
  }
}

function saveVotes(votes: VoteMap): void {
  if (typeof window === "undefined") return;
  setSecurely(VOTES_KEY, votes).catch((e) =>
    console.error("Failed to save votes:", e instanceof Error ? e.message : String(e))
  );
}

function mergePosts(existing: CommunityPost[], incoming: CommunityPost[]): CommunityPost[] {
  const map = new Map<string, CommunityPost>();
  for (const p of existing) map.set(p.id, p);
  for (const p of incoming) {
    const existing = map.get(p.id);
    if (existing) {
      map.set(p.id, {
        ...p,
        upvotes: Math.max(p.upvotes, existing.upvotes),
        downvotes: Math.max(p.downvotes, existing.downvotes),
        commentCount: Math.max(p.commentCount, existing.commentCount),
      });
    } else {
      map.set(p.id, p);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function useCommunityStorage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState<VoteMap>({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const mountedRef = useRef(true);

  // On mount: fetch from Supabase as PRIMARY source, fall back to local cache
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      const remotePosts = await fetchPostsFromSupabase();
      if (!mountedRef.current) return;
      if (remotePosts.length > 0) {
        setPosts(remotePosts);
        saveCache(POSTS_CACHE_KEY, remotePosts);
      } else {
        const cached = await loadCache<CommunityPost[]>(POSTS_CACHE_KEY, []);
        if (cached.length > 0) setPosts(cached);
      }
    })();

    (async () => {
      const cachedComments = await loadCache<Comment[]>(COMMENTS_CACHE_KEY, []);
      if (!mountedRef.current) return;
      if (cachedComments.length > 0) setComments(cachedComments);
    })();

    (async () => {
      const loadedVotes = await loadVotes();
      if (!mountedRef.current) return;
      setVotes(loadedVotes);
    })();

    setLoaded(true);
    setLoading(false);

    return () => { mountedRef.current = false; };
  }, []);

  // Cache to localStorage whenever data changes (debounced)
  useEffect(() => { if (loaded && posts.length > 0) saveCache(POSTS_CACHE_KEY, posts); }, [posts, loaded]);
  useEffect(() => { if (loaded && comments.length > 0) saveCache(COMMENTS_CACHE_KEY, comments); }, [comments, loaded]);
  useEffect(() => { if (loaded) saveVotes(votes); }, [votes, loaded]);

  const refreshPosts = useCallback(() => {
    fetchPostsFromSupabase().then((remote) => {
      if (!mountedRef.current) return;
      if (remote.length > 0) {
        setPosts((prev) => mergePosts(prev, remote));
      }
    });
  }, []);

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

    // Sync to Supabase
    const success = await syncPostToSupabase(newPost);
    if (success) {
      refreshPosts();
    }

    return newPost.id;
  }, [refreshPosts]);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setComments((prev) => prev.filter((c) => c.postId !== id));
    deletePostFromSupabase(id).then(() => refreshPosts());
  }, [refreshPosts]);

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

    fetchCommentsFromSupabase(postId).then((remote) => {
      if (!mountedRef.current) return;
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
        const rest = { ...prev };
        delete rest[postId];
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

  return { posts, votes, addPost, deletePost, addComment, getPostComments, toggleVote, loaded, loading };
}
