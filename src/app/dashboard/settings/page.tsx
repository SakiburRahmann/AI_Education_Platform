"use client";

import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { toast } from "sonner";
import {
  Trash2, Download, AlertTriangle, Info, Palette, Database, Shield,
} from "lucide-react";

export default function SettingsPage() {
  const [clearing, setClearing] = useState<string | null>(null);

  const clearStorage = (key: string, label: string) => {
    setClearing(key);
    setTimeout(() => {
      try {
        localStorage.removeItem(key);
        toast.success(`${label} cleared`);
      } catch {
        toast.error(`Failed to clear ${label}`);
      }
      setClearing(null);
    }, 300);
  };

  const exportData = () => {
    try {
      const data: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ulu-al-albab-")) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key) || "null");
          } catch {
            data[key] = localStorage.getItem(key);
          }
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ulu-al-albab-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported");
    } catch {
      toast.error("Failed to export data");
    }
  };

  const clearAll = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ulu-al-albab-")) keysToRemove.push(key);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      toast.success("All Ulu Al Albab data cleared. Page will reload.");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("Failed to clear data");
    }
  };

  const sections = [
    {
      title: "Appearance",
      icon: Palette,
      items: [
        {
          label: "Theme",
          description: "Choose your visual theme and color mode",
          content: <ThemeSwitcher />,
        },
      ],
    },
    {
      title: "Data Management",
      icon: Database,
      items: [
        {
          label: "Export Data",
          description: "Download all your Ulu Al Albab data as JSON",
          action: { label: "Export", onClick: exportData },
        },
        {
          label: "Clear Conversations",
          description: "Remove all chat conversations",
          action: { label: clearing === "ulu-al-albab-conversations" ? "Clearing..." : "Clear", onClick: () => clearStorage("ulu-al-albab-conversations", "Conversations"), danger: true },
        },
        {
          label: "Clear Lessons",
          description: "Remove all saved lessons",
          action: { label: clearing === "ulu-al-albab-lessons" ? "Clearing..." : "Clear", onClick: () => clearStorage("ulu-al-albab-lessons", "Lessons"), danger: true },
        },
        {
          label: "Clear Quizzes",
          description: "Remove all saved quizzes",
          action: { label: clearing === "ulu-al-albab-quizzes" ? "Clearing..." : "Clear", onClick: () => clearStorage("ulu-al-albab-quizzes", "Quizzes"), danger: true },
        },
        {
          label: "Clear Community Posts",
          description: "Remove all community posts and comments",
          action: { label: clearing === "ulu-al-albab-community-posts" ? "Clearing..." : "Clear", onClick: () => { clearStorage("ulu-al-albab-community-posts", "Posts"); clearStorage("ulu-al-albab-community-comments", "Comments"); clearStorage("ulu-al-albab-community-votes", "Votes"); }, danger: true },
        },
        {
          label: "Clear Gamification",
          description: "Reset XP, streak, and achievements",
          action: { label: clearing === "ulu-al-albab-gamification" ? "Clearing..." : "Reset", onClick: () => clearStorage("ulu-al-albab-gamification", "Gamification"), danger: true },
        },
        {
          label: "Clear All Data",
          description: "Remove ALL Ulu Al Albab data from this browser",
          action: { label: "Clear All", onClick: clearAll, danger: true },
        },
      ],
    },
    {
      title: "About",
      icon: Info,
      items: [
        {
          label: "Version",
          description: "Ulu Al Albab v1.0.0 — Powered by Lubb AI",
        },
        {
          label: "Data Storage",
          description: "All data is stored locally in your browser. Nothing is sent to external servers except AI API calls.",
        },
        {
          label: "Models",
          description: "Powered by Gemma 4 31B, Gemma 4 26B, and Gemini 3.1 Flash Lite via Google AI Studio.",
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your preferences and data
        </p>
      </div>

      {sections.map((section) => {
        const SectionIcon = section.icon;
        return (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <SectionIcon className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-heading text-sm font-semibold">{section.title}</h2>
            </div>
            <div className="rounded-xl border bg-card divide-y">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                  <div className="shrink-0 ml-3">
                    {"content" in item ? item.content : "action" in item ? (
                      <button
                        onClick={item.action.onClick}
                        disabled={clearing !== null}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          "danger" in item.action && item.action.danger
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
                            : "text-muted-foreground hover:bg-muted"
                        } disabled:opacity-50`}
                      >
                        {item.action.label}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-800 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Data Privacy Notice</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              All your data is stored in your browser's localStorage. Clearing your browser data will remove all Ulu Al Albab content. 
              Export your data before clearing if you want to keep it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
