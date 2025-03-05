import Hero from "@/components/root-sections/hero";
import Projects from "@/components/root-sections/projects";
import Experience from "@/components/root-sections/experience";
import GithubStats from "@/components/root-sections/github-stats";

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
