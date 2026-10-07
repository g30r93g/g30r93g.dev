import { Morph } from "@/components/site/page-transition";

/** A role's company logo on its brand background; morphs between the lists and the role's page. */
export default function RoleLogo({ slug, logo, background }: { slug: string; logo?: string; background?: string }) {
  return (
    <Morph name={`role-logo-${slug}`}>
      <span className={"logo-tile"} style={{ background }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logo && <img src={logo} alt={""} />}
      </span>
    </Morph>
  );
}
