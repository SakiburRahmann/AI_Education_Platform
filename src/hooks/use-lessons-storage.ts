import { useState, useCallback, useEffect } from "react";

function uid(): string {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
}

export type LocalLesson = {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "eduai-lessons";

function load(): LocalLesson[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(lessons: LocalLesson[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  } catch (e) {
    console.warn("Failed to save lessons:", e);
  }
}

export function useLessonsStorage() {
  const [lessons, setLessons] = useState<LocalLesson[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLessons(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save(lessons);
  }, [lessons, loaded]);

  const addLesson = useCallback((title: string, subject: string, content: string) => {
    const lesson: LocalLesson = {
      id: uid(),
      title,
      subject,
      content,
      createdAt: new Date().toISOString(),
    };
    setLessons((prev) => [lesson, ...prev]);
    return lesson.id;
  }, []);

  const deleteLesson = useCallback((id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { lessons, addLesson, deleteLesson, loaded };
}
