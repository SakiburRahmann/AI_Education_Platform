"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuizzesStorage } from "@/hooks/use-quizzes-storage";
import { useGamification } from "@/hooks/use-gamification";
import { InteractiveContent } from "@/components/interactive/renderer";
import { XPFloat } from "@/components/gamification/xp-float";
import {
  ArrowLeft, HelpCircle, Trash2, CheckCircle2, RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { quizzes, deleteQuiz } = useQuizzesStorage();
  const { awardXP, awardAchievement, lastXpEarned } = useGamification();
  const router = useRouter();
  const xpAwarded = useRef(false);

  const quiz = quizzes.find((q) => q.id === id);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed && !xpAwarded.current) {
      xpAwarded.current = true;
      awardXP(50, "Completed a quiz");
      awardAchievement("first_quiz");
    }
  }, [completed, awardXP, awardAchievement]);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
        <HelpCircle className="mb-4 h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/40" />
        <h2 className="font-heading text-lg font-semibold mb-1">Quiz not found</h2>
        <p className="text-sm text-muted-foreground">This quiz may have been deleted.</p>
        <Link
          href="/dashboard/quizzes"
          className="mt-4 text-sm text-ulul-albab-primary hover:underline"
        >
          Back to quizzes
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteQuiz(id);
    router.push("/dashboard/quizzes");
  };

  const handleRestart = () => {
    setStarted(false);
    setCompleted(false);
    xpAwarded.current = false;
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/dashboard/quizzes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quizzes
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12 sm:py-20 text-center">
          <HelpCircle className="mb-4 h-10 w-10 sm:h-12 sm:w-12 text-ulul-albab-accent" />
          <h1 className="font-heading text-xl sm:text-2xl font-bold mb-1">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground mb-1">{quiz.subject}</p>
          <p className="text-xs text-muted-foreground mb-6">
            {new Date(quiz.createdAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
          <button
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/quizzes"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quizzes
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-heading text-xl font-bold">{quiz.title}</h1>
        <p className="text-xs text-muted-foreground mt-1">{quiz.subject}</p>
      </div>

      {completed && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/10 p-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-green-600 mb-2" />
          <p className="font-semibold text-sm text-green-700 dark:text-green-400">Quiz completed!</p>
          <p className="text-xs text-green-600/70 mt-1">Review your answers above. Great job!</p>
        </div>
      )}

      <div className="space-y-4">
        <InteractiveContent content={quiz.content} />
      </div>

      {!completed && (
        <div className="text-center">
          <button
            onClick={() => setCompleted(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Complete
          </button>
        </div>
      )}

      {lastXpEarned && <XPFloat amount={lastXpEarned.amount} reason={lastXpEarned.reason} />}
    </div>
  );
}
