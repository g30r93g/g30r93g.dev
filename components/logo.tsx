import { clsx } from "clsx";
import Image from "next/image";

/**
 * Renders a project icon or company logo, falling back to a neutral
 * placeholder when `src` is unset. Sized by the caller via `className`.
 *
 * Passing `background` puts the logo on a coloured plate and letterboxes it
 * inside, which is what company logos need — they're mixed aspect ratios and
 * usually transparent, so they'd otherwise crop badly or vanish against the
 * card. Project icons omit it: they're full-bleed square artwork already.
 */
export default function Logo({
  src,
  background,
  className,
}: {
  src?: string;
  background?: string;
  className?: string;
}) {
  const shape = clsx("shrink-0 rounded-lg", className);

  if (!src) {
    return <span aria-hidden className={clsx(shape, "bg-secondary")} />;
  }

  return (
    <Image
      // Decorative: the project or company name always sits alongside it.
      alt={""}
      className={clsx(shape, background ? "object-contain p-1" : "object-cover")}
      height={64}
      src={src}
      style={background ? { backgroundColor: background } : undefined}
      // Logos are already small, and skipping the optimiser lets SVGs through
      // without enabling `dangerouslyAllowSVG` globally.
      unoptimized
      width={64}
    />
  );
}
