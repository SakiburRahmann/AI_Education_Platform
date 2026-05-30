"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCommunityStorage } from "@/hooks/use-community-storage";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare, ThumbsUp, ThumbsDown, Plus, X, User,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  const { posts, votes, addPost, deletePost, toggleVote } = useCommunityStorage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const username = user?.email?.split("@")[0] || "Anonymous";

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    addPost(title.trim(), content.trim(), username);
    setTitle("");
    setContent("");
    setShowForm(false);
  };

  const sortedPosts = [...posts].sort(
    (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discuss topics, share resources, and help each other learn
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, questions, or resources..."
            rows={4}
            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="rounded-lg bg-primary px-4 py-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {sortedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
          <MessageSquare className="mb-4 h-10 w-10 text-muted-foreground/40" />
          <h2 className="font-heading text-lg font-semibold mb-1">No posts yet</h2>
          <p className="text-sm text-muted-foreground">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPosts.map((post) => {
            const userVote = votes[post.id];
            const score = post.upvotes - post.downvotes;
            return (
              <div key={post.id} className="rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="flex gap-3 p-4">
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <button
                      onClick={() => toggleVote(post.id, "up")}
                      className={`flex items-center justify-center rounded p-2 transition-colors min-h-[44px] min-w-[44px] ${
                        userVote === "up" ? "text-eduai-primary" : "text-muted-foreground hover:text-eduai-primary"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <span className={`text-xs font-bold ${
                      score > 0 ? "text-green-600" : score < 0 ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {score}
                    </span>
                    <button
                      onClick={() => toggleVote(post.id, "down")}
                      className={`flex items-center justify-center rounded p-2 transition-colors min-h-[44px] min-w-[44px] ${
                        userVote === "down" ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/community/${post.id}`} className="hover:underline">
                      <h3 className="font-heading font-semibold text-sm">{post.title}</h3>
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span>{timeAgo(post.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.commentCount}
                      </span>
                      {post.author === username && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
