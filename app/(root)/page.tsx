import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import GithubStats from "@/components/github-stats";
import Minimap from "@/components/minimap";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <GithubStats />
      <Minimap />
    </>
  );
}
