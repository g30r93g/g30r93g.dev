"use client";

import type { ReactNode } from "react";
import { useSite } from "@/components/site/theme-provider";

/** The bento grid; the nav's filter fades the cards outside the chosen section (on phones, it hides them). */
export default function Bento({ children }: { children: ReactNode }) {
  const { filter } = useSite();
  return (
    <main className={"bento"} data-filter={filter}>
      {children}
    </main>
  );
}
