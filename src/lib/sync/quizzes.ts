import { createClient } from "@/lib/supabase/client";

export async function syncQuizToSupabase(quiz: {
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

    await supabase.from("quizzes").upsert({
      id: quiz.id,
      user_id: user.id,
      title: quiz.title,
      questions: { raw: quiz.content, subject: quiz.subject },
      created_at: quiz.createdAt,
    }, { onConflict: "id" });
  } catch (e) {
    console.warn("Failed to sync quiz to Supabase:", e);
  }
}

export async function deleteQuizFromSupabase(id: string) {
  try {
    const supabase = createClient();
    await supabase.from("quizzes").delete().eq("id", id);
  } catch (e) {
    console.warn("Failed to delete quiz from Supabase:", e);
  }
}

export async function fetchQuizzesFromSupabase(): Promise<{
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
      .from("quizzes")
      .select("id, title, questions, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return (data || []).map((q: any) => ({
      id: q.id,
      title: q.title,
      subject: q.questions?.subject || "General",
      content: typeof q.questions === "string" ? q.questions : q.questions?.raw || "",
      createdAt: q.created_at,
    }));
  } catch {
    return [];
  }
}
