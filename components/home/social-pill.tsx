"use client";

import { useRef } from "react";
import { slideTo } from "@/components/home/slide-to";

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/g30r93g",
    path: "M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/g30r93g",
    path: "M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm1.8 13.1H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z",
  },
];

/** GitHub | LinkedIn, with a highlight that slides to the hovered link. */
export default function SocialPill() {
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  return (
    <div
      className={"social"}
      ref={pill}
      onMouseLeave={() => indicator.current && (indicator.current.style.opacity = "0")}
    >
      <span className={"ind"} ref={indicator} />
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={"_blank"}
          rel={"me noreferrer"}
          onMouseEnter={(e) => {
            slideTo(indicator.current, pill.current, e.currentTarget);
            if (indicator.current) indicator.current.style.opacity = "1";
          }}
        >
          <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <path d={link.path} />
          </svg>
          {link.label}
        </a>
      ))}
    </div>
  );
}
