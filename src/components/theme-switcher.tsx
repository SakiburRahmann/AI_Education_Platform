"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { Monitor, Sun, Moon, Cloud, Sword, Telescope, Candy } from "lucide-react";

const themes = [
  {
    id: "neutral",
    name: "Modern Normal",
    desc: "Professional & clean",
    icon: Monitor,
  },
  {
    id: "cozy",
    name: "Cozy",
    desc: "Warm cream & coral",
    icon: Sun,
  },
  {
    id: "sunshine",
    name: "Sunshine",
    desc: "Bright & playful",
    icon: Cloud,
  },
  {
    id: "darkquest",
    name: "Dark Quest",
    desc: "Dark RPG style",
    icon: Sword,
  },
  {
    id: "cosmic",
    name: "Cosmic",
    desc: "Deep space sci-fi",
    icon: Telescope,
  },
  {
    id: "candypastel",
    name: "Candy Pastel",
    desc: "Soft & dreamy",
    icon: Candy,
  },
];

export function ThemeSwitcher() {
  const [colorTheme, setColorTheme] = useState<string>("neutral");
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const saved = localStorage.getItem("ulu-al-albab-theme") || "neutral";
    setColorTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const switchTheme = useCallback((id: string) => {
    setColorTheme(id);
    setOpen(false);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("ulu-al-albab-theme", id);
  }, []);

  const toggleDark = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  const handleOpen = useCallback(() => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 280);
    }
    setOpen((prev) => !prev);
  }, [open]);

  const current = themes.find((t) => t.id === colorTheme) || themes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={toggleDark}
        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={isDark ? "Switch to light" : "Switch to dark"}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute right-0 z-50 w-44 max-h-60 overflow-y-auto rounded-xl border bg-popover p-1.5 shadow-lg ${
              dropUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => switchTheme(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    colorTheme === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-popover-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs opacity-70">{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
