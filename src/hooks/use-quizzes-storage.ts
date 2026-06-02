import { useState, useCallback, useEffect } from "react";

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

const STORAGE_KEY = "eduai-quizzes";

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
    setQuizzes(load());
    setLoaded(true);
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
    return quiz.id;
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return { quizzes, addQuiz, deleteQuiz, loaded };
}
