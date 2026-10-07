import {
  Chakra_Petch,
  Geist,
  Geist_Mono,
  Hanken_Grotesk,
  Inter,
  JetBrains_Mono,
  Rethink_Sans,
  Roboto_Mono,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";

/* Site-wide, and the home page's default (g30r93g) theme. */
export const rethinkSans = Rethink_Sans({ variable: "--font-rethink-sans", subsets: ["latin"] });
export const robotoMono = Roboto_Mono({ variable: "--font-roboto", subsets: ["latin"] });
export const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

/* The project themes' type. Not preloaded: each downloads only when its theme is worn.
   (next/font needs literal options, so these can't share an object.) */
export const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  weight: ["500", "600"],
  subsets: ["latin"],
  preload: false,
});
export const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  preload: false,
});
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  preload: false,
});
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  preload: false,
});
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});
/* TfL Planner's Johnston, via Farringdon: an OFL revival (app/fonts/farringdon/OFL.txt) */
export const farringdon = localFont({
  variable: "--font-farringdon",
  src: [
    { path: "../app/fonts/farringdon/Farringdon-Roman.woff2", weight: "400" },
    { path: "../app/fonts/farringdon/Farringdon-Bold.woff2", weight: "500 700" },
  ],
  preload: false,
});
export const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  preload: false,
});

/**
 * Every font's CSS variable. Applied to <html>, because the home page's theme
 * tokens are declared there and can only resolve variables defined on <html>.
 */
export const fontVariables = [
  rethinkSans,
  robotoMono,
  jetbrainsMono,
  chakraPetch,
  sora,
  spaceGrotesk,
  geist,
  geistMono,
  inter,
  farringdon,
  hankenGrotesk,
]
  .map((font) => font.variable)
  .join(" ");
