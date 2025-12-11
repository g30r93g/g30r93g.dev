'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MouseEvent, useCallback } from "react";

const sections = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "GitHub Stats", href: "#github-stats" },
];

export default function Minimap() {
  const scrollToSection = useCallback(
    (href: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  return (
    <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-200">
      <div className="group relative px-10 py-8">
        <div className="flex flex-col items-end gap-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="contents">
              <Button
                variant="outline"
                size="sm"
                aria-label={section.label}
                onClick={scrollToSection(section.href)}
                className="overflow-hidden rounded-full border-primary/40 bg-primary text-primary-foreground transition-[width,padding,background-color] duration-300 ease-out w-0.75 px-0 py-0 justify-end group-hover:w-44 group-hover:px-4 group-hover:bg-background/90 group-hover:text-foreground"
              >
                <span className="opacity-0 transition-opacity duration-200 delay-150 group-hover:opacity-100 whitespace-nowrap">
                  {section.label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
