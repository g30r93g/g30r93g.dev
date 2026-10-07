"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import RoleLogo from "@/components/experience/logo";
import Timeline from "@/components/experience/timeline";
import { slideTo } from "@/components/home/slide-to";
import { Morph } from "@/components/site/page-transition";
import type { Timeline as TimelineData } from "@/lib/experience";

export type RoleCard = {
  slug: string;
  url: string;
  role: string;
  companyName: string;
  logo?: string;
  logoBackground?: string;
  type: "work" | "education";
  current: boolean;
  period: string;
  tenure: string;
  tools: string[];
};

type Filter = "all" | "work" | "education";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
];

/**
 * The timeline and a card per role. Pointing at a bar lights its card and the other
 * way round; the Work / Education switch hides the other cards and fades their bars.
 */
export default function RoleBrowser({ roles, timeline }: { roles: RoleCard[]; timeline: TimelineData }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [lit, setLit] = useState<string | null>(null);
  const seg = useRef<HTMLDivElement>(null);
  const segIndicator = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    slideTo(segIndicator.current, seg.current, seg.current?.querySelector<HTMLElement>("[aria-pressed=true]") ?? null);
  }, [filter]);

  return (
    <>
      <section className={"card c-time span-12"} aria-labelledby={"timeline"}>
        <div className={"time-head"}>
          <h2 className={"label"} id={"timeline"}>
            Timeline
          </h2>
          <div className={"time-key label"}>
            <span>
              <i />
              Work
            </span>
            <span>
              <i className={"edu"} />
              Education
            </span>
          </div>
        </div>
        <Timeline timeline={timeline} filter={filter} lit={lit} onLight={setLit} grow />
      </section>

      <div className={"roles-head"}>
        <h2 className={"label"}>All roles</h2>
        <div className={"seg"} role={"group"} aria-label={"Show"} ref={seg}>
          <span className={"ind"} ref={segIndicator} />
          {FILTERS.map((f) => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {roles.map((r) => {
        const shown = r.tools.slice(0, r.current ? 8 : 4);
        return (
          <article
            key={r.slug}
            className={["card role-card span-4", r.current && "current", lit === r.slug && "lit"].filter(Boolean).join(" ")}
            hidden={filter !== "all" && filter !== r.type}
            onMouseEnter={() => setLit(r.slug)}
            onMouseLeave={() => setLit(null)}
          >
            <svg className={"arrow"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"M7 17 17 7"} />
              <path d={"M7 7h10v10"} />
            </svg>
            <div className={"role-top"}>
              <RoleLogo slug={r.slug} logo={r.logo} background={r.logoBackground} />
              <div className={"co"}>{r.companyName}</div>
            </div>
            <div>
              <h3 className={"display"}>
                <Link href={r.url} transitionTypes={["nav-forward"]}>
                  <Morph name={`role-title-${r.slug}`}>
                    <span className={"morph-text"}>{r.role}</span>
                  </Morph>
                </Link>
              </h3>
              <div className={"label when"}>
                {r.period} · {r.tenure}
              </div>
            </div>
            {r.current && (
              <div className={"now-tag"}>
                <span className={"dot"} />
                Current role
              </div>
            )}
            <ul className={"tags"} aria-label={"Tools"}>
              {shown.map((t) => (
                <li key={t} className={"chip"}>
                  {t}
                </li>
              ))}
              {r.tools.length > shown.length && (
                <li className={"chip more"} aria-label={`and ${r.tools.length - shown.length} more`}>
                  +{r.tools.length - shown.length}
                </li>
              )}
            </ul>
          </article>
        );
      })}
    </>
  );
}
