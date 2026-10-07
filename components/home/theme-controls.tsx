"use client";

import { useHome } from "@/components/home/theme-provider";
import type { ThemeId } from "@/components/home/themes";

/** "Wear theme" on a project card. */
export function WearTheme({ theme }: { theme: ThemeId }) {
  const { theme: current, setTheme } = useHome();
  const wearing = current === theme;
  return (
    <button className={"try"} aria-pressed={wearing} onClick={() => setTheme(theme)}>
      {wearing ? "Wearing it ✓" : "Wear theme →"}
    </button>
  );
}

