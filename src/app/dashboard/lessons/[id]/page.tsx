"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { useLessonsStorage } from "@/hooks/use-lessons-storage";
import { useGamification } from "@/hooks/use-gamification";
import { InteractiveContent } from "@/components/interactive/renderer";
import { XPFloat } from "@/components/gamification/xp-float";
import { ArrowLeft, BookOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lessons, deleteLesson } = useLessonsStorage();
  const { awardXP, awardAchievement, lastXpEarned } = useGamification();
  const router = useRouter();
  const awarded = useRef(false);

  useEffect(() => {
    if (awarded.current) return;
    awarded.current = true;
    awardXP(30, "Viewed a lesson");
    awardAchievement("first_lesson");
  }, [awardXP, awardAchievement]);

  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h2 className="font-heading text-lg font-semibold mb-1">Lesson not found</h2>
        <p className="text-sm text-muted-foreground">This lesson may have been deleted.</p>
        <Link
          href="/dashboard/lessons"
          className="mt-4 text-sm text-ulul-albab-primary hover:underline"
        >
          Back to lessons
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteLesson(id);
    router.push("/dashboard/lessons");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/lessons"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lessons
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-ulul-albab-primary" />
          <span className="text-xs text-muted-foreground">{lesson.subject}</span>
        </div>
        <h1 className="font-heading text-2xl font-bold">{lesson.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(lesson.createdAt).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </p>
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <InteractiveContent content={lesson.content} />
      </div>

      {lastXpEarned && <XPFloat amount={lastXpEarned.amount} reason={lastXpEarned.reason} />}
    </div>
  );
}
