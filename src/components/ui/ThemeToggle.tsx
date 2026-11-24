"use client";

import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "rohobot-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme changes still apply when browser storage is unavailable.
  }
}

export function ThemeToggle() {
  const toggleTheme = () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      className="fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      <Moon data-theme-toggle-icon="moon" className="h-5 w-5" />
      <Sun data-theme-toggle-icon="sun" className="h-5 w-5" />
    </button>
  );
}
