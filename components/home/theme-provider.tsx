"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { DEFAULT_THEME, THEME_IDS, THEME_STORAGE_KEY, isThemeId, type ThemeId } from "@/components/home/themes";

export type Filter = "all" | "about" | "work" | "projects";

type HomeContext = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

const Context = createContext<HomeContext | null>(null);

export function useHome() {
  const value = useContext(Context);
  if (!value) throw new Error("useHome must be used inside <HomeProvider>");
  return value;
}

const storage = {
  get: () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set: (value: string) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {}
  },
};

/* The theme lives on <html data-theme>: React reads it from there, so the attribute
   (set before first paint by THEME_BOOT_SCRIPT) and the UI can never disagree. */
const listeners = new Set<() => void>();
const themeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get(): ThemeId {
    const value = document.documentElement.dataset.theme;
    return isThemeId(value) ? value : DEFAULT_THEME;
  },
  set(theme: ThemeId) {
    document.documentElement.dataset.theme = theme;
    listeners.forEach((listener) => listener());
  },
};

/**
 * Holds the home page's theme and section filter. Every home page style is scoped
 * to <html data-theme>, which is removed when leaving the page so the rest of the
 * site keeps its own look.
 */
export function HomeProvider({ children }: { children: ReactNode }) {
  // The server renders the default theme; hydration then adopts the one on <html>.
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => DEFAULT_THEME);
  const [filter, setFilter] = useState<Filter>("all");

  useLayoutEffect(() => {
    const root = document.documentElement;
    // arriving by client-side navigation, the boot script hasn't run
    if (!isThemeId(root.dataset.theme)) themeStore.set([storage.get()].find(isThemeId) ?? DEFAULT_THEME);
    return () => {
      delete root.dataset.theme;
    };
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    const apply = () => {
      // flushSync: the view transition snapshots the new state as soon as this returns
      flushSync(() => themeStore.set(next));
      storage.set(next);
    };
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  }, []);

  // 1-5 wear a theme
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
      const n = Number.parseInt(e.key, 10);
      if (n >= 1 && n <= THEME_IDS.length) setTheme(THEME_IDS[n - 1]);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setTheme]);

  const value = useMemo(() => ({ theme, setTheme, filter, setFilter }), [theme, setTheme, filter]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

/** The bento grid; the nav's filter fades the cards outside the chosen section. */
export function Bento({ children }: { children: ReactNode }) {
  const { filter } = useHome();
  return (
    <main className={"bento"} data-filter={filter}>
      {children}
    </main>
  );
}
