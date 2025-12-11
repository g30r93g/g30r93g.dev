import NameAliasHoverTitle from "@/components/hero/name-alias-hover-title";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import SocialNetworksPill from "@/components/social-networks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className={"h-svh"}>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={12}
        maxOpacity={0.25}
        flickerChance={0.1618}
      />
      <div
        className={"container mx-auto font-mono block relative top-[30.9vh]"}
      >
        <NameAliasHoverTitle
          className={"text-xl md:text-2xl lg:text-4xl font-medium"}
          name={"George Nick Gorzynski"}
          alias={"g30r93g"}
        />
        <p className="text-muted-foreground mt-1.5">Software Engineer • Systems Architect • Innovator</p>
        <h2 className={"text-lg/5 md:text-xl/7 lg:text-2xl/9 mt-4.5"}>
          Crafting solutions
          <br />
          for interesting problems.
        </h2>
        <SocialNetworksPill className={"mt-6"} />
      </div>
      <div
        className={
          "relative right-0 top-[40vh] sm:top-[61.8vh] bg-accent/50 dark:bg-accent/35 ml-auto mr-0 rounded-l-2xl border border-r-0 border-accent p-4 w-[90vw] md:w-fit grid xs:grid-cols-1 sm:grid-cols-2 items-stretch md:flex flex-row gap-2 z-[100]"
        }
      >
        <Link href={"#projects"}>
          <Button className={"w-full"} size={"lg"} variant={"outline"}>
            Projects
          </Button>
        </Link>
        <Link href={"#experience"}>
          <Button className={"w-full"} size={"lg"} variant={"outline"}>
            Experience
          </Button>
        </Link>
        <Link href={"#github-stats"}>
          <Button className={"w-full"} size={"lg"} variant={"outline"}>
            GitHub Stats
          </Button>
        </Link>
        <div className={"hidden md:block w-26 lg:w-56"} />
      </div>
    </div>
  );
}
