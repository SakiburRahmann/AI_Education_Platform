import { createClient } from "@/lib/supabase/client";

export async function syncLessonToSupabase(lesson: {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("lessons").upsert({
      id: lesson.id,
      user_id: user.id,
      title: lesson.title,
      content: { raw: lesson.content, subject: lesson.subject },
      created_at: lesson.createdAt,
    }, { onConflict: "id" });
  } catch (e) {
    console.warn("Failed to sync lesson to Supabase:", e);
  }
}

export async function deleteLessonFromSupabase(id: string) {
  try {
    const supabase = createClient();
    await supabase.from("lessons").delete().eq("id", id);
  } catch (e) {
    console.warn("Failed to delete lesson from Supabase:", e);
  }
}

export async function fetchLessonsFromSupabase(): Promise<{
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("lessons")
      .select("id, title, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return (data || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      subject: l.content?.subject || "General",
      content: typeof l.content === "string" ? l.content : l.content?.raw || "",
      createdAt: l.created_at,
    }));
  } catch {
    return [];
  }
}
