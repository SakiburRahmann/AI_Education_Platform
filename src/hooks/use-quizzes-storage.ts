import { useState, useCallback, useEffect } from "react";
import { syncQuizToSupabase, deleteQuizFromSupabase, fetchQuizzesFromSupabase } from "@/lib/sync/quizzes";

function uid(): string {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
}

export type LocalQuiz = {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "ulul-albab-quizzes";

function load(): LocalQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(quizzes: LocalQuiz[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.warn("Failed to save quizzes:", e);
  }
}

export function useQuizzesStorage() {
  const [quizzes, setQuizzes] = useState<LocalQuiz[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const local = load();
    setQuizzes(local);
    setLoaded(true);

    // Fetch from Supabase and merge
    fetchQuizzesFromSupabase().then((remote) => {
      if (remote.length > 0) {
        const localIds = new Set(local.map((q) => q.id));
        const merged = [...local];
        for (const r of remote) {
          if (!localIds.has(r.id)) {
            merged.push(r);
          }
        }
        setQuizzes(merged);
      }
    });
  }, []);

  useEffect(() => {
    if (loaded) save(quizzes);
  }, [quizzes, loaded]);

  const addQuiz = useCallback((title: string, subject: string, content: string) => {
    const quiz: LocalQuiz = {
      id: uid(),
      title,
      subject,
      content,
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [quiz, ...prev]);

    // Sync to Supabase in background
    syncQuizToSupabase(quiz);

    return quiz.id;
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));

    // Delete from Supabase in background
    deleteQuizFromSupabase(id);
  }, []);

  return { quizzes, addQuiz, deleteQuiz, loaded };
}
