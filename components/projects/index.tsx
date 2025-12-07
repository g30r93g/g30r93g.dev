import { getAllProjects } from "@/lib/projects";
import ProjectCard from "@/components/projects/card";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <div className={"container mx-auto pt-16"}>
      <h2 id={"projects"} className={"font-mono font-medium text-2xl mt-8"}>
        My Projects
      </h2>
      <div className={"mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
