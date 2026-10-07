"use client";

import { useEffect, useRef } from "react";
import { DEMOS } from "@/components/home/spotlight-demos";
import { useSite } from "@/components/site/theme-provider";
import { THEMES } from "@/components/home/themes";

/** A live piece of the active theme's project (decorative, so it renders client-side). */
export default function Spotlight() {
  const { theme } = useSite();
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => DEMOS[theme](stage.current!), [theme]);

  return (
    <section className={"card c-spot"} data-cat={"projects"} aria-label={`${THEMES[theme].name} demo`}>
      <div className={"spot"} ref={stage} />
      <div className={"spot-tag"}>
        <span className={"label"}>{THEMES[theme].label}</span>
      </div>
    </section>
  );
}
