import { z } from "zod";

/**
 * A logo or icon: either a remote URL or a path under `public`
 * (e.g. `/icons/prereq.svg`).
 *
 * Blank strings normalise to `undefined` rather than failing validation —
 * `getMdx` discards any file whose frontmatter doesn't parse, so a stray
 * `icon: ""` would otherwise drop the whole entry from the site.
 */
export const assetPathSchema = z
  .string()
  .refine(
    (value) => value === "" || value.startsWith("/") || URL.canParse(value),
    { message: "must be an absolute URL or a path beginning with /" },
  )
  .transform((value) => (value === "" ? undefined : value))
  .optional();
