import { useState, useCallback, useEffect } from "react";

export type FileInfo = {
  id: string;
  name: string;
  type: string;
  size: number;
  text: string;
  pages: number;
  uploadedAt: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "eduai-conversations";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.warn("Failed to save conversations:", e);
  }
}

export function useChatStorage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadConversations();
    setConversations(saved);
    if (saved.length > 0) {
      setActiveId(saved[0].id);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveConversations(conversations);
    }
  }, [conversations, loaded]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const createConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      files: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  const addMessage = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                updatedAt: new Date().toISOString(),
                title:
                  c.messages.length === 0 && message.role === "user"
                    ? message.content.slice(0, 60) + (message.content.length > 60 ? "..." : "")
                    : c.title,
              }
            : c
        )
      );
    },
    []
  );

  const addFile = useCallback((conversationId: string, file: FileInfo) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, files: [...c.files, file], updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const removeFile = useCallback((conversationId: string, fileId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, files: c.files.filter((f) => f.id !== fileId), updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const clearConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    loaded,
    setActiveId,
    createConversation,
    deleteConversation,
    addMessage,
    addFile,
    removeFile,
    clearConversations,
  };
}
