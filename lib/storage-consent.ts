/*
 * The site sets no cookies. It does keep a few things in this browser's local
 * storage: the chosen theme and Ship it's board, result and streak. A visitor
 * can say no, which clears them and stops saving (the choice itself is kept,
 * so the notice doesn't come back).
 */

export type Consent = "yes" | "no";

const CONSENT_KEY = "g-storage";
const listeners = new Set<() => void>();

const isConsent = (value: unknown): value is Consent => value === "yes" || value === "no";

export const consent = {
  subscribe(fn: () => void) {
    // decided in another tab
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY || e.key === null) fn();
    };
    listeners.add(fn);
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  },
  /** The visitor's choice, or "" while they haven't made one. */
  get(): Consent | "" {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return isConsent(value) ? value : "";
    } catch {
      return "";
    }
  },
  set(choice: Consent | "") {
    try {
      if (choice === "no") localStorage.clear();
      if (choice) localStorage.setItem(CONSENT_KEY, choice);
      else localStorage.removeItem(CONSENT_KEY);
    } catch {}
    listeners.forEach((fn) => fn());
  },
};

/** Whether the site may save to local storage: yes until the visitor says no. */
export const mayStore = () => consent.get() !== "no";
