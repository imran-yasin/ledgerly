"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button type="button" className="icon-button" aria-label="Toggle color theme">
        <span className="size-[17px]" />
      </button>
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="icon-button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle color theme"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
