import { ViewTransition, type ReactNode } from "react";

const DIRECTION = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Slides a page's content in the direction of travel: links tag a navigation
 * `nav-forward` or `nav-back` (Link's `transitionTypes`), and the CSS is in
 * app/(root)/theme.css. Untagged changes, like the browser's back button, swap
 * instantly. Goes in each page, not a layout: layouts persist, so they never enter or exit.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={DIRECTION} exit={DIRECTION} default={"none"}>
      {children}
    </ViewTransition>
  );
}

/** Morphs an element into its namesake on the next page, like a role's title from a list into its page. */
export function Morph({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share={"morph"} default={"none"}>
      {children}
    </ViewTransition>
  );
}
