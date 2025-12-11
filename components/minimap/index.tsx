"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    [],
  );

  return (
    <div className="group relative pl-20 py-8">
      <div className="flex flex-col items-end gap-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="contents">
            <Button
              variant="outline"
              size="sm"
              aria-label={section.label}
              onClick={scrollToSection(section.href)}
              className={cn(
                "overflow-hidden rounded-12 border-primary/40 bg-background/90 text-foreground transition-[width,padding,background-color] duration-300 ease-out w-44 px-4 py-0 justify-end",
                "md:bg-primary md:text-primary-foreground md:w-0.75 md:px-0 md:group-hover:w-44 md:group-hover:px-4 md:group-hover:bg-background/90 md:group-hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200 delay-0 opacity-100",
                  "md:opacity-0 md:delay-150 md:group-hover:opacity-100"
                )}
              >
                {section.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
