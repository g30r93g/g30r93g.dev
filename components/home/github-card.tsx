"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { slideTo } from "@/components/home/slide-to";
import type { ContributionDay, GithubProfile } from "@/lib/contributions";

type Kind = "all" | "personal" | "work";
const KINDS: { id: Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "personal", label: "Personal" },
  { id: "work", label: "Work" },
];
const USER = "g30r93g";
// fixed locale, so the server's numbers match the browser's when hydrating
const fmt = (n: number) => n.toLocaleString("en-GB");
const value = (d: ContributionDay, k: Kind) => (k === "all" ? d.personal + d.work : d[k]);

async function fetchProfile(): Promise<GithubProfile> {
  const signal = AbortSignal.timeout(5000);
  const ok = (r: Response) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub ${r.status}`)));
  const [u, repos]: [
    { public_repos: number; followers: number; created_at: string; avatar_url: string },
    { stargazers_count?: number }[],
  ] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`, { signal }).then(ok),
    fetch(`https://api.github.com/users/${USER}/repos?type=owner&per_page=100`, { signal }).then(ok),
  ]);
  return {
    repos: u.public_repos,
    followers: u.followers,
    since: u.created_at.slice(0, 4),
    avatar: u.avatar_url,
    stars: repos.reduce((a, r) => a + (r.stargazers_count ?? 0), 0),
  };
}

/** GitHub-style levels: quartiles of the non-zero days in the selected series. */
function levels(days: ContributionDay[], k: Kind) {
  const vals = days.map((d) => value(d, k));
  const nz = vals.filter((v) => v > 0).sort((a, b) => a - b);
  const q = (f: number) => nz[Math.floor(f * (nz.length - 1))] ?? 1;
  const cut = [q(0.25), q(0.5), q(0.75)];
  const level = (v: number) => (v === 0 ? 0 : v <= cut[0] ? 1 : v <= cut[1] ? 2 : v <= cut[2] ? 3 : 4);
  return { vals, levels: vals.map(level), top: cut[2] + 1 }; // the top colour starts above the 75th percentile
}

/**
 * Profile stats and a 53-week commit heatmap, split into personal and work.
 * Both come from the snapshot (scripts/build-contributions.py); the profile
 * stats are refreshed from GitHub's live API when it answers.
 */
export default function GithubCard({ profile: snapshot, days }: { profile: GithubProfile; days: ContributionDay[] }) {
  const [kind, setKind] = useState<Kind>("all");
  // Live refresh. GitHub allows unauthenticated visitors 60 requests an hour,
  // so a failed refresh just keeps the snapshot.
  const { data: live } = useSWR("github-profile", fetchProfile, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  const profile = live ?? snapshot;
  const seg = useRef<HTMLDivElement>(null);
  const segInd = useRef<HTMLSpanElement>(null);
  const heat = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const prevLevels = useRef<number[] | null>(null);

  const { vals, levels: lv, top } = useMemo(() => levels(days, kind), [days, kind]);
  const total = (k: Kind) => days.reduce((a, d) => a + value(d, k), 0);
  const tp = total("personal");
  const tw = total("work");
  // empty cells after the last day, to finish its week
  const tail = 6 - ((new Date(days[days.length - 1].date + "T00:00:00Z").getUTCDay() + 6) % 7);

  // On a filter change: a left-to-right ripple, and the cells that changed dip and return
  useLayoutEffect(() => {
    const cells = [...(heat.current?.children ?? [])] as HTMLElement[];
    const prev = prevLevels.current;
    prevLevels.current = lv;
    if (!prev) return;
    const changed = cells.filter((_, i) => i < lv.length && prev[i] !== lv[i]);
    changed.forEach((el) => el.classList.remove("pop"));
    void heat.current?.offsetWidth; // one reflow, so the animation restarts on every changed cell
    changed.forEach((el) => el.classList.add("pop"));
  }, [lv]);

  const remeasure = useCallback(
    () => slideTo(segInd.current, seg.current, seg.current?.querySelector<HTMLElement>("[aria-pressed=true]") ?? null),
    [],
  );
  useLayoutEffect(remeasure, [remeasure, kind]);
  useEffect(() => {
    // the buttons' widths change with the window, the theme's fonts, and once web fonts load
    let live = true;
    document.fonts?.ready.then(() => live && remeasure());
    window.addEventListener("resize", remeasure);
    const observer = new MutationObserver(remeasure);
    observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    // on narrow screens, show the latest weeks
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
    return () => {
      live = false;
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
    };
  }, [remeasure]);

  return (
    <section className={"card c-gh"} data-cat={"work"} aria-labelledby={"gh-heading"}>
      <div className={"gh-stats"}>
        <div className={"gh-user"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar} alt={""} width={42} height={42} />
          <div>
            <b id={"gh-heading"}>
              <a href={`https://github.com/${USER}`} target={"_blank"} rel={"me noreferrer"}>
                {USER}
              </a>
            </b>
            <span className={"label"}>since {profile.since}</span>
          </div>
        </div>
        <Stat n={fmt(profile.repos)} label={"Repos"} />
        <Stat n={fmt(profile.stars)} label={"Stars"} />
        <Stat n={fmt(profile.followers)} label={"Followers"} />
        <Stat
          n={fmt(total(kind))}
          label={kind === "all" ? "Commits / yr" : `${kind[0].toUpperCase() + kind.slice(1)} commits`}
        />
      </div>
      <div className={"heat-wrap"}>
        <div className={"heat-head"}>
          <div className={"seg"} role={"group"} aria-label={"Contribution type"} ref={seg}>
            <span className={"ind"} ref={segInd} />
            {KINDS.map((k) => (
              <button key={k.id} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
          <div className={"split"} data-k={kind}>
            <span>Personal {fmt(tp)}</span>
            <span className={"bar"}>
              <i className={"p"} style={{ width: `${(tp / (tp + tw)) * 100}%` }} />
              <i className={"w"} style={{ width: `${(tw / (tp + tw)) * 100}%` }} />
            </span>
            <span>Work {fmt(tw)}</span>
          </div>
        </div>
        <div className={"heat-scroll"} ref={scroller}>
          <div className={"heat"} ref={heat} role={"img"} aria-label={`${fmt(total(kind))} commits in the last year`}>
            {vals.map((v, i) => (
              <i
                key={days[i].date}
                data-l={lv[i]}
                title={`${days[i].date}: ${v}`}
                style={{ "--d": `${Math.floor(i / 7) * 7}ms` } as React.CSSProperties /* 7ms per week column */}
              />
            ))}
            {Array.from({ length: tail }, (_, i) => (
              <i key={`pad-${i}`} data-l={-1} />
            ))}
          </div>
        </div>
        <div className={"heat-foot"}>
          <div className={"heat-key"} aria-label={"Colour key"}>
            <span>0</span>
            <span className={"ramp"} />
            <span>{top}+ a day</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className={"n display"}>{n}</div>
      <div className={"label"}>{label}</div>
    </div>
  );
}
