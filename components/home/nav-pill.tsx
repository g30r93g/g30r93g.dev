"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { slideTo } from "@/components/home/slide-to";
import { useHome, type Filter } from "@/components/home/theme-provider";
import { THEME_IDS, THEMES } from "@/components/home/themes";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
];

/**
 * One pill, two contexts: the section filter, or (via the paintbrush tucked behind
 * its right edge) the theme list. Choosing a theme wears it and returns to the nav.
 */
export default function NavPill() {
  const { theme, setTheme, filter, setFilter } = useHome();
  const [themesOpen, setThemesOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const navPage = useRef<HTMLDivElement>(null);
  const themePage = useRef<HTMLDivElement>(null);
  const tuckBtn = useRef<HTMLButtonElement>(null);
  const fromWidth = useRef<number | null>(null);

  // the visible page's pressed button, whichever page that is
  const remeasure = useCallback(() => {
    const page = [navPage.current, themePage.current].find((p) => p && !p.hidden);
    slideTo(indicator.current, nav.current, page?.querySelector<HTMLElement>("[aria-pressed=true]") ?? null);
  }, []);

  const toggle = (open: boolean) => {
    fromWidth.current = nav.current?.getBoundingClientRect().width ?? null;
    setThemesOpen(open);
  };

  // Swap pages: animate the pill between the two widths and stagger the items in
  useLayoutEffect(() => {
    const el = nav.current;
    const from = fromWidth.current;
    fromWidth.current = null;
    if (!el || from === null) return;
    el.style.width = "auto";
    const to = el.getBoundingClientRect().width;
    el.style.width = `${from}px`;
    void el.offsetWidth; // commit the start width
    el.style.width = `${to}px`;
    const done = (e: TransitionEvent) => {
      if (e.propertyName !== "width") return;
      el.style.width = "";
      el.removeEventListener("transitionend", done);
    };
    el.addEventListener("transitionend", done);

    const page = themesOpen ? themePage.current : navPage.current;
    page?.classList.remove("enter");
    void page?.offsetWidth;
    page?.classList.add("enter");
    if (themesOpen) {
      (page?.querySelector<HTMLElement>("[aria-pressed=true]") ?? page?.querySelector("button"))?.focus({ preventScroll: true });
    }
    return () => el.removeEventListener("transitionend", done);
  }, [themesOpen]);

  useLayoutEffect(remeasure, [remeasure, themesOpen, filter, theme]);

  // Button widths change with the window and once web fonts arrive
  useEffect(() => {
    let live = true;
    document.fonts?.ready.then(() => live && remeasure());
    window.addEventListener("resize", remeasure);
    return () => {
      live = false;
      window.removeEventListener("resize", remeasure);
    };
  }, [remeasure]);

  // Escape closes the theme list
  useEffect(() => {
    if (!themesOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      toggle(false);
      tuckBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [themesOpen]);

  const onThemeKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const items = [...(themePage.current?.querySelectorAll<HTMLElement>("button") ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const step = e.key === "ArrowRight" ? 1 : -1;
    items[(i + step + items.length) % items.length]?.focus();
  };

  return (
    <div className={"chrome"}>
      <div className={"chrome-row"}>
        <nav className={"pill"} id={"filter"} aria-label={themesOpen ? "Theme" : "Filter"} ref={nav}>
          <span className={"indicator"} ref={indicator} />
          <div className={"page"} id={"navPage"} hidden={themesOpen} ref={navPage}>
            {FILTERS.map((f) => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <div
            className={"page"}
            id={"themePage"}
            role={"group"}
            aria-label={"Theme"}
            hidden={!themesOpen}
            ref={themePage}
            onKeyDown={onThemeKeys}
          >
            {THEME_IDS.map((id, i) => (
              <button
                key={id}
                className={"theme-btn"}
                aria-pressed={theme === id}
                aria-label={THEMES[id].name}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => {
                  if (id !== theme) setTheme(id);
                  toggle(false);
                  tuckBtn.current?.focus({ preventScroll: true });
                }}
              >
                {THEMES[id].icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={"ico"} src={THEMES[id].icon} alt={""} />
                ) : (
                  <span className={"ico foil"}>g</span>
                )}
                <span>{THEMES[id].name}</span>
              </button>
            ))}
          </div>
        </nav>
        {/* Theme picker: a tab tucked behind the pill's right edge */}
        <div className={`tuck${themesOpen ? " open" : ""}`}>
          <button
            className={"tuck-trigger"}
            ref={tuckBtn}
            aria-controls={"filter"}
            aria-expanded={themesOpen}
            aria-label={themesOpen ? "Close themes" : "Change theme"}
            title={"Change theme"}
            onClick={() => toggle(!themesOpen)}
          >
            {/* lucide: x */}
            <svg className={"glyph x"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"M18 6 6 18"} />
              <path d={"m6 6 12 12"} />
            </svg>
            {/* lucide: paintbrush */}
            <svg className={"glyph brush"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"m14.622 17.897-10.68-2.913"} />
              <path
                d={
                  "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"
                }
              />
              <path d={"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
