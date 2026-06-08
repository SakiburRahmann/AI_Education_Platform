"use client";

import Link from "next/link";
import { useLessonsStorage } from "@/hooks/use-lessons-storage";
import { BookOpen, Trash2, MessageSquare } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function LessonsPage() {
  const { lessons, deleteLesson } = useLessonsStorage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Lessons</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive AI-generated lessons saved from chat
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20 text-center">
          <BookOpen className="mb-4 h-10 w-10 text-muted-foreground/40" />
          <h2 className="font-heading text-lg font-semibold mb-1">No lessons yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground mb-4">
            Ask Lubb to create a lesson in the chat, then save it here.
          </p>
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Go to Chat
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="group relative rounded-xl border bg-card hover:shadow-md transition-shadow">
              <Link href={`/dashboard/lessons/${lesson.id}`} className="block p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-ulu-al-albab-primary shrink-0" />
                  <span className="text-xs text-muted-foreground">{lesson.subject}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-2">{lesson.title}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(lesson.createdAt)}</p>
              </Link>
              <button
                onClick={() => deleteLesson(lesson.id)}
                className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                title="Delete lesson"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
