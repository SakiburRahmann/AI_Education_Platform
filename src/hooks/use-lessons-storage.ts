import { useState, useCallback, useEffect } from "react";
import { syncLessonToSupabase, deleteLessonFromSupabase, fetchLessonsFromSupabase } from "@/lib/sync/lessons";
import { setSecurely, getSecurely } from "@/lib/crypto";

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

const STORAGE_KEY = "ulul-albab-lessons-cache";

async function loadCache(): Promise<LocalLesson[]> {
  if (typeof window === "undefined") return [];
  try {
    return await getSecurely<LocalLesson[]>(STORAGE_KEY, []);
  } catch {
    return [];
  }
}

function saveCache(lessons: LocalLesson[]) {
  if (typeof window === "undefined") return;
  try {
    setSecurely(STORAGE_KEY, lessons);
  } catch (e) {
    console.error("Failed to cache lessons:", e instanceof Error ? e.message : String(e));
  }
}

export function useLessonsStorage() {
  const [lessons, setLessons] = useState<LocalLesson[]>([]);
  const [loaded, setLoaded] = useState(false);

  // On mount: fetch from Supabase as PRIMARY, fall back to local cache
  useEffect(() => {
    fetchLessonsFromSupabase().then((remote) => {
      if (remote.length > 0) {
        setLessons(remote);
        saveCache(remote);
      } else {
        loadCache().then((cached) => {
          if (cached.length > 0) setLessons(cached);
        });
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded && lessons.length > 0) saveCache(lessons);
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
    syncLessonToSupabase(lesson);
    return lesson.id;
  }, []);

  const deleteLesson = useCallback((id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    deleteLessonFromSupabase(id);
  }, []);

  return { lessons, addLesson, deleteLesson, loaded };
}
