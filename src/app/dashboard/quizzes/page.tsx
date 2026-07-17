"use client";

import Link from "next/link";
import { useQuizzesStorage } from "@/hooks/use-quizzes-storage";
import { HelpCircle, Trash2, MessageSquare } from "lucide-react";
import { DashboardEntrance } from "@/components/animations/dashboard-entrance";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function QuizzesPage() {
  const { quizzes, deleteQuiz } = useQuizzesStorage();

  return (
    <DashboardEntrance>
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Quizzes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-generated quizzes to test your knowledge
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12 sm:py-20 text-center">
          <HelpCircle className="mb-4 h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/40" />
          <h2 className="font-heading text-base sm:text-lg font-semibold mb-1">No quizzes yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground mb-4">
            Ask Lubb to quiz you on any topic in the chat, then save it here.
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
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="group relative rounded-xl border bg-card hover:shadow-md transition-shadow">
              <Link href={`/dashboard/quizzes/${quiz.id}`} className="block p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-ulul-albab-accent shrink-0" />
                  <span className="text-xs text-muted-foreground">{quiz.subject}</span>
                </div>
                <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-2">{quiz.title}</h3>
                <p className="text-xs text-muted-foreground">{formatDate(quiz.createdAt)}</p>
              </Link>
              <button
                onClick={() => deleteQuiz(quiz.id)}
                className="absolute right-2 top-2 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                title="Delete quiz"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </DashboardEntrance>
  );
}
