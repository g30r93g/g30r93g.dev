import NameAliasHoverTitle from "@/components/hero/name-alias-hover-title";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import Minimap from "@/components/minimap";
import SocialNetworksPill from "@/components/social-networks";

export default function Hero() {
  return (
    <section className="relative h-svh">
      <FlickeringGrid
        className="absolute inset-0 -z-10 size-full"
        squareSize={4}
        gridGap={12}
        maxOpacity={0.25}
        flickerChance={0.1618}
      />
      <div className="container mx-auto flex h-full flex-col justify-center gap-10 font-mono">
        <div>
          <NameAliasHoverTitle
            className="text-xl md:text-2xl lg:text-4xl font-medium"
            name="George Nick Gorzynski"
            alias="g30r93g"
          />
          <p className="text-muted-foreground mt-1.5">
            Software Engineer • Systems Architect • Innovator
          </p>
          <h2 className="text-lg/5 md:text-xl/7 lg:text-2xl/9 mt-4.5">
            Crafting solutions
            <br />
            for interesting problems.
          </h2>
          <SocialNetworksPill className="mt-6" />
        </div>
        <div className="flex justify-end">
          <Minimap />
        </div>
      </div>
    </section>
  );
}
