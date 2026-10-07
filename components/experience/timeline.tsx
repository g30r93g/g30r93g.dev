"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Timeline as TimelineData } from "@/lib/experience";

type Props = {
  timeline: TimelineData;
  /** The role this page is about: lit, with the rest dimmed. */
  focus?: string;
  /** Roles of the other type fade back. */
  filter?: "all" | "work" | "education";
  /** Lit from outside, like the card under the pointer. */
  lit?: string | null;
  onLight?: (slug: string | null) => void;
  /** Bars grow in, oldest first. */
  grow?: boolean;
};

/**
 * Every role on one axis, overlapping roles on separate lanes. Each bar links to its role;
 * a bar for an earlier role than `focus` slides forward, a later one slides back.
 */
export default function Timeline({ timeline, focus, filter = "all", lit, onLight, grow }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const focusOrder = timeline.bars.find((b) => b.slug === focus)?.order;

  // phones: the timeline scrolls; start at the newest end
  useLayoutEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, []);

  return (
    <div className={"tl-scroll"} ref={scroller}>
      <div
        className={["tl", grow && "grow", focus && "focused"].filter(Boolean).join(" ")}
        data-filter={filter}
        style={{ "--lanes": timeline.lanes } as React.CSSProperties}
      >
        {timeline.years.map(({ year, left }) => (
          <div key={year} className={"tl-year"} style={{ left: `${left}%` }}>
            <span className={"label"}>{year}</span>
          </div>
        ))}
        <div className={"tl-today"} style={{ left: `${timeline.today}%` }} />
        <div className={"tl-lanes"}>
          {timeline.bars.map((bar) => (
            <Link
              key={bar.slug}
              href={bar.url}
              transitionTypes={[focusOrder === undefined || bar.order < focusOrder ? "nav-forward" : "nav-back"]}
              className={[
                "tl-bar",
                bar.type === "education" && "edu",
                bar.current && "current",
                bar.width < 9 && "short",
                (bar.slug === focus || bar.slug === lit) && "lit",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                {
                  left: `${bar.left}%`,
                  width: `max(36px, ${bar.width}%)`,
                  "--lane": bar.lane,
                  "--order": bar.order,
                } as React.CSSProperties
              }
              title={bar.title}
              aria-label={bar.title}
              aria-current={bar.slug === focus ? "page" : undefined}
              onMouseEnter={() => onLight?.(bar.slug)}
              onMouseLeave={() => onLight?.(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {bar.logo && <img src={bar.logo} alt={""} style={{ background: bar.logoBackground }} />}
              <span>{bar.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
