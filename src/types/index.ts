export type GamificationLevel = {
  level: number;
  xpRequired: number;
  title: string;
};

export type League = {
  id: string;
  name: string;
  tier: number;
  min_xp: number;
  max_xp: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type UserProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
  streak_count: number;
  league_id: string | null;
  created_at: string;
};

export type FileRecord = {
  id: string;
  user_id: string;
  name: string;
  type: "pdf" | "docx" | "pptx" | "txt";
  size: number;
  status: "processing" | "ready" | "error";
  created_at: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Lesson = {
  id: string;
  user_id: string;
  file_id: string | null;
  title: string;
  content: LessonContent;
  created_at: string;
};

export type LessonContent = {
  concepts: { title: string; description: string; key_points: string[] }[];
  sections: { heading: string; body: string; examples?: string[] }[];
  summary: string;
  practice_exercises: { question: string; answer: string }[];
};

export type Quiz = {
  id: string;
  user_id: string;
  file_id: string | null;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  question: string;
  options?: string[];
  correct_answer: string;
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  completed_at: string;
};

export type CommunityPost = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
  author?: UserProfile;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: UserProfile;
};

export type AIModel =
  | "gemini-3-flash-live"
  | "gemma-4-31b"
  | "gemma-4-26b"
  | "gemini-3.1-flash-lite"
  | "gemini-embedding-2"
  | "gemini-2.5-flash-audio"
  | "search-grounding"
  | "deep-research-pro";

export type ModelAllocation = {
  model: AIModel;
  priority: number;
  rpm: number;
  tpm: number;
  rpd: number;
};

export type AITaskType =
  | "chat"
  | "lesson_generation"
  | "quiz_generation"
  | "embedding"
  | "quick_qa"
  | "deep_research"
  | "search_grounding";
