"use client";

import { daysBetween, londonDay } from "@/lib/daily";
import { useMemo, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";

/*
 * "Ship it": a daily axonometric pipe puzzle. Rotate the pipes until a commit
 * can flow from `push` (the back corner) to `prod` (the front corner). Each
 * day's board is seeded by the date in London, so everyone gets the same one.
 */

const N = 5; // tiles per side
const S = 52; // a tile's side, in board units
const GAP = 3; // inset of each tile's top face
const BASE = 8; // thickness of a tile
const TOWER = 20; // how much higher push and prod stand
const PAD = 6;
const CX = Math.cos(Math.PI / 6);
const SY = 0.5;
const SRC = 0;
const SINK = N * N - 1;
const FIRST_DAY = "2026-10-07"; // puzzle #1
// N, E, S, W: bit d of a mask is a pipe opening on that side
const STEP = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;
const DECOYS = [5, 5, 3, 3, 3, 7]; // straights, elbows and the odd tee

type Tile = { mask: number; r: number };
type Game = { tiles: Tile[]; moves: number };
type Puzzle = Game & { route: number[] };

const at = (u: number, v: number) => v * N + u;
const inside = (u: number, v: number) => u >= 0 && v >= 0 && u < N && v < N;
const openings = (t: Tile) => {
  const r = ((t.r % 4) + 4) % 4;
  return ((t.mask << r) | (t.mask >> (4 - r))) & 15;
};

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tiles joined to push, and how many steps each is from it. */
function flow(tiles: Tile[]) {
  const dist = new Map([[SRC, 0]]);
  const queue = [SRC];
  while (queue.length) {
    const i = queue.shift()!;
    const open = openings(tiles[i]);
    STEP.forEach(([du, dv], d) => {
      const u = (i % N) + du;
      const v = Math.floor(i / N) + dv;
      const j = at(u, v);
      if (!(open & (1 << d)) || !inside(u, v) || dist.has(j)) return;
      if (openings(tiles[j]) & (1 << ((d + 2) % 4))) {
        dist.set(j, dist.get(i)! + 1);
        queue.push(j);
      }
    });
  }
  return dist;
}

/** A winding route from push to prod among decoy pipes, every pipe turned at random. */
function generate(rand: () => number): Puzzle {
  const shuffled = (xs: number[]) => {
    for (let i = xs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  };
  const [min, max] = [2 * N + 1, 3 * N + 2]; // tiles on the route
  const walk = (path: number[]): number[] | null => {
    const i = path[path.length - 1];
    const [u, v] = [i % N, Math.floor(i / N)];
    if (i === SINK) return path.length >= min ? path : null;
    if (path.length + (N - 1 - u) + (N - 1 - v) > max) return null;
    for (const d of shuffled([0, 1, 2, 3])) {
      const [nu, nv] = [u + STEP[d][0], v + STEP[d][1]];
      if (!inside(nu, nv) || path.includes(at(nu, nv))) continue;
      const found = walk([...path, at(nu, nv)]);
      if (found) return found;
    }
    return null;
  };
  const route = walk([SRC])!;

  const tiles = Array.from({ length: N * N }, () => ({ mask: DECOYS[Math.floor(rand() * DECOYS.length)], r: 0 }));
  route.forEach((i, k) => {
    let mask = 0;
    for (const j of [route[k - 1], route[k + 1]]) {
      if (j === undefined) continue;
      mask |= 1 << STEP.findIndex(([du, dv]) => (j % N) - (i % N) === du && Math.floor(j / N) - Math.floor(i / N) === dv);
    }
    tiles[i].mask = mask;
  });
  // push and prod don't turn, so they open both ways: either neighbour can join them
  tiles[SRC].mask = 0b0110;
  tiles[SINK].mask = 0b1001;
  do {
    tiles.forEach((t, i) => (t.r = i === SRC || i === SINK ? 0 : Math.floor(rand() * 4)));
  } while (flow(tiles).has(SINK));
  return { tiles, route, moves: 0 };
}

const seedOf = (day: string) => Number(day.replaceAll("-", ""));
const dayBefore = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10);

/* Today's board, result and streak, kept in this browser only */
type Board = { day: string; turns: number[]; moves: number };
type Record = { day?: string; moves?: number; streak?: number; board?: Board };
const RECORD_KEY = "g-ship-it";
const listeners = new Set<() => void>();
let cached: string | undefined; // the last write, even if the browser wouldn't keep it
const record = {
  subscribe(fn: () => void) {
    // played in another tab: catch up
    const onStorage = (e: StorageEvent) => {
      if (e.key !== RECORD_KEY) return;
      cached = e.newValue ?? "";
      fn();
    };
    listeners.add(fn);
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  },
  read() {
    if (cached === undefined) {
      try {
        cached = localStorage.getItem(RECORD_KEY) ?? "";
      } catch {
        cached = "";
      }
    }
    return cached;
  },
  parse(raw: string): Record {
    try {
      return JSON.parse(raw) ?? {};
    } catch {
      return {};
    }
  },
  write(next: Record) {
    cached = JSON.stringify(next);
    try {
      localStorage.setItem(RECORD_KEY, cached);
    } catch {}
    listeners.forEach((fn) => fn());
  },
  play(board: Board) {
    record.write({ ...record.parse(record.read()), board });
  },
  solve(board: Board) {
    const last = record.parse(record.read());
    const streak = last.day === dayBefore(board.day) ? (last.streak ?? 0) + 1 : 1;
    record.write({ day: board.day, moves: board.moves, streak, board });
  },
};

// The day rolls over while a tab sits in the background: check again when it's back
const subscribeDay = (fn: () => void) => {
  document.addEventListener("visibilitychange", fn);
  return () => document.removeEventListener("visibilitychange", fn);
};

// board units to the screen: u runs down-right, v down-left, z up
const W = 2 * N * S * CX + 2 * PAD;
const H = N * S + BASE + TOWER + 2 * PAD;
const point = (u: number, v: number, z = 0) =>
  [W / 2 + (u - v) * S * CX, PAD + TOWER + (u + v) * S * SY - z] as const;
const poly = (pts: (readonly [number, number])[]) => pts.map((p) => p.join(",")).join(" ");

/**
 * `day` is the London date the page was rendered for (a cron re-renders it just
 * after midnight). If the browser's London date has moved on since, it wins.
 */
export default function ShipIt({ day }: { day: string }) {
  const today = useSyncExternalStore(subscribeDay, londonDay, () => day);
  return <Daily key={today} day={today} />;
}

function Daily({ day }: { day: string }) {
  const puzzle = useMemo(() => generate(mulberry32(seedOf(day))), [day]);
  const saved = record.parse(useSyncExternalStore(record.subscribe, record.read, () => ""));
  const streak = saved.day === day || saved.day === dayBefore(day) ? (saved.streak ?? 0) : 0;
  // today's board as it was left, so a reload carries on rather than starting afresh
  const board = saved.board?.day === day && saved.board.turns?.length === N * N ? saved.board : undefined;
  const play: Game = board
    ? { tiles: puzzle.tiles.map((t, i) => ({ ...t, r: Number(board.turns[i]) || 0 })), moves: board.moves || 0 }
    : puzzle;
  // solved today but the board wasn't kept (solved before boards were): show the solution
  const game =
    saved.day === day && !flow(play.tiles).has(SINK)
      ? { tiles: puzzle.tiles.map((t, i) => (puzzle.route.includes(i) ? { ...t, r: 0 } : t)), moves: saved.moves ?? 0 }
      : play;
  const dist = flow(game.tiles);
  const won = dist.has(SINK);
  const turned = game.tiles.some((t, i) => t.r !== puzzle.tiles[i].r);

  const turn = (i: number, by: 1 | -1) => {
    if (won || i === SRC || i === SINK) return;
    const tiles = game.tiles.map((t, j) => (j === i ? { ...t, r: t.r + by } : t));
    const next = { day, turns: tiles.map((t) => t.r), moves: game.moves + 1 };
    if (flow(tiles).has(SINK)) record.solve(next);
    else record.play(next);
  };
  // the pipes go back, but the moves still count
  const reset = () => record.play({ day, turns: puzzle.tiles.map((t) => t.r), moves: game.moves });
  const onKey = (i: number) => (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    turn(i, e.shiftKey ? -1 : 1);
  };
  const onContext = (i: number) => (e: MouseEvent) => {
    e.preventDefault(); // right-click turns the other way
    turn(i, -1);
  };

  // painter's order: back to front
  const order = game.tiles.map((_, i) => i).sort((a, b) => (a % N) + Math.floor(a / N) - ((b % N) + Math.floor(b / N)));

  return (
    <section className={"card c-game"} data-cat={"games"} aria-labelledby={"game-heading"}>
      <div className={"game-head"}>
        <div>
          <div className={"label"}>Daily · #{daysBetween(FIRST_DAY, day) + 1}</div>
          <h2 id={"game-heading"} className={"display"}>
            Ship it
          </h2>
        </div>
        <div className={"label game-stats"} aria-live={"polite"}>
          {won ? `Shipped in ${game.moves}` : `${game.moves} ${game.moves === 1 ? "move" : "moves"}`}
          {streak > 1 && ` · ${streak}-day streak`}
        </div>
      </div>

      <svg
        className={`board${won ? " won" : ""}`}
        viewBox={`0 0 ${W.toFixed(1)} ${H}`}
        role={"group"}
        aria-label={"Pipe puzzle: rotate the pipes to join push to prod"}
      >
        {order.map((i) => {
          const t = game.tiles[i];
          const [u, v] = [i % N, Math.floor(i / N)];
          const end = i === SRC || i === SINK;
          const h = end ? TOWER : 0;
          const g = GAP / S;
          const [tr, br, bl] = [point(u + 1 - g, v + g, h), point(u + 1 - g, v + 1 - g, h), point(u + g, v + 1 - g, h)];
          const down = ([x, y]: readonly [number, number]) => [x, y + h + BASE] as const;
          const [cx, cy] = point(u + 0.5, v + 0.5, h);
          // push's outlet, where it shows: a port in the tower's front faces
          const port = (d: number) => {
            const w = 0.13;
            const z = 11;
            const [a, b] = d === 1 ? [[u + 1 - g, v + 0.5 - w], [u + 1 - g, v + 0.5 + w]] : [[u + 0.5 - w, v + 1 - g], [u + 0.5 + w, v + 1 - g]];
            return poly([point(a[0], a[1], 0), point(b[0], b[1], 0), point(b[0], b[1], z), point(a[0], a[1], z)]);
          };
          return (
            <g
              key={i}
              className={`tile${end ? " end" : ""}${dist.has(i) ? " lit" : ""}`}
              style={{ "--d": `${(dist.get(i) ?? 0) * 50}ms` } as CSSProperties}
              {...(!end && {
                role: "button",
                tabIndex: 0,
                "aria-label": `Pipe ${u + 1}, ${v + 1}. Rotate.`,
                onClick: () => turn(i, 1),
                onContextMenu: onContext(i),
                onKeyDown: onKey(i),
              })}
            >
              <polygon className={"side r"} points={poly([tr, br, down(br), down(tr)])} />
              <polygon className={"side l"} points={poly([bl, br, down(br), down(bl)])} />
              <g transform={`matrix(${CX} ${SY} ${-CX} ${SY} ${cx} ${cy})`}>
                <rect className={"top"} x={-S / 2 + GAP} y={-S / 2 + GAP} width={S - 2 * GAP} height={S - 2 * GAP} rx={6} />
                {end ? (
                  <text className={"end-label"} textAnchor={"middle"} dominantBaseline={"central"}>
                    {i === SRC ? "push" : "prod"}
                  </text>
                ) : (
                  <g className={"pipe"} style={{ transform: `rotate(${t.r * 90}deg)` }}>
                    {/* spans the tile, so the pipe turns about the tile's centre */}
                    <rect x={-S / 2} y={-S / 2} width={S} height={S} fill={"none"} />
                    {STEP.map(([du, dv], d) =>
                      t.mask & (1 << d) ? <line key={d} x1={0} y1={0} x2={(du * S) / 2} y2={(dv * S) / 2} /> : null,
                    )}
                    <circle r={S * 0.1} />
                  </g>
                )}
              </g>
              {end &&
                [1, 2].filter((d) => t.mask & (1 << d)).map((d) => <polygon key={d} className={"port"} points={port(d)} />)}
            </g>
          );
        })}
      </svg>

      <div className={"game-foot"}>
        <p>
          {won ? "Shipped. A new board drops at midnight UK time." : "Turn the pipes to get a commit from push to prod."}
        </p>
        {!won && turned && (
          <button className={"game-btn"} onClick={reset}>
            Start over
          </button>
        )}
      </div>
    </section>
  );
}
