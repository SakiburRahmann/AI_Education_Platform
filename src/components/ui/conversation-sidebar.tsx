"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";

export type SidebarConversation = {
  id: string;
  title: string;
};

type ConversationSidebarProps = {
  conversations: SidebarConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  className?: string;
};

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  className = "",
}: ConversationSidebarProps) {
  return (
    <div className={`flex h-full w-64 flex-col ${className}`}>
      <div className="flex items-center justify-between border-b p-3">
        <span className="text-sm font-medium">Conversations</span>
        <button
          onClick={onCreate}
          className="rounded-full p-1.5 hover:bg-muted transition-colors"
          title="New chat"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">
            No conversations yet
          </p>
        ) : (
          conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
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
                  onDelete(c.id);
                }}
                className="hidden group-hover:block rounded p-0.5 hover:text-destructive"
                aria-label={`Delete conversation ${c.title}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
