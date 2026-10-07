import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* The site-wide social card: the home hero in the default (g30r93g) theme. */

export const alt =
  "George Nick Gorzynski, Full-Stack Software Engineer in London. Crafting solutions for interesting problems.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#08090d";
const FG = "#eef0f6";
const MUTED = "#8a8fa3";
const CARD = "#12141b";

// Satori has no `inset`, so full-bleed layers spell out their box
const LAYER = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;

// Satori reads only static TTF/OTF, so these are fixed-weight copies of the site's fonts
const fonts = join(process.cwd(), "app/fonts/og");
const [display, mono, foil] = await Promise.all([
  readFile(join(fonts, "RethinkSans-Medium.ttf")),
  readFile(join(fonts, "JetBrainsMono-Regular.ttf")),
  readFile(join(process.cwd(), "public/home/foil.jpg")),
]);
const FOIL = `url(data:image/jpeg;base64,${foil.toString("base64")})`;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: BG,
        color: FG,
        fontFamily: "Rethink Sans",
      }}
    >
      {/* the aura: foil light falling from the top edge */}
      <div
        style={{
          ...LAYER,
          backgroundImage: FOIL,
          backgroundSize: "100% 100%",
          opacity: 0.55,
        }}
      />
      {/* Satori has no mask-image, so background-coloured veils fade the aura out */}
      <div
        style={{
          ...LAYER,
          backgroundImage: `linear-gradient(180deg, rgba(8,9,13,0.25) 0%, rgba(8,9,13,0.8) 32%, ${BG} 60%)`,
        }}
      />
      <div
        style={{
          ...LAYER,
          backgroundImage: `linear-gradient(90deg, ${BG} 0%, rgba(8,9,13,0) 30%, rgba(8,9,13,0) 70%, ${BG} 100%)`,
        }}
      />
      {/* the dot grid */}
      <div
        style={{
          ...LAYER,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              display: "flex",
              width: 104,
              height: 104,
              padding: 4,
              borderRadius: 999,
              backgroundImage: FOIL,
              backgroundSize: "400% 400%",
              backgroundPosition: "30% 50%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                borderRadius: 999,
                background: CARD,
                fontFamily: "JetBrains Mono",
                fontSize: 30,
              }}
            >
              GG
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 50,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              George Nick Gorzynski
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 19,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Full-Stack Software Engineer · London
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 92,
            // 1.0, as on the site, clips the descenders of g and p
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          <div>Crafting solutions</div>
          <div style={{ display: "flex" }}>
            for&nbsp;
            <span
              style={{
                // the foil fills only the span's box, so extend it below the baseline
                paddingBottom: "0.1em",
                marginBottom: "-0.1em",
                backgroundImage: FOIL,
                backgroundSize: "400% 400%",
                backgroundPosition: "30% 50%",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              interesting
            </span>
            &nbsp;problems.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            letterSpacing: "0.08em",
            color: MUTED,
          }}
        >
          <div>g30r93g.dev</div>
          <div>TypeScript · React · Next.js · Swift · AWS</div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Rethink Sans", data: display, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
