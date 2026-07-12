import { useState, useCallback, useEffect } from "react";
import { syncLessonToSupabase, deleteLessonFromSupabase, fetchLessonsFromSupabase } from "@/lib/sync/lessons";

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

const STORAGE_KEY = "ulul-albab-lessons";

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
    const local = load();
    setLessons(local);
    setLoaded(true);

    // Fetch from Supabase and merge (if authenticated)
    fetchLessonsFromSupabase().then((remote) => {
      if (remote.length > 0) {
        // Merge: prefer local for conflicts, add remote ones not in local
        const localIds = new Set(local.map((l) => l.id));
        const merged = [...local];
        for (const r of remote) {
          if (!localIds.has(r.id)) {
            merged.push(r);
          }
        }
        setLessons(merged);
      }
    });
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

    // Sync to Supabase in background
    syncLessonToSupabase(lesson);

    return lesson.id;
  }, []);

  const deleteLesson = useCallback((id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));

    // Delete from Supabase in background
    deleteLessonFromSupabase(id);
  }, []);

  return { lessons, addLesson, deleteLesson, loaded };
}
