"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStorage, type Message, type FileInfo } from "@/hooks/use-chat-storage";
import { InteractiveContent } from "@/components/interactive/renderer";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ThinkingBlock } from "@/components/ui/thinking-block";
import { useLessonsStorage } from "@/hooks/use-lessons-storage";
import { useQuizzesStorage } from "@/hooks/use-quizzes-storage";
import { useGamification } from "@/hooks/use-gamification";
import { XPFloat } from "@/components/gamification/xp-float";
import { toast } from "sonner";
import {
  Send,
  Paperclip,
  X,
  Loader2,
  Plus,
  Trash2,
  MessageSquare,
  FileText,
  Bot,
  User,
  BookOpen,
  HelpCircle,
} from "lucide-react";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function uid(): string {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FILE_ICONS: Record<string, string> = {
  pdf: "text-eduai-error",
  docx: "text-eduai-secondary",
  pptx: "text-eduai-accent",
  txt: "text-muted-foreground",
};

async function uploadFile(file: File): Promise<FileInfo> {
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("File too large (max 4MB)");
  }
  const formData = new FormData();
  formData.set("file", file);
  const res = await fetch("/api/files/process", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text ? text.slice(0, 200) : `Upload failed (${res.status})`);
  }
  const data = await res.json();

  return {
    id: uid(),
    name: data.name,
    type: data.type,
    size: data.size,
    text: data.text || "",
    pages: data.pages || 0,
    dataUrl: data.dataUrl,
    uploadedAt: new Date().toISOString(),
  };
}

export default function ChatPage() {
  const {
    conversations,
    activeConversation,
    activeId,
    createConversation,
    deleteConversation,
    setActiveId,
    addMessage,
  } = useChatStorage();
  const { addLesson } = useLessonsStorage();
  const { addQuiz } = useQuizzesStorage();
  const { awardXP, awardAchievement, lastXpEarned } = useGamification();

  const [sessionMode, setSessionMode] = useState("learn");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileInfo[]>([]);
  const pendingFilesRef = useRef(pendingFiles);
  useEffect(() => { pendingFilesRef.current = pendingFiles; }, [pendingFiles]);
  const [streamContent, setStreamContent] = useState("");
  const [streamReasoning, setStreamReasoning] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    if (isMobile) setSideOpen(false);
  }, [isMobile]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, streamContent]);

  useEffect(() => {
    if (!activeId && conversations.length === 0) {
      createConversation();
    } else if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations, createConversation, setActiveId]);

  const processAndAttachFile = useCallback(async (file: File) => {
    if (!activeId) {
      const id = createConversation();
      if (!id) return;
    }
    setUploading(true);
    try {
      const fileInfo = await uploadFile(file);
      setPendingFiles((prev) => [...prev, fileInfo]);
      toast.success(`Attached ${fileInfo.name}`);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }, [activeId, createConversation]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAndAttachFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [processAndAttachFile]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.files;
    if (!items || items.length === 0) return;

    e.preventDefault();
    const file = items[0];
    await processAndAttachFile(file);
  }, [processAndAttachFile]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    const currentPending = pendingFilesRef.current;
    if ((!text && currentPending.length === 0) || !activeId || streaming) return;

    setInput("");
    const filesToSend = currentPending;
    setPendingFiles([]);
    const conv = conversations.find((c) => c.id === activeId);

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: text,
      files: filesToSend.length > 0 ? filesToSend : undefined,
      createdAt: new Date().toISOString(),
    };
    addMessage(activeId, userMsg);

    setStreaming(true);
    setStreamContent("");
    setStreamReasoning("");

    try {
      const hasImages = filesToSend.some((f) => f.dataUrl);
      const context = hasImages ? undefined : filesToSend.map((f) => `--- ${f.name} ---\n${f.text}`).join("\n\n");
      const messagesForApi = [
        ...(conv?.messages || []).map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messagesForApi,
            context: context || undefined,
            files: hasImages ? filesToSend.filter((f) => f.dataUrl).map((f) => ({ name: f.name, dataUrl: f.dataUrl, type: f.type })) : undefined,
            sessionMode,
          }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Chat failed" }));
        throw new Error(err.error);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let fullReasoning = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            if (msg.t?.endsWith("-delta")) {
              if (msg.t === "text-delta") {
                fullContent += msg.c;
                setStreamContent(fullContent);
              } else if (msg.t === "reasoning-delta") {
                fullReasoning += msg.c;
                setStreamReasoning(fullReasoning);
              }
            } else if (msg.t === "error") {
              throw new Error(msg.c);
            }
          } catch {
            if (line.startsWith("{")) throw new Error("Parse error");
          }
        }
      }

      if (fullContent) {
        const assistantMsg: Message = {
          id: uid(),
          role: "assistant",
          content: fullContent,
          reasoning: fullReasoning || undefined,
          createdAt: new Date().toISOString(),
        };
        addMessage(activeId, assistantMsg);
        setStreamContent("");
        setStreamReasoning("");
        awardXP(15, "Chat interaction");
      }
    } catch (err: any) {
      console.error("Stream error:", err);
      toast.error("Chat failed — retrying with a different model");
      const errorMsg: Message = {
        id: uid(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      addMessage(activeId, errorMsg);
    } finally {
      setStreaming(false);
    }
  }, [input, activeId, conversations, streaming, sessionMode, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100dvh-6rem)] md:h-[calc(100dvh-5rem)] -mx-4 -mb-4 md:-mx-6 md:-mb-6">
      {/* Conversation sidebar — mobile overlay */}
      <div className="md:hidden">
        {sideOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/20"
            onClick={() => setSideOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 border-r bg-background transition-transform ${
            sideOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full w-64 flex-col">
            <div className="flex items-center justify-between border-b p-3">
              <span className="text-sm font-medium">Conversations</span>
              <button
                onClick={() => createConversation()}
                className="rounded-full p-1.5 hover:bg-muted transition-colors"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => { setActiveId(c.id); setSideOpen(false); }}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                    c.id === activeId
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate flex-1">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(c.id);
                    }}
                    className="hidden group-hover:block rounded p-0.5 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversation sidebar — desktop inline */}
      <div
        className={`hidden md:block border-r bg-muted/30 transition-all overflow-hidden shrink-0 ${
          sideOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="flex h-full w-64 flex-col">
          <div className="flex items-center justify-between border-b p-3">
            <span className="text-sm font-medium">Conversations</span>
            <button
              onClick={() => createConversation()}
              className="rounded-full p-1.5 hover:bg-muted transition-colors"
              title="New chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                  c.id === activeId
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate flex-1">{c.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(c.id);
                  }}
                  className="hidden group-hover:block rounded p-0.5 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toggle sidebar */}
        <div className="flex items-center gap-2 border-b px-4 py-2 ml-10 md:ml-0">
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          {activeConversation && (
            <>
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {sessionMode === "learn" ? "🎓 Learn" : sessionMode === "ask" ? "💬 Ask" : "✏️ Practice"}
              </span>
              <span className="text-sm font-medium truncate">{activeConversation.title}</span>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {activeConversation && activeConversation.messages.length === 0 && !streaming ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <Bot className="mb-4 h-12 w-12 text-primary/40" />
              <h2 className="font-heading text-xl font-bold mb-2">Chat with Nexo</h2>
              <p className="max-w-md text-sm text-muted-foreground mb-6">
                What are you looking for? Choose a session mode to get started.
              </p>

              <div className="flex flex-col gap-3 w-full max-w-sm">
                {[
                  { id: "learn", icon: "🎓", label: "Learn", desc: "Teach me a topic deeply — use examples, analogies, and check my understanding." },
                  { id: "ask", icon: "💬", label: "Ask", desc: "Just give me quick answers and facts without turning it into a lesson." },
                  { id: "practice", icon: "✏️", label: "Practice", desc: "Quiz me, give me exercises, or help me prepare for a test." },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSessionMode(m.id); setInput(m.id === "learn" ? "" : ""); }}
                    className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                      sessionMode === m.id
                        ? "border-eduai-primary bg-eduai-primary/5"
                        : "border-border hover:border-eduai-primary/30"
                    }`}
                  >
                    <span className="text-xl mt-0.5">{m.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { mode: "learn", text: "Explain quantum computing" },
                  { mode: "learn", text: "Teach me about photosynthesis" },
                  { mode: "practice", text: "Quiz me on World War II" },
                  { mode: "ask", text: "What is the capital of France?" },
                ].map((q) => (
                  <button
                    key={q.text}
                    onClick={() => {
                      setSessionMode(q.mode);
                      setInput(q.text);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 px-2 sm:px-4 py-3 sm:py-4">
              {activeConversation?.messages.map((msg) => (
                <div key={msg.id} className="flex gap-2 sm:gap-3">
                  <div
                    className={`shrink-0 rounded-full p-1.5 sm:p-2 ${
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium">
                        {msg.role === "assistant" ? "Nexo" : "You"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm leading-relaxed">
                      {msg.role === "user" && msg.files && msg.files.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {msg.files.map((f) => (
                            <div
                              key={f.id}
                              className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs ${
                                FILE_ICONS[f.type] || "text-muted-foreground"
                              }`}
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0" />
                              <span className="max-w-28 sm:max-w-40 truncate">{f.name}</span>
                              <span className="opacity-60 shrink-0">({formatSize(f.size)})</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.role === "assistant" && msg.reasoning && (
                        <ThinkingBlock content={msg.reasoning} />
                      )}
                      <InteractiveContent content={msg.content} />
                      {msg.role === "assistant" && !streaming && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              const title = msg.content.replace(/<<<[\s\S]*?>>>/g, "").slice(0, 60).trim() || "Untitled";
                              addLesson(title, "From Chat", msg.content);
                              awardAchievement("first_save");
                              toast.success("Saved as lesson");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] text-muted-foreground hover:text-eduai-primary hover:border-eduai-primary/30 transition-colors"
                          >
                            <BookOpen className="h-3 w-3" />
                            Save as Lesson
                          </button>
                          <button
                            onClick={() => {
                              const title = msg.content.replace(/<<<[\s\S]*?>>>/g, "").slice(0, 60).trim() || "Untitled";
                              addQuiz(title, "From Chat", msg.content);
                              awardAchievement("first_save");
                              toast.success("Saved as quiz");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] text-muted-foreground hover:text-eduai-accent hover:border-eduai-accent/30 transition-colors"
                          >
                            <HelpCircle className="h-3 w-3" />
                            Save as Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming assistant message */}
              {streaming && (
                <div className="flex gap-2 sm:gap-3">
                  <div className="shrink-0 rounded-full p-1.5 sm:p-2 bg-primary/10 text-primary">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium">Nexo</span>
                    </div>
                    <div className="mt-1 text-sm leading-relaxed">
                      {streamReasoning && (
                        <ThinkingBlock content={streamReasoning} isStreaming />
                      )}
                      {streamContent ? (
                        <>
                          <MarkdownRenderer content={streamContent} />
                          <span className="inline-block h-4 w-0.5 bg-primary ml-0.5 animate-pulse" />
                        </>
                      ) : (
                        <div className="flex items-center gap-1 py-2">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Pending files */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t px-2 sm:px-4 py-2">
            {pendingFiles.map((f) => {
              const fileColor = FILE_ICONS[f.type] || "text-muted-foreground";
              return (
                <div
                  key={f.id}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${fileColor}`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="max-w-32 truncate">{f.name}</span>
                  <span className="opacity-60">({formatSize(f.size)})</span>
                  <button
                    onClick={() => setPendingFiles((prev) => prev.filter((pf) => pf.id !== f.id))}
                    className="rounded p-0.5 hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Input area */}
        <div className="border-t p-2 sm:p-3">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <div className="relative flex flex-1 items-end gap-1 sm:gap-2 rounded-xl border bg-background px-2 sm:px-3 py-2 focus-within:ring-2 focus-within:ring-ring/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Ask Nexo anything... (paste files directly)"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                style={{ maxHeight: "200px" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
                }}
              />
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    disabled={uploading}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                    title="Attach file"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && pendingFiles.length === 0) || streaming}
                  className="rounded-lg bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Powered by Gemini 3 Flash Live (chat) &amp; Gemma 4 31B (file processing). Conversations stored locally.
          </p>
        </div>
      </div>
      {lastXpEarned && <XPFloat amount={lastXpEarned.amount} reason={lastXpEarned.reason} />}
    </div>
  );
}
