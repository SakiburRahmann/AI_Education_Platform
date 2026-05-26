"use client";

import { useEffect, useState } from "react";
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("eduai-theme") || "neutral";
    const isDark = document.documentElement.classList.contains("dark");
    setColorTheme(saved);
    setDarkMode(isDark);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const switchTheme = (id: string) => {
    setColorTheme(id);
    setOpen(false);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("eduai-theme", id);
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const current = themes.find((t) => t.id === colorTheme) || themes[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={toggleDark}
        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title={darkMode ? "Switch to light" : "Switch to dark"}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 sm:left-auto top-full z-50 mt-1 w-44 max-h-80 overflow-y-auto rounded-xl border bg-popover p-1.5 shadow-lg">
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
