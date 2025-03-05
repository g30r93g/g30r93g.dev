import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ExternalLink} from "lucide-react";

export default function Hero() {
  return (
    <div className={"h-svh"}>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={12}
        color="#6B7280"
        maxOpacity={0.25}
        flickerChance={0.1618}
      />
      <div className={"container mx-auto font-mono block relative top-[30.9vh]"}>
          <h1 className={"text-4xl font-medium"}>g30r93g</h1>
          <h2 className={"text-2xl/9 mt-4.5"}>Creating solutions<br />for interesting problems.</h2>
      </div>
      <div className={"relative right=0 top-[61.8vh] bg-accent/50 dark:bg-accent/35 ml-auto mr-0 rounded-l-2xl border border-r-0 border-accent p-4 w-[90vw] md:w-fit flex flex-row gap-2 z-[100]"}>
        <Link href={"#projects"}>
          <Button size={"lg"} variant={"outline"}>Projects</Button>
        </Link>
        <Link href={"#experience"}>
          <Button size={"lg"} variant={"outline"}>Experience</Button>
        </Link>
        <Link href={"#github-stats"}>
          <Button size={"lg"} variant={"outline"}>GitHub Stats</Button>
        </Link>
        <Link href={"https://github.com/g30r93g/CV"} referrerPolicy={"no-referrer"}>
          <Button size={"lg"} variant={"outline"}>CV<ExternalLink /></Button>
        </Link>
        <div className={"w-56"} />
      </div>
    </div>
  )
}