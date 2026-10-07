/**
 * Home page themes: the personal g30r93g theme, plus one per featured project.
 * Each project theme borrows that project's design language (colour, type, shape);
 * the tokens live in app/(root)/home.css.
 */
export const THEME_IDS = ["g30r93g", "racedash", "idgame", "mixcut", "tfl"] as const;
export type ThemeId = (typeof THEME_IDS)[number];
export const DEFAULT_THEME: ThemeId = "g30r93g";
export const THEME_STORAGE_KEY = "g-theme";

type Theme = {
  name: string;
  /** Icon in the theme picker; the g30r93g theme draws a foil chip instead. */
  icon?: string;
  /** Caption under the spotlight demo. */
  label: string;
  /** Slug in content/projects; its `technologies` become the tooling strip. */
  project?: string;
  /** Glow behind the project card. */
  swatch?: string;
  /** The handful of technologies shown on the project card. */
  tags?: string[];
};

export const THEMES: Record<ThemeId, Theme> = {
  g30r93g: { name: "g30r93g", label: "g30r93g · holo ID" },
  racedash: {
    name: "RaceDash",
    icon: "/themes/racedash.png",
    label: "RaceDash · timing overlay",
    project: "racedash",
    swatch: "#8cc8ff",
    tags: ["Electron", "Remotion", "AWS Step Functions", "ffmpeg"],
  },
  idgame: {
    name: "The ID Game",
    icon: "/themes/idgame.png",
    label: "The ID Game · tap the card",
    project: "the-id-game",
    swatch: "oklch(0.723 0.219 149.579)",
    tags: ["Next.js", "Convex", "Better Auth", "PostHog"],
  },
  mixcut: {
    name: "Mixcut",
    icon: "/themes/mixcut.png",
    label: "Mixcut · click the waveform to add a marker",
    project: "mixcut",
    swatch: "#78a0ff",
    tags: ["Electron", "wavesurfer.js", "ffmpeg", "Vitest"],
  },
  tfl: {
    name: "TfL Planner",
    icon: "/themes/tfl.png",
    label: "TfL Planner · route detail",
    project: "tfl-planner",
    swatch: "#ffcd00",
    tags: ["Swift", "UIKit", "MapKit", "Core Data"],
  },
};

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);

/**
 * Runs before first paint (inline in the page) so a returning visitor never sees
 * the default theme flash. Reads ?theme= first, then the saved choice.
 */
export const THEME_BOOT_SCRIPT = `try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.dataset.theme=${JSON.stringify(THEME_IDS)}.indexOf(t)>-1?t:${JSON.stringify(DEFAULT_THEME)}}catch(e){document.documentElement.dataset.theme=${JSON.stringify(DEFAULT_THEME)}}`;
