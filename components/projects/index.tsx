import ProjectsList from "@/components/projects/list";
import { getAllProjects } from "@/lib/projects";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <div className={"container mx-auto pt-16"}>
      <h2
        id={"projects"}
        className={"font-mono font-medium text-2xl mt-8 mb-4"}
      >
        My Projects
      </h2>
      <ProjectsList projects={projects} />
    </div>
  );
}
