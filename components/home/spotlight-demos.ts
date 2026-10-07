import type { ThemeId } from "@/components/home/themes";

/**
 * The spotlight card's demo for each theme: a small, live piece of that project's
 * UI. Each demo renders into `root` and returns a cleanup function.
 */
type Demo = (root: HTMLElement) => () => void;

/** Portrait photo (9:16) for the ID card. Empty shows the placeholder. */
const PHOTO = "";

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode) => [...root.querySelectorAll<T>(sel)];

/** A font from a next/font CSS variable, for canvas text. */
const fontVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "monospace";

export const DEMOS: Record<ThemeId, Demo> = {
  /* g30r93g: portrait holographic ID card */
  g30r93g(root) {
    root.innerHTML = `
      <div class="holo-stage"><div class="holo">
        <span class="slot"></span>
        <div class="hdr"><b>g30r93g</b><span>IDENTITY</span></div>
        <div class="photo" ${PHOTO ? `style="background-image:url('${PHOTO}')" role="img" aria-label="Photo of George Nick Gorzynski"` : ""}>
          ${PHOTO ? "" : `<div class="ph-empty"><div><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><br/>PORTRAIT<br/>9 : 16</div></div>`}
          <div class="id-panel">
            <div class="nm">George Nick<br/>Gorzynski</div>
            <div class="fields">
              <span>ROLE</span><span>SOFTWARE ENGINEER</span>
              <span>ALIAS</span><span>g30r93g</span>
              <span>NO.</span><span>0001 · ’26</span>
            </div>
          </div>
        </div>
      </div></div>`;
    return () => {};
  },

  /* RaceDash: TimingTile + SpeedReadout over footage (apps/renderer/src/components/timing) */
  racedash(root) {
    const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
      const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = p(a0);
      const [x1, y1] = p(a1);
      return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };
    const dots = Array.from({ length: 25 }, (_, i) => (i === 12 ? '<i class="mid"></i>' : "<i></i>")).join("");
    root.innerHTML = `
      <div class="rd"></div>
      <div class="rd-tile">
        <div class="rd-row"><span class="rd-lbl">Lap<b data-lap>07</b><b style="margin-left:2px;color:#e8f3ff80">/ 12</b></span><span class="rd-lbl">Pos<b><i>0</i>4</b></span></div>
        <div class="rd-time" data-time>0:00.000</div>
        <div class="rd-stats">
          <div><span class="rd-lbl">Last</span><span>1:02.418</span></div>
          <div><span class="rd-lbl">Best</span><span style="color:#b89cff">1:01.977</span></div>
          <div><span class="rd-lbl">Delta</span><span data-delta>—</span></div>
        </div>
        <div class="rd-dots" data-dots>${dots}</div>
      </div>
      <div class="rd-speed">
        <svg viewBox="0 0 132 132">
          <path d="${arc(66, 66, 56, 150, 390)}" fill="none" stroke="#e8f3ff1f" stroke-width="5" stroke-linecap="round"/>
          <path data-arc d="" fill="none" stroke="#8cc8ff" stroke-width="5" stroke-linecap="round"/>
        </svg>
        <div class="v" data-speed>0</div><div class="u rd-lbl">km/h</div>
      </div>`;
    const LAP = 9000;
    const fmt = (ms: number) =>
      `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}.${String(Math.floor(ms % 1000)).padStart(3, "0")}`;
    const lapEl = $("[data-lap]", root);
    const timeEl = $("[data-time]", root);
    const deltaEl = $("[data-delta]", root);
    const speedEl = $("[data-speed]", root);
    const arcEl = $<SVGPathElement>("[data-arc]", root);
    const dotEls = $$("[data-dots] i:not(.mid)", root);
    let start = performance.now();
    let lap = 7;
    let raf = 0;
    const loop = (now: number) => {
      let el = now - start;
      if (el > LAP) {
        start = now;
        el = 0;
        lap = lap >= 12 ? 1 : lap + 1;
        lapEl.textContent = String(lap).padStart(2, "0");
      }
      timeEl.textContent = fmt(52000 + el * 1.1);
      const d = Math.sin(el / 1100 + lap) * 0.4; // seconds vs best
      deltaEl.textContent = (d < 0 ? "−" : "+") + Math.abs(d).toFixed(3);
      deltaEl.style.color = d < 0 ? "#7fe3b0" : "#e88a8a";
      const n = Math.min(12, Math.round(Math.abs(d) * 30));
      dotEls.forEach((dot, i) => {
        // 0..11 left (faster), 12..23 right (slower)
        const lit = d < 0 ? i < 12 && i >= 12 - n : i >= 12 && i < 12 + n;
        dot.style.opacity = lit ? "1" : ".15";
        dot.style.background = lit ? (d < 0 ? "#7fe3b0" : "#e88a8a") : "#e8f3ff";
      });
      const spd = 96 + Math.sin(el / 700) * 34 + Math.sin(el / 230) * 4;
      speedEl.textContent = String(Math.round(spd));
      arcEl.setAttribute("d", arc(66, 66, 56, 150, 150 + 240 * Math.min(1, spd / 180)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },

  /* The ID Game: "called out" card */
  idgame(root) {
    const Q = [
      "Who’s most likely to ship to prod on a Friday?",
      "Who’s most likely to lose their phone?",
      "Who’s most likely to cry at a film?",
      "Who’s most likely to be late?",
    ];
    const P = ["GG", "AL", "SK", "MJ", "RT"];
    let qi = 0;
    let roll = 0;
    root.innerHTML = `
      <div class="idg"><div class="idg-card" role="button" tabindex="0" aria-label="Pick someone">
        <div class="idg-stamp">CALLED OUT!</div>
        <div class="idg-eyebrow">ROUND 3 · TAP TO PICK</div>
        <div class="idg-q" data-q>${Q[0]}</div>
        <div class="idg-who">${P.map((p) => `<span>${p}</span>`).join("")}</div>
      </div></div>`;
    const card = $(".idg-card", root);
    const pick = () => {
      const spans = $$(".idg-who span", root);
      if (card.classList.contains("out")) {
        card.classList.remove("out");
        spans.forEach((s) => s.classList.remove("picked"));
        qi = (qi + 1) % Q.length;
        $("[data-q]", root).textContent = Q[qi];
        return;
      }
      clearInterval(roll);
      let i = 0;
      roll = window.setInterval(() => {
        spans.forEach((s) => s.classList.remove("picked"));
        spans[i % spans.length].classList.add("picked");
        i++;
        if (i > 9 + ((Math.random() * 5) | 0)) {
          clearInterval(roll);
          card.classList.add("out");
        }
      }, 90);
    };
    card.addEventListener("click", pick);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pick();
      }
    });
    return () => clearInterval(roll);
  },

  /* Mixcut: waveform + tracklist (components/track-waveform.tsx, tracklist-editor.tsx) */
  mixcut(root) {
    const TOTAL = 3734; // 62:14
    const names = [
      ["Intro", "Unknown Artist"],
      ["Leftfield Bounce", "Kestrel"],
      ["Night Bus Home", "Mildmay"],
      ["Northern Line Dub", "Liberty"],
      ["Last Orders", "Weaver"],
      ["Encore", "Suffragette"],
    ];
    const cues = [0, 0.19, 0.41, 0.66];
    root.innerHTML = `
      <div class="mx">
        <div class="mx-head"><span class="lbl">TRACKLIST</span><span class="clock" data-clock>0:00 / 62:14</span></div>
        <div class="mx-wave"><canvas></canvas><div class="mx-ph"></div></div>
        <div class="mx-list"></div>
      </div>`;
    const wave = $(".mx-wave", root);
    const canvas = $<HTMLCanvasElement>("canvas", wave);
    const playhead = $(".mx-ph", root);
    const list = $(".mx-list", root);
    const clock = $("[data-clock]", root);
    const font = `10px ${fontVar("--font-jetbrains-mono")}`;
    const mss = (f: number) => {
      const s = Math.round(f * TOTAL);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    };
    let bars: number[] = [];
    const build = () => {
      // barWidth 2, barGap 1, normalised
      const n = Math.floor(wave.clientWidth / 3);
      bars = Array.from({ length: n }, (_, i) => {
        const f = i / n;
        const seg = cues.filter((c) => c <= f).length;
        const nearCue = cues.some((c) => c > 0 && Math.abs(c - f) < 0.008);
        return nearCue
          ? 0.06
          : 0.25 + 0.7 * Math.abs(Math.sin(i * 0.41 + seg)) * (0.55 + 0.45 * Math.abs(Math.sin(i * 0.043 + seg * 1.7)));
      });
    };
    const draw = (p: number) => {
      const dpr = devicePixelRatio || 1;
      const w = wave.clientWidth;
      const h = wave.clientHeight - 14;
      canvas.width = w * dpr;
      canvas.height = (h + 14) * dpr;
      const x = canvas.getContext("2d")!;
      x.scale(dpr, dpr);
      bars.forEach((b, i) => {
        x.fillStyle = i / bars.length < p ? "rgba(120,160,255,0.7)" : "rgba(120,160,255,0.4)";
        const bh = Math.max(2, b * h);
        x.beginPath();
        x.roundRect(i * 3, (h - bh) / 2, 2, bh, 1);
        x.fill();
      });
      x.fillStyle = "rgba(255,255,255,0.2)";
      x.font = font;
      for (let m = 0; m <= 60; m += 15) x.fillText(`${m}:00`, ((m * 60) / TOTAL) * w + 2, h + 12);
    };
    const renderCues = () => {
      $$(".mx-cue", wave).forEach((n) => n.remove());
      cues.forEach((c) => {
        if (!c) return;
        const d = document.createElement("div");
        d.className = "mx-cue";
        d.style.left = `${c * 100}%`;
        wave.append(d);
      });
    };
    const renderList = (p: number) => {
      const sorted = [...cues].sort((a, b) => a - b);
      list.innerHTML = sorted
        .slice(0, 6)
        .map((c, i) => {
          const end = sorted[i + 1] ?? 1;
          const on = p >= c && p < end;
          const [t, a] = names[i] ?? [`Track ${i + 1}`, "Artist"];
          return `<div class="mx-tr ${on ? "on" : ""}"><span class="no">${String(i + 1).padStart(2, "0")}</span><span><div class="t">${t}</div><div class="a">${a}</div></span><span class="tm">${mss(c)}<small>${mss(end - c)}</small></span></div>`;
        })
        .join("");
      const on = list.querySelector<HTMLElement>(".mx-tr.on"); // keep the playing track in view
      if (on) list.scrollTop = Math.max(0, on.offsetTop - list.clientHeight / 2 + on.offsetHeight / 2);
    };
    wave.addEventListener("click", (e) => {
      const r = wave.getBoundingClientRect();
      cues.push((e.clientX - r.left) / r.width);
      cues.sort((a, b) => a - b);
      build();
      renderCues();
    });
    build();
    renderCues();
    let p = 0.05;
    let raf = 0;
    let lastT = 0;
    const loop = (t: number) => {
      p = (p + 0.0008) % 1;
      playhead.style.left = `${p * 100}%`;
      if (t - lastT > 150) {
        draw(p);
        renderList(p);
        clock.textContent = `${mss(p)} / 62:14`;
        lastT = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },

  /* TfL Planner: route detail spine (Views/SwiftUI/RouteDetailView.swift) */
  tfl(root) {
    const JUB = "#838d93";
    const VIC = "#00a0e2";
    root.innerHTML = `
      <div class="tfl">
        <div class="tfl-head">
          <div>
            <h4>Arrives first</h4>
            <p>Arrive by 09:41</p>
            <div class="tfl-badges"><span class="tfl-badge" style="background:${JUB}">JUB</span>›<span class="tfl-badge" style="background:${VIC}">VIC</span></div>
          </div>
          <div class="tfl-pill">17<small>min</small></div>
        </div>
        <div class="tfl-route">
          <div class="stop" style="--c:${JUB};--h:22px"><span class="sp"></span><span class="mk board"></span><span class="nm">Waterloo</span><span class="t">09:24</span></div>
          <div class="stop minor" style="--c:${JUB}"><span class="sp"></span><span class="mk tick"></span><span class="nm">Westminster</span><span></span></div>
          <div class="stop end" style="--c:${JUB};--h:22px"><span class="sp"></span><span class="mk alight"></span><span class="nm">Green Park</span><span class="t">09:28</span></div>
          <div class="walk">Change to the Victoria line · 3 min</div>
          <div class="stop" style="--c:${VIC};--h:22px"><span class="sp"></span><span class="mk board"></span><span class="nm">Green Park</span><span class="t">09:31</span></div>
          <div class="stop minor" style="--c:${VIC}"><span class="sp"></span><span class="mk tick"></span><span class="nm">Oxford Circus</span><span></span></div>
          <div class="stop minor" style="--c:${VIC}"><span class="sp"></span><span class="mk tick"></span><span class="nm">Warren Street</span><span></span></div>
          <div class="stop minor" style="--c:${VIC}"><span class="sp"></span><span class="mk tick"></span><span class="nm">Euston</span><span></span></div>
          <div class="stop end" style="--c:${VIC};--h:22px"><span class="sp"></span><span class="mk alight"></span><span class="nm">King's Cross St. Pancras</span><span class="t">09:41</span></div>
          <span class="tfl-you"></span>
        </div>
      </div>`;
    const you = $(".tfl-you", root);
    const stops = $$(".stop", root);
    let i = 0;
    const step = () => {
      const s = stops[i % stops.length];
      you.style.top = `${s.offsetTop + s.offsetHeight / 2 - 10}px`;
      i++;
    };
    step();
    const iv = window.setInterval(step, 1500);
    return () => clearInterval(iv);
  },
};
