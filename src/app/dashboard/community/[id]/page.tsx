"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useCommunityStorage } from "@/hooks/use-community-storage";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, User, Send,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts, votes, getPostComments, addComment, toggleVote, deletePost } = useCommunityStorage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const post = posts.find((p) => p.id === id);
  const comments = getPostComments(id);
  const userId = user?.id || "";
  const username = user?.email?.split("@")[0] || "Anonymous";

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
        <MessageSquare className="mb-4 h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/40" />
        <h2 className="font-heading text-lg font-semibold mb-1">Post not found</h2>
        <p className="text-sm text-muted-foreground">This post may have been deleted.</p>
        <Link href="/dashboard/community" className="mt-4 text-sm text-ulul-albab-primary hover:underline">
          Back to community
        </Link>
      </div>
    );
  }

  const userVote = votes[post.id];
  const score = post.upvotes - post.downvotes;

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(id, commentText.trim(), username);
    setCommentText("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/community"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to community
      </Link>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex gap-3">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <button
              onClick={() => toggleVote(post.id, "up")}
              className={`flex items-center justify-center rounded p-2 transition-colors min-h-[44px] min-w-[44px] ${
                userVote === "up" ? "text-ulul-albab-primary" : "text-muted-foreground hover:text-ulul-albab-primary"
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
            </button>
            <span className={`text-sm font-bold ${
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
              <ThumbsDown className="h-5 w-5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-xl font-bold">{post.title}</h1>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author}
              </span>
              <span>{formatDate(post.createdAt)}</span>
              {post.authorId === userId && (
                <button
                  onClick={() => { deletePost(post.id); window.location.href = "/dashboard/community"; }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h2 className="font-heading text-sm font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </h2>
        <div className="space-y-3 mb-4">
          {comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-lg border bg-muted/20 px-3 py-2.5">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{c.author}</span>
                  <span>{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm">{c.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            onClick={handleComment}
            disabled={!commentText.trim()}
            className="flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px]"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
