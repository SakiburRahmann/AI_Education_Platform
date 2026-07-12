import { createClient } from "@/lib/supabase/client";

export interface SyncLesson {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface FetchedLesson {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

interface LessonRow {
  id: string;
  title: string;
  content: { raw?: string; subject?: string } | string;
  created_at: string;
}

export async function syncLessonToSupabase(lesson: SyncLesson): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from("lessons").upsert({
      id: lesson.id,
      user_id: user.id,
      title: lesson.title,
      content: { raw: lesson.content, subject: lesson.subject },
      created_at: lesson.createdAt,
    }, { onConflict: "id" });

    if (error) {
      console.error("Failed to sync lesson:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to sync lesson:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function deleteLessonFromSupabase(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete lesson:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to delete lesson:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function fetchLessonsFromSupabase(): Promise<FetchedLesson[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("lessons")
      .select("id, title, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch lessons:", error.message);
      return [];
    }

    return (data || []).map((l: LessonRow): FetchedLesson => ({
      id: l.id,
      title: l.title,
      subject: typeof l.content === "object" ? l.content?.subject || "General" : "General",
      content: typeof l.content === "object" ? l.content?.raw || "" : typeof l.content === "string" ? l.content : "",
      createdAt: l.created_at,
    }));
  } catch (e) {
    console.error("Failed to fetch lessons:", e instanceof Error ? e.message : String(e));
    return [];
  }
}
