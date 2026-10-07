"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { slideTo } from "@/components/home/slide-to";
import { THEME_IDS, THEMES } from "@/components/home/themes";
import { useSite, type Filter } from "@/components/site/theme-provider";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "games", label: "Games" },
];

type Crumb = { href: string; label: string };

/**
 * One pill for every page. On the home page it holds the section filter; on any
 * other page, a breadcrumb that starts at the section (Experience, Blog), with a
 * back tab tucked behind its left edge. The paintbrush behind its right edge swaps
 * it for the theme list. It lives in the layout, so it stays mounted between pages
 * and animates its width to fit whatever it holds next.
 *
 * `titles` maps each path to its crumb, e.g. "/experience/lumen-research" to the role.
 */
export default function SiteNav({ titles }: { titles: Record<string, string> }) {
  const { theme, setTheme, filter, setFilter } = useSite();
  const pathname = usePathname();
  const [themesOpen, setThemesOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const navPage = useRef<HTMLElement>(null);
  const themePage = useRef<HTMLDivElement>(null);
  const tuckBtn = useRef<HTMLButtonElement>(null);
  const settled = useRef<number | null>(null); // the pill's width when it last came to rest
  const wasOpen = useRef(false);

  const mode = pathname === "/" ? "filter" : "crumbs";
  const segments = pathname.split("/").filter(Boolean);
  const trail: Crumb[] = segments.map((segment, i) => {
    const href = `/${segments.slice(0, i + 1).join("/")}`;
    return { href, label: titles[href] ?? segment };
  });
  const up: Crumb = trail.at(-2) ?? { href: "/", label: "Home" };
  const contents = mode === "filter" ? "filter" : trail.map((c) => c.href).join(" ");

  // the visible page's current item, whichever page that is
  const remeasure = useCallback(() => {
    const page = [navPage.current, themePage.current].find((p) => p && !p.hidden);
    slideTo(indicator.current, nav.current, page?.querySelector<HTMLElement>("[aria-pressed=true], [aria-current]") ?? null);
  }, []);

  // A new page closes the theme list
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setThemesOpen(false);
  }

  // Whenever the contents change (theme list, filter or breadcrumb), animate the
  // pill from its last width to the new one and stagger the items in
  useLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    const from = settled.current;
    el.style.width = "auto";
    const to = el.getBoundingClientRect().width;
    settled.current = to;
    if (from === null) {
      el.style.width = "";
      return; // first paint: nothing to animate from
    }
    el.style.width = `${from}px`;
    void el.offsetWidth; // commit the start width
    el.style.width = `${to}px`;
    const done = (e: TransitionEvent) => {
      if (e.propertyName !== "width") return;
      el.style.width = "";
      el.removeEventListener("transitionend", done);
    };
    el.addEventListener("transitionend", done);
    if (Math.abs(from - to) < 1) el.style.width = "";

    const page = themesOpen ? themePage.current : navPage.current;
    page?.classList.remove("enter");
    void page?.offsetWidth;
    page?.classList.add("enter");
    if (themesOpen && !wasOpen.current) {
      (page?.querySelector<HTMLElement>("[aria-pressed=true]") ?? page?.querySelector("button"))?.focus({ preventScroll: true });
    }
    wasOpen.current = themesOpen;
    return () => el.removeEventListener("transitionend", done);
  }, [themesOpen, contents]);

  useLayoutEffect(remeasure, [remeasure, themesOpen, filter, theme, contents]);

  // Item widths change with the window and once web fonts arrive
  useEffect(() => {
    let live = true;
    const onResize = () => {
      remeasure();
      if (nav.current && !nav.current.style.width) settled.current = nav.current.getBoundingClientRect().width;
    };
    document.fonts?.ready.then(() => live && onResize());
    window.addEventListener("resize", onResize);
    return () => {
      live = false;
      window.removeEventListener("resize", onResize);
    };
  }, [remeasure]);

  // Escape closes the theme list
  useEffect(() => {
    if (!themesOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setThemesOpen(false);
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

  const onHome = mode === "filter";

  return (
    <div className={"chrome"} data-mode={mode}>
      <div className={"chrome-row"}>
        {/* Back: a tab tucked behind the pill's left edge, hidden on the home page */}
        <div className={"tuck back"} aria-hidden={onHome || undefined}>
          <Link
            className={"tuck-trigger"}
            href={up.href}
            transitionTypes={["nav-back"]}
            aria-label={`Back to ${up.label}`}
            title={`Back to ${up.label}`}
            tabIndex={onHome ? -1 : undefined}
          >
            {/* lucide: arrow-left */}
            <svg className={"glyph"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"m12 19-7-7 7-7"} />
              <path d={"M19 12H5"} />
            </svg>
          </Link>
        </div>
        <nav
          className={"pill"}
          id={"filter"}
          aria-label={themesOpen ? "Theme" : onHome ? "Filter" : "Breadcrumb"}
          ref={nav}
        >
          <span className={"indicator"} ref={indicator} />
          {onHome ? (
            <div className={"page"} id={"navPage"} hidden={themesOpen} ref={navPage as React.RefObject<HTMLDivElement>}>
              {FILTERS.map((f) => (
                <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          ) : (
            <ol className={"page crumbs"} id={"navPage"} hidden={themesOpen} ref={navPage as React.RefObject<HTMLOListElement>}>
              {trail.map((crumb, i) => {
                const current = i === trail.length - 1;
                return (
                  <li key={crumb.href}>
                    <Link
                      href={crumb.href}
                      aria-current={current ? "page" : undefined}
                      transitionTypes={current ? undefined : ["nav-back"]}
                    >
                      <span>{crumb.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
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
                  setThemesOpen(false);
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
            onClick={() => setThemesOpen(!themesOpen)}
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
