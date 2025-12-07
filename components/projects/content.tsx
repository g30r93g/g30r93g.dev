"use client";

import { MDXProvider } from "@mdx-js/react";
import Project from "@/types/project";

export default function ProjectContent({ project }: { project: Project }) {
  return (
    <div className={"container mx-auto"}>
      <div className={"flex flex-row items-center gap-4"}>
        <span className={"w-8 h-8 rounded-full bg-secondary"} />
        <div>
          <h1 className={"font-medium text-2xl"}>{project.title}</h1>
          <h2 className={"text-muted-foreground"}>{project.description}</h2>
        </div>
      </div>
      <MDXProvider>
        <div>{project.content}</div>
      </MDXProvider>
    </div>
  );
}
