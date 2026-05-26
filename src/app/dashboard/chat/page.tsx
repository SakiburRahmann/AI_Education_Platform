"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChatStorage, type Message, type FileInfo } from "@/hooks/use-chat-storage";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ThinkingBlock } from "@/components/ui/thinking-block";
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
} from "lucide-react";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
    id: crypto.randomUUID(),
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

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileInfo[]>([]);
  const pendingFilesRef = useRef(pendingFiles);
  useEffect(() => { pendingFilesRef.current = pendingFiles; }, [pendingFiles]);
  const [streamContent, setStreamContent] = useState("");
  const [streamReasoning, setStreamReasoning] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
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
      id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
          role: "assistant",
          content: fullContent,
          reasoning: fullReasoning || undefined,
          createdAt: new Date().toISOString(),
        };
        addMessage(activeId, assistantMsg);
        setStreamContent("");
        setStreamReasoning("");
      }
    } catch (err: any) {
      console.error("Stream error:", err);
      toast.error("Chat failed — retrying with a different model");
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      addMessage(activeId, errorMsg);
    } finally {
      setStreaming(false);
    }
  }, [input, activeId, conversations, streaming, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex -mx-4 -mb-4 h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)]">
      {/* Conversation sidebar */}
      <div
        className={`${
          sideOpen ? "w-64" : "w-0"
        } border-r bg-muted/30 transition-all overflow-hidden shrink-0`}
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
        <div className="flex items-center gap-2 border-b px-4 py-2">
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          {activeConversation && (
            <span className="text-sm font-medium truncate">{activeConversation.title}</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {activeConversation && activeConversation.messages.length === 0 && !streaming ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <Bot className="mb-4 h-12 w-12 text-primary/40" />
              <h2 className="font-heading text-xl font-bold mb-2">Chat with Nexo</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Upload your study materials (PDF, DOCX, PPTX, TXT, images, and more) and ask questions,
                generate lessons, or create quizzes. You can also paste files directly.
                Everything is stored locally in your browser.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Explain quantum computing", "Create a lesson on photosynthesis", "Quiz me on World War II"].map(
                  (q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 px-4 py-4">
              {activeConversation?.messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div
                    className={`shrink-0 rounded-full p-2 ${
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
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
                              <span className="max-w-40 truncate">{f.name}</span>
                              <span className="opacity-60 shrink-0">({formatSize(f.size)})</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.role === "assistant" && msg.reasoning && (
                        <ThinkingBlock content={msg.reasoning} />
                      )}
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming assistant message */}
              {streaming && (
                <div className="flex gap-3">
                  <div className="shrink-0 rounded-full p-2 bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
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
          <div className="flex flex-wrap gap-2 border-t px-4 py-2">
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
        <div className="border-t p-3">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <div className="relative flex flex-1 items-end gap-2 rounded-xl border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/30">
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
                <button
                  onClick={() => fileInputRef.current?.click()}
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
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && pendingFiles.length === 0) || streaming}
                  className="rounded-lg bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Powered by Gemini 3 Flash Live (chat) &amp; Gemma 4 31B (file processing). Conversations stored locally.
          </p>
        </div>
      </div>
    </div>
  );
}
