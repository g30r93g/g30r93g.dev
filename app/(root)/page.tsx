import Experience from "@/components/experience";
import GithubStats from "@/components/github-stats";
import Hero from "@/components/hero";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <GithubStats />
    </>
  );
}
