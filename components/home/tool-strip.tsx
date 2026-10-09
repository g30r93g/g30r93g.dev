"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site/theme-provider";
import { DEFAULT_THEME, type ThemeId } from "@/components/home/themes";
import type { Tool, ToolStacks } from "@/lib/tools";

const SPEED = 28; // px per second
const HOLD = 2000; // ms to hold on load and after a theme change
const EDGE = 14; // the left fade of the strip's mask

const eyebrowFor = (theme: ThemeId) => (theme === "g30r93g" ? "Tools I reach for" : "Built with");
const countFor = (ids: string[]) => `${ids.length} tools`;
// sized per logo so each carries the same visual weight (scripts/size-tool-logos.mjs)
const imgStyle = ({ size }: Tool) => ({ width: `${size.w}px`, height: `${size.h}px`, translate: `${size.x}px ${size.y}px` });

/**
 * The logos behind the active theme. Server-rendered for the default theme (so the
 * stack is in the HTML), then driven by `createStrip`, which owns the track's DOM:
 * logos are keyed by tool, so tools shared between two stacks glide to their new
 * place while the others leave and arrive.
 */
export default function ToolStrip({ data }: { data: ToolStacks }) {
  const { theme } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<ReturnType<typeof createStrip>>(null);
  // the first render's markup is never re-rendered: after hydration the DOM is the strip's
  const [initial] = useState(() => data.stacks[DEFAULT_THEME]);

  useEffect(() => {
    strip.current = createStrip(root.current!, data);
    return () => strip.current?.destroy();
  }, [data]);

  useEffect(() => strip.current?.show(theme), [theme]);

  return (
    <div className={"card c-tools"} data-cat={"about"} ref={root}>
      <div className={"tools-label"}>
        <span className={"label"} data-eyebrow={""}>
          {eyebrowFor(DEFAULT_THEME)}
        </span>
        <b data-name={""}>
          <span>{countFor(initial)}</span>
        </b>
      </div>
      <div className={"tools-view"}>
        <ul className={"tools-track"} aria-label={"Tools"} suppressHydrationWarning>
          {initial.map((id) => (
            <li key={id} className={"tool"} data-id={id} title={data.tools[id].name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.tools[id].icon} alt={data.tools[id].name} style={imgStyle(data.tools[id])} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function createStrip(card: HTMLElement, data: ToolStacks) {
  const track = card.querySelector<HTMLElement>(".tools-track")!;
  const name = card.querySelector<HTMLElement>("[data-name]")!;
  const eyebrow = card.querySelector<HTMLElement>("[data-eyebrow]")!;
  const $$ = (sel: string) => [...track.querySelectorAll<HTMLElement>(sel)];
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  let count = "";
  let raf = 0;
  let hold = 0;
  let holdName = 0;
  let resize = 0;
  let currentEl: HTMLElement | null = null;
  let currentName = "";
  let lastIds: string[] = [];
  let shown: ThemeId | null = null;

  const node = (id: string) => {
    const tool = data.tools[id];
    const el = document.createElement("li");
    el.className = "tool";
    el.dataset.id = id;
    el.title = tool.name;
    const img = document.createElement("img");
    img.src = tool.icon;
    img.alt = tool.name;
    Object.assign(img.style, imgStyle(tool));
    el.append(img);
    return el;
  };

  // ticker: the old name slides up and out as the new one rises in
  function setName(text: string) {
    const current = name.querySelector("span:not(.out)");
    if (current?.textContent === text) return;
    name.querySelectorAll("span.out").forEach((el) => el.remove());
    if (current) {
      // with reduced motion there is no animation (so no animationend): just swap
      if (reducedMotion()) current.remove();
      else {
        current.className = "out";
        current.addEventListener("animationend", () => current.remove(), { once: true });
      }
    }
    const next = document.createElement("span");
    next.textContent = text;
    if (current) next.className = "in";
    name.append(next);
  }

  // hovering a logo names it (delegated, so clones and new logos need no listeners)
  const onOver = (e: MouseEvent) => {
    const tool = (e.target as HTMLElement).closest<HTMLElement>(".tool");
    if (tool) setName(data.tools[tool.dataset.id!].name);
  };
  const onOut = (e: MouseEvent) => {
    const from = (e.target as HTMLElement).closest(".tool");
    const to = (e.relatedTarget as HTMLElement | null)?.closest(".tool");
    if (from && from !== to && !to) setName(currentName || count);
  };
  track.addEventListener("mouseover", onOver);
  track.addEventListener("mouseout", onOut);

  function clearCurrent() {
    currentEl?.classList.remove("current");
    currentEl = null;
    currentName = "";
    setName(count);
  }
  function setCurrent(el: HTMLElement) {
    if (el === currentEl) return;
    currentEl?.classList.remove("current");
    currentEl = el;
    el.classList.add("current");
    currentName = data.tools[el.dataset.id!].name;
    if (!card.matches(":hover")) setName(currentName);
  }

  // While looping, highlight the logo nearest the left edge and show its name.
  // Reads the loop's offset from the animation clock, so no layout is forced per frame.
  function follow(slots: { el: HTMLElement; x: number; w: number }[], setW: number) {
    const anim = track.getAnimations().find((a) => (a as CSSAnimation).animationName === "tools-loop");
    const dur = (setW / SPEED) * 1000;
    const tick = () => {
      const t = anim ? Number(anim.currentTime) || 0 : 0;
      const tx = -((t % dur) / dur) * setW;
      const slot = slots.find((s) => s.x + tx + s.w / 2 >= EDGE + 4);
      if (slot) setCurrent(slot.el);
      raf = requestAnimationFrame(tick);
    };
    tick();
  }

  // Fix the label column at the widest text it will show for this stack (eyebrow,
  // count or any tool name), so swapping names never moves the logos.
  const measure = document.createElement("canvas").getContext("2d")!;
  function fitLabel(ids: string[]) {
    const label = name.parentElement!;
    label.style.width = "max-content";
    const eyebrowW = eyebrow.getBoundingClientRect().width;
    measure.font = getComputedStyle(name).font;
    const textW = Math.max(...[count, ...ids.map((id) => data.tools[id].name)].map((t) => measure.measureText(t).width));
    label.style.width = `${Math.ceil(Math.min(170, Math.max(eyebrowW, textW) + 2))}px`;
  }
  document.fonts?.ready.then(() => fitLabel(lastIds)); // re-measure once web fonts are in

  const overflows = () => track.scrollWidth > track.parentElement!.clientWidth;

  function stopLoop({ keepCurrent = false } = {}) {
    cancelAnimationFrame(raf);
    if (!keepCurrent) clearCurrent();
    track.classList.remove("loops");
    $$(".tool.clone").forEach((el) => el.remove());
  }

  // first beat of the hold: name the logo the loop will start from
  function preview() {
    if (!overflows()) return;
    const first = $$(".tool:not(.leaving)").find((el) => el.offsetLeft + el.offsetWidth / 2 >= EDGE + 4);
    if (first) setCurrent(first);
  }

  // an infinite loop, only if the logos don't fit
  function loop() {
    stopLoop({ keepCurrent: true }); // carry the previewed highlight straight into the loop
    const originals = $$(".tool:not(.leaving)");
    if (!originals.length || !overflows()) {
      clearCurrent();
      return;
    }
    originals.forEach((el) => {
      const clone = node(el.dataset.id!);
      clone.classList.add("clone");
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    });
    // one set = distance from the first logo to its first copy (includes the trailing gap)
    const setW = track.querySelector<HTMLElement>(".tool.clone")!.offsetLeft - originals[0].offsetLeft;
    track.style.setProperty("--set-w", `${setW}px`);
    track.style.setProperty("--loop-dur", `${setW / SPEED}s`);
    void track.offsetWidth;
    track.classList.add("loops");
    follow(
      $$(".tool").map((el) => ({ el, x: el.offsetLeft, w: el.offsetWidth })),
      setW,
    );
  }

  function show(theme: ThemeId) {
    if (theme === shown) return;
    shown = theme;
    const ids = data.stacks[theme] ?? [];
    eyebrow.textContent = eyebrowFor(theme);
    count = countFor(ids);
    setName(count);
    fitLabel(ids);
    lastIds = ids;
    // where each logo is on screen now, including how far the loop had scrolled
    const tx = new DOMMatrix(getComputedStyle(track).transform).m41 || 0;
    const before = new Map($$(".tool:not(.leaving):not(.clone)").map((el) => [el.dataset.id!, el.offsetLeft + tx]));
    stopLoop();
    // outgoing: pin where they were, then fade
    const next = new Set(ids);
    $$(".tool:not(.leaving)").forEach((el) => {
      if (next.has(el.dataset.id!)) return;
      el.style.left = `${before.get(el.dataset.id!)}px`;
      el.classList.add("leaving");
      el.setAttribute("aria-hidden", "true");
      setTimeout(() => el.remove(), 300);
    });
    // incoming and staying, in the new order
    let n = 0;
    ids.forEach((id) => {
      let el = track.querySelector<HTMLElement>(`.tool[data-id="${id}"]:not(.leaving)`);
      if (!el) {
        el = node(id);
        el.classList.add("entering");
        el.style.setProperty("--i", String(n++));
        const entering = el;
        el.addEventListener("animationend", () => entering.classList.remove("entering"), { once: true });
      }
      track.append(el);
    });
    // FLIP the ones that stayed
    ids.forEach((id) => {
      const el = track.querySelector<HTMLElement>(`.tool[data-id="${id}"]:not(.leaving)`);
      if (!el || !before.has(id)) return;
      const dx = before.get(id)! - el.offsetLeft;
      if (!dx) return;
      el.style.transition = "none";
      el.style.transform = `translateX(${dx}px)`;
      void el.offsetWidth;
      el.style.transition = "";
      el.style.transform = "";
    });
    // hold: the count for 1s, then the first logo's name for 1s, then loop
    clearTimeout(hold);
    clearTimeout(holdName);
    holdName = window.setTimeout(preview, HOLD / 2);
    hold = window.setTimeout(loop, HOLD);
  }

  const onResize = () => {
    clearTimeout(resize);
    resize = window.setTimeout(loop, 150);
  };
  window.addEventListener("resize", onResize);

  return {
    show,
    destroy() {
      clearTimeout(hold);
      clearTimeout(holdName);
      clearTimeout(resize);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      track.removeEventListener("mouseover", onOver);
      track.removeEventListener("mouseout", onOut);
      shown = null;
    },
  };
}
