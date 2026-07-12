import { useState, useCallback, useEffect } from "react";
import { syncQuizToSupabase, deleteQuizFromSupabase, fetchQuizzesFromSupabase } from "@/lib/sync/quizzes";
import { setSecurely, getSecurely } from "@/lib/crypto";

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

const STORAGE_KEY = "ulul-albab-quizzes-cache";

async function loadCache(): Promise<LocalQuiz[]> {
  if (typeof window === "undefined") return [];
  try {
    return await getSecurely<LocalQuiz[]>(STORAGE_KEY, []);
  } catch {
    return [];
  }
}

function saveCache(quizzes: LocalQuiz[]) {
  if (typeof window === "undefined") return;
  try {
    setSecurely(STORAGE_KEY, quizzes);
  } catch (e) {
    console.error("Failed to cache quizzes:", e instanceof Error ? e.message : String(e));
  }
}

export function useQuizzesStorage() {
  const [quizzes, setQuizzes] = useState<LocalQuiz[]>([]);
  const [loaded, setLoaded] = useState(false);

  // On mount: fetch from Supabase as PRIMARY, fall back to local cache
  useEffect(() => {
    fetchQuizzesFromSupabase().then((remote) => {
      if (remote.length > 0) {
        setQuizzes(remote);
        saveCache(remote);
      } else {
        loadCache().then((cached) => {
          if (cached.length > 0) setQuizzes(cached);
        });
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded && quizzes.length > 0) saveCache(quizzes);
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
    syncQuizToSupabase(quiz);
    return quiz.id;
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    deleteQuizFromSupabase(id);
  }, []);

  return { quizzes, addQuiz, deleteQuiz, loaded };
}
