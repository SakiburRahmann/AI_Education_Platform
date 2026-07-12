import { createClient } from "@/lib/supabase/client";

export interface SyncQuiz {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface FetchedQuiz {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
}

interface QuizRow {
  id: string;
  title: string;
  questions: { raw?: string; subject?: string } | string;
  created_at: string;
}

export async function syncQuizToSupabase(quiz: SyncQuiz): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from("quizzes").upsert({
      id: quiz.id,
      user_id: user.id,
      title: quiz.title,
      questions: { raw: quiz.content, subject: quiz.subject },
      created_at: quiz.createdAt,
    }, { onConflict: "id" });

    if (error) {
      console.error("Failed to sync quiz:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to sync quiz:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function deleteQuizFromSupabase(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete quiz:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to delete quiz:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

export async function fetchQuizzesFromSupabase(): Promise<FetchedQuiz[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, questions, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch quizzes:", error.message);
      return [];
    }

    return (data || []).map((q: QuizRow): FetchedQuiz => ({
      id: q.id,
      title: q.title,
      subject: typeof q.questions === "object" ? q.questions?.subject || "General" : "General",
      content: typeof q.questions === "object" ? q.questions?.raw || "" : typeof q.questions === "string" ? q.questions : "",
      createdAt: q.created_at,
    }));
  } catch (e) {
    console.error("Failed to fetch quizzes:", e instanceof Error ? e.message : String(e));
    return [];
  }
}
